import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bookProgressKey,validBookProgress} from '../public/book-progress.js';
import {validateChildrenChanges} from '../lib/children-records.js';
import {adultLoops,learnerCurriculum} from '../public/curriculum.js';
import {learnerSubjects,reviewLearning} from '../public/learning-data.js';
test('adult philosophy follows history and records coverage separately',()=>{
 assert.deepEqual(Object.keys(adultLoops),['beauty','literature','history','philosophy']);
 assert.equal(adultLoops.philosophy.items[0].title,'Charlotte Mason · Volume 1');
 assert.equal(learnerCurriculum('ethan').loops.philosophy,undefined);
 assert.equal(learnerSubjects('parent').philosophy,'Educational philosophy');
 assert.equal(learnerSubjects('ethan').philosophy,undefined);
 assert.equal(validateChildrenChanges([{key:'rotation:parent',value:'philosophy'}]),true);
 assert.equal(validateChildrenChanges([{key:'rotation',value:'philosophy'}]),false);
 const review=reviewLearning({'activity:parent:2026-10-27:charlotte-volume-1':true},'parent',['2026-10-27']);
 assert.equal(review.subjects.philosophy.days,1);
});
test('reading progress persists by normalized title and validates reading position',()=>{
 const title='Northanger Abbey',key=bookProgressKey(title),value={title,current:32,total:200,unit:'pages'};
 assert.equal(bookProgressKey('  NORTHANGER ABBEY  '),key);
 assert.notEqual(bookProgressKey('Jane Austen’s Bookshelf'),key);
 assert.equal(validateChildrenChanges([{key,value}]),true);
 assert.equal(validBookProgress(key,{...value,current:0}),true);
 assert.equal(validBookProgress(key,{...value,current:200,unit:'chapters'}),true);
 for(const patch of [{current:201},{current:-1},{current:1.5},{current:NaN},{total:0},{total:100001},{unit:'percent'},{title:'Different book'},{unexpected:true}])assert.equal(validBookProgress(key,{...value,...patch}),false);
 assert.equal(validateChildrenChanges([{key:key.replace(':parent:',':ethan:'),value}]),false);
 assert.deepEqual(reviewLearning({[key]:value},'parent',['2026-10-27']).attendance,[]);
});
