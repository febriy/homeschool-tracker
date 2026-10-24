// Parent-facing checklists. Math crosswalks are our interpretation, not an official alignment.
export const skillSources = {
  sage:'https://www.sagebookshk.com/wp-content/uploads/2024/06/2024-ICBCC_EN.pdf',
  sageCourse:'https://www.sagebookshk.com/programs/basic-chinese-beginning/',
  nel:'https://nel.moe.edu.sg/la/numeracy/overview/',
  nelGuide:'https://isomer-user-content.by.gov.sg/57/c079b912-2898-42e2-b32d-ff3ab7cfbec4/Nurturing%20Early%20Learners%202022%20Educators%20Guide%20Numeracy_new.pdf',
  nctm:'https://www.nctm.org/uploadedFiles/About/MathEdInUS2004.pdf',
  syllables:'https://www.readingrockets.org/topics/spelling-and-word-study/articles/six-syllable-types',
  phonics:'https://ufli.education.ufl.edu/foundations/'
};
const sounds=[['a','short a · apple'],['b','/b/ · bat'],['c','hard c · cat'],['d','/d/ · dog'],['e','short e · egg'],['f','/f/ · fish'],['g','hard g · goat'],['h','/h/ · hat'],['i','short i · insect'],['j','/j/ · jam'],['k','/k/ · kite'],['l','/l/ · leaf'],['m','/m/ · moon'],['n','/n/ · net'],['o','short o · octopus'],['p','/p/ · pig'],['q','/kw/ · queen (q usually pairs with u; two sounds)'],['r','/r/ · rabbit'],['s','/s/ · sun'],['t','/t/ · top'],['u','short u · umbrella'],['v','/v/ · van'],['w','/w/ · web'],['x','/ks/ · box (two sounds)'],['y','/y/ · yes'],['z','/z/ · zip'],['long-a','long a · acorn'],['long-e','long e · equal'],['long-i','long i · ice'],['long-o','long o · open'],['long-u','long u · unicorn']];
const starterWords='I a the to and is in it you of he she we me be was are said have do go no so my by all they this that with'.split(' ');
const item=(id,label,help)=>({id,label,help});
export const englishGroups=[
  {id:'sounds',title:'Letter sounds',hint:'Tick after you have explicitly taught and practised the sound. This records coverage, not automatic reading mastery.',items:sounds.map(([id,help])=>item('en-sound-'+id,id.length===1?id:id.replace('long-','Long '),help))},
  {id:'sight',title:'Sight words',hint:'A starter list, not a claimed Alana’s manual word sequence. Add the words from your manual below. Teach the regular sounds and point out any unexpected spelling.',items:starterWords.map(word=>item('en-word-'+word.toLowerCase(),word,'Tick when this word has been taught and practised in a short phrase or sentence.'))},
  {id:'digraphs',title:'Digraphs',hint:'Two letters representing one sound. Different sounds of th, oo, ow, and ea have separate checkboxes.',items:[['sh','ship'],['ch','chip'],['th-quiet','th · thin (unvoiced)'],['th-voiced','th · this (voiced)'],['ck','duck'],['ng','sing'],['ph','phone'],['ai','rain'],['ay','day'],['ee','feet'],['ea-long','ea · leaf'],['ea-short','ea · bread'],['oa','boat'],['ow-long','ow · snow'],['ow-ou','ow · cow'],['oo-long','oo · moon'],['oo-short','oo · book'],['ou','out'],['oi','coin'],['oy','boy']].map(([id,example])=>item('en-di-'+id,id.includes('-')?example:id,'Example: '+example+'. Tick after teaching and practising this spelling and sound.'))},
  {id:'trigraphs',title:'Trigraphs',hint:'Three letters representing one sound; do not treat consonant blends such as str as trigraphs.',items:[item('en-tri-igh','igh','Example: night. Three letters spell the long i sound.'),item('en-tri-tch','tch','Example: catch. Three letters spell /ch/.'),item('en-tri-dge','dge','Example: badge. Three letters spell /j/.')]},
  {id:'syllables',title:'Syllable types',hint:'Six common decoding patterns. These are syllable types, rather than syllabus categories. Tick when the pattern has been taught with example words.',items:[
    item('en-syl-closed','Closed','cat, rabbit: a vowel is followed by a consonant in the syllable; the vowel is usually short.'),
    item('en-syl-open','Open','me, tiger: the syllable ends in a vowel, usually with its long sound.'),
    item('en-syl-vce','Vowel-consonant-e','cake, hope: a final silent e commonly signals a long vowel.'),
    item('en-syl-team','Vowel team','rain, boat: a vowel spelling uses two or more letters. Some teams have more than one sound.'),
    item('en-syl-r','R-controlled','car, bird: r changes the preceding vowel sound; pronunciation varies with accent.'),
    item('en-syl-cle','Consonant-le','table, little: a final unstressed syllable ends in consonant + le.')
  ]}
];
// Publisher’s Level 1 chart: two ten-character rows per book, in lesson order.
const traditional=['山高的人個大上下在有手很隻小孩家也我指五','兩十來是女媽爸馬朋友去這不你們鳥天地花朵','四草到說好甚麼飛看裏起要男明兔白書本會吃','和水幾沒走都出回了太他嗎長愛喝可想見給玩','就把樹頭耳快得子多又妹雨誰門貓開老紅邊那'];
const simplified=['山高的人个大上下在有手很只小孩家也我指五','两十来是女妈爸马朋友去这不你们鸟天地花朵','四草到说好甚么飞看里起要男明兔白书本会吃','和水几没走都出回了太他吗长爱喝可想见给玩','就把树头耳快得子多又妹雨谁门猫开老红边那'];
export const sageBooks=traditional.map((text,book)=>({id:'book-'+(book+1),title:'Book '+(book+1),items:[...text].map((character,index)=>({id:`zh-b${book+1}-${index+1}`,label:character,simplified:[...simplified[book]][index],lesson:index+1,help:`Book ${book+1}, lesson ${index+1}. Tick after introducing this character and reading it in the lesson. Recognition is different from writing it independently.`}))}));
const math=(id,label,nel,meaning,observe,alignment='Direct')=>({id:'math-'+id,label,nel,help:meaning,observe,alignment});
export const mathGroups=[
  {id:'number',title:'Number & operations',hint:'Build quantity sense before rushing into written sums.',items:[
    math('count20','Count aloud to 20','3.1','The child knows the spoken number sequence.','During a game, invite them to count to 20 without you supplying the next number. No objects are needed.'),
    math('count10','Count 10 objects accurately','3.2','Each object gets one number word; the last word answers “how many?”.','Offer 10 counters in a loose pile. They move or touch each once and tell you the total.'),
    math('conserve','Same amount, new arrangement','3.3','Spreading or bunching objects does not change their quantity.','Count 7 buttons, spread them out, and ask whether there are still 7. They explain that none were added or removed.'),
    math('numerals','Recognise numerals and number words','3.4','Connect written symbols and written number names with their spoken names.','Mix numeral cards and number-word cards. Ask the child to read each, rather than relying on card order.'),
    math('match','Match symbols to quantities','3.5','The spoken number, numeral, written word and amount refer to the same quantity.','Place 6 blocks beside numeral 6 and the word six. Ask the child to match another amount in a new arrangement.'),
    math('write','Write numerals','3.6','Record an amount using a readable numeral.','After counting a small collection, the child writes its numeral without tracing. Note which numerals still need practice.'),
    math('compare','Compare sets up to 10','3.7','Compare actual amounts, rather than the length of the row.','Show two sets in different arrangements and ask which has more, fewer, or the same number. They can justify by matching or counting.'),
    math('parts','Split and combine amounts within 10','3.8','A whole can be made from different pairs of parts.','Offer 5 counters: show 2 and 3, then ask for another split. The child can rebuild the whole and describe the two parts.'),
    math('stories','Act out adding and taking away','3.8','Use real objects to represent simple joining and separating stories.','Tell a snack story: 3 crackers and 2 more. The child models it and finds the result; written equations are optional.','Related'),
    math('tens','Explore a ten and some more','No direct goal','Begin to organise a larger amount into a group of ten and leftovers.','Use a full ten-frame and 3 loose counters. The child sees a ten and 3 more. This is an optional NCTM extension.','Extension')
  ]},
  {id:'algebra',title:'Algebra · relationships & patterns',items:[
    math('sort','Match, sort and explain a rule','2.1','Group objects using an attribute the child can identify.','Offer mixed buttons. They sort by a chosen feature, then explain the rule and try a different one.'),
    math('order','Order objects or events','2.2','Arrange items by an attribute or put familiar events in sequence.','Give four different-length ribbons to order, or ask the child to sequence getting-ready pictures and explain the order.'),
    math('patterns','Copy, extend and create patterns','2.3','Notice the repeating unit, rather than guess the next colour.','Build an AB or ABC pattern. The child extends it and makes their own, pointing out the part that repeats.'),
    math('explain-pattern','Describe a relationship or pattern','2.4','Put the rule into words or demonstrate it clearly.','Ask “How does your pattern work?” They describe the repeating unit or explain how two groups are related.')
  ]},
  {id:'geometry',title:'Geometry',items:[
    math('shapes','Recognise four basic shapes','4.1','Identify circle, square, rectangle and triangle across sizes and orientations.','Rotate shape cards or find shapes in the room. The child still recognises a triangle when its point faces sideways.'),
    math('attributes','Describe shape features','4.2','Look at sides, corners and curves instead of colour or overall appearance.','Ask how two shapes are alike or different. The child can point out corners or straight versus curved boundaries.'),
    math('compose-shape','Build shapes and pictures','4.3','Combine smaller shapes into a new shape or figure.','Invite the child to make a house or larger shape from pieces, then describe the pieces they used.'),
    math('position','Use position, direction and distance','4.4','Understand spatial words while moving objects or their body.','Play a treasure game using behind, under, left/right, near/far. Record which words the child understands without gestures.')
  ]},
  {id:'measurement',title:'Measurement',items:[
    math('compare-size','Compare measurable features','2.1, 2.2','Compare length, height or size and put objects in order.','Ask which ribbon is longer. The child lines up the ends and explains the comparison rather than guessing from position.','Related'),
    math('units','Measure with equal informal units','No direct goal','Use repeated, equal-size units with no gaps or overlaps.','Measure a book using identical cubes. The child keeps units touching and counts them. This extends NEL comparison work.','Extension'),
    math('capacity','Compare capacity and weight','No direct goal','Explore heavier/lighter or holds more/less using objects.','Use a balance or pour water to test an initial prediction. This is optional enrichment, not a separate listed NEL numeracy goal.','Extension')
  ]},
  {id:'data',title:'Data analysis & probability',items:[
    math('collect','Collect and sort simple data','2.1','Use categories to answer a real question.','Ask which fruit the family prefers. The child places one counter for each response in the appropriate group.','Related'),
    math('graph','Make and read a simple object graph','3.7','Compare the quantities represented by data groups.','Arrange votes in aligned rows. Ask which group has more or fewer votes, and how the child knows. Graph-making is our extension.','Related'),
    math('chance','Explore likely and impossible','No direct goal','Talk about possible outcomes without formal probability calculations.','With only red counters in a bag, ask whether drawing a blue one is possible. Treat this as playful NCTM enrichment.','Extension')
  ]},
  {id:'process',title:'Using mathematical thinking',hint:'These habits run across NCTM’s content categories and connect to NEL’s everyday numeracy goal.',items:[
    math('daily','Use maths in a daily routine','1.1','Recognise a useful reason to count, compare or use shapes.','Invite the child to decide how many cups the table needs. They use maths to solve the real task.'),
    math('language','Explain using mathematical words','1.2','Use suitable maths language while explaining an idea.','During play, listen for a meaningful use of more, fewer, bigger, smaller, or shape names; ask them to explain their thinking.')
  ]}
];
export function allBuiltInSkills(){return [...englishGroups.flatMap(g=>g.items),...sageBooks.flatMap(g=>g.items),...mathGroups.flatMap(g=>g.items)]}
export const skillIds=new Set(allBuiltInSkills().map(x=>x.id));
