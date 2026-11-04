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
];
export const seasonalActivities={
 bible:[{id:'advent-matthew',title:'Matthew',detail:'Read Matthew during Advent.'},{id:'advent-narnia',title:'Advent in Narnia',detail:'Heidi Haverkamp · Follow your Advent reading days.'}],
 beauty:[{id:'advent-art',title:'Advent picture study',detail:'Look closely, then recall what you noticed.'},{id:'advent-poetry',title:'Poems by C. S. Lewis',detail:'Choose one poem to read and revisit.'},{id:'advent-messiah',title:'Handel’s Messiah',detail:'Read the Scripture and devotion, then listen.',link:'https://www.cslewisinstitute.org/messiah/',linkLabel:'Messiah daily calendar'}],
 literature:[{id:'little-women',title:'Little Women',detail:'Louisa May Alcott · Follow your chapter targets.',progress:true},{id:'marmee-louisa',title:'Marmee & Louisa',detail:'Eve LaPlante · Read twice a week.',progress:true},{id:'little-men',title:'Little Men',detail:'Louisa May Alcott · Continue alongside the biography.',progress:true},{id:'narnia-wardrobe',title:'The Lion, the Witch, and the Wardrobe',detail:'C. S. Lewis · Read for yourself or as an optional family read-aloud.',progress:true}],
 history:[{id:'writing-gods',title:'The Writing of the Gods',detail:'Edward Dolnick · The Rosetta Stone and Egyptian culture.',progress:true}],
 other:[{id:'personal-cooking',title:'Cooking',detail:'Try one new family recipe each week. Record its title, source and what you would change.'},{id:'personal-commonplace',title:'Commonplace notebook',detail:'Keep a passage and a thought from your reading.'},{id:'personal-narration',title:'Narration journal',detail:'Retell a short reading in your own words.'},{id:'personal-nature',title:'Nature journal',detail:'Spend a little time outdoors and record an observation.'},{id:'personal-centuries',title:'Book of Centuries',detail:'Add a person, work or event that caught your attention.'},{id:'personal-handicraft',title:'Handicraft',detail:'Choose a craft to enjoy and practise.'}]
};
const chapters=range=>({detail:'Chapters {range}',detailValues:{range}});
export function personalEducation(date,base){
 const week=educationWeeks.find(x=>date>=x.start&&date<=x.end);if(!week)return null;
 const advent=date>='2026-11-29'&&date<='2026-12-26',prep=date<'2026-11-29',january=date>='2027-01-03';
 const find=id=>Object.values(seasonalActivities).flat().find(x=>x.id===id);
 const biography={...find('marmee-louisa'),...(week.biography.endsWith('%')?{detail:'Read twice this week · aim for about {target} by the end of this period.',detailValues:{target:week.biography}}:{detail:week.biography})};
 const literature=[...(week.littleWomen?[{...find('little-women'),...chapters(week.littleWomen)}]:[]),biography,...(advent?[{...find('narnia-wardrobe'),...chapters(week.narnia)}]:[]),...(january?[{...find('little-men'),...(week.littleMen?chapters(week.littleMen):{})}]:[])];
 const beauty=base.loops.beauty.items.map(item=>date>'2026-12-26'?item:item.id==='artist'?{...item,title:prep?'Artist · Beatrix Potter':week.art||'Advent picture study',detail:prep?'Complete your current art appreciation study.':'Look closely, then recall what you noticed.'}:item.id==='poet'&&!prep?find('advent-poetry'):item);
 if(date>='2026-11-28'&&date<='2026-12-26')beauty.splice(1,1,{...find('advent-messiah'),...(date==='2026-12-26'?{detail:'Revisit a favourite from the Messiah calendar.'}:{detail:'Messiah calendar · day {day} of 28',detailValues:{day:Math.floor((Date.parse(date)-Date.parse('2026-11-28'))/86400000)+1}})});
 const bible=base.bible.map(item=>item.id==='new-testament'&&advent?{...find('advent-matthew')}:item.id==='hymn'&&advent?{...item,title:week.hymn}:item);
 if(advent)bible.push({...find('advent-narnia'),detail:'Days {range}',detailValues:{range:week.devotional}});
 return {week,bible,loops:{...base.loops,beauty:{...base.loops.beauty,items:beauty},literature:{...base.loops.literature,items:literature},history:{...base.loops.history,items:[...base.loops.history.items,...(prep?seasonalActivities.history:[])]},other:{title:'Practical study & notebooks',description:'Make something, notice something, keep a thought.',items:seasonalActivities.other}}};
}
