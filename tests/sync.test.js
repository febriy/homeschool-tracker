import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../sync.js',import.meta.url),'utf8');
function device(server,initial={}){
  const saved=new Map();let state=structuredClone(initial),status;
  const context={window:{addEventListener(){}},document:{hidden:false,activeElement:null,addEventListener(){}},navigator:{onLine:true},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},setInterval(){},setTimeout(){},clearTimeout(){},AbortSignal,JSON,Object,Set,structuredClone,fetch:async(url,options)=>({ok:true,json:async()=>{
    const body=options.body&&JSON.parse(options.body);
    if(server.fail)throw new Error('offline');
    if(body&&(body.mode==='update'||!server.initialized)){for(const {key,value} of body.changes)server.records[key]=value;server.initialized=true;}
    return {initialized:server.initialized,records:structuredClone(server.records)};
  }})};
  vm.runInNewContext(source,context);
  const tracker=new context.window.SharedTracker({snapshot:()=>structuredClone(state),apply:value=>{state=structuredClone(value)},status:value=>{status=value}});
  return {tracker,saved,state:()=>state,status:()=>status,edit:(key,value)=>{state[key]=value;tracker.changed()}};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
test('two devices preserve unrelated simultaneous edits and do not seed over existing data',async()=>{
  const server={initialized:true,records:{'daily:2026-10-24:0':false,'journal:2026-10-24':''}};
  const a=device(server,{'journal:2026-10-24':'stale local note'}),b=device(server);
  await settle();assert.equal(a.state()['journal:2026-10-24'],'');
  a.edit('daily:2026-10-24:0',true);b.edit('journal:2026-10-24','A shared thought');
  await Promise.all([a.tracker.flush(),b.tracker.flush()]);await a.tracker.refresh();
  assert.equal(server.records['daily:2026-10-24:0'],true);
  assert.equal(a.state()['journal:2026-10-24'],'A shared thought');
});
test('failed saves remain queued across reloads and recover without losing edits',async()=>{
  const server={initialized:true,records:{'journal:2026-10-24':''}};const a=device(server);await settle();
  server.fail=true;a.edit('journal:2026-10-24','Offline note');await a.tracker.flush();
  assert.equal(a.status(),'error');assert.match(a.saved.get('mll-pending-v1'),/Offline note/);
  server.fail=false;await a.tracker.flush();
  assert.equal(server.records['journal:2026-10-24'],'Offline note');assert.equal(a.saved.get('mll-pending-v1'),'{}');assert.equal(a.status(),'saved');
});
test('a second initializer respects the first initialized tracker',async()=>{
  const server={initialized:false,records:{}};const a=device(server,{'journal:2026-10-24':'First'});await settle();
  const b=device(server,{'journal:2026-10-24':'Second'});await settle();
  assert.equal(server.records['journal:2026-10-24'],'First');assert.equal(b.state()['journal:2026-10-24'],'First');
});
