import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewLearning,periodDays } from '../public/learning-data.js';
import { validateChildrenChanges } from '../lib/children-records.js';
import { ladderBooks } from '../public/ladder-data.js';
import { bible,loops } from '../public/curriculum.js';
const session=(childId,date,subject='mandarin',skillIds=['zh-b1-1','zh-b1-2'])=>({childId,date,subject,skillIds,note:'',outcome:'completed',createdAt:'2026-10-24T10:00:00Z'});
test('week and month use calendar dates across year boundaries and leap years',()=>{
  assert.deepEqual(periodDays('2027-01-01'),['2026-12-28','2026-12-29','2026-12-30','2026-12-31','2027-01-01','2027-01-02','2027-01-03']);
  assert.equal(periodDays('2028-02-15','month').length,29);
});
test('many Chinese skills and repeat lessons count one subject day, independently per child',()=>{
  const records={'coverage:a:2026-10-19:mandarin':true,'session:one':session('a','2026-10-19'),'session:two':session('a','2026-10-19'),'session:three':session('a','2026-10-21'),'session:other':session('b','2026-10-20'),'session:outside':session('a','2026-09-20')};
  const days=periodDays('2026-10-21'),review=reviewLearning(records,'a',days);
  assert.equal(review.subjects.mandarin.days,2);assert.equal(review.subjects.mandarin.sessions,3);assert.equal(review.attendance.length,2);
  assert.equal(reviewLearning(records,'b',days).subjects.mandarin.days,1);
});
test('read alouds, activities, direct checklist checks, and manual attendance appear in review',()=>{
  const records={'reading:a:2026-10-19':{titles:['Book 1','Book 2']},'activity:a:2026-10-20:atlas':true,'attendance:a:2026-10-22':true,'attendance:a:2026-10-19':false,'skill:a:en-sound-a':{covered:true,date:'2026-10-21'},'skill:a:en-sound-b':{covered:true,date:'2026-10-21'}};
  const review=reviewLearning(records,'a',periodDays('2026-10-21'));
  assert.deepEqual(review.attendance,['2026-10-20','2026-10-21','2026-10-22']);assert.equal(review.subjects.literature.days,1);assert.equal(review.subjects.geography.days,1);assert.equal(review.calendar['2026-10-21'].details.length,2);
});
test('new progress records enforce subject-specific selections and ten optional book titles',()=>{
  const valid=value=>validateChildrenChanges([{key:'session:one',value}]);assert.equal(valid(session('a','2026-10-24')),true);
  assert.equal(valid({...session('a','2026-10-24'),childId:undefined}),false);
  assert.equal(valid({...session('a','2026-10-24'),skillIds:['en-sound-a']}),false);
  assert.equal(valid({...session('a','2026-10-24'),skillIds:[]}),false);
  assert.equal(validateChildrenChanges([{key:'reading:a:2026-10-24',value:{titles:[]}}]),true);
  assert.equal(validateChildrenChanges([{key:'reading:a:2026-10-24',value:{titles:Array(10).fill('Book')}}]),true);
  assert.equal(validateChildrenChanges([{key:'reading:a:2026-10-24',value:{titles:Array(11).fill('Book')}}]),false);
  assert.equal(validateChildrenChanges([{key:'book:a:ladder-0001',value:{read:true,date:'2026-10-24'}}]),true);
});
test('provided Literary Ladder retains all seven rungs and daily music uses direct destinations',()=>{
  assert.equal(ladderBooks.length,852);assert.deepEqual([...new Set(ladderBooks.map(b=>b.rung))],[1,2,3,4,5,6,7]);
  assert.equal(ladderBooks[0].title,"Tomie DePaola's Favorite Nursery Tales");assert.equal(new Set(ladderBooks.map(b=>b.id)).size,852);
  for(const item of [...bible,...loops.beauty.items].filter(item=>item.link?.includes('spotify.com')))assert.match(item.link,/spotify\.com\/(track|album|playlist)\/[a-zA-Z0-9]+$/);
});
