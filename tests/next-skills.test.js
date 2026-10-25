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

test('together view gives each child their own focus, excluding shared and adult progress',async()=>{
 const {subjectFocus}=await import('../public/learning-data.js');
 const records={'profile:together':{name:'Children together'},'profile:parent':{name:'My learning'},'profile:carisa':{name:'Carisa'},'profile:ethan':{name:'Ethan'},'skill:carisa:en-sound-a':{covered:true},'skill:ethan:en-word-i':{covered:true},'skill:together:en-sound-b':{covered:true},'skill:carisa:zh-b1-1':{covered:true},'skill:ethan:zh-b1-2':{covered:true},'skill:carisa:math-count20':{covered:true,secure:true},'skill:ethan:math-parts':{covered:false,needsPractice:true}};
 const english=subjectFocus('english',records);
 assert.deepEqual(english.map(x=>x.name),['Carisa','Ethan']);
 assert.equal(english[0].sound.id,'en-sound-b');assert.equal(english[0].sightWord.label,'I');
 assert.equal(english[1].sound.id,'en-sound-a');assert.equal(english[1].sightWord.label,'a');
 assert.deepEqual(english.map(x=>x.covered),[1,1]);
 const mandarin=subjectFocus('mandarin',records);
 assert.equal(mandarin[0].characters[0].label,'高');assert.equal(mandarin[1].characters[0].label,'山');
 const math=subjectFocus('math',records);
 assert.equal(math[0].next.id,'math-count10');assert.equal(math[1].next.id,'math-parts');
 assert.deepEqual(subjectFocus('english',records,'ethan').map(x=>x.name),['Ethan']);
 assert.deepEqual(subjectFocus('english',records,'parent'),[]);
 assert.deepEqual(subjectFocus('english',{},'together'),[]);
});
