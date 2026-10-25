import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nextLanguageSkills,checklistGroups} from '../public/learning-data.js';
test('Mandarin suggests five uncovered characters in publisher order for the selected child',()=>{
 const records={'skill:a:zh-b1-1':{covered:true},'skill:b:zh-b1-2':{covered:true}};
 assert.deepEqual(nextLanguageSkills('mandarin',records,'a').characters.map(x=>x.simplified),['高','的','人','个','大']);
 assert.deepEqual(nextLanguageSkills('mandarin',records,'b').characters.map(x=>x.simplified),['山','的','人','个','大']);
 const all=checklistGroups('mandarin').flatMap(g=>g.items);
 const almost=Object.fromEntries(all.slice(0,-2).map(x=>['skill:a:'+x.id,{covered:true}]));
 assert.equal(nextLanguageSkills('mandarin',almost,'a').characters.length,2);
 for(const item of all)almost['skill:a:'+item.id]={covered:true};
 assert.deepEqual(nextLanguageSkills('mandarin',almost,'a').characters,[]);
});
test('English suggests a sound and sight word independently of letter names and red words',()=>{
 const records={'skill:a:en-upper-a-name':{covered:true},'skill:a:en-red-said':{covered:true}};
 let next=nextLanguageSkills('english',records,'a');
 assert.equal(next.sound.id,'en-sound-a');assert.equal(next.sightWord.label,'I');
 records['skill:a:en-sound-a']={covered:true};records['skill:a:en-word-i']={covered:true};
 next=nextLanguageSkills('english',records,'a');assert.equal(next.sound.id,'en-sound-b');assert.equal(next.sightWord.label,'a');
 assert.equal(nextLanguageSkills('english',records,'b').sound.id,'en-sound-a');
});
test('completed English suggestions have clear empty states and include family-added sight words',()=>{
 const records={'custom:ours':{group:'sight',label:'because'}};
 for(const group of checklistGroups('english',records))for(const item of group.items)records['skill:a:'+item.id]={covered:true};
 assert.deepEqual(nextLanguageSkills('english',records,'a'),{sound:null,sightWord:null});
 records['skill:a:custom-ours'].covered=false;
 assert.equal(nextLanguageSkills('english',records,'a').sightWord.label,'because');
 records['skill:a:en-sound-long-a'].covered=false;
 assert.equal(nextLanguageSkills('english',records,'a').sound.id,'en-sound-long-a');
 assert.deepEqual(nextLanguageSkills('mandarin',records,'parent'),{});
});
