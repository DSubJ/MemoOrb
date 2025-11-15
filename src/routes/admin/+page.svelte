<script lang="ts">
  import AdminThoughtForm from '$lib/components/AdminThoughtForm.svelte';
  import { deleteThought, mapThought, upsertThought } from '$lib/api/thoughts';
  import { pocketbase } from '$lib/pocketbase';
  import { todayISO } from '$lib/utils/dates';
  import type { Thought } from '$lib/types';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let thoughts = $state(structuredClone(data.thoughts) as Thought[]);
  let active = $state<Thought | null>(null);
  let loading = $state(false);
  let message = $state('');
  let error = $state('');

  const onLogout = () => {
    pocketbase.authStore.clear();
    window.location.href = '/';
  };

  const handleSave = async (event: CustomEvent<{ payload: Partial<Thought>; file: File | null }>) => {
    loading = true;
    error = '';
    message = '';
    try {
      const record = await upsertThought({
        id: event.detail.payload.id,
        title: event.detail.payload.title,
        date: event.detail.payload.date,
        description: event.detail.payload.description,
        mood: event.detail.payload.mood
      } as any, event.detail.file);
      const updated = mapThought(record as any);
      const existingIndex = thoughts.findIndex((t) => t.id === updated.id);
      if (existingIndex !== -1) {
        thoughts[existingIndex] = updated;
      } else {
        thoughts = [updated, ...thoughts];
      }
      active = null;
      message = 'Gespeichert.';
    } catch (err) {
      error = 'Konnte nicht speichern. Prüfe Felder und Login.';
    } finally {
      loading = false;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Diesen Gedanken wirklich löschen?')) return;
    loading = true;
    error = '';
    try {
      await deleteThought(id);
      thoughts = thoughts.filter((t) => t.id !== id);
      if (active?.id === id) active = null;
      message = 'Gelöscht.';
    } catch (err) {
      error = 'Löschen fehlgeschlagen.';
    } finally {
      loading = false;
    }
  };
</script>

<section class="admin">
  <header class="header glass-panel">
    <div>
      <p class="eyebrow">Admin</p>
      <h2>Gedanken verwalten</h2>
      <p class="meta">Eingeloggt als {data.user?.email}</p>
    </div>
    <div class="actions">
      <a class="button secondary" href="/timeline">Zur Timeline</a>
      <button class="button" type="button" onclick={onLogout}>Logout</button>
    </div>
  </header>

  <div class="layout">
    <div class="form-col">
      <h3>{active ? 'Gedanke bearbeiten' : 'Neuen Gedanken anlegen'}</h3>
      <AdminThoughtForm
        current={active ?? { id: '', title: '', date: todayISO(), description: '', mood: '' } as Thought}
        on:save={handleSave}
      />
      {#if message}<p class="success">{message}</p>{/if}
      {#if error}<p class="error">{error}</p>{/if}
    </div>

    <div class="list-col glass-panel">
      <div class="list-head">
        <h3>Alle Gedanken</h3>
        <p class="hint">Klick zum Bearbeiten</p>
      </div>
      <div class="list">
        {#each thoughts as thought}
          <div
            class={`row ${active?.id === thought.id ? 'active' : ''}`}
            role="button"
            tabindex="0"
            onclick={() => (active = thought)}
            onkeydown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                active = thought;
              }
            }}
          >
            <div>
              <p class="title">{thought.title}</p>
              <p class="meta">{thought.date}{thought.mood ? ` · ${thought.mood}` : ''}</p>
            </div>
            <div class="row-actions">
              <button
                class="button secondary"
                type="button"
                onclick={(event) => {
                  event.stopPropagation();
                  handleDelete(thought.id);
                }}
              >
                Löschen
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  {#if loading}
    <div class="loading">Speichere...</div>
  {/if}
</section>

<style>
  .admin {
    padding: 2rem 1.5rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-muted);
    margin: 0;
  }

  h2 {
    margin: 4px 0;
  }

  .meta {
    margin: 0;
    color: var(--color-text-muted);
  }

  .layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 16px;
    margin-top: 18px;
  }

  .form-col h3, .list-head h3 {
    margin: 0 0 8px 0;
  }

  .list-col {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 70vh;
    overflow: auto;
  }

  .row {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 12px;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;
    text-align: left;
  }

  .row.active {
    border-color: rgba(243, 193, 105, 0.6);
    box-shadow: 0 0 20px rgba(243, 193, 105, 0.25);
  }

  .title {
    margin: 0;
    font-weight: 700;
  }

  .row-actions {
    display: flex;
    gap: 8px;
  }

  .hint {
    margin: 0;
    color: var(--color-text-muted);
  }

  .success { color: #c4f5d1; }
  .error { color: #f7a7a3; }

  .loading {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 14px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  }

  @media (max-width: 900px) {
    .layout { grid-template-columns: 1fr; }
  }
</style>
