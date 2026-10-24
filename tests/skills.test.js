import {test} from 'node:test';
import assert from 'node:assert/strict';
import {englishGroups,sageBooks,mathGroups,allBuiltInSkills} from '../public/skill-data.js';
import {validateChildrenChanges} from '../lib/children-records.js';
test('Sagebooks Level 1 has exactly 100 unique character lessons in five ordered books',()=>{
  assert.equal(sageBooks.length,5);
  for(const book of sageBooks){assert.equal(book.items.length,20);assert.deepEqual(book.items.map(x=>x.lesson),Array.from({length:20},(_,i)=>i+1));assert.ok(book.items.every(x=>[...x.simplified].length===1));}
  assert.equal(new Set(sageBooks.flatMap(b=>b.items.map(x=>x.label))).size,100);
  assert.equal(sageBooks[0].items[0].label,'山');assert.equal(sageBooks[4].items[19].label,'那');
});
test('English includes individually tracked sounds, sight words, digraphs, trigraphs and six syllable types',()=>{
  assert.deepEqual(englishGroups.map(x=>x.id),['sounds','sight','digraphs','trigraphs','syllables']);
  assert.equal(englishGroups.find(x=>x.id==='syllables').items.length,6);
  assert.ok(englishGroups.find(x=>x.id==='trigraphs').items.some(x=>x.label==='igh'));
});
test('math covers all 18 NEL knowledge, skill and disposition references without labelling extensions as direct matches',()=>{
  const codes=new Set(mathGroups.flatMap(g=>g.items).filter(x=>x.alignment==='Direct').map(x=>x.nel));
  for(const code of ['1.1','1.2','2.1','2.2','2.3','2.4','3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','4.1','4.2','4.3','4.4'])assert.ok(codes.has(code));
  for(const item of mathGroups.flatMap(g=>g.items)){assert.ok(item.help.length>0&&item.observe.length>0);if(item.alignment==='Extension')assert.equal(item.nel,'No direct goal');}
  assert.deepEqual(mathGroups.slice(0,5).map(x=>x.id),['number','algebra','geometry','measurement','data']);
});
test('skill identifiers are unique and per-child progress can be checked and unchecked',()=>{
  const skills=allBuiltInSkills();assert.equal(new Set(skills.map(x=>x.id)).size,skills.length);
  const changes=['child-a','child-b'].map((child,i)=>({key:`skill:${child}:zh-b1-1`,value:{covered:i===0,date:'2026-10-24',note:''}}));
  assert.equal(validateChildrenChanges(changes),true);
  assert.equal(validateChildrenChanges([{key:'skill:child-a:invented',value:{covered:true,date:'2026-10-24',note:''}}]),false);
  assert.equal(validateChildrenChanges([{key:'skill:child-a:math-count20',value:{covered:true,date:'2026-10-24',note:'x'.repeat(2001)}}]),false);
});
test('custom sight words are bounded and have independently trackable skill records',()=>{
  assert.equal(validateChildrenChanges([{key:'custom:test-word',value:{group:'sight',label:'because'}},{key:'skill:child-a:custom-test-word',value:{covered:true,date:'2026-10-24',note:'Read together'}}]),true);
  assert.equal(validateChildrenChanges([{key:'custom:test-word',value:{group:'math',label:'because'}}]),false);
  assert.equal(validateChildrenChanges([{key:'custom:test-word',value:{group:'sight',label:' '}}]),false);
});
