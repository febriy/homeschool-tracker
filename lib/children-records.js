import { validatePlayChange } from './play-records.js';
import { activityIds } from '../public/curriculum.js';
import { learningSubjects,checklistGroups } from '../public/learning-data.js';
import { skillIds } from '../public/skill-data.js';
const id = '[a-zA-Z0-9-]{1,80}';
const day = '\\d{4}-\\d{2}-\\d{2}';
const keyPattern = new RegExp(`^(playfamily|playprofile:${id}|playmaterials:${id}|playweek:${id}:${day}|playmonth:${id}:\\d{4}-\\d{2}|playidea:${id}:${id}|playobservation:${id}:${id}|profile:${id}|entry:${id}|session:${id}|attendance:${id}:${day}|coverage:${id}:${day}:[a-z]+|activity:${id}:${day}:[a-z-]+|countrybooks:${id}:${day}|reading:${id}:${day}|book:${id}:ladder-[0-9]{4}|custom:${id}|skill:${id}:${id}|check:${day}:(bible-story|without-doors|hymn|scripture|catechism|artist|composer|poet|drawing|handicraft|literature|biblioplan|atlas)|journal:${day}|rotation:${id}|rotation)$`);
export function validateChildrenChanges(changes) {
  if (!Array.isArray(changes) || changes.length < 1 || changes.length > 500) return false;
  const seen = new Set();
  return changes.every(({key,value} = {}) => {
    if (typeof key !== 'string' || !keyPattern.test(key) || seen.has(key)) return false;
    seen.add(key);
    if(key.startsWith('play'))return validatePlayChange(key,value);
    if(key.startsWith('attendance:'))return typeof value==='boolean';
    if(key.startsWith('coverage:'))return typeof value==='boolean'&&Object.hasOwn(learningSubjects,key.split(':')[3]);
    if(key.startsWith('activity:'))return typeof value==='boolean'&&activityIds.includes(key.split(':')[3]);
    if(key.startsWith('countrybooks:'))return value&&Object.keys(value).every(k=>['country','titles'].includes(k))&&typeof value.country==='string'&&value.country.length<=120&&Array.isArray(value.titles)&&value.titles.length<=5&&value.titles.every(title=>typeof title==='string'&&title.trim().length>0&&title.length<=300);
    if(key.startsWith('reading:'))return value&&Array.isArray(value.titles)&&Object.keys(value).every(k=>k==='titles')&&value.titles.length<=10&&value.titles.every(title=>typeof title==='string'&&title.trim().length>0&&title.length<=300);
    if(key.startsWith('book:'))return value&&Object.keys(value).every(k=>['read','date','rating','recommendation','comment'].includes(k))&&typeof value.read==='boolean'&&/^\d{4}-\d{2}-\d{2}$/.test(value.date)&&(value.rating===undefined||value.rating===null||Number.isInteger(value.rating)&&value.rating>=1&&value.rating<=5)&&(value.recommendation===undefined||['','yes','maybe','no'].includes(value.recommendation))&&(value.comment===undefined||typeof value.comment==='string'&&value.comment.length<=2000);
    if(key.startsWith('session:')){
      if(value===null)return true;
      const subjectItems=Object.hasOwn(learningSubjects,value?.subject)?checklistGroups(value.subject,{},value.childId).flatMap(g=>g.items).map(x=>x.id):[];
      return value&&Object.keys(value).every(k=>['childId','date','subject','skillIds','note','outcome','createdAt'].includes(k))&&typeof value.childId==='string'&&new RegExp(`^${id}$`).test(value.childId)&&/^\d{4}-\d{2}-\d{2}$/.test(value.date)&&Object.hasOwn(learningSubjects,value.subject)&&Array.isArray(value.skillIds)&&value.skillIds.length>0&&value.skillIds.length<=300&&new Set(value.skillIds).size===value.skillIds.length&&value.skillIds.every(id=>subjectItems.includes(id)||(value.subject==='english'&&/^custom-[a-zA-Z0-9-]{1,80}$/.test(id)))&&typeof value.note==='string'&&value.note.length<=4000&&['completed','practised','revisit'].includes(value.outcome)&&typeof value.createdAt==='string'&&!Number.isNaN(Date.parse(value.createdAt));
    }
    if (key.startsWith('custom:')) return value && typeof value === 'object' && Object.keys(value).every(k=>['group','label'].includes(k)) && ['sight','red'].includes(value.group) && typeof value.label==='string' && value.label.trim().length>0 && value.label.length<=60;
    if (key.startsWith('skill:')) {
      const skillId=key.split(':')[2];
      return (skillIds.has(skillId)||/^custom-[a-zA-Z0-9-]{1,80}$/.test(skillId)) && value && typeof value==='object' && Object.keys(value).every(k=>['covered','date','note','secure','needsPractice','focusWeek'].includes(k)) && typeof value.covered==='boolean' && typeof value.date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) && typeof value.note==='string' && value.note.length<=2000 && ['secure','needsPractice'].every(k=>value[k]===undefined||typeof value[k]==='boolean') && (value.focusWeek===undefined||value.focusWeek===''||/^\d{4}-\d{2}-\d{2}$/.test(value.focusWeek));
    }
    if (key === 'rotation'||key.startsWith('rotation:')) return ['beauty','literature','history'].includes(value);
    if (key.startsWith('check:')) return typeof value === 'boolean';
    if (key.startsWith('journal:')) return typeof value === 'string' && value.length <= 20000;
    if (value === null) return key.startsWith('entry:');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    if (key.startsWith('profile:')) return Object.keys(value).every(k => ['name'].includes(k)) && typeof value.name === 'string' && value.name.trim().length > 0 && value.name.length <= 80;
    return Object.keys(value).every(k => ['date','subject','childId','lesson','note','outcome','createdAt'].includes(k)) &&
      typeof value.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
      ['english','mandarin','math'].includes(value.subject) &&
      typeof value.childId === 'string' && new RegExp(`^${id}$`).test(value.childId) &&
      typeof value.lesson === 'string' && value.lesson.trim().length > 0 && value.lesson.length <= 300 &&
      typeof value.note === 'string' && value.note.length <= 4000 &&
      ['completed','practised','revisit'].includes(value.outcome) &&
      typeof value.createdAt === 'string' && !Number.isNaN(Date.parse(value.createdAt));
  });
}
