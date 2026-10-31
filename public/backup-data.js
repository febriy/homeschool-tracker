const encode=value=>new TextEncoder().encode(value);
export function backupFilename(date=new Date()){
 const stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(date).replace(' ','_').replaceAll(':','-');
 return `wonder-and-worship-backup-${stamp}.zip`;
}
export function backupFiles({records,photos=[],images={},createdAt=new Date().toISOString(),source='shared-database',pendingCount=0}){
 if(!records||typeof records!=='object'||Array.isArray(records))throw Error('Invalid records');
 const files={},manifest=photos.map(photo=>{
  const {url,...metadata}=photo;
  if(photo.deleted)return {...metadata,file:null};
  const image=images[photo.id];if(!image||!(image.bytes instanceof Uint8Array)||!image.bytes.length||!['jpg','png','webp'].includes(image.extension)||!/^[a-zA-Z0-9-]{1,80}$/.test(photo.id))throw Error('Missing photo bytes');
  const path=`photos/${photo.id}.${image.extension}`;files[path]=image.bytes;return {...metadata,file:path};
 });
 const data={format:'wonder-and-worship-backup',version:1,createdAt,timeZone:'Asia/Singapore',source,pendingCount,records,photos:manifest};
 files['tracker-data.json']=encode(JSON.stringify(data,null,2));
 files['README.txt']=encode(`Wonder and Worship backup\nCreated: ${createdAt}\n\ntracker-data.json contains all learner profiles, lesson history, skill statuses, attendance, reading progress, book reviews, play plans and notes present in this snapshot.\nThe photos/ folder contains copies of the active uploaded photos when photos were included. Photo metadata links each image to its learner, date, subject and caption. Recently removed photos retain metadata only; their image files are not included.\n\nSource: ${source}. Unsent record changes from the exporting browser included: ${pendingCount}. Unsaved form drafts and photos not yet uploaded are not included.\n\nKeep this ZIP intact in Google Drive. This is a portable recovery snapshot, not live sync. To recover, provide this archive to your tracker administrator; there is currently no in-app restore button.\n`);
 return {files,data};
}
export async function prepareBackup({getRecords,getPending=()=>({}),includePhotos=true,request=fetch,onProgress=()=>{},now=new Date()}){
 const pendingAtStart=structuredClone(getPending()),cached=structuredClone(getRecords());let records,source;
 try{const response=await request('/api/children',{cache:'no-store'});if(!response.ok)throw Error('Records unavailable');const result=await response.json();if(!result.records||typeof result.records!=='object')throw Error('Records unavailable');records={...result.records,...pendingAtStart,...structuredClone(getPending())};source='shared-database'}catch{records={...cached,...pendingAtStart,...structuredClone(getPending())};source='browser-cache'}
 const images={};let photos=[];
 if(includePhotos){const response=await request('/api/photos',{cache:'no-store'});if(!response.ok)throw Error('photos');const result=await response.json();if(!Array.isArray(result.photos))throw Error('photos');photos=result.photos;const active=photos.filter(photo=>!photo.deleted);let bytes=0;
  for(let index=0;index<active.length;index++){const photo=active[index];onProgress(index+1,active.length);if(!/^[a-zA-Z0-9-]{1,80}$/.test(photo.id))throw Error('photos');const response=await request('/api/photos?id='+encodeURIComponent(photo.id),{cache:'no-store'});if(!response.ok)throw Error('photos');const extension=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'})[(response.headers.get('content-type')||'').split(';')[0]];if(!extension)throw Error('photos');const buffer=new Uint8Array(await response.arrayBuffer());bytes+=buffer.length;if(bytes>150*1024*1024)throw Error('large');images[photo.id]={bytes:buffer,extension};}
 }
 const pendingCount=Object.keys({...pendingAtStart,...getPending()}).length;
 const result=backupFiles({records,photos,images,source,pendingCount,createdAt:now.toISOString()});result.data.photosIncluded=includePhotos;
 result.files['tracker-data.json']=encode(JSON.stringify(result.data,null,2));
 return {...result,filename:backupFilename(now)};
}
