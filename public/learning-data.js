import { playWeekDays } from './play-data.js';
import { isAdult,learnerCurriculum,adultMandarin } from './curriculum.js';
import { englishGroups,sageBooks,mathGroups,skillText,mathStatus } from './skill-data.js';
export const learningSubjects={english:'English',mandarin:'Mandarin',math:'Math',bible:'Bible & worship',beauty:'Beauty loop',literature:'Literature',history:'History',geography:'Geography',nature:'Natural philosophy',other:'Life & learning'};
export function checklistGroups(subject,records={},child='together'){
  if(isAdult(child)){const plan=learnerCurriculum(child),items=subject==='mandarin'?adultMandarin:subject==='bible'?plan.bible:plan.loops[subject]?.items||(subject==='other'?[{id:'other',title:'Life & learning'}]:[]);return [{id:subject,title:learningSubjects[subject],items:items.map(x=>({id:'activity-'+x.id,label:x.title}))}]}
  if(subject==='mandarin')return sageBooks;
  if(subject==='math')return mathGroups;
  if(subject==='english')return englishGroups.map(group=>({...group,items:[...group.items,...Object.entries(records).filter(([key,value])=>key.startsWith('custom:')&&value?.group===group.id).map(([key,value])=>({id:'custom-'+key.slice(7),label:value.label,help:'Your own word.'}))]}));
  const activities={bible:[['bible-story','Kingdom of God Storybook Bible'],['without-doors','Without Doors · Life of Jesus'],['hymn','It Is Well with My Soul'],['scripture','Scripture memory'],['catechism','Catechism']],beauty:[['artist','Beatrix Potter'],['composer','George Frideric Handel'],['poet','Emily Dickinson'],['drawing','Drawing'],['handicraft','My First Piano Adventures Book A']],literature:[['literature','Read aloud']],history:[['biblioplan','BiblioPlan']],geography:[['atlas','Student Bible Atlas']],nature:[['nature','Natural philosophy']],other:[['other','Life & learning']]};
  return [{id:subject,title:learningSubjects[subject],items:(activities[subject]||[]).map(([id,label])=>({id:'activity-'+id,label}))}];
}
export function skillLabel(id,records={},child='together',t=x=>x){for(const subject of Object.keys(learningSubjects)){for(const group of checklistGroups(subject,records,child)){const item=group.items.find(x=>x.id===id);if(item)return subject==='mandarin'&&!isAdult(child)?`${t(group.title)} · ${item.simplified||item.label}`:group.letters?`${item.label} · ${t(item.letterTarget)}`:skillText(item,t)}}return id}
export function periodDays(date,period='week'){
  const start=new Date(date+'T12:00:00Z');
  if(period==='month')start.setUTCDate(1);else start.setUTCDate(start.getUTCDate()-(start.getUTCDay()+6)%7);
  const end=new Date(start);if(period==='month')end.setUTCMonth(end.getUTCMonth()+1);else end.setUTCDate(end.getUTCDate()+7);
  const days=[];for(const d=new Date(start);d<end;d.setUTCDate(d.getUTCDate()+1))days.push(d.toISOString().slice(0,10));return days;
}
const activitySubject={ 'bible-story':'bible','without-doors':'bible',hymn:'bible',scripture:'bible',catechism:'bible',artist:'beauty',composer:'beauty',poet:'beauty',drawing:'beauty',handicraft:'beauty',literature:'literature',biblioplan:'history',atlas:'geography','new-testament':'bible','spck-atlas':'bible','psalms-proverbs':'bible',podcast:'mandarin',zaobao:'mandarin',preply:'mandarin',piano:'beauty',northanger:'literature','austen-bookshelf':'literature'};
export function reviewLearning(records,child,days,photos=[],t=x=>x){
  const calendar=Object.fromEntries(days.map(day=>[day,{subjects:{},details:[],photos:[]}])) ;
  function add(date,subject,id,detail){if(!calendar[date]||!learningSubjects[subject])return;const cell=calendar[date];const ids=cell.subjects[subject]??=new Set();if(id.startsWith('session:')||id.startsWith('entry:'))for(const previous of ids)if(previous.startsWith('coverage:')||previous.startsWith('checklist-'))ids.delete(previous);ids.add(id);if(detail)cell.details.push({subject,text:detail})}
  for(const [key,value] of Object.entries(records)){
    if(!value)continue;
    if(key.startsWith('playweek:'+child+':'))for(const day of value.days||[])if(playWeekDays(key.split(':')[2]).includes(day))add(day,'other',key+':'+day,t('Play & discovery')+(value.observe||value.memory?' · '+(value.observe||value.memory):''));
    if((key.startsWith('session:')||key.startsWith('entry:'))&&value.childId===child)add(value.date,value.subject,key,value.lesson||(value.skillIds||[]).map(id=>skillLabel(id,records,child,t)).join(', ')||t('Subject practice'));
    if(key.startsWith('coverage:'+child+':')&&value===true){const parts=key.split(':');if(!calendar[parts[2]]?.subjects[parts[3]]?.size)add(parts[2],parts[3],key,t('Subject covered'))}
    if(key.startsWith('activity:'+child+':')&&value===true){const parts=key.split(':');add(parts[2],activitySubject[parts[3]],key,t([...learnerCurriculum(child).bible,...Object.values(learnerCurriculum(child).loops).flatMap(x=>x.items),...adultMandarin].find(x=>x.id===parts[3])?.title||parts[3]))}
    if(child==='together'&&key.startsWith('check:')&&value===true){const parts=key.split(':');add(parts[1],activitySubject[parts[2]],key,t([...learnerCurriculum(child).bible,...Object.values(learnerCurriculum(child).loops).flatMap(x=>x.items)].find(x=>x.id===parts[2])?.title||parts[2]))}
    if(key.startsWith('skill:'+child+':')&&value.covered){const id=key.split(':')[2],subject=id.startsWith('en-')||id.startsWith('custom-')?'english':id.startsWith('zh-')?'mandarin':'math';if(![...(calendar[value.date]?.subjects[subject]||[])].some(id=>id.startsWith('session:')||id.startsWith('entry:')))add(value.date,subject,'checklist-'+subject,skillLabel(id,records,child,t))}
    if(key.startsWith('countrybooks:'+child+':')&&value.titles?.length)add(key.split(':')[2],'history',key,(value.country?value.country+': ':'')+value.titles.join(', '));
    if(key.startsWith('reading:'+child+':')&&value.titles?.length)add(key.split(':')[2],'literature',key,value.titles.join(', '));
    if(key.startsWith('book:'+child+':')&&value.read)add(value.date,'literature','book-'+value.date,t('Literary Ladder reading'));
  }
  for(const photo of photos.filter(p=>p.childId===child&&!p.deleted&&calendar[p.date]))calendar[photo.date].photos.push(photo);
  const attendance=days.filter(date=>records[`attendance:${child}:${date}`]??Object.keys(calendar[date].subjects).length>0);
  const subjects=Object.fromEntries(Object.keys(learningSubjects).map(subject=>{const dates=days.filter(day=>calendar[day].subjects[subject]?.size);return [subject,{days:dates.length,sessions:dates.reduce((sum,date)=>sum+calendar[date].subjects[subject].size,0)}]}));
  return {calendar,attendance,subjects};
}

