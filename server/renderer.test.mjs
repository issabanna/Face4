import test from 'node:test';
import assert from 'node:assert/strict';
import {photoPlacement,validAnnotations} from '../dist/renderer.js';
test('portrait fits without cropping',()=>{for(const[w,h]of [[300,300],[800,1200],[1600,900]]){const p=photoPlacement(w,h);assert(p.x>=0);assert(p.width<=840);assert(p.height<=570);assert.equal(p.width/p.height,w/h);}});
test('playful card requires four concise sections',()=>{const d={nickname:'The Plot Twist',vibe:'A bold photo entrance.',standout:'Bold brows steal the frame.',punchline:'Already in the opening credits.'};assert(validAnnotations(d));d.nickname='';assert(!validAnnotations(d));});
