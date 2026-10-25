import {validAnnotations,renderAnnotatedCard} from './renderer.js';
'use strict';
const $=id=>document.getElementById(id);
let image=null,photoURL=null,assessment=null,busy=false,selection=0;
function invalidate(){assessment=null;$('result').hidden=true;$('result-photo').removeAttribute('src');}
$('photo').addEventListener('change',async event=>{
 const version=++selection,file=event.target.files[0];invalidate();image=null;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=null;$('photo-preview').hidden=true;$('upload-placeholder').hidden=false;$('remove-photo').hidden=true;
 if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10485760){event.target.value='';$('file-message').textContent='Choose a JPG, PNG, or WebP photo smaller than 10 MB.';return;}
 const url=URL.createObjectURL(file),candidate=new Image();
 try{await new Promise((resolve,reject)=>{candidate.onload=resolve;candidate.onerror=reject;candidate.src=url;});if(candidate.naturalWidth*candidate.naturalHeight>40000000)throw Error();if(version!==selection){URL.revokeObjectURL(url);return;}image=candidate;photoURL=url;$('photo-preview').src=url;$('photo-preview').hidden=false;$('upload-placeholder').hidden=true;$('remove-photo').hidden=false;$('file-message').textContent='Photo ready. Submit when you’re ready.';}
 catch{URL.revokeObjectURL(url);if(version===selection){event.target.value='';$('file-message').textContent='Could not open that photo. Try another image.';}}
});
$('remove-photo').onclick=()=>{selection++;if(photoURL)URL.revokeObjectURL(photoURL);photoURL=null;image=null;$('photo').value='';$('photo-preview').removeAttribute('src');$('photo-preview').hidden=true;$('upload-placeholder').hidden=false;$('remove-photo').hidden=true;$('file-message').textContent='Photo removed.';invalidate();};
function compressedPhoto(){const canvas=document.createElement('canvas'),scale=Math.min(1,1280/Math.max(image.naturalWidth,image.naturalHeight));canvas.width=Math.round(image.naturalWidth*scale);canvas.height=Math.round(image.naturalHeight*scale);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.85);}
$('assessment-form').onsubmit=async event=>{
 event.preventDefault();if(busy)return;
 const status=$('analysis-status');
 if(!image){status.textContent='Choose a photo before starting your assessment.';return;}
 const endpoint=window.FACE4_ANALYSIS_URL;
 if(!endpoint){status.textContent='Photo ready. Live AI analysis is not connected yet. No name, email, or photo has been sent.';status.focus();return;}
 const name=$('name').value.trim(),email=$('email').value.trim();if(!name){status.textContent='Please enter your name.';return;}
 busy=true;invalidate();$('analyze-button').disabled=true;$('assessment-form').setAttribute('aria-busy','true');status.textContent='Analyzing your photo. This can take up to a minute…';
 const photo=compressedPhoto();for(const control of $('assessment-form').elements)control.disabled=true;
 try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,photo}),signal:AbortSignal.timeout(65000)});let data;try{data=await response.json();}catch{throw Error('The analysis service is unavailable. Please try again later.');}if(!response.ok)throw Error(data.error||'Analysis could not be completed. Please try again.');if(!validAnnotations(data))throw Error('The analysis service returned an incomplete result. Please try another photo.');assessment={...data,name,photo};$('result-name').textContent=`${name}’s first look`;$('result-photo').src=photo;$('result-impression').textContent=data.vibe;$('result-standout').textContent=data.standout;$('result-punchline').textContent=data.punchline;await renderAnnotatedCard(assessment,$('annotated-card'));$('result').hidden=false;status.textContent='Your assessment is ready.';$('result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 catch(error){status.textContent=error.name==='TimeoutError'?'Analysis took too long. Please try again.':error.message;status.focus();}
 finally{busy=false;for(const control of $('assessment-form').elements)control.disabled=false;$('assessment-form').removeAttribute('aria-busy');}
};
function wrap(ctx,text,x,y,width,lineHeight){let line='';for(const word of text.split(/\s+/)){if(ctx.measureText(line+word).width>width&&line){ctx.fillText(line.trim(),x,y);y+=lineHeight;line='';}line+=word+' ';}ctx.fillText(line.trim(),x,y);return y+lineHeight;}
$('download').onclick=async()=>{if(!assessment)return;try{const canvas=$('annotated-card');const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error();const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='my-face4-annotated-card.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);$('download-status').textContent='Your annotated photo card has been downloaded.';}catch{$('download-status').textContent='Could not download your card. Please try again.';}};


if(window.FACE4_ANALYSIS_URL){fetch(window.FACE4_ANALYSIS_URL).then(r=>r.ok?r.json():null).then(data=>{if(data?.available)document.querySelectorAll('.availability').forEach(el=>{el.textContent='Your free AI assessment is ready. Add your details and photo to begin.';});}).catch(()=>{});}
