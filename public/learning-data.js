import { isAdult,learnerCurriculum,adultMandarin } from './curriculum.js';
import { englishGroups,sageBooks,mathGroups } from './skill-data.js';
export const learningSubjects={english:'English',mandarin:'Mandarin',math:'Math',bible:'Bible & worship',beauty:'Beauty loop',literature:'Literature',history:'History',geography:'Geography',nature:'Natural philosophy',other:'Life & learning'};
export function checklistGroups(subject,records={},child='together'){
  if(isAdult(child)){const plan=learnerCurriculum(child),items=subject==='mandarin'?adultMandarin:subject==='bible'?plan.bible:plan.loops[subject]?.items||(subject==='other'?[{id:'other',title:'Life & learning'}]:[]);return [{id:subject,title:learningSubjects[subject],items:items.map(x=>({id:'activity-'+x.id,label:x.title}))}]}
  if(subject==='mandarin')return sageBooks;
  if(subject==='math')return mathGroups;
  if(subject==='english')return englishGroups.map(group=>({...group,items:[...group.items,...Object.entries(records).filter(([key,value])=>key.startsWith('custom:')&&value?.group===group.id).map(([key,value])=>({id:'custom-'+key.slice(7),label:value.label,help:'Your own word.'}))]}));
  const activities={bible:[['bible-story','Kingdom of God Storybook Bible'],['without-doors','Without Doors · Life of Jesus'],['hymn','It Is Well with My Soul'],['scripture','Scripture memory'],['catechism','Catechism']],beauty:[['artist','Beatrix Potter'],['composer','George Frideric Handel'],['poet','Emily Dickinson'],['drawing','Drawing'],['handicraft','My First Piano Adventures Book A']],literature:[['literature','Read aloud']],history:[['biblioplan','BiblioPlan']],geography:[['atlas','Student Bible Atlas']],nature:[['nature','Natural philosophy']],other:[['other','Life & learning']]};
  return [{id:subject,title:learningSubjects[subject],items:(activities[subject]||[]).map(([id,label])=>({id:'activity-'+id,label}))}];
}
export function skillLabel(id,records={},child='together'){for(const subject of Object.keys(learningSubjects)){for(const group of checklistGroups(subject,records,child)){const item=group.items.find(x=>x.id===id);if(item)return subject==='mandarin'&&!isAdult(child)?`${group.title} · ${item.simplified||item.label}`:group.letters?`${item.label} · ${item.letterTarget}`:item.label}}return id}
export function periodDays(date,period='week'){
  const start=new Date(date+'T12:00:00Z');
  if(period==='month')start.setUTCDate(1);else start.setUTCDate(start.getUTCDate()-(start.getUTCDay()+6)%7);
  const end=new Date(start);if(period==='month')end.setUTCMonth(end.getUTCMonth()+1);else end.setUTCDate(end.getUTCDate()+7);
  const days=[];for(const d=new Date(start);d<end;d.setUTCDate(d.getUTCDate()+1))days.push(d.toISOString().slice(0,10));return days;
}
const activitySubject={ 'bible-story':'bible','without-doors':'bible',hymn:'bible',scripture:'bible',catechism:'bible',artist:'beauty',composer:'beauty',poet:'beauty',drawing:'beauty',handicraft:'beauty',literature:'literature',biblioplan:'history',atlas:'geography','new-testament':'bible','spck-atlas':'bible','psalms-proverbs':'bible',podcast:'mandarin',zaobao:'mandarin',preply:'mandarin',piano:'beauty',northanger:'literature','austen-bookshelf':'literature'};
export function reviewLearning(records,child,days,photos=[]){
  const calendar=Object.fromEntries(days.map(day=>[day,{subjects:{},details:[],photos:[]}])) ;
  function add(date,subject,id,detail){if(!calendar[date]||!learningSubjects[subject])return;const cell=calendar[date];const ids=cell.subjects[subject]??=new Set();if(id.startsWith('session:')||id.startsWith('entry:'))for(const previous of ids)if(previous.startsWith('coverage:')||previous.startsWith('checklist-'))ids.delete(previous);ids.add(id);if(detail)cell.details.push({subject,text:detail})}
  for(const [key,value] of Object.entries(records)){
    if(!value)continue;
    if((key.startsWith('session:')||key.startsWith('entry:'))&&value.childId===child)add(value.date,value.subject,key,value.lesson||(value.skillIds||[]).map(id=>skillLabel(id,records,child)).join(', ')||'Subject practice');
    if(key.startsWith('coverage:'+child+':')&&value===true){const parts=key.split(':');if(!calendar[parts[2]]?.subjects[parts[3]]?.size)add(parts[2],parts[3],key,'Subject covered')}
    if(key.startsWith('activity:'+child+':')&&value===true){const parts=key.split(':');add(parts[2],activitySubject[parts[3]],key,parts[3].replaceAll('-',' '))}
    if(child==='together'&&key.startsWith('check:')&&value===true){const parts=key.split(':');add(parts[1],activitySubject[parts[2]],key,parts[2].replaceAll('-',' '))}
    if(key.startsWith('skill:'+child+':')&&value.covered){const id=key.split(':')[2],subject=id.startsWith('en-')||id.startsWith('custom-')?'english':id.startsWith('zh-')?'mandarin':'math';if(![...(calendar[value.date]?.subjects[subject]||[])].some(id=>id.startsWith('session:')||id.startsWith('entry:')))add(value.date,subject,'checklist-'+subject,skillLabel(id,records))}
    if(key.startsWith('countrybooks:'+child+':')&&value.titles?.length)add(key.split(':')[2],'history',key,(value.country?value.country+': ':'')+value.titles.join(', '));
    if(key.startsWith('reading:'+child+':')&&value.titles?.length)add(key.split(':')[2],'literature',key,value.titles.join(', '));
    if(key.startsWith('book:'+child+':')&&value.read)add(value.date,'literature','book-'+value.date,'Literary Ladder reading');
  }
  for(const photo of photos.filter(p=>p.childId===child&&!p.deleted&&calendar[p.date]))calendar[photo.date].photos.push(photo);
  const attendance=days.filter(date=>records[`attendance:${child}:${date}`]??Object.keys(calendar[date].subjects).length>0);
  const subjects=Object.fromEntries(Object.keys(learningSubjects).map(subject=>{const dates=days.filter(day=>calendar[day].subjects[subject]?.size);return [subject,{days:dates.length,sessions:dates.reduce((sum,date)=>sum+calendar[date].subjects[subject].size,0)}]}));
  return {calendar,attendance,subjects};
}

export function learnerSubjects(child){return Object.fromEntries(Object.entries(learningSubjects).filter(([key])=>!isAdult(child)||!['english','math','geography','nature'].includes(key)))}
