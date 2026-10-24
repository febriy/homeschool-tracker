import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateChanges } from '../lib/records.js';
test('accepts independent tasks, daily progress, notes, and tombstones',()=>{
  assert.equal(validateChanges([{key:'task:A:default-0',value:{id:'default-0',title:'Chinese',done:true}},{key:'daily:2026-10-24:0',value:true},{key:'journal:2026-10-24',value:'A discovery'},{key:'task:B:removed',value:null}]),true);
});
test('rejects malformed keys, task IDs, script URLs, oversized notes and duplicates',()=>{
  for(const changes of [
    [{key:'__proto__',value:'x'}],
    [{key:'task:A:abc',value:{id:'different',title:'x'}}],
    [{key:'task:A:abc',value:{id:'abc',title:'x',url:'javascript:alert(1)'}}],
    [{key:'task:A:abc',value:{id:'abc',title:'x',links:[{label:'x',url:'data:text/html,x'}]}}],
    [{key:'journal:2026-10-24',value:'x'.repeat(20001)}],
    [{key:'daily:2026-10-24:0',value:true},{key:'daily:2026-10-24:0',value:false}],
    [{key:'daily:2026-10-24:4',value:true}],
    [{key:'loop-note:A',value:null}]
  ]) assert.equal(validateChanges(changes),false);
});
