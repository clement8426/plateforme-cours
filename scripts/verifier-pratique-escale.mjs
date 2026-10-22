import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const require=createRequire(resolve(process.env.UX_OUTILS||'../atelier-ia-donnees/labo-ux','package.json'));
const {chromium}=require('playwright'),{AxeBuilder}=require('@axe-core/playwright');
const base=process.env.SITE_URL||'http://localhost:4187';
const html=readFileSync('public/diapos/ux-ia/index.html','utf8');
const config=vm.runInNewContext('('+html.match(/const CONFIG = ([\s\S]*?)\r?\n};/)[1]+'\n})');
assert.equal(config.minutes.length,47);assert.deepEqual(Array.from(config.bonus),[42,43,44]);
const dataContext={window:{}};vm.runInNewContext(readFileSync('public/diapos/ux-ia/pratique-escale-data.js','utf8'),dataContext);const data=dataContext.window.ESCALE_PRATIQUE;
const b=await chromium.launch(),errors=[],badResponses=[];
try{
 for(const [width,height] of [[1280,720],[1920,1080]])for(const theme of ['light','dark']){
  const ctx=await b.newContext({viewport:{width,height},permissions:['clipboard-read','clipboard-write']});const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)badResponses.push(r.status()+' '+r.url())});
  for(let n=32;n<=45;n++){
   await p.goto(`${base}/diapos/ux-ia/#${n}`);await p.evaluate(t=>{document.documentElement.dataset.deck=t;return document.fonts.ready},theme);await p.waitForTimeout(350);const slide=p.locator('.slide.active');
   const key=await slide.getAttribute('data-key');assert.equal(await slide.getAttribute('data-part'),'3');assert.equal(await slide.locator('[data-kind="qr"]').count(),0);
   const practice=slide.locator('[data-practice]');
   if(await practice.count()){
    const overflow=await practice.evaluate(r=>{const box=r.getBoundingClientRect();return [...r.querySelectorAll('*')].filter(e=>{const rect=e.getBoundingClientRect(),s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&rect.width&&rect.height&&(rect.bottom>box.bottom+3||rect.right>box.right+3||rect.left<box.left-3)}).map(e=>e.className||e.tagName)});assert.deepEqual(overflow,[],`${key} ${width} ${theme} débordement`);
    const d=data.cases.find(c=>c.key===key);
    if(d&&!d.theory){
     for(const label of ['Avant','Après','Preuve avant','Preuve après']){await practice.getByRole('button',{name:label,exact:true}).click();await practice.locator('.practice-image-area img').evaluate(i=>i.decode());assert.equal(await practice.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),'true');}
     const zoom=practice.getByRole('button',{name:'Agrandir la capture',exact:true});await zoom.click();await p.locator('dialog[open] img').waitFor();await p.keyboard.press('Escape');assert.equal(await zoom.evaluate(e=>e===document.activeElement),true);
     await practice.getByRole('button',{name:'Les gestes, pas à pas',exact:true}).click();const manual=p.locator('dialog[open]');assert.ok(await manual.locator('li').count()>=4);await p.keyboard.press('Escape');
     await practice.getByRole('button',{name:'Avec un agent',exact:true}).click();const dialog=p.locator('dialog[open]');await dialog.getByRole('textbox',{name:'Adresse locale réelle d’Escale'}).fill('http://localhost:4321');assert.ok((await dialog.locator('textarea').inputValue()).includes('http://localhost:4321'));assert.ok((await dialog.locator('textarea').inputValue()).includes('copie'));
     if(width===1280&&theme==='light'){await dialog.getByRole('button',{name:'Copier le prompt',exact:true}).click();assert.ok((await p.evaluate(()=>navigator.clipboard.readText())).includes('http://localhost:4321'));const axe=await new AxeBuilder({page:p}).include('dialog[open]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[],key+' dialogue');}
     await p.keyboard.press('Escape');
    }
   }
  }
  const text=await p.locator('[data-key="escale-comportement"]').innerText();assert.ok(!text.includes('%'));assert.ok(text.includes('aucun taux'));
  await ctx.close();
 }
 const ctx=await b.newContext();const p=await ctx.newPage();for(const path of ['/ux/ux-ia/demos/labo-ux-demo/','/ux/ux-ia/demos/tilleul/']){await p.goto(base+path);await p.waitForURL('**/demos/escale/');}
 await p.goto(base+'/ux/ux-ia/');assert.equal(await p.locator('a[href="/ux/ux-ia/demos/escale/"]').count(),1);
 const paths=new Set(data.cases.flatMap(c=>c.theory?[]:[c.before,c.after,c.proofBefore,c.proofAfter,...(c.reports||[]).map(r=>r[1])]));
 for(const path of paths){const r=await p.request.get(`${base}/diapos/ux-ia/preuves/escale/${path}`);assert.equal(r.status(),200,path)}
 assert.deepEqual(errors,[]);assert.deepEqual(badResponses,[]);console.log('OK : 47 slides, tous les états de la pratique dans deux thèmes et deux tailles, zoom, gestes, prompts, copie réelle, axe des dialogues, bonus et conclusion sans QR, redirections et preuves HTTP 200.');await ctx.close();
}finally{await b.close()}
