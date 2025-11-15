# Gedanken Orbits

Eine kleine Progressive Web App als intimer Erinnerungsraum: jeden Tag leuchtet genau ein Gedanke in einem Orb. Gebaut mit SvelteKit + TypeScript, PocketBase als Backend/Auth, gestalt=Orbs & Partikel.

## Projektüberblick
- Routen: `/` heutiger Gedanke, `/timeline` alle vergangenen Gedanken, `/auth/login` Admin-Login, `/admin` geschütztes CRUD mit Upload.
- PWA: Manifest, Service Worker (Asset-Cache + zuletzt geladene API-Responses), installierbar, Fullscreen.
- Design: dunkler Verlauf, goldene Partikel, Orbs mit Glow/Fotos, CSS-Design-Tokens in `src/app.css`.
- Datenmodell (PocketBase): `users` (role admin/viewer), `thoughts` (date, title, description?, mood?, image?), `settings` (time zones, optional).

## Entwicklung lokal
Voraussetzungen: Node 20+, npm. PocketBase lokal auf Port 8090.

```bash
npm install
# PocketBase starten (Konsole 1)
docker run --rm -p 8090:8090 -v "$PWD/pocketbase/pb_data:/pb_data" ghcr.io/pocketbase/pocketbase:latest \
  serve /pb_data --http=0.0.0.0:8090
# App starten (Konsole 2)
VITE_PB_URL=http://localhost:8090 npm run dev -- --open
```

### PocketBase Schema
Im Ordner `pocketbase/schema.json` sind die Collections beschrieben. Erstelle sie in der PocketBase Admin UI oder importiere sie per CLI:

```bash
# falls du die Zip von pocketbase.io heruntergeladen hast
./pocketbase migrate collections pocketbase/schema.json
```

Felder:
- `users` (auth): email, password, role select {admin, viewer}
- `thoughts`: date (Datum), title (Text, required), description (Text optional), mood (Text optional), image (File, optional)
- `settings`: timeZoneOwner, timeZoneFriend (optional Text)

### Admin vs. Viewer
- Viewer: liest `/` und `/timeline` ohne Login.
- Admin: erstellt/ändert/löscht in `/admin`, Login unter `/auth/login` (PocketBase `users` collection mit role `admin`).

## Build & Tests
- Typencheck: `npm run check`
- Produktion bauen: `npm run build`

## Docker & Reverse Proxy
Es gibt zwei Container (Frontend + PocketBase) und einen einfachen Nginx-Proxy.

### Docker-Images bauen/ausführen
```bash
# Build (Frontend + PocketBase aus Alpine + PB Download)
docker compose build
# Start (Frontend:3000, PocketBase:8090 -> 8080 intern, Proxy:80)
docker compose up
```
Notes:
- `frontend` wird mit `VITE_PB_URL=/pb` gebaut, damit der Proxy die API unter dem gleichen Host bedient.
- PocketBase-Image wird per `pocketbase/Dockerfile` gebaut (PB v0.33.0, Port 8080 in-Container, gemappt auf 8090 hostseitig).
- `deploy/nginx.conf`: `/pb/` an PocketBase (Websocket ready), Rest an Frontend.

### Deployment-Hinweise (z.B. Strato Container)
1. Baue Images lokal oder in CI und pushe sie in eine Registry (z.B. GHCR/Docker Hub).
2. Setze auf dem Server `VITE_PB_URL` (z.B. `https://deine-domain.tld/pb`) beim Build oder als Build-Arg im Dockerfile.
3. Starte `docker compose up -d` auf dem Server. Passe Ports/Volumes in `docker-compose.yml` bei Bedarf an (z.B. HTTPS-Terminierung, persistente `pocketbase/pb_data`).
4. Lege in PocketBase einen Admin-User mit role `admin` an und importiere die Collections.

## PWA Details
- Manifest: `static/manifest.webmanifest` mit Icon `static/icons/icon.svg`.
- Service Worker: `src/service-worker.ts` cached Build-Assets + GET-Requests an PocketBase (offline letzte Responses), fallback auf Cache bei Netzverlust.
- `<sveltekit:service-worker />` wird in `src/routes/+layout.svelte` registriert.

## Code-Organisation
- `src/app.css`: Design Tokens, globale Styles, Buttons, Hintergründe.
- Komponenten: `ThoughtStage`, `OrbMain`, `OrbMemory`, `ParticleLayer`, `AdminThoughtForm` in `src/lib/components`.
- PocketBase Client & API-Helper: `src/lib/pocketbase.ts`, `src/lib/api/thoughts.ts`, Types unter `src/lib/types.ts`.
- Routen: `src/routes/+page.svelte` (heute), `timeline/+page.svelte`, `auth/login/+page.svelte`, `admin/+page.svelte`.

Viel Spaß beim Verfeinern der Orbs & Partikel!

### Schema via API setzen
Falls die Collections nicht angelegt sind, kannst du sie per Script gegen eine laufende PocketBase-Instanz importieren:

```bash
# einmalig einen Admin/Superuser anlegen (falls noch keiner existiert)
docker run --rm -v "$PWD/pocketbase/pb_data:/pb_data" pb-local /pb/pocketbase superuser upsert admin@example.com geheim

# PocketBase starten (separat, z.B. wie oben)
# Schema importieren
PB_URL=http://localhost:8090 \
PB_ADMIN_EMAIL=admin@example.com \
PB_ADMIN_PASSWORD=geheim \
npm run pb:import
```

Das Script liest `pocketbase/schema.json` und legt/aktualisiert `users`, `thoughts`, `settings`.
