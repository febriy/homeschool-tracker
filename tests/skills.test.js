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
  assert.ok(['upper','lower','red','sight','digraphs','trigraphs','syllables'].every(id=>englishGroups.some(group=>group.id===id)));
  for(const id of ['upper','lower']){const group=englishGroups.find(g=>g.id===id);assert.equal(group.items.length,52);assert.equal(group.items.filter(x=>x.letterTarget==='name').length,26);assert.equal(group.items.filter(x=>x.letterTarget==='sound').length,26);}
  assert.equal(englishGroups.find(x=>x.id==='syllables').items.length,6);
  assert.ok(englishGroups.find(x=>x.id==='trigraphs').items.some(x=>x.label==='igh'));
});
test('math covers all 18 NEL knowledge, skill and disposition references without labelling extensions as direct matches',()=>{
  const codes=new Set(mathGroups.flatMap(g=>g.items).filter(x=>x.alignment==='Direct').map(x=>x.nel));
  for(const code of ['1.1','1.2','2.1','2.2','2.3','2.4','3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','4.1','4.2','4.3','4.4'])assert.ok(codes.has(code));
  for(const item of mathGroups.flatMap(g=>g.items)){assert.ok(item.help.length>0&&item.observe.length>0);if(item.alignment==='Extension')assert.equal(item.nel,'No direct goal');}
  assert.deepEqual(mathGroups.slice(0,6).map(x=>x.id),['cardinality','comparison','composition','pattern','shape','measures']);
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

test('NCETM regrouping preserves previous math and lowercase sound IDs',()=>{
  const all=allBuiltInSkills();for(const id of ['math-count20','math-compare','math-parts','math-patterns','math-shapes','math-units','math-graph','en-sound-a','en-sound-long-a'])assert.ok(all.some(x=>x.id===id));
});
test('legacy skill flags remain accepted for backward compatibility',()=>{
  const key='skill:child-a:math-parts';const value={covered:false,date:'2026-10-24',note:'Needs concrete objects',secure:false,needsPractice:true,focusWeek:'2026-10-19'};
  assert.equal(validateChildrenChanges([{key,value}]),true);
  assert.equal(validateChildrenChanges([{key,value:{...value,secure:'yes'}}]),false);
  assert.equal(validateChildrenChanges([{key,value:{...value,focusWeek:'tomorrow'}}]),false);
  assert.equal(validateChildrenChanges([{key:'custom:red-example',value:{group:'red',label:'said'}}]),true);
});

test('math has one current status, preserves older progress and treats practice-only records as checked',async()=>{
  const {mathStatus,updateMathStatus,matchesMathStatus}=await import('../public/skill-data.js');
  const previous={covered:false,secure:true,needsPractice:true,focusWeek:'2026-10-19',note:'Keep this observation',date:'2026-10-20'};
  assert.equal(mathStatus(previous),'mastered');
  assert.equal(mathStatus({needsPractice:true}),'practice');
  assert.equal(mathStatus({covered:true}),'observed');
  assert.equal(mathStatus({focusWeek:'2026-10-19'}),'unchecked');
  for(const status of ['observed','practice','mastered','unchecked']){
    const value=updateMathStatus(previous,status,'2026-10-25');
    assert.equal(mathStatus(value),status);
    assert.equal(value.note,previous.note);
    assert.equal(validateChildrenChanges([{key:'skill:child-a:math-count10',value}]),true);
    for(const filter of ['observed','practice','mastered','unchecked'])assert.equal(matchesMathStatus(value,filter),filter===status);
    assert.equal(matchesMathStatus(value,'all'),true);
  }
  assert.equal(matchesMathStatus({covered:false,needsPractice:true},'unchecked'),false);
  assert.equal(previous.needsPractice,true);
});

test('English and maths revision lists keep introduced/practising skills until mastered, per learner',async()=>{
 const {revisionItems,updateMathStatus,mathStatus}=await import('../public/skill-data.js');
 const items=[{id:'en-word-the'},{id:'en-word-you'},{id:'en-word-they'},{id:'en-word-of'}];
 const records={'skill:carisa:en-word-the':{covered:true,date:'2026-10-28',note:''},'skill:carisa:en-word-you':{covered:true,needsPractice:true,date:'2026-10-28',note:''},'skill:carisa:en-word-they':{covered:true,secure:true,date:'2026-10-28',note:''}};
 assert.equal(mathStatus(records['skill:carisa:en-word-the']),'observed');
 for(const subject of ['english','math']){
  assert.deepEqual(revisionItems(items,records,'carisa',subject).map(x=>x.id),['en-word-the','en-word-you','en-word-of']);
  assert.equal(revisionItems(items,records,'ethan',subject).length,4);
  assert.equal(revisionItems(items,records,'carisa',subject,{includeMastered:true}).length,4);
  assert.equal(revisionItems(items,records,'carisa',subject,{editingIds:['en-word-they']}).length,4);
 }
 const revised=updateMathStatus(records['skill:carisa:en-word-they'],'practice','2026-10-28');
 assert.equal(mathStatus(revised),'practice');assert.equal(revised.secure,false);
 assert.equal(revisionItems(items,records,'carisa','mandarin').length,4);
 assert.equal(validateChildrenChanges([{key:'skill:carisa:en-word-the',value:updateMathStatus(records['skill:carisa:en-word-the'],'mastered','2026-10-28')}]),true);
});

test('phonemic awareness can be recorded as English skills without conflating letter sounds',async()=>{
 const {updateMathStatus}=await import('../public/skill-data.js');
 const group=englishGroups.find(group=>group.id==='phonemic');
 assert.equal(group.items.length,15);
 for(const item of group.items){
  assert.ok(item.id.startsWith('en-pa-'));
  assert.equal(validateChildrenChanges([{key:`skill:carisa:${item.id}`,value:updateMathStatus({},'practice','2026-10-28')}]),true);
 }
 assert.equal(validateChildrenChanges([{key:'session:phonemic-test',value:{childId:'carisa',date:'2026-10-28',subject:'english',skillIds:group.items.map(item=>item.id),note:'Spoken sounds',outcome:'practised',createdAt:'2026-10-28T10:00:00Z'}}]),true);
 assert.equal(new Set([...englishGroups.flatMap(g=>g.items)].map(item=>item.id)).size,englishGroups.flatMap(g=>g.items).length);
});
