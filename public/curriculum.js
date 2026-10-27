export const subjects = {
  english: {title:'English', curriculum:'Alana’s manual', hint:'Lesson, page, or skill', example:'e.g. Lesson 12 · letter sounds'},
  mandarin: {title:'Mandarin', curriculum:'Sagebooks', hint:'Set, book, lesson, or characters', example:'e.g. Set 1, Book 2 · Lesson 4'},
  math: {title:'Math', curriculum:'Kate Snow · Math with Confidence', hint:'Level, unit, or lesson', example:'e.g. Kindergarten · Unit 3, Lesson 2'}
};
export const bible = [
  {id:'bible-story', title:'Kingdom of God Storybook Bible', detail:'Read the next story together.'},
  {id:'without-doors', title:'Without Doors · Life of Jesus', detail:'Continue the curriculum’s next topic.'},
  {id:'hymn', title:'It Is Well with My Soul', detail:'Listen, sing, and learn the hymn.', link:'https://open.spotify.com/track/0p6lVcx7a04LpFQ7iSSeHP', linkLabel:'Listen to the hymn'},
  {id:'scripture', title:'Scripture memory', detail:'Practise the current verse together.', link:'https://open.spotify.com/album/3TlEFiW8VqsP1ULTnKW8Yc', linkLabel:'Scripture songs'},
  {id:'catechism', title:'Catechism', detail:'Review your current question and answer.', link:'https://open.spotify.com/album/3CMRKYEy9rRmaM5upIfwYH', linkLabel:'Catechism songs'}
];
export const loops = {
  beauty:{ title:'Beauty loop', description:'Choose a study to enjoy together.', items:[
    {id:'artist',title:'Artist · Beatrix Potter',detail:'Look closely at an illustration or painting.'},
    {id:'composer',title:'Composer · George Frideric Handel',detail:'Listen to the composer study.',link:'https://open.spotify.com/playlist/5Y08mRKOo0bBGt1u4lSERW',linkLabel:'Composer playlist'},
    {id:'poet',title:'Poet · Emily Dickinson',detail:'Read a poem aloud together and enjoy its sounds and images.',link:'https://poetryarchive.org/poet/emily-dickinson/',linkLabel:'Emily Dickinson poems',extraLink:'https://childrens.poetryarchive.org/explore/',extraLinkLabel:'Explore children’s poetry'},
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
export function defaultRecords(){return {'profile:together':{name:'Children together'},'profile:parent':{name:'My learning'},rotation:'beauty'}};

export const adultBible=[
  {id:'new-testament',title:'New Testament',detail:'Continue your New Testament reading.'},
  {id:'spck-atlas',title:'SPCK Bible Atlas',detail:'Explore the places connected to your reading.'},
  {id:'hymn',title:'Hymn singing',detail:'Sing and reflect on a hymn.'},
  {id:'without-doors',title:'Without Doors · Life of Jesus',detail:'Continue the curriculum’s next topic.'},
  {id:'psalms-proverbs',title:'QT programs · Books of Psalms & Proverbs',detail:'Continue your quiet-time reading.'}
];
export const adultMandarin=[
  {id:'podcast',title:'Listen to a podcast',detail:'Spend time listening in Mandarin.'},
  {id:'zaobao',title:'Read 联合早报 · one article',detail:'Read one article and notice useful expressions.'},
  {id:'preply',title:'Revise Preply vocabulary',detail:'Review and practise your lesson vocabulary.'}
];
export const adultLoops={
  beauty:{title:'Beauty loop',description:'Make room to look, listen, and practise.',items:[
    {id:'artist',title:'Artist · Anna Archer',detail:'Continue your artist study.'},
    {...loops.beauty.items[1]}, {id:'poet',title:'Poet · Emily Dickinson',detail:'Read a poem and enjoy its sounds and images.',link:'https://poetryarchive.org/poet/emily-dickinson/',linkLabel:'Emily Dickinson poems'},
    {id:'drawing',title:'Drawing',detail:'Continue your drawing practice.'},
    {id:'piano',title:'Piano practice',detail:'Spend time at the piano.'}
  ]},
  literature:{title:'Literature',description:'Continue your own reading.',items:[
    {id:'northanger',title:'Northanger Abbey',detail:'Continue from your last reading.'},
    {id:'austen-bookshelf',title:'Jane Austen’s Bookshelf',detail:'Continue from your last reading.'}
  ]},
  history:{title:'History',description:'Connect your BiblioPlan study with country reading.',items:[{id:'biblioplan',title:'BiblioPlan',detail:'Continue the next history study.'}]},
  philosophy:{title:'Educational philosophy',description:'Read, reflect, and bring an idea into your home.',items:[{id:'charlotte-volume-1',title:'Charlotte Mason · Volume 1',detail:'Continue from your last reading.'}]}
};
export const isAdult=id=>id==='parent';
export function learnerCurriculum(id){return isAdult(id)?{bible:adultBible,subjects:{mandarin:{title:'Mandarin',curriculum:'Podcasts · 联合早报 · Preply'}},loops:adultLoops}:{bible,subjects,loops}}
export const activityIds=[...new Set([...bible,...Object.values(loops).flatMap(x=>x.items),...adultBible,...adultMandarin,...Object.values(adultLoops).flatMap(x=>x.items)].map(x=>x.id))];
