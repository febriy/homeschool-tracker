import { learningSubjects,learnerSubjects } from './learning-data.js';
export function setupPhotos({getChild,childName,t,esc,announce,singaporeDay,dateLabel,onChange=()=>{}}) {
  const $=id=>document.getElementById(id);
  let photos=[],loaded=false,loading=false,uploading=false,previewURLs=[],completed=new Set(),uploadIds=new Map(),failed=false;
  const copy={
    'photos-heading':['Little moments, growing minds.','小小瞬间，慢慢成长。'],
    'photos-intro':['Keep the drawing, the discovery, and the proud smile.','保存画作、发现，和自豪的笑容。'],
    'new-photo':['Add photos','添加照片'],'photo-form-heading':['Save a learning moment','保存学习瞬间'],
    'photo-child-label':['Learner','学习者'],'photo-date-label':['Date','日期'],'photo-subject-label':['Subject','学科'],
    'photo-caption-label':['A few words (optional)','写几句话（可选）'],'photo-pick-label':['Choose photos','选择照片'],
    'photo-pick-hint':['JPEG, PNG or WebP · up to 10 at a time','JPEG、PNG 或 WebP · 每次最多 10 张'],
    'photo-sharing':['Shared with everyone who can open this tracker. Photos are resized before uploading.','可打开此记录的人都能查看。照片上传前会自动缩小。'],
    'cancel-photo':['Cancel','取消'],'save-photo':['Save photos','保存照片'],
    'show-removed-label':['Recently removed','已移除的照片'],'retry-photos':['Retry loading photos','重试加载照片']
  };
  const chinese=()=>document.documentElement.lang.startsWith('zh');
  const say=(en,zh)=>chinese()?zh:en;
  function render(){
    for(const id of ['photo-subject','photo-filter-subject']){const el=$(id);if(!el)continue;const selected=el.value,hasAll=[...el.options].some(o=>o.value==='all');el.innerHTML=(hasAll?'<option value="all">'+esc(t('All subjects'))+'</option>':'')+Object.entries(learnerSubjects(id==='photo-subject'?$('photo-child').value||getChild():getChild())).map(([key,title])=>`<option value="${key}">${esc(t(title))}</option>`).join('');el.value=[...el.options].some(o=>o.value===selected)?selected:hasAll?'all':Object.keys(learnerSubjects(getChild()))[0]}

    for(const [id,words] of Object.entries(copy))if(!uploading||id!=='save-photo')$(id).textContent=words[chinese()?1:0];
    const removed=$('show-removed').checked,child=getChild();
    const subjectFilter=$('photo-filter-subject').value||'all',groupBy=$('photo-group-by').value;
    const list=photos.filter(p=>p.childId===child&&p.deleted===removed&&(subjectFilter==='all'||p.subject===subjectFilter)).sort((a,b)=>groupBy==='subject'?a.subject.localeCompare(b.subject)||b.date.localeCompare(a.date):b.date.localeCompare(a.date));
    let lastGroup='';
    $('photo-summary').textContent=childName(child)+' · '+(loading?say('Loading photos…','正在加载照片…'):say(`${list.length} ${list.length===1?'photo':'photos'}`,`${list.length} 张照片`));
    if(failed){$('photo-gallery').innerHTML=`<div class="empty-state"><h2>${say('Photos couldn’t load.','无法加载照片。')}</h2><p>${say('Your saved photos are still online. Check your connection and retry.','已保存的照片仍在云端。请检查网络后重试。')}</p></div>`;$('retry-photos').hidden=false;return}
    $('retry-photos').hidden=true;
    $('photo-gallery').innerHTML=list.length?list.map(p=>{const group=groupBy==='subject'?t(learningSubjects[p.subject]||'Life & learning'):dateLabel(p.date),heading=group!==lastGroup?`<h2 class="photo-group-heading">${esc(group)}</h2>`:'';lastGroup=group;return `${heading}<figure class="photo-card">${p.deleted?`<div class="removed-photo">${say('Removed from journal','已从日记移除')}</div>`:`<a href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="${esc(say('View photo: ','查看照片：')+(p.caption||dateLabel(p.date)))}"><img src="${esc(p.url)}" alt="${esc(p.caption||say('Learning moment for ','学习瞬间：')+childName(p.childId))}" loading="lazy" width="600" height="450"></a>`}<figcaption><span class="photo-date">${esc(dateLabel(p.date))} · ${esc(p.subject==='other'?say('Life & learning','生活与学习'):t(learningSubjects[p.subject]||'Life & learning'))}</span>${p.caption?`<p>${esc(p.caption)}</p>`:''}<button class="text-button" data-photo-id="${p.id}" data-photo-deleted="${!p.deleted}">${p.deleted?say('Restore photo','恢复照片'):say('Remove photo','移除照片')}</button></figcaption></figure>`}).join(''):`<div class="empty-state photo-empty"><img src="/citrus-branch.webp" alt="" width="64" height="64"><h2>${loading?say('Gathering your moments…','正在加载…'):removed?say('No removed photos.','没有已移除的照片。'):say('Their learning, in pictures.','用照片记下学习。')}</h2><p>${removed?say('Removed photos can be restored here.','可在此恢复已移除的照片。'):say('Add a drawing, a book page, or a moment worth keeping for ','添加画作、书页，或值得珍藏的瞬间：')+esc(childName(child))+'.'}</p>${!removed&&!loading?`<button class="button secondary" data-add-photo>${say('Add the first photo','添加第一张照片')}</button>`:''}</div>`;
  }
  async function refresh(){if(loading)return;loading=true;render();try{const response=await fetch('/api/photos',{cache:'no-store'});if(!response.ok)throw Error();photos=(await response.json()).photos;loaded=true;failed=false}catch{failed=true}finally{loading=false;render();onChange()}}
  function releasePreviews(){for(const url of previewURLs)URL.revokeObjectURL(url);previewURLs=[]}
  function preview(){releasePreviews();completed.clear();uploadIds.clear();const files=[...$('photo-file').files];$('photo-previews').innerHTML=files.slice(0,10).map(file=>{const url=URL.createObjectURL(file);previewURLs.push(url);return `<figure><img src="${url}" alt="${esc(file.name)}"><figcaption>${esc(file.name)}</figcaption></figure>`}).join('');$('photo-status').textContent=files.length>10?say('Choose up to 10 photos at a time.','每次最多选择 10 张照片。'):''}
  async function resize(file){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error(say('Use JPEG, PNG or WebP. On iPhone, choose a compatible photo or export as JPEG.','请使用 JPEG、PNG 或 WebP。iPhone 照片请先导出为 JPEG。'));
    if(file.size>30*1024*1024)throw Error(say('Choose an original photo under 30 MB.','请选择小于 30 MB 的原始照片。'));
    const bitmap=await createImageBitmap(file);
    try{const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.84));if(!blob||blob.size>3*1024*1024)throw Error(say('Try a smaller photo.','请尝试更小的照片。'));return blob}finally{bitmap.close()}
  }
  function open(context={}){
    $('photo-panel').hidden=false;$('new-photo').hidden=true;
    if(!$('photo-file').files.length){$('photo-child').value=context.childId||getChild();$('photo-date').value=context.date||singaporeDay();$('photo-status').textContent=''}
    render();if(context.subject&&!$('photo-file').files.length)$('photo-subject').value=context.subject;$('photo-date').max=singaporeDay();$('photo-panel').scrollIntoView({block:'start',behavior:'instant'});$('photo-child').focus({preventScroll:true});
  }
  $('new-photo').addEventListener('click',open);
  $('photo-gallery').addEventListener('click',async event=>{
    if(event.target.closest('[data-add-photo]'))return open();
    const button=event.target.closest('[data-photo-id]');if(!button)return;
    button.disabled=true;
    try{const response=await fetch('/api/photos',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:button.dataset.photoId,deleted:button.dataset.photoDeleted==='true'})});if(!response.ok)throw Error();await refresh();announce(say('Photo journal updated. Restore removed photos from Recently removed.','照片日记已更新。可在“已移除的照片”中恢复。'))}catch{announce(say('Couldn’t update this photo. Please retry.','无法更新照片，请重试。'));button.disabled=false}
  });
  $('show-removed').addEventListener('change',render);$('retry-photos').addEventListener('click',refresh);
  $('photo-file').addEventListener('change',preview);$('photo-child').addEventListener('change',render);
  // Changing the record context makes an intentional second upload distinct from a retry.
  for(const id of ['photo-child','photo-date','photo-subject','photo-caption'])$(id).addEventListener('change',()=>{completed.clear();uploadIds.clear()});
  $('cancel-photo').addEventListener('click',()=>{if(uploading)return;$('photo-panel').hidden=true;$('new-photo').hidden=false;$('photo-form').reset();releasePreviews();$('photo-previews').innerHTML='';completed.clear();$('new-photo').focus()});
  $('photo-form').addEventListener('submit',async event=>{
    event.preventDefault();if(uploading)return;
    const files=[...$('photo-file').files];if(!files.length||files.length>10){$('photo-status').textContent=say('Choose between 1 and 10 photos.','请选择 1 至 10 张照片。');return}
    // Capture the child and fields before any async work; switching children cannot misfile a photo.
    const details={childId:$('photo-child').value,date:$('photo-date').value,subject:$('photo-subject').value,caption:$('photo-caption').value.trim()};
    uploading=true;$('photo-status').dataset.state='loading';
    for(const el of $('photo-form').elements)el.disabled=true;
    try{
      for(let i=0;i<files.length;i++){
        if(completed.has(i))continue;
        $('photo-status').textContent=say(`Saving photo ${i+1} of ${files.length} for ${childName(details.childId)}…`,`正在为 ${childName(details.childId)} 保存第 ${i+1}/${files.length} 张照片…`);
        const blob=await resize(files[i]),form=new FormData();for(const [key,value]of Object.entries(details))form.set(key,value);form.set('photo',blob,'learning-moment.jpg');if(!uploadIds.has(i))uploadIds.set(i,crypto.randomUUID());form.set('uploadId',uploadIds.get(i));
        const response=await fetch('/api/photos',{method:'POST',body:form});
        const data=await response.json().catch(()=>({}));if(!response.ok)throw Error(say('Upload didn’t finish. Please retry.','上传未完成，请重试。'));completed.add(i);
      }
      $('photo-form').reset();releasePreviews();$('photo-previews').innerHTML='';completed.clear();$('photo-panel').hidden=true;$('new-photo').hidden=false;announce(say('Photos saved.','照片已保存。'));await refresh();
    }catch(error){$('photo-status').dataset.state='error';$('photo-status').textContent=error.message+' '+say(`${completed.size} saved. Keep this page open and press Save photos to retry the rest.`,`${completed.size} 张已保存。请保留此页面，再按“保存照片”重试其余照片。`)}
    finally{uploading=false;for(const el of $('photo-form').elements)el.disabled=false;render()}
  });
  window.addEventListener('beforeunload',event=>{if(uploading||$('photo-file').files.length){event.preventDefault();event.returnValue=''}});
  window.addEventListener('focus',()=>{if(loaded)refresh()});
  for(const id of ['photo-group-by','photo-filter-subject'])$(id).addEventListener('change',render);
  $('photo-filter-subject').innerHTML='<option value="all">'+esc(t('All subjects'))+'</option>'+Object.entries(learningSubjects).map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('');
  $('photo-subject').innerHTML=Object.entries(learningSubjects).map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('');$('photo-subject').value='other';
  render();return {render,refresh,open,getPhotos:()=>photos};
}

export async function uploadLearningPhotos(files,details,{ids=new Map(),done=new Set(),onProgress=()=>{},t=x=>x}={}){
  if(files.length>10)throw Error(t('Choose up to 10 photos at a time.'));
  for(let i=0;i<files.length;i++){
    if(done.has(i))continue;onProgress(t('Uploading photo {number} of {total}…',{number:i+1,total:files.length}));
    const file=files[i];if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error(t('Use JPEG, PNG or WebP photos.'));
    if(file.size>30*1024*1024)throw Error(t('Choose an original photo under 30 MB.'));
    const bitmap=await createImageBitmap(file);let blob;
    try{const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.84))}finally{bitmap.close()}
    if(!blob||blob.size>3*1024*1024)throw Error(t('Try a smaller photo.'));
    const form=new FormData();for(const [key,value]of Object.entries(details))form.set(key,value);form.set('photo',blob,'learning-moment.jpg');if(!ids.has(i))ids.set(i,crypto.randomUUID());form.set('uploadId',ids.get(i));
    const response=await fetch('/api/photos',{method:'POST',body:form}),data=await response.json().catch(()=>({}));if(!response.ok)throw Error(t('Upload didn’t finish. Retry to save the remaining photos.'));done.add(i);
  }
}
