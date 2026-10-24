export const subjects = {
  english: {title:'English', curriculum:'Alana’s manual', hint:'Lesson, page, or skill', example:'e.g. Lesson 12 · letter sounds'},
  mandarin: {title:'Mandarin', curriculum:'Sagebooks', hint:'Set, book, lesson, or characters', example:'e.g. Set 1, Book 2 · Lesson 4'},
  math: {title:'Math', curriculum:'Kate Snow · Math with Confidence', hint:'Level, unit, or lesson', example:'e.g. Kindergarten · Unit 3, Lesson 2'}
};
export const bible = [
  {id:'bible-story', title:'Kingdom of God Storybook Bible', detail:'Read the next story together.'},
  {id:'without-doors', title:'Without Doors · Life of Jesus', detail:'Continue the curriculum’s next topic.', link:'https://www.withoutdoorscurriculum.com/curriculum/bible-study/', linkLabel:'Open curriculum'},
  {id:'hymn', title:'It Is Well with My Soul', detail:'Listen, sing, and learn the hymn.', link:'https://open.spotify.com/track/0p6lVcx7a04LpFQ7iSSeHP', linkLabel:'Listen to the hymn'},
  {id:'scripture', title:'Scripture memory', detail:'Practise the current verse together.', link:'https://open.spotify.com/album/3TlEFiW8VqsP1ULTnKW8Yc', linkLabel:'Scripture songs'},
  {id:'catechism', title:'Catechism', detail:'Review your current question and answer.', link:'https://open.spotify.com/album/3CMRKYEy9rRmaM5upIfwYH', linkLabel:'Catechism songs'}
];
export const loops = {
  beauty:{ title:'Beauty loop', description:'Choose a study to enjoy together.', items:[
    {id:'artist',title:'Artist · Beatrix Potter',detail:'Look closely at an illustration or painting.'},
    {id:'composer',title:'Composer · George Frideric Handel',detail:'Listen to the composer study.',link:'https://open.spotify.com/playlist/5Y08mRKOo0bBGt1u4lSERW',linkLabel:'Composer playlist'},
    {id:'drawing',title:'Drawing',detail:'Continue your drawing lesson or sketch together.'},
    {id:'handicraft',title:'Handicraft · My First Piano Adventures Book A',detail:'Continue the next activity or piano lesson.'}
  ]},
  literature:{title:'Literature',description:'Continue your Literary Ladder reading.',items:[
    {id:'literature',title:'Literary Ladder',detail:'Read from the children’s current book.'}
  ]},
  history:{title:'History, geography & natural philosophy',description:'Continue history and map work.',items:[
    {id:'biblioplan',title:'BiblioPlan',detail:'Continue the next history study.'},
    {id:'atlas',title:'Student Bible Atlas',detail:'Find the places connected to your study.'}
  ]}
};
export function singaporeDay(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
export function progressEntries(records,{child='all',subject='all'}={}){
  return Object.entries(records).filter(([key,value])=>key.startsWith('entry:')&&value&& (child==='all'||value.childId===child)&&(subject==='all'||value.subject===subject)).map(([key,value])=>({id:key.slice(6),...value})).sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt));
}
export function defaultRecords(){return {'profile:together':{name:'Children together'},rotation:'beauty'}};
