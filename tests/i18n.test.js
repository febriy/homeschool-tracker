import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {translate,zh} from '../public/i18n.js';
import {englishGroups,sageBooks,mathGroups} from '../public/skill-data.js';
import {bible,loops,adultBible,adultMandarin,adultLoops} from '../public/curriculum.js';
import {skillLabel,reviewLearning} from '../public/learning-data.js';
const t=(s,values)=>translate(s,'zh',values);

test('all checklist guidance, maths labels, group titles and materials have Chinese translations',()=>{
  for(const g of [...englishGroups,...sageBooks,...mathGroups]){
    for(const text of [g.title,g.hint,...g.items.flatMap(i=>[i.help,i.material,i.observe])].filter(Boolean))assert.ok(zh[text],`Missing: ${text}`);
  }
  for(const i of mathGroups.flatMap(g=>g.items))assert.notEqual(t(i.label),i.label);
});
test('child and adult activity instructions and explicit UI translation keys are covered',()=>{
  for(const i of [...bible,...adultBible,...adultMandarin,...Object.values(loops).flatMap(g=>g.items),...Object.values(adultLoops).flatMap(g=>g.items)])assert.ok(zh[i.detail],i.detail);
  for(const file of ['app.js','skills.js','learning.js'])for(const match of readFileSync(`public/${file}`,'utf8').matchAll(/\bt\((['"])(.*?)\1/g))if(match[2])assert.ok(zh[match[2]],`${file}: ${match[2]}`);
});
test('authored static UI copy is translated while names, titles and English learning targets remain intact',()=>{
  const html=readFileSync('index.html','utf8').replace(/<head>[\s\S]*?<\/head>|<script[\s\S]*?<\/script>/g,'');
  for(const match of html.matchAll(/>([^<>]+)</g)){const text=match[1].trim();if(text&&!['EN','中文'].includes(text))assert.ok(zh[text],`Static copy: ${text}`)}
  assert.equal(t('Carisa'),'Carisa');assert.equal(t('Northanger Abbey'),'Northanger Abbey');assert.equal(t('the'),'the');assert.equal(skillLabel('custom-test',{'custom:test':{group:'sight',label:'Open'}},'carisa',t),'Open');
  assert.equal(t('Book {number} (optional)',{number:3}),'第 3 本书（可选）');
  assert.equal(translate('Book {number} (optional)','en',{number:3}),'Book 3 (optional)');
});
test('record history and review localize built-in skill/activity labels without changing stored progress or notes',()=>{
  const records={'activity:carisa:2026-10-25:bible-story':true,'session:one':{childId:'carisa',date:'2026-10-25',subject:'math',skillIds:['math-count10'],note:'Leave my note exactly as typed',outcome:'practised'}};
  const snapshot=structuredClone(records);
  assert.equal(skillLabel('math-count10',records,'carisa',t),'准确点数 10 个物品');
  assert.equal(skillLabel('en-sound-a',records,'carisa',t),'a · 发音');
  const result=reviewLearning(records,'carisa',['2026-10-25'],[],t);
  assert.ok(result.calendar['2026-10-25'].details.some(d=>d.text==='准确点数 10 个物品'));
  assert.ok(result.calendar['2026-10-25'].details.some(d=>d.text==='天国故事圣经'));
  assert.deepEqual(records,snapshot);
});
