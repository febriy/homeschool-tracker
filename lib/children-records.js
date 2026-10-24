import { skillIds } from '../public/skill-data.js';
const id = '[a-zA-Z0-9-]{1,80}';
const day = '\\d{4}-\\d{2}-\\d{2}';
const keyPattern = new RegExp(`^(profile:${id}|entry:${id}|custom:${id}|skill:${id}:${id}|check:${day}:(bible-story|without-doors|hymn|scripture|catechism|artist|composer|drawing|handicraft|literature|biblioplan|atlas)|journal:${day}|rotation)$`);
export function validateChildrenChanges(changes) {
  if (!Array.isArray(changes) || changes.length < 1 || changes.length > 500) return false;
  const seen = new Set();
  return changes.every(({key,value} = {}) => {
    if (typeof key !== 'string' || !keyPattern.test(key) || seen.has(key)) return false;
    seen.add(key);
    if (key.startsWith('custom:')) return value && typeof value === 'object' && Object.keys(value).every(k=>['group','label'].includes(k)) && value.group==='sight' && typeof value.label==='string' && value.label.trim().length>0 && value.label.length<=60;
    if (key.startsWith('skill:')) {
      const skillId=key.split(':')[2];
      return (skillIds.has(skillId)||/^custom-[a-zA-Z0-9-]{1,80}$/.test(skillId)) && value && typeof value==='object' && Object.keys(value).every(k=>['covered','date','note'].includes(k)) && typeof value.covered==='boolean' && typeof value.date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) && typeof value.note==='string' && value.note.length<=2000;
    }
    if (key === 'rotation') return ['beauty','literature','history'].includes(value);
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
