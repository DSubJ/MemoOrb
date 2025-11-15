import fs from 'fs';
import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;
const SCHEMA_PATH = process.env.PB_SCHEMA_PATH || './pocketbase/schema.json';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Bitte PB_ADMIN_EMAIL und PB_ADMIN_PASSWORD setzen.');
  process.exit(1);
}

const schemaRaw = fs.readFileSync(SCHEMA_PATH, 'utf8');
const schema = JSON.parse(schemaRaw);

const pb = new PocketBase(PB_URL);

async function main() {
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  for (const coll of schema.collections) {
    const payload = { ...coll };
    delete payload.id;
    try {
      const existing = await pb.collections.getOne(coll.name);
      await pb.collections.update(existing.id, payload);
      console.log(`Updated collection ${coll.name}`);
    } catch (err) {
      await pb.collections.create(payload);
      console.log(`Created collection ${coll.name}`);
    }
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
