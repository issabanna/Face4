const limits={nickname:40,vibe:120,standout:120,punchline:150};
export function validAnnotations(value){return Object.entries(limits).every(([key,max])=>typeof value?.[key]==='string'&&value[key].trim().length>0&&value[key].length<=max);}
export function photoPlacement(width,height){const scale=Math.min(1000/width,1100/height);return {x:(1000-width*scale)/2,y:0,width:width*scale,height:height*scale};}
function lines(ctx,text,x,y,width,lineHeight){let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,y);y+=lineHeight;line=word;}else line=next;}ctx.fillText(line,x,y);return y+lineHeight;}
function bubble(ctx,title,text,x,y,width,fill){
 ctx.font='28px Arial';let rows=1,line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width-46&&line){rows++;line=word;}else line=next;}
 const height=78+rows*34;ctx.save();ctx.shadowColor='rgba(35,25,55,.15)';ctx.shadowBlur=20;ctx.shadowOffsetY=7;ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,width,height,24);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.beginPath();ctx.moveTo(x+35,y+height-2);ctx.lineTo(x+58,y+height+23);ctx.lineTo(x+78,y+height-2);ctx.fill();ctx.fillStyle='#685576';ctx.font='bold 17px Arial';ctx.fillText(title,x+23,y+32);ctx.fillStyle='#30213f';ctx.font='28px Arial';lines(ctx,text,x+23,y+72,width-46,34);ctx.restore();
}
export async function renderAnnotatedCard(a,canvas){
 if(!validAnnotations(a))throw Error('Your card details are incomplete.');await document.fonts.ready;const img=new Image();img.src=a.photo;await img.decode();canvas.width=1000;canvas.height=1600;const c=canvas.getContext('2d'),p=photoPlacement(img.naturalWidth,img.naturalHeight);
 c.fillStyle='#f2ebff';c.fillRect(0,0,1000,1600);c.drawImage(img,p.x,p.y,p.width,p.height);
 const shade=c.createLinearGradient(0,800,0,1450);shade.addColorStop(0,'rgba(242,235,255,0)');shade.addColorStop(1,'#f2ebff');c.fillStyle=shade;c.fillRect(0,800,1000,650);
 c.fillStyle='rgba(255,255,255,.92)';c.beginPath();c.roundRect(30,25,225,55,27);c.fill();c.fillStyle='#30213f';c.font='bold 22px Arial';c.fillText('face4 / PHOTO EDIT',48,60);
 bubble(c,'YOUR PHOTO VIBE',a.vibe,30,135,345,'rgba(224,247,255,.96)');
 bubble(c,'STEALS THE SCENE',a.standout,625,590,345,'rgba(255,225,237,.96)');
 c.save();c.shadowColor='rgba(42,22,64,.13)';c.shadowBlur=30;c.beginPath();c.arc(500,1130,245,0,Math.PI*2);c.fillStyle='#fffdfb';c.fill();c.restore();
 c.fillStyle='#806890';c.textAlign='center';c.font='bold 20px Arial';c.fillText('FIRST IMPRESSION',500,975);c.fillStyle='#30213f';c.textAlign='left';c.font='bold 43px Arial';let y=lines(c,a.nickname,325,1045,350,49);c.font='24px Arial';lines(c,'“'+a.punchline+'”',320,Math.max(y+25,1160),360,30);
 c.textAlign='center';c.fillStyle='#30213f';c.font='26px Arial';c.fillText('Get yours & more',500,1460);c.font='bold 49px Arial';c.fillText('face4.org',500,1520);c.font='14px Arial';c.fillStyle='#887192';c.fillText('A playful photo interpretation, not a personality assessment.',500,1570);c.textAlign='left';
 canvas.setAttribute('aria-label',`${a.nickname}. Photo vibe: ${a.vibe}. Standout: ${a.standout}. ${a.punchline}. Get yours and more at face4.org.`);
}
