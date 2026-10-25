import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {createServer,createHandler} from './server.mjs';
const origin='https://issabanna.github.io';
const photo='data:image/jpeg;base64,/9j/2Q==';
const input={name:'Maya',email:'maya@example.com',photo};
const good={usable:true,reason:'',nickname:'The Quiet Headliner',vibe:'Low-key pose. Poster energy.',standout:'Those bold brows steal the frame.',punchline:'No announcement. Still an entrance.'};
async function withServer(options,run){const server=createServer(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));try{await run('http://127.0.0.1:'+server.address().port+'/api/analyze');}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}}
const request=(url,body=input,from=origin)=>fetch(url,{method:'POST',headers:{Origin:from,'Content-Type':'application/json'},body:JSON.stringify(body)});
test('disconnected service returns a clear 503',()=>withServer({env:{}},async url=>{assert.equal((await request(url)).status,503);}));
test('rejects an unapproved origin without calling provider',()=>withServer({env:{OPENAI_API_KEY:'test'},fetchImpl:()=>{throw Error('must not call');}},async url=>{assert.equal((await request(url,input,'https://other.example')).status,403);}));
test('validates name, email, and image before provider call',()=>withServer({env:{OPENAI_API_KEY:'test'},fetchImpl:()=>{throw Error('must not call');}},async url=>{for(const change of [{email:'invalid'},{name:''},{photo:'data:image/jpeg;base64,YWJjZA=='}])assert.equal((await request(url,{...input,...change})).status,400);}));
test('real provider format returns assessment, without forwarding name or email',()=>withServer({env:{OPENAI_API_KEY:'test'},fetchImpl:async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/responses');const body=JSON.parse(options.body);assert.equal(body.store,false);assert(!options.body.includes(input.name));assert(!options.body.includes(input.email));assert.equal(body.input[0].content[1].image_url,photo);return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(good)}]}]});}},async url=>{const response=await request(url);assert.equal(response.status,200);const data=await response.json();assert.equal(data.nickname,good.nickname);assert(!Object.hasOwn(data,'palette'));}));
test('no face produces actionable error instead of a fake result',()=>withServer({env:{OPENAI_API_KEY:'test'},fetchImpl:async()=>Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({...good,usable:false,reason:'Use one clearly visible face.'})}]}]})},async url=>{const response=await request(url);assert.equal(response.status,422);assert.equal((await response.json()).code,'CLEARER_PHOTO_REQUIRED');}));
test('daily cap prevents additional paid provider calls',()=>withServer({env:{OPENAI_API_KEY:'test',DAILY_LIMIT:'1'},fetchImpl:async()=>Response.json({error:'down'},{status:500})},async url=>{assert.equal((await request(url)).status,502);assert.equal((await request(url)).status,429);}));

test('readiness works without an Origin and exposes only availability',()=>withServer({env:{OPENAI_API_KEY:'not-exposed'}},async url=>{const r=await fetch(url);assert.equal(r.status,200);assert.deepEqual(await r.json(),{available:true});}));
test('Vercel parsed body and same-origin request use shared handler',async()=>{
 const handler=createHandler({env:{OPENAI_API_KEY:'test'},fetchImpl:async()=>Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(good)}]}]})});
 const server=http.createServer(async(req,res)=>{let text='';for await(const chunk of req)text+=chunk;req.body=JSON.parse(text);handler(req,res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const host='127.0.0.1:'+server.address().port;
 try{const r=await request('http://'+host+'/api/analyze',input,'https://'+host);assert.equal(r.status,200);assert.equal((await r.json()).nickname,good.nickname);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});

test('provider refusal produces a useful photo error',()=>withServer({env:{OPENAI_API_KEY:'test'},fetchImpl:async()=>Response.json({status:'completed',output:[{content:[{type:'refusal',refusal:'Cannot assess.'}]}]})},async url=>{const r=await request(url);assert.equal(r.status,422);assert.equal((await r.json()).code,'PHOTO_NOT_ASSESSED');}));
test('token limit response is reported as interrupted',()=>withServer({env:{OPENAI_API_KEY:'test'},fetchImpl:async()=>Response.json({status:'incomplete',incomplete_details:{reason:'max_output_tokens'}})},async url=>{const r=await request(url);assert.equal(r.status,502);assert.equal((await r.json()).code,'ANALYSIS_INTERRUPTED');}));

test('incomplete playful card is rejected',()=>withServer({env:{OPENAI_API_KEY:'test'},fetchImpl:async()=>Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({...good,punchline:''})}]}]})},async url=>{const r=await request(url);assert.equal(r.status,502);assert.equal((await r.json()).code,'INCOMPLETE_CARD');}));
