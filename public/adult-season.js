// Personal reading targets from the user's personalised AME Advent 2026 plan.
// Targets are plans, never completion records. Original PDF and reflections stay private.
export const educationWeeks=[
 {start:'2026-11-04',end:'2026-11-07',phase:'Begin your preparation',biography:'Begin Marmee & Louisa.'},
 {start:'2026-11-08',end:'2026-11-14',phase:'Preparation week 1',littleWomen:'1–10',biography:'10%'},
 {start:'2026-11-15',end:'2026-11-21',phase:'Preparation week 2',littleWomen:'11–20',biography:'20%'},
 {start:'2026-11-22',end:'2026-11-28',phase:'Preparation week 3',littleWomen:'21–30',biography:'30%'},
 {start:'2026-11-29',end:'2026-12-05',phase:'Advent week 1',littleWomen:'31–34',narnia:'1–5',devotional:'1–7',biography:'35%',art:'Sandro Botticelli · Mystic Nativity',hymn:'O Come, O Come, Emmanuel'},
 {start:'2026-12-06',end:'2026-12-12',phase:'Advent week 2',littleWomen:'35–38',narnia:'6–9',devotional:'8–14',biography:'40%',art:'Pieter Bruegel the Elder · The Census at Bethlehem',hymn:'Comfort, Comfort Ye My People'},
 {start:'2026-12-13',end:'2026-12-19',phase:'Advent week 3',littleWomen:'39–42',narnia:'10–13',devotional:'15–21',biography:'45%',art:'Gari Melchers · The Nativity',hymn:'Wake, Awake, for Night Is Flying'},
 {start:'2026-12-20',end:'2026-12-26',phase:'Advent week 4',littleWomen:'43–45',narnia:'14–17',devotional:'22–28',biography:'50%',art:'Caspar David Friedrich · Winter Landscape',hymn:'Of the Father’s Love Begotten'},
 {start:'2026-12-27',end:'2027-01-02',phase:'The week after Advent',littleWomen:'46–47',biography:'60%'},
 {start:'2027-01-03',end:'2027-01-12',phase:'Into Little Men',littleMen:'1–7',biography:'Read alongside Little Men.'},
 {start:'2027-01-13',end:'2027-01-27',phase:'January reading',biography:'75%'},
 {start:'2027-01-28',end:'2027-02-23',phase:'February reading',biography:'Finish by 23 February.'}

 // A Mother's Education · Winter 2026. The source PDF remains private.
 {program:'winter',start:'2027-01-03',end:'2027-01-09',phase:'Winter · Week 1',littleMen:'1–3',polarNight:'',everlastingMeal:'1–2',marmeeLouisa:'1–2',art:'We Are Resting (1951)',challenge:'Set aside a small, candlelit reading time.'},
 {program:'winter',start:'2027-01-10',end:'2027-01-16',phase:'Winter · Week 2',littleMen:'4–7',polarNight:'',everlastingMeal:'3–4',marmeeLouisa:'3',art:'Out for Christmas Trees (1946)',challenge:'Choose a line from a Frost poem and keep it where you will see it.'},
 {program:'winter',start:'2027-01-17',end:'2027-01-23',phase:'Winter · Week 3',littleMen:'8–10',polarNight:'',everlastingMeal:'5',marmeeLouisa:'4',art:'Turkeys (1958)',challenge:'Make one meal from what is already in the pantry, carrying leftovers forward.'},
 {program:'winter',start:'2027-01-24',end:'2027-01-30',phase:'Winter · Week 4',littleMen:'11–14',polarNight:'',everlastingMeal:'6–7',marmeeLouisa:'5',art:'Cambridge Valley (1942)',challenge:'Spend ten quiet minutes noticing the small figures in a Grandma Moses painting.'},
 {program:'winter',start:'2027-01-31',end:'2027-02-06',phase:'Winter · Week 5',littleMen:'15–16',polarNight:'',everlastingMeal:'8–9',marmeeLouisa:'6',art:'Joy Ride (1953)',challenge:'Read a chapter of Little Men aloud to your children, or tell them one Plumfield story.'},
 {program:'winter',start:'2027-02-07',end:'2027-02-13',phase:'Winter · Week 6',littleMen:'17–18',polarNight:'',everlastingMeal:'10',marmeeLouisa:'7–8',art:'Winter (undated)',challenge:'Write a handwritten letter to a mother or another woman who has shaped you.'},
 {program:'winter',start:'2027-02-14',end:'2027-02-20',phase:'Winter · Week 7',littleMen:'',polarNight:'1–3',everlastingMeal:'11–12',marmeeLouisa:'9',art:'Bringing in the Maple Sugar (1940)',challenge:'Learn a short Frost poem by heart and recite it during an ordinary chore.'},
 {program:'winter',start:'2027-02-21',end:'2027-02-27',phase:'Winter · Week 8',littleMen:'',polarNight:'4–6',everlastingMeal:'13–14',marmeeLouisa:'10',art:'Checkered House (1955)',challenge:'Simmer orange, cinnamon, and cloves while you read.'},
 {program:'winter',start:'2027-02-28',end:'2027-03-06',phase:'Winter · Week 9',littleMen:'',polarNight:'7–9',everlastingMeal:'15',marmeeLouisa:'11',art:'Untitled (1918)',challenge:'Try a simple handicraft such as mending, knitting, or embroidery.'},
 {program:'winter',start:'2027-03-07',end:'2027-03-13',phase:'Winter · Week 10',littleMen:'',polarNight:'10–12',everlastingMeal:'16–17',marmeeLouisa:'12',art:'A Fire in the Woods (1940)',challenge:'Keep a small winter-weather note, beginning with the morning sky.'},
 {program:'winter',start:'2027-03-14',end:'2027-03-20',phase:'Winter · Week 11',littleMen:'',polarNight:'13–15',everlastingMeal:'18–19',marmeeLouisa:'13',art:'Early Springtime on the Farm (1945)',challenge:'Step outside after dark and spend a few minutes under the night sky.'},
 {program:'winter',start:'2027-03-21',end:'2027-03-27',phase:'Winter · Week 12',littleMen:'',polarNight:'15–18',everlastingMeal:'20',marmeeLouisa:'14–15',art:'',challenge:'Share a thought from this season’s reading with a friend.'},
];
export const seasonalActivities={
 bible:[{id:'advent-matthew',title:'Matthew',detail:'Read Matthew during Advent.'},{id:'advent-narnia',title:'Advent in Narnia',detail:'Heidi Haverkamp · Follow your Advent reading days.'}],
 beauty:[{id:'advent-art',title:'Advent picture study',detail:'Look closely, then recall what you noticed.'},{id:'advent-poetry',title:'Poems by C. S. Lewis',detail:'Choose one poem to read and revisit.'},{id:'advent-messiah',title:'Handel’s Messiah',detail:'Read the Scripture and devotion, then listen.',link:'https://www.cslewisinstitute.org/messiah/',linkLabel:'Messiah daily calendar'}],
 literature:[{id:'little-women',title:'Little Women',detail:'Louisa May Alcott · Follow your chapter targets.',progress:true},{id:'marmee-louisa',title:'Marmee & Louisa',detail:'Eve LaPlante · Read twice a week.',progress:true},{id:'little-men',title:'Little Men',detail:'Louisa May Alcott · Continue alongside the biography.',progress:true},{id:'narnia-wardrobe',title:'The Lion, the Witch, and the Wardrobe',detail:'C. S. Lewis · Read for yourself or as an optional family read-aloud.',progress:true}],
 history:[{id:'writing-gods',title:'The Writing of the Gods',detail:'Edward Dolnick · The Rosetta Stone and Egyptian culture.',progress:true}],
 winter:[{id:'ame-winter-little-men',title:'Little Men',detail:'Follow this week’s reading target.',progress:true},{id:'ame-winter-polar-night',title:'A Woman in the Polar Night',detail:'Follow this week’s reading target.',progress:true},{id:'ame-winter-everlasting-meal',title:'An Everlasting Meal',detail:'Read the scheduled chapters as time allows.',progress:true},{id:'ame-winter-marmee-louisa',title:'Marmee & Louisa',detail:'Read the scheduled chapters as time allows.',progress:true}],
 other:[{id:'personal-cooking',title:'Cooking',detail:'Try one new family recipe each week. Record its title, source and what you would change.'},{id:'personal-commonplace',title:'Commonplace notebook',detail:'Keep a passage and a thought from your reading.'},{id:'personal-narration',title:'Narration journal',detail:'Retell a short reading in your own words.'},{id:'personal-nature',title:'Nature journal',detail:'Spend a little time outdoors and record an observation.'},{id:'personal-centuries',title:'Book of Centuries',detail:'Add a person, work or event that caught your attention.'},{id:'personal-handicraft',title:'Handicraft',detail:'Choose a craft to enjoy and practise.'}]
};
const chapters=range=>({detail:'Chapters {range}',detailValues:{range}});
const chapters=range=>({detail:'Chapters {range}',detailValues:{range}});
export function personalEducation(date,base){
 const week=educationWeeks.find(x=>date>=x.start&&date<=x.end);if(!week)return null;
 if(week.program==='winter'){
  const find=id=>seasonalActivities.winter.find(x=>x.id===id);
  const readings=[];
  if(week.littleMen)readings.push({...find('ame-winter-little-men'),detail:'Chapters {range}',detailValues:{range:week.littleMen}});
  if(week.polarNight)readings.push({...find('ame-winter-polar-night'),detail:'Chapters {range}',detailValues:{range:week.polarNight}});
  readings.push({...find('ame-winter-everlasting-meal'),detail:'Chapters {range}',detailValues:{range:week.everlastingMeal}});
  readings.push({...find('ame-winter-marmee-louisa'),detail:'Chapters {range}',detailValues:{range:week.marmeeLouisa}});
  const beauty=base.loops.beauty.items.map(item=>item.id==='artist'?{...item,title:'Artist · Grandma Moses',detail:week.art?'Picture study · '+week.art:'Picture study · choose a favourite painting'}:item.id==='poet'?{...item,title:'Poet · Robert Frost',detail:'Read one poem each day.'}:item);
  const targetParts=[];
  if(week.littleMen)targetParts.push('Little Men · chapters '+week.littleMen);
  if(week.polarNight)targetParts.push('A Woman in the Polar Night · chapters '+week.polarNight);
  targetParts.push('An Everlasting Meal · chapters '+week.everlastingMeal,'Marmee & Louisa · chapters '+week.marmeeLouisa,'Robert Frost · one poem a day');
  return {week:{...week,readingTargets:targetParts.join(' · ')},bible:base.bible,loops:{...base.loops,beauty:{...base.loops.beauty,items:beauty},literature:{...base.loops.literature,items:readings},other:{title:'Practical study & notebooks',description:'Make something, notice something, keep a thought.',items:seasonalActivities.other}}};
 }
 const biography={...seasonalActivities.literature.find(x=>x.id==='marmee-louisa'),...(week.biography.endsWith('%')?{detail:'Read twice this week · aim for about {target} by the end of this period.',detailValues:{target:week.biography}}:{detail:week.biography})};
 const literature=[...(week.littleWomen?[{...seasonalActivities.literature.find(x=>x.id==='little-women'),...chapters(week.littleWomen)}]:[]),biography,...(date>='2026-11-29'&&date<='2026-12-26'?[{...seasonalActivities.literature.find(x=>x.id==='narnia-wardrobe'),...chapters(week.narnia)}]:[]),...(week.littleMen?[{...seasonalActivities.literature.find(x=>x.id==='little-men'),...chapters(week.littleMen)}]:[])];
 const prep=date<'2026-11-29',advent=date>='2026-11-29'&&date<='2026-12-26';
 const beauty=base.loops.beauty.items.map(item=>date>'2026-12-26'?item:item.id==='artist'?{...item,title:prep?'Artist · Beatrix Potter':week.art||'Advent picture study',detail:prep?'Complete your current art appreciation study.':'Look closely, then recall what you noticed.'}:item.id==='poet'&&!prep?seasonalActivities.beauty.find(x=>x.id==='advent-poetry'):item);
 if(date>='2026-11-28'&&date<='2026-12-26')beauty.splice(1,1,{...seasonalActivities.beauty.find(x=>x.id==='advent-messiah'),...(date==='2026-12-26'?{detail:'Revisit a favourite from the Messiah calendar.'}:{detail:'Messiah calendar · day {day} of 28',detailValues:{day:Math.floor((Date.parse(date)-Date.parse('2026-11-28'))/86400000)+1}})});
 const bible=base.bible.map(item=>item.id==='new-testament'&&advent?{...seasonalActivities.bible.find(x=>x.id==='advent-matthew')}:item.id==='hymn'&&advent?{...item,title:week.hymn}:item);
 if(advent)bible.push({...seasonalActivities.bible.find(x=>x.id==='advent-narnia'),detail:'Days {range}',detailValues:{range:week.devotional}});
 return {week,bible,loops:{...base.loops,beauty:{...base.loops.beauty,items:beauty},literature:{...base.loops.literature,items:literature},history:{...base.loops.history,items:[...base.loops.history.items,...(prep?seasonalActivities.history:[])]},other:{title:'Practical study & notebooks',description:'Make something, notice something, keep a thought.',items:seasonalActivities.other}}};
}