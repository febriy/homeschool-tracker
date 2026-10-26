import {playAreas,playStyles,playSchemas,playRoles,playOutings,materialIds,familyFields,profileFields,weekFields,monthFields,ideaFields,materialFields,playObservations,observationStates,playWeekStart,playWeekDays} from '../public/play-data.js';
const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
const text=(value,max=4000)=>typeof value==='string'&&value.length<=max;
const day=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
const strings=(value,allowed,max=50)=>Array.isArray(value)&&value.length<=max&&new Set(value).size===value.length&&value.every(id=>allowed.includes(id));
const fields=(value,definitions,extra=[])=>object(value)&&Object.keys(value).every(key=>definitions.some(([id])=>id===key)||extra.includes(key))&&definitions.every(([id])=>value[id]===undefined||text(value[id]));
export function validatePlayChange(key,value){
 const [kind,child,period]=key.split(':');
 if(kind==='playfamily')return fields(value,familyFields);
 if(kind==='playprofile')return fields(value,profileFields,['ageBand','styles','schemas','date'])&&(value.ageBand===undefined||['all','baby','toddler','preschool'].includes(value.ageBand))&&(value.date===undefined||day(value.date))&&(value.styles===undefined||strings(value.styles,Object.keys(playStyles)))&&(value.schemas===undefined||object(value.schemas)&&Object.entries(value.schemas).every(([key,value])=>Object.hasOwn(playSchemas,key)&&text(value,1000)));
 if(kind==='playweek')return day(period)&&playWeekStart(period)===period&&fields(value,weekFields,['areas','outings','days'])&&(value.areas===undefined||strings(value.areas,Object.keys(playAreas)))&&(value.outings===undefined||strings(value.outings,Object.keys(playOutings)))&&(value.days===undefined||strings(value.days,playWeekDays(period),7));
 if(kind==='playmonth')return /^\d{4}-(0[1-9]|1[0-2])$/.test(period)&&fields(value,monthFields,['roleEasy','roleNext'])&&['roleEasy','roleNext'].every(key=>value[key]===undefined||value[key]===''||Object.hasOwn(playRoles,value[key]));
 if(kind==='playmaterials')return fields(value,materialFields,['available'])&&(value.available===undefined||strings(value.available,materialIds));
 if(kind==='playidea')return value===null||fields(value,ideaFields,['tried'])&&text(value.title,200)&&value.title.trim().length>0&&typeof value.tried==='boolean';
 if(kind==='playobservation')return child!=='together'&&playObservations.some(item=>item.id===period)&&object(value)&&Object.keys(value).every(key=>['status','date','note'].includes(key))&&observationStates.includes(value.status)&&day(value.date)&&text(value.note,2000);
 return false;
}
