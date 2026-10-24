import test from 'node:test';
import assert from 'node:assert/strict';
import { learnerCurriculum,adultMandarin,defaultRecords } from '../public/curriculum.js';
import { checklistGroups,learnerSubjects,reviewLearning,periodDays } from '../public/learning-data.js';
import { validateChildrenChanges } from '../lib/children-records.js';
const session={childId:'parent',date:'2026-10-25',subject:'mandarin',skillIds:['activity-podcast','activity-zaobao','activity-preply'],note:'',outcome:'completed',createdAt:'2026-10-25T01:00:00Z'};
test('parent has an independent supplied curriculum while children retain their plan',()=>{
 const parent=learnerCurriculum('parent'),child=learnerCurriculum('child-a');
 assert.equal(defaultRecords()['profile:parent'].name,'My learning');
 assert.deepEqual(Object.keys(parent.subjects),['mandarin']);assert.deepEqual(Object.keys(child.subjects),['english','mandarin','math']);
 assert.deepEqual(parent.bible.map(x=>x.id),['new-testament','spck-atlas','hymn','without-doors','psalms-proverbs']);
 assert.equal(parent.loops.beauty.items[0].title,'Artist · Anna Archer');assert.equal(child.loops.beauty.items[0].title,'Artist · Beatrix Potter');
 assert.deepEqual(parent.loops.literature.items.map(x=>x.title),['Northanger Abbey','Jane Austen’s Bookshelf']);
 assert.equal(Object.hasOwn(learnerSubjects('parent'),'english'),false);assert.equal(Object.hasOwn(learnerSubjects('parent'),'math'),false);
 assert.equal(adultMandarin.length,3);assert.equal(checklistGroups('mandarin',{},'parent')[0].items.length,3);assert.equal(checklistGroups('mandarin',{},'child-a').length,5);
});
test('adult sessions validate against adult activities and cannot silently use child skills',()=>{
 assert.equal(validateChildrenChanges([{key:'session:test',value:session}]),true);
 assert.equal(validateChildrenChanges([{key:'session:test',value:{...session,skillIds:['zh-b1-1']}}]),false);
 assert.equal(validateChildrenChanges([{key:'session:test',value:{...session,childId:'child-a'}}]),false);
 assert.equal(validateChildrenChanges([{key:'rotation:parent',value:'history'},{key:'activity:parent:2026-10-25:preply',value:true}]),true);
 assert.equal(validateChildrenChanges([{key:'activity:parent:2026-10-25:unknown',value:true}]),false);
});
test('country books are bounded, learner-specific, and contribute to history review',()=>{
 const book={country:'Greece',titles:['A country book']};
 assert.equal(validateChildrenChanges([{key:'countrybooks:parent:2026-10-25',value:book}]),true);
 assert.equal(validateChildrenChanges([{key:'countrybooks:child-a:2026-10-25',value:{country:'',titles:[]}}]),true);
 assert.equal(validateChildrenChanges([{key:'countrybooks:parent:2026-10-25',value:{country:'Greece',titles:Array(6).fill('Book')}}]),false);
 const records={'countrybooks:parent:2026-10-25':book,'activity:parent:2026-10-25:preply':true,'activity:child-a:2026-10-25:poet':true,'session:test':session};
 const days=periodDays('2026-10-25'),review=reviewLearning(records,'parent',days);
 assert.equal(review.subjects.history.days,1);assert.equal(review.subjects.mandarin.days,1);assert.equal(review.subjects.beauty.days,0);
 assert.equal(reviewLearning(records,'child-a',days).subjects.history.days,0);
 assert.match(review.calendar['2026-10-25'].details.find(x=>x.subject==='mandarin'&&x.text.includes('Preply')).text,/Preply/);
});
