import test from 'node:test';
import assert from 'node:assert/strict';
import {photoPlacement,validAnnotations,featureKeys} from '../dist/renderer.js';
test('photo coordinates preserve the entire source without cropping',()=>{for(const [w,h] of [[300,300],[800,1200],[1600,900]]){const p=photoPlacement(w,h);assert(p.x>=0);assert(p.width<=1000);assert(p.height<=1080);assert.equal(p.width/p.height,w/h);}});
test('annotations require all visible feature labels and valid source coordinates',()=>{const data={impressionLabel:'Subtle smile',features:Object.fromEntries(featureKeys.map(k=>[k,{text:'Visible contours',x:.4,y:.5}]))};assert(validAnnotations(data));data.features.eyes.x=1.2;assert(!validAnnotations(data));});
