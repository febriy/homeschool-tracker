import { neon } from '@neondatabase/serverless';
import { put, get, del } from '@vercel/blob';
import { randomUUID } from 'node:crypto';
import { MAX_PHOTO_BYTES, validPhotoDetails, validPhotoId, imageType } from '../lib/photos.js';
const reply = (data, status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
let prepared;
export async function handlePhotos(request, dependencies={}) {
  try {
    const sql = dependencies.sql || neon(process.env.DATABASE_URL);
    const storage = dependencies.storage || {put,get,del};
    if (!prepared || dependencies.sql) {
      const createSchema = () => sql`CREATE TABLE IF NOT EXISTS children_photos (
        id uuid PRIMARY KEY, child_id text NOT NULL, date date NOT NULL,
        subject text NOT NULL, caption text NOT NULL, pathname text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(), deleted boolean NOT NULL DEFAULT false
      )`;
      // Two new function instances may create the same Postgres catalog type at once.
      const ready = createSchema().catch(error=>{if(error.code==='23505')return createSchema();throw error});
      if (!dependencies.sql) prepared=ready.catch(e=>{prepared=null;throw e});
      await ready;
    } else await prepared;
    const url = new URL(request.url);
    if (request.method !== 'GET') {
      const origin = request.headers.get('origin');
      if (origin && origin !== url.origin) return reply({error:'Please upload from the tracker website.'},403);
    }
    if (request.method === 'POST') {
      if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) return reply({error:'Choose a photo to upload.'},415);
      if (Number(request.headers.get('content-length')) > MAX_PHOTO_BYTES+20000) return reply({error:'This photo is too large. Please choose a smaller photo.'},413);
      const body = await request.arrayBuffer();
      if (body.byteLength > MAX_PHOTO_BYTES+20000) return reply({error:'This photo is too large. Please choose a smaller photo.'},413);
      const form = await new Response(body,{headers:{'Content-Type':request.headers.get('content-type')}}).formData();
      const details = Object.fromEntries(['childId','date','subject','caption'].map(key=>[key,form.get(key)]));
      if (!validPhotoDetails(details)) return reply({error:'Choose a child, date, and subject, with a caption under 500 characters.'},400);
      const file=form.get('photo');
      if (!file || typeof file.arrayBuffer !== 'function' || file.size < 1 || file.size > MAX_PHOTO_BYTES) return reply({error:'Choose a photo under 3 MB.'},400);
      const bytes=new Uint8Array(await file.arrayBuffer()), type=imageType(bytes);
      if (!type || file.type !== type) return reply({error:'Please use a JPEG, PNG, or WebP photo.'},415);
      const profiles=await sql`SELECT key FROM children_records WHERE key=${'profile:'+details.childId} AND value <> 'null'::jsonb`;
      if (!profiles.length) return reply({error:'Add this child to the tracker before uploading.'},400);
      const requestedId=form.get('uploadId');
      if (requestedId && !validPhotoId(requestedId)) return reply({error:'Invalid photo upload.'},400);
      const id=requestedId || randomUUID();
      const existing=await sql`SELECT id FROM children_photos WHERE id=${id} AND child_id=${details.childId}`;
      if (existing.length) return reply({id},201);
      const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[type];
      const blob=await storage.put(`children/${details.childId}/${id}.${ext}`,bytes,{access:'private',contentType:type,addRandomSuffix:false});
      try {
        await sql`INSERT INTO children_photos (id,child_id,date,subject,caption,pathname) VALUES (${id},${details.childId},${details.date},${details.subject},${details.caption},${blob.pathname})`;
      } catch(error) { await storage.del(blob.pathname).catch(()=>{}); throw error; }
      return reply({id},201);
    }
    if (request.method === 'PATCH') {
      const raw=await request.text();
      if (raw.length > 2000) return reply({error:'Invalid photo update.'},400);
      let body; try {body=JSON.parse(raw)}catch{return reply({error:'Invalid photo update.'},400)}
      if (!validPhotoId(body.id) || typeof body.deleted !== 'boolean') return reply({error:'Invalid photo update.'},400);
      const rows=await sql`UPDATE children_photos SET deleted=${body.deleted} WHERE id=${body.id} RETURNING id`;
      return rows.length ? reply({saved:true}) : reply({error:'Photo not found.'},404);
    }
    if (request.method !== 'GET') return reply({error:'Method not allowed.'},405);
    const id=url.searchParams.get('id');
    if (id) {
      if (!validPhotoId(id)) return reply({error:'Photo not found.'},404);
      const rows=await sql`SELECT pathname FROM children_photos WHERE id=${id} AND deleted=false`;
      if (!rows.length) return reply({error:'Photo not found.'},404);
      const photo=await storage.get(rows[0].pathname,{access:'private'});
      if (photo?.statusCode !== 200) return reply({error:'Photo not found.'},404);
      return new Response(photo.stream,{headers:{'Content-Type':photo.blob.contentType,'X-Content-Type-Options':'nosniff','Cache-Control':'private, max-age=300'}});
    }
    const rows=await sql`SELECT id,child_id AS "childId", to_char(date,'YYYY-MM-DD') AS date, subject,caption,deleted FROM children_photos ORDER BY date DESC,created_at DESC`;
    return reply({photos:rows.map(row=>({...row,url:'/api/photos?id='+row.id}))});
  } catch(error) {
    console.error('Photo storage failed',{code:error.code||error.name||'storage_unavailable'});
    return reply({error:'Photos couldn’t be saved online. Your selected photo is still here; please retry.'},503);
  }
}
export const GET=handlePhotos;
export const POST=handlePhotos;
export const PATCH=handlePhotos;
