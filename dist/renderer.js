export const featureKeys=['eyes','eyebrows','cheeks','cheekbones','smile','jaw'];
export function validAnnotations(value){return typeof value?.impressionLabel==='string'&&value.impressionLabel.length>0&&value.impressionLabel.length<=32&&featureKeys.every(k=>{const f=value.features?.[k];return f&&typeof f.text==='string'&&f.text.length>0&&f.text.length<=65&&Number.isFinite(f.x)&&f.x>=0&&f.x<=1&&Number.isFinite(f.y)&&f.y>=0&&f.y<=1;});}
export function photoPlacement(width,height){const scale=Math.min(1000/width,1080/height);return {x:(1000-width*scale)/2,y:0,width:width*scale,height:height*scale};}
function lines(ctx,text,x,y,width,lineHeight){let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,y);y+=lineHeight;line=word;}else line=next;}ctx.fillText(line,x,y);return y+lineHeight;}
export async function renderAnnotatedCard(assessment,canvas){
 if(!validAnnotations(assessment))throw Error('Clearer facial feature details are required.');
 await document.fonts.ready;
 const portrait=new Image();portrait.src=assessment.photo;await portrait.decode();
 canvas.width=1000;canvas.height=1500;const ctx=canvas.getContext('2d'),place=photoPlacement(portrait.naturalWidth,portrait.naturalHeight);
 ctx.fillStyle='#3c3a35';ctx.fillRect(0,0,1000,1500);ctx.drawImage(portrait,place.x,place.y,place.width,place.height);
 const shade=ctx.createLinearGradient(0,0,1000,0);shade.addColorStop(0,'rgba(0,0,0,.58)');shade.addColorStop(.28,'rgba(0,0,0,.03)');shade.addColorStop(.72,'rgba(0,0,0,.03)');shade.addColorStop(1,'rgba(0,0,0,.58)');ctx.fillStyle=shade;ctx.fillRect(0,0,1000,1080);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,0,1000,75);ctx.fillStyle='#fff';ctx.font='20px Arial';ctx.fillText('FACE4 / '+assessment.name.toUpperCase(),30,47,940);
 const labels=[['eyes','EYES',30,175],['eyebrows','EYEBROWS',750,175],['cheeks','CHEEKS',30,445],['cheekbones','CHEEKBONES',750,445],['smile','SMILE',30,735],['jaw','JAW & CHIN',750,735]];
 for(const[key,title,x,y]of labels){const f=assessment.features[key],point={x:place.x+f.x*place.width,y:place.y+f.y*place.height},right=x>500;ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=4;ctx.beginPath();ctx.moveTo(right?x-10:x+220,y+60);ctx.lineTo(point.x,point.y);ctx.stroke();ctx.beginPath();ctx.arc(point.x,point.y,4.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.font='bold 25px Arial';ctx.fillText(title,x,y,220);ctx.font='25px Georgia';lines(ctx,f.text,x,y+38,220,32);ctx.shadowBlur=0;}
 ctx.beginPath();ctx.arc(500,1135,215,0,Math.PI*2);ctx.fillStyle='#fffdf7';ctx.fill();ctx.fillStyle='#17261f';ctx.textAlign='center';ctx.font='21px Arial';ctx.fillText('FIRST IMPRESSION',500,1040);let size=55;while(size>28){ctx.font=`${size}px Georgia`;if(ctx.measureText(assessment.impressionLabel).width<=390)break;size--;}ctx.fillText(assessment.impressionLabel,500,1140);ctx.font='19px Arial';ctx.fillText('VISIBLE EXPRESSION & PRESENTATION',500,1200);ctx.font='17px Arial';ctx.fillText('Your look. Your choice.',500,1250);
 ctx.fillStyle='#fff';ctx.font='28px Georgia';ctx.fillText('Get yours and more',500,1400);ctx.font='bold 48px Arial';ctx.fillText('face3.org',500,1455);ctx.font='13px Arial';ctx.fillText('Photo presentation, not personality · AI-generated observations',500,1485);ctx.textAlign='start';
 canvas.setAttribute('aria-label',`${assessment.name}: ${assessment.impressionLabel}. `+featureKeys.map(k=>`${k}: ${assessment.features[k].text}`).join('. ')+'. Get yours and more at face3.org.');
}
