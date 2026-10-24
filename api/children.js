import { neon } from '@neondatabase/serverless';
import { validateChildrenChanges } from '../lib/children-records.js';
let schemaReady;
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
function database() {
  if (!process.env.DATABASE_URL) throw new Error('Database is not configured');
  return neon(process.env.DATABASE_URL);
}
async function prepare(sql) {
  if (!schemaReady) schemaReady = sql`CREATE TABLE IF NOT EXISTS children_records (
    key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
  )`.catch(error => { schemaReady = null; throw error; });
  await schemaReady;
}
async function handle(request) {
  try {
    const sql = database();
    await prepare(sql);
    if (request.method === 'POST') {
      const origin = request.headers.get('origin');
      if (origin && origin !== new URL(request.url).origin) return reply({ error: 'Please save from the tracker website.' }, 403);
      if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Expected JSON.' }, 415);
      const raw = await request.text();
      if (Buffer.byteLength(raw) > 256000) return reply({ error: 'This save is too large.' }, 413);
      let body;
      try { body = JSON.parse(raw); } catch { return reply({ error: 'Invalid JSON.' }, 400); }
      if (!['initialize','update'].includes(body.mode) || !validateChildrenChanges(body.changes)) return reply({ error: 'Invalid tracker changes.' }, 400);
      const data = JSON.stringify(body.changes);
      if (body.mode === 'initialize') {
        // One device wins first initialization; later devices never overwrite it.
        await sql`WITH first AS (
          INSERT INTO children_records (key, value) VALUES ('_initialized', 'true')
          ON CONFLICT DO NOTHING RETURNING key
        ) INSERT INTO children_records (key, value)
          SELECT entry->>'key', entry->'value' FROM jsonb_array_elements(${data}::jsonb) AS entry
          WHERE EXISTS (SELECT 1 FROM first) ON CONFLICT DO NOTHING`;
      } else {
        // One atomic batch; unrelated tasks and notes from other devices are preserved.
        await sql`INSERT INTO children_records (key, value)
          SELECT entry->>'key', entry->'value' FROM jsonb_array_elements(${data}::jsonb) AS entry
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
      }
    }
    const rows = await sql`SELECT key, value FROM children_records ORDER BY key`;
    return reply({ initialized: rows.some(row => row.key === '_initialized'), records: Object.fromEntries(rows.filter(row => row.key !== '_initialized').map(row => [row.key, row.value])) });
  } catch (error) {
    console.error('Tracker persistence failed', { code: error.code || 'database_unavailable' });
    return reply({ error: 'Shared saving is unavailable. Your changes are kept on this device; please retry.' }, 503);
  }
}
export const GET = handle;
export const POST = handle;