export function learnerSubjects(child){return Object.fromEntries(Object.entries(learningSubjects).filter(([key])=>!isAdult(child)||!['english','math','geography','nature'].includes(key)))}

// Attendance can include English without adding it to the adult lesson curriculum.
export function attendanceSubjects(child){const subjects=learnerSubjects(child);return isAdult(child)?{english:learningSubjects.english,...subjects}:subjects}

// A review never changes whether or when the book was read.
export function updateBookReview(previous={},review,date) {
  return {...previous,read:previous.read??false,date:previous.date||date,rating:review.rating,recommendation:review.recommendation,comment:review.comment};
}

// Follow the existing checklist order, using each learner’s own coverage records.
export function nextLanguageSkills(subject,records={},child='together') {
  const groups=checklistGroups(subject,records,child);
  const uncovered=item=>!records[`skill:${child}:${item.id}`]?.covered;
  if(subject==='mandarin'&&!isAdult(child))return {characters:groups.flatMap(g=>g.items).filter(uncovered).slice(0,5)};
  if(subject==='english'&&!isAdult(child))return {
    sound:[...(groups.find(g=>g.id==='lower')?.items||[]).filter(item=>item.letterTarget==='sound'),...(groups.find(g=>g.id==='vowels')?.items||[])].find(uncovered)||null,
    sightWord:(groups.find(g=>g.id==='sight')?.items||[]).find(uncovered)||null
  };
  return {};
}

export function subjectFocus(subject,records={},activeChild='together') {
  if(isAdult(activeChild))return [];
  const learners=activeChild==='together'?Object.entries(records).filter(([key,value])=>key.startsWith('profile:')&&value&&key!=='profile:together'&&!isAdult(key.slice(8))).map(([key,value])=>({id:key.slice(8),name:value.name})):[{id:activeChild,name:records['profile:'+activeChild]?.name||activeChild}];
  return learners.map(learner=>{
    const items=checklistGroups(subject,records,learner.id).flatMap(group=>group.items),state=item=>records[`skill:${learner.id}:${item.id}`]||{};
    const covered=items.filter(item=>subject==='math'?mathStatus(state(item))!=='unchecked':state(item).covered).length;
    const next=subject==='math'?items.find(item=>mathStatus(state(item))==='practice')||items.find(item=>mathStatus(state(item))==='unchecked')||items.find(item=>mathStatus(state(item))==='observed'):null;
    return {...learner,covered,total:items.length,next,...nextLanguageSkills(subject,records,learner.id)};
  });
}
