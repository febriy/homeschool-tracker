import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateChildrenChanges} from '../lib/children-records.js';
import {playObservations,playIdeaStarters,playWeekStart,playWeekDays,materialIds} from '../public/play-data.js';
import {reviewLearning,periodDays} from '../public/learning-data.js';
const valid=(key,value)=>validateChildrenChanges([{key,value}]);
test('play records persist separately by learner and canonical week or month',()=>{
 assert.equal(valid('playfamily',{why:'A joyful childhood',values:'Faith and kindness'}),true);
 assert.equal(valid('playprofile:ethan',{age:'1 year',ageBand:'toddler',interests:'Water',styles:['sensory','moving'],schemas:{trajectory:'Drops a ball and watches'},date:'2026-10-26'}),true);
 assert.equal(valid('playweek:ethan:2026-10-26',{notice:'Pouring water',invitation:'Cups on a tray',materials:'Two large cups',everyday:'Bath time',observe:'Transferred water using both hands',areas:['body','thinking'],days:['2026-10-26'],outings:['park'],next:'Offer a sponge'}),true);
 assert.equal(valid('playmonth:carisa:2026-10',{interests:'Building',growthreading:'Retells a story',roleEasy:'observer',roleNext:'curator',letGo:'Perfect plans'}),true);
 assert.equal(valid('playmaterials:ethan',{available:materialIds.slice(0,4),out:'Large blocks',rest:'Cars',return:'Animals',other:'Wooden bowls'}),true);
 assert.equal(valid('playidea:carisa:idea-one',{title:'Build a town',interest:'Vehicles',materials:'Blocks',notes:'Try outside',tried:false}),true);
 assert.equal(valid('playidea:carisa:idea-one',null),true);
 for(const status of ['unnoticed','emerging','independent'])assert.equal(valid('playobservation:ethan:toddler-tools',{status,date:'2026-10-26',note:'Used both hands'}),true);
});
test('play validation rejects unknown fields, bad dates, duplicate choices and cross-week attendance',()=>{
 for(const [key,value]of [
 ['playfamily',{unknown:'x'}],['playprofile:a',{styles:['made-up']}],['playprofile:a',{styles:['art','art']}],['playprofile:a',{schemas:{unexpected:'x'}}],['playprofile:a',{ageBand:'teen'}],
 ['playweek:a:2026-10-27',{days:[]}],['playweek:a:2026-10-26',{days:['2026-11-02']}],['playweek:a:2026-10-26',{days:['2026-10-26','2026-10-26']}],['playweek:a:2026-10-26',{notice:'x'.repeat(4001)}],
 ['playmonth:a:2026-13',{}],['playmonth:a:2026-10',{roleNext:'made-up'}],['playmaterials:a',{available:['not-material']}],
 ['playidea:a:one',{title:'',tried:false}],['playidea:a:one',{title:'x'.repeat(201),tried:false}],['playidea:a:one',{title:'Game',tried:'yes'}],
 ['playobservation:a:invented',{status:'emerging',date:'2026-10-26',note:''}],['playobservation:together:toddler-tools',{status:'emerging',date:'2026-10-26',note:''}],['playobservation:a:toddler-tools',{status:'mastered',date:'2026-10-26',note:''}],['playobservation:a:toddler-tools',{status:'emerging',date:'2026-02-30',note:''}]
 ])assert.equal(valid(key,value),false,key);
});
test('play calendar uses real Monday weeks including fifth weeks and month/year boundaries',()=>{
 assert.equal(playWeekStart('2026-11-01'),'2026-10-26');
 assert.deepEqual(playWeekDays('2026-10-31'),['2026-10-26','2026-10-27','2026-10-28','2026-10-29','2026-10-30','2026-10-31','2026-11-01']);
 assert.equal(playWeekStart('2027-01-01'),'2026-12-28');
});
test('only checked play days count in review; plans and growth observations never invent attendance',()=>{
 const records={'playweek:ethan:2026-10-26':{notice:'Pouring',observe:'Used a cup',days:['2026-10-26','2026-11-01']},'playweek:carisa:2026-10-26':{notice:'Building',days:['2026-10-27']},'playmonth:ethan:2026-10':{growthbody:'Balances'},'playobservation:ethan:toddler-tools':{status:'independent',date:'2026-10-28',note:'Drawing'}};
 const oct=reviewLearning(records,'ethan',periodDays('2026-10-26','month'));
 assert.deepEqual(oct.attendance,['2026-10-26']);assert.equal(oct.subjects.other.days,1);assert.equal(oct.subjects.math.days,0);
 assert.equal(oct.calendar['2026-10-26'].details[0].text,'Play & discovery · Used a cup');
 const november=reviewLearning(records,'ethan',periodDays('2026-11-01','month'));assert.deepEqual(november.attendance,['2026-11-01']);
 const carisa=reviewLearning(records,'carisa',playWeekDays('2026-10-26'));assert.deepEqual(carisa.attendance,['2026-10-27']);
 assert.equal(reviewLearning({'playweek:ethan:2026-10-26':{notice:'Plan only'}},'ethan',playWeekDays('2026-10-26')).attendance.length,0);
});
test('all adapted observations and starter ideas have stable unique IDs and bilingual labels',()=>{
 assert.equal(new Set(playObservations.map(x=>x.id)).size,playObservations.length);
 for(const item of playObservations){assert.ok(['baby','toddler','preschool','all'].includes(item.age));assert.equal(item.label.length,2);assert.ok(item.label.every(Boolean));}
 assert.equal(playIdeaStarters.length,10);
 for(const item of playIdeaStarters)for(const field of ['title','interest','materials','notes'])assert.ok(item[field].length===2&&item[field].every(Boolean));
});
