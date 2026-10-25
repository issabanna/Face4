const limits={nickname:40,vibe:120,standout:120,punchline:150};
export function validAnnotations(value){return Object.entries(limits).every(([key,max])=>typeof value?.[key]==='string'&&value[key].trim().length>0&&value[key].length<=max);}
export function photoPlacement(width,height){const scale=Math.min(840/width,570/height);return {x:(1000-width*scale)/2,y:130,width:width*scale,height:height*scale};}
function lines(ctx,text,x,y,width,lineHeight){let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,y);y+=lineHeight;line=word;}else line=next;}ctx.fillText(line,x,y);return y+lineHeight;}
export async function renderAnnotatedCard(a,canvas){
 if(!validAnnotations(a))throw Error('Your card details are incomplete.');await document.fonts.ready;const img=new Image();img.src=a.photo;await img.decode();canvas.width=1000;canvas.height=1660;const c=canvas.getContext('2d'),p=photoPlacement(img.naturalWidth,img.naturalHeight);
 c.fillStyle='#f0e9ff';c.fillRect(0,0,1000,1660);c.fillStyle='#31215d';c.font='bold 26px Arial';c.fillText('face4 / THE PHOTO EDIT',65,75);c.fillStyle='#fff';c.fillRect(60,110,880,610);c.drawImage(img,p.x,p.y,p.width,p.height);
 c.save();c.translate(815,155);c.rotate(.13);c.fillStyle='#dcff91';c.fillRect(-115,-35,230,70);c.fillStyle='#31215d';c.font='bold 24px Arial';c.textAlign='center';c.fillText('PLOT TWIST!',0,9);c.restore();
 c.fillStyle='#746392';c.font='bold 18px Arial';c.fillText('YOUR UNOFFICIAL NICKNAME',65,775);c.fillStyle='#31215d';c.font='bold 66px Arial';let y=lines(c,a.nickname,65,855,870,74);
 const blocks=[['THE PHOTO VIBE',a.vibe,'#dff8ff'],['STEALS THE SCENE',a.standout,'#ffdfeb']];y=Math.max(940,y+25);for(const [title,text,color]of blocks){c.fillStyle=color;c.fillRect(55,y-30,890,155);c.fillStyle='#63547c';c.font='bold 17px Arial';c.fillText(title,80,y);c.fillStyle='#31215d';c.font='28px Arial';lines(c,text,80,y+45,830,35);y+=175;}
 c.fillStyle='#31215d';c.font='bold 33px Arial';lines(c,'“'+a.punchline+'”',65,y+10,870,40);c.font='22px Arial';c.fillText('Get yours & more',65,1570);c.font='bold 34px Arial';c.fillText('face4.org',685,1570);c.font='15px Arial';c.fillStyle='#746392';c.fillText('Playful photo interpretation · Your look, your choice.',65,1625);
 canvas.setAttribute('aria-label',`${a.nickname}. Photo vibe: ${a.vibe}. Standout: ${a.standout}. ${a.punchline}`);
}
