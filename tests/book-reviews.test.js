import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateChildrenChanges} from '../lib/children-records.js';
import {updateBookReview,reviewLearning} from '../public/learning-data.js';
const key='book:child-a:ladder-0001';
const previous={read:true,date:'2026-10-20'};
const review={rating:5,recommendation:'yes',comment:'Loved reading this together. 孩子很喜欢。'};
test('book reviews save per learner and keep existing reading dates and optional fields',()=>{
 const value=updateBookReview(previous,review,'2026-10-25');
 assert.equal(value.date,'2026-10-20');assert.equal(value.read,true);
 assert.equal(validateChildrenChanges([{key,value},{key:'book:child-b:ladder-0001',value:{...value,rating:2,recommendation:'no',comment:'Not a favourite'}}]),true);
 assert.deepEqual(previous,{read:true,date:'2026-10-20'});
 assert.equal(validateChildrenChanges([{key,value:previous}]),true);
 const cleared=updateBookReview(value,{rating:null,recommendation:'',comment:''},'2026-10-25');
 assert.equal(validateChildrenChanges([{key,value:cleared}]),true);
});
test('invalid ratings, recommendation values and oversized or non-text comments are rejected',()=>{
 const value={...previous,...review};
 for(const rating of [0,6,2.5,'5',true])assert.equal(validateChildrenChanges([{key,value:{...value,rating}}]),false);
 for(const recommendation of ['sure',true,null])assert.equal(validateChildrenChanges([{key,value:{...value,recommendation}}]),false);
 for(const comment of ['x'.repeat(2001),null,5])assert.equal(validateChildrenChanges([{key,value:{...value,comment}}]),false);
});
test('rating an unread book does not mark it read or add attendance',()=>{
 const value=updateBookReview({},review,'2026-10-25');
 assert.equal(value.read,false);assert.equal(validateChildrenChanges([{key,value}]),true);
 const result=reviewLearning({[key]:value},'child-a',['2026-10-25']);
 assert.equal(result.attendance.length,0);assert.equal(result.subjects.literature.days,0);
});
