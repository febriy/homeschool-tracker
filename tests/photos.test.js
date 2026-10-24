import test from 'node:test';
import assert from 'node:assert/strict';
import { handlePhotos } from '../api/photos.js';
import { validPhotoDetails,imageType } from '../lib/photos.js';
const jpg=new Uint8Array([255,216,255,224,0,16]);
test('photo metadata and file signatures reject unsupported uploads',()=>{
  const details={childId:'child-a',date:'2026-10-24',caption:'Counting seeds',subject:'math'};
  assert.equal(validPhotoDetails(details),true);
  assert.equal(validPhotoDetails({...details,childId:'../other'}),false);
  assert.equal(validPhotoDetails({...details,caption:'x'.repeat(501)}),false);
  assert.equal(imageType(jpg),'image/jpeg');
  assert.equal(imageType(Buffer.from('<svg onload=alert(1)>')),null);
});
test('photo upload captures the child, serves stored bytes, and supports reversible removal',async()=>{
  let saved,removed=false;const writes=[];
  const sql=async(strings,...values)=>{
    const query=strings.join('?');
    if(query.includes('SELECT key'))return [{key:'profile:child-a'}];
    if(query.includes('SELECT id'))return [];
    if(query.includes('INSERT INTO')){saved=values;return []}
    if(query.includes('SELECT pathname'))return removed?[]:[{pathname:saved[5]}];
    if(query.includes('UPDATE')){removed=values[0];return [{id:values[1]}]}
    return [];
  };
  const storage={put:async(path,bytes,options)=>{writes.push({path,bytes,options});return {pathname:path}},get:async()=>({statusCode:200,blob:{contentType:'image/jpeg'},stream:new Blob([jpg]).stream()}),del:async()=>{}};
  const form=new FormData();for(const [key,value]of Object.entries({childId:'child-a',date:'2026-10-24',subject:'math',caption:'Counting seeds'}))form.set(key,value);form.set('photo',new Blob([jpg],{type:'image/jpeg'}),'photo.jpg');
  const response=await handlePhotos(new Request('https://tracker.test/api/photos',{method:'POST',body:form}),{sql,storage});
  assert.equal(response.status,201);const {id}=await response.json();
  assert.equal(saved[1],'child-a');assert.equal(writes[0].options.access,'private');assert.match(writes[0].path,/^children\/child-a\//);
  let image=await handlePhotos(new Request('https://tracker.test/api/photos?id='+id),{sql,storage});
  assert.equal(image.headers.get('Content-Type'),'image/jpeg');assert.deepEqual(new Uint8Array(await image.arrayBuffer()),jpg);
  const update=deleted=>handlePhotos(new Request('https://tracker.test/api/photos',{method:'PATCH',body:JSON.stringify({id,deleted})}),{sql,storage});
  assert.equal((await update(true)).status,200);
  assert.equal((await handlePhotos(new Request('https://tracker.test/api/photos?id='+id),{sql,storage})).status,404);
  await update(false);
  assert.equal((await handlePhotos(new Request('https://tracker.test/api/photos?id='+id),{sql,storage})).status,200);
});
test('cross-origin uploads and invalid IDs never reach Blob storage',async()=>{
  const sql=async()=>[],storage={put:()=>assert.fail('must not write'),get:()=>assert.fail('must not read')};
  assert.equal((await handlePhotos(new Request('https://tracker.test/api/photos',{method:'POST',headers:{Origin:'https://unrelated.test'}}),{sql,storage})).status,403);
  assert.equal((await handlePhotos(new Request('https://tracker.test/api/photos?id=../secret'),{sql,storage})).status,404);
});
