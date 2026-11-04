import test from 'node:test';
import assert from 'node:assert/strict';
import {learnerCurriculum,seasonalActivities,educationWeeks} from '../public/curriculum.js';
import {checklistGroups,reviewLearning} from '../public/learning-data.js';
import {validateChildrenChanges} from '../lib/children-records.js';
import {zh,translate} from '../public/i18n.js';
test('personal preparation, Advent and January targets follow the supplied dates without changing child plans',()=>{
 const start=learnerCurriculum('parent','2026-11-04');
 assert.deepEqual(start.loops.literature.items.map(x=>x.id),['marmee-louisa']);
 assert.equal(start.loops.beauty.items[0].title,'Artist · Beatrix Potter');
 const prep=learnerCurriculum('parent','2026-11-08');
 assert.equal(prep.loops.literature.items[0].detailValues.range,'1–10');
 assert.equal(prep.loops.literature.items[1].detailValues.target,'10%');
 const first=learnerCurriculum('parent','2026-11-29');
 assert.equal(first.bible.find(x=>x.id==='advent-narnia').detailValues.range,'1–7');
 assert.equal(first.loops.beauty.items.find(x=>x.id==='advent-messiah').detailValues.day,2);
 assert.equal(first.loops.literature.items.find(x=>x.id==='little-women').detailValues.range,'31–34');
 assert.equal(learnerCurriculum('parent','2026-12-25').loops.beauty.items.find(x=>x.id==='advent-messiah').detailValues.day,28);
 assert.equal(learnerCurriculum('parent','2026-12-26').loops.beauty.items.find(x=>x.id==='advent-messiah').detail,'Revisit a favourite from the Messiah calendar.');
 assert.equal(learnerCurriculum('parent','2027-01-03').loops.literature.items.find(x=>x.id==='little-men').detailValues.range,'1–7');
 assert.equal(learnerCurriculum('parent','2027-02-23').education.biography,'Finish by 23 February.');
 assert.deepEqual(learnerCurriculum('ethan','2026-12-01'),learnerCurriculum('ethan','2026-10-25'));
 assert.equal(first.loops.philosophy.items[0].id,'charlotte-volume-1');
 assert.equal(first.subjects.mandarin.title,'Mandarin');
 assert.ok(first.bible.every(x=>!x.progress));
});
test('new activities save and count in adult review while historic lessons stay valid',()=>{
 const records={};
 for(const [subject,items] of Object.entries(seasonalActivities))for(const item of items){
  const key=`activity:parent:2026-12-01:${item.id}`;assert.ok(validateChildrenChanges([{key,value:true}]),item.id);records[key]=true;
  const session={childId:'parent',date:'2026-12-01',subject,skillIds:['activity-'+item.id],note:'My own notes',outcome:'completed',createdAt:'2026-12-01T12:00:00Z'};
  assert.ok(validateChildrenChanges([{key:'session:test',value:session}]),item.id);
  assert.equal(validateChildrenChanges([{key:'session:test',value:{...session,childId:'ethan'}}]),false);
 }
 const review=reviewLearning(records,'parent',['2026-12-01']);
 for(const subject of Object.keys(seasonalActivities))assert.equal(review.subjects[subject].days,1,subject);
 assert.deepEqual(review.attendance,['2026-12-01']);
 assert.equal(reviewLearning(records,'ethan',['2026-12-01']).attendance.length,0);
 assert.ok(validateChildrenChanges([{key:'rotation:parent',value:'other'}]));
 assert.equal(validateChildrenChanges([{key:'rotation',value:'other'}]),false);
 for(const id of ['activity-northanger','activity-austen-bookshelf'])assert.ok(checklistGroups('literature',{},'parent','2026-12-01')[0].items.some(x=>x.id===id));
});
test('seasonal instructions and schedule labels have Chinese translations',()=>{
 for(const date of educationWeeks.map(w=>w.start)){
  const plan=learnerCurriculum('parent',date);
  for(const item of [...plan.bible,...Object.values(plan.loops).flatMap(l=>l.items)])assert.ok(zh[item.detail],item.detail);
  assert.ok(zh[plan.education.phase]);
 }
 assert.equal(translate('Chapters {range}','zh',{range:'1–10'}),'第 1–10 章');
});
