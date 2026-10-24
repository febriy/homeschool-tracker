import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateChildrenChanges } from '../lib/children-records.js';
import { subjects, loops, bible, progressEntries } from '../public/curriculum.js';
const entry={date:'2026-10-24',childId:'child-a',subject:'english',lesson:'Lesson 3',note:'Blending sounds',outcome:'practised',createdAt:'2026-10-24T03:00:00Z'};
test('children’s plan contains the supplied daily curricula and three loops',()=>{
  assert.deepEqual(Object.keys(subjects),['english','mandarin','math']);
  assert.equal(subjects.mandarin.curriculum,'Sagebooks');
  assert.equal(subjects.math.curriculum,'Kate Snow · Math with Confidence');
  assert.equal(bible.length,5);
  assert.equal(loops.beauty.items.length,5);
  assert.equal(loops.literature.items[0].title,'Literary Ladder');
  assert.deepEqual(loops.history.items.map(x=>x.title),['BiblioPlan','Student Bible Atlas']);
  assert.ok(!JSON.stringify({subjects,loops,bible}).includes('Zaobao'));
});
test('validates dated subject records, named children and reversible removal',()=>{
  assert.equal(validateChildrenChanges([{key:'profile:child-a',value:{name:'First child'}},{key:'entry:test-1',value:entry},{key:'entry:test-2',value:null},{key:'check:2026-10-24:bible-story',value:true},{key:'rotation',value:'literature'}]),true);
  for(const value of [{...entry,subject:'other'},{...entry,childId:'../a'},{...entry,lesson:''},{...entry,note:'x'.repeat(4001)},{...entry,outcome:'invented'}])assert.equal(validateChildrenChanges([{key:'entry:test-1',value}]),false);
  assert.equal(validateChildrenChanges([{key:'profile:child-a',value:null}]),false);
  assert.equal(validateChildrenChanges([{key:'check:2026-10-24:unknown',value:true}]),false);
});
test('progress history keeps children and subjects separate and includes older lessons',()=>{
  const records={'entry:one':entry,'entry:two':{...entry,childId:'child-b',lesson:'Lesson 8'},'entry:three':{...entry,subject:'math',lesson:'Unit 1'},'entry:older':{...entry,date:'2026-10-23',lesson:'Lesson 2'},'entry:removed':null};
  assert.deepEqual(progressEntries(records,{child:'child-a',subject:'english'}).map(x=>x.lesson),['Lesson 3','Lesson 2']);
  assert.equal(progressEntries(records,{child:'child-b'}).length,1);
  assert.equal(progressEntries(records,{subject:'math'})[0].lesson,'Unit 1');
});
