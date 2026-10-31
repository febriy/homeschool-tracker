import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zipSync,unzipSync,strFromU8} from 'fflate';
import {backupFilename,backupFiles,prepareBackup} from '../public/backup-data.js';
const now=new Date('2026-10-31T17:02:03Z');
const photos=[{id:'photo-one',childId:'carisa',date:'2026-10-31',subject:'english',caption:'Drawing',deleted:false,url:'/api/photos?id=photo-one'},{id:'photo-two',childId:'ethan',deleted:true,url:'/api/photos?id=photo-two'}];
const image={bytes:new Uint8Array([255,216,255,217]),extension:'jpg'};
test('ZIP includes complete record values, photo bytes and portable metadata without service URLs',()=>{
 const records={'profile:carisa':{name:'Carisa'},'profile:ethan':{name:'Ethan'},'skill:carisa:en-word-the':{covered:true,needsPractice:true,note:'My note'}};
 const {files,data}=backupFiles({records,photos,images:{'photo-one':image},createdAt:now.toISOString(),pendingCount:2});
 const unpacked=unzipSync(zipSync(files,{level:0})),restored=JSON.parse(strFromU8(unpacked['tracker-data.json']));
 assert.deepEqual(restored.records,records);assert.deepEqual(unpacked['photos/photo-one.jpg'],image.bytes);
 assert.equal(restored.photos[1].file,null);assert.equal(restored.photos[0].url,undefined);assert.equal(data.pendingCount,2);
 assert.match(strFromU8(unpacked['README.txt']),/no in-app restore button/);
});
test('snapshot fetches latest shared records while preserving unsent edits from this browser',async()=>{
 let pending={local:'waiting',same:'local version'};
 const result=await prepareBackup({getRecords:()=>({stale:'old',same:'stale'}),getPending:()=>pending,includePhotos:false,now,request:async()=>{pending={same:'newer local',extra:'new'};return Response.json({records:{remote:'fresh',same:'remote'}})}});
 assert.deepEqual(result.data.records,{remote:'fresh',local:'waiting',same:'newer local',extra:'new'});
 assert.equal(result.data.source,'shared-database');assert.equal(result.data.photosIncluded,false);
 assert.equal(result.filename,'wonder-and-worship-backup-2026-11-01_01-02-03.zip');
});
test('offline record-only backup explicitly identifies browser cache and retains pending changes',async()=>{
 const result=await prepareBackup({getRecords:()=>({a:'cached'}),getPending:()=>({b:'pending'}),includePhotos:false,request:async()=>{throw Error('offline')}});
 assert.equal(result.data.source,'browser-cache');assert.deepEqual(result.data.records,{a:'cached',b:'pending'});
});
test('photo backups copy all active photos and fail if a requested photo is unavailable',async()=>{
 const request=async path=>path==='/api/children'?Response.json({records:{a:true}}):path==='/api/photos'?Response.json({photos}):new Response(image.bytes,{headers:{'content-type':'image/jpeg'}});
 const result=await prepareBackup({getRecords:()=>({}),request});assert.equal(result.data.photos[0].file,'photos/photo-one.jpg');assert.equal(result.data.photos[1].deleted,true);
 await assert.rejects(prepareBackup({getRecords:()=>({}),request:async path=>path.includes('?id=')?new Response('',{status:404}):request(path)}),/photos/);
 await assert.rejects(prepareBackup({getRecords:()=>({}),request:async path=>path==='/api/photos'?new Response('',{status:503}):request(path)}),/photos/);
});
test('archive refuses missing photo files, traversal names and invalid record containers',()=>{
 assert.throws(()=>backupFiles({records:[],photos:[]}));
 assert.throws(()=>backupFiles({records:{},photos,images:{}}),/Missing photo/);
 assert.throws(()=>backupFiles({records:{},photos:[{id:'../bad'}],images:{'../bad':image}}),/Missing photo/);
 assert.match(backupFilename(now),/^wonder-and-worship-backup-/);
});
