// Contrôle des fiches outils : navigation, toutes les vues, copie, dialogues et accessibilité.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
if(!process.env.UX_OUTILS)throw Error('Définir UX_OUTILS vers le dossier contenant Playwright et axe.');
const require=createRequire(resolve(process.env.UX_OUTILS,'package.json'));
const {chromium}=require('playwright'),{AxeBuilder}=require('@axe-core/playwright');
const base=process.env.SITE_URL??'http://localhost:3000';
const html=readFileSync(new URL('../public/diapos/ux-ia/index.html',import.meta.url),'utf8');
const config=vm.runInNewContext('('+html.match(/const CONFIG = ([\s\S]*?)\r?\n};/)[1]+'\n})');
const keys=[...html.matchAll(/<section class="slide\b[^>]*data-key="([^"]+)"/g)].map(m=>m[1]);
assert.equal(config.minutes.length,47);assert.equal(config.minutes.slice(22,31).reduce((a,b)=>a+b,0),19);
assert(config.lexique.every(x=>keys.includes(x.cle)),'destination du lexique absente');
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:1440,height:900},permissions:['clipboard-read','clipboard-write']}),page=await context.newPage();
const errors=[],httpErrors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)httpErrors.push(r.status()+' '+r.url());});
// L'endpoint Vercel ne fait pas partie du serveur statique local.
await page.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
async function scene(n){await page.goto(base+'/diapos/ux-ia/#'+n);await page.locator('.slide.active [data-lab]').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);return page.locator('.slide.active [data-lab]');}
async function layout(root){const overflow=await root.evaluate(r=>{const box=r.getBoundingClientRect();return [...r.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&b.width&&b.height&&(b.bottom>box.bottom+3||b.right>box.right+3||b.left<box.left-3);}).map(e=>e.className||e.tagName);});assert.deepEqual(overflow,[],'débordement '+await root.getAttribute('data-lab')+': '+overflow.join(', '));}
try{
 let root=await scene(23);assert.equal(await page.locator('section.slide').count(),47);assert.equal(await root.locator('.tool-tile').count(),6);
 const parts=await page.locator('section.slide').evaluateAll(ss=>ss.map(s=>Number(s.dataset.part)));
 config.parties.forEach((p,i)=>{for(let n=p.de;n<=p.a;n++)assert.equal(parts[n-1],i+1);});
 await root.getByRole('link',{name:/2 Friction/}).click();await page.waitForURL('**/#26');assert((await page.locator('.slide.active').innerText()).includes('Playwright'));
 // Définitions autonomes : catégorie, fonction, source ; distinction des trois voies axe.
 root=await scene(24);await root.getByRole('button',{name:'La famille axe',exact:true}).click();
 assert.equal(await root.locator('.tool-definition').count(),3);
 for(const term of ['axe-core','axe DevTools','Axe MCP'])assert(config.lexique.some(x=>x.terme===term));
 assert((await root.innerText()).includes('Bibliothèque de code'));
 assert((await root.innerText()).includes('extension pour le navigateur'));
 for(let n=25;n<=30;n++){
  root=await scene(n);await root.getByRole('button',{name:'Comprendre les outils',exact:true}).click();
  const definition=page.getByRole('dialog',{name:'Les outils, en clair',exact:true});await definition.waitFor();
  assert((await definition.locator('.tool-definition').count())>=2);
  assert.equal(await definition.locator('.tool-definition > a').count(),await definition.locator('.tool-definition').count());
  const result=await new AxeBuilder({page}).include('dialog[open]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations.map(x=>x.id),[],'définitions '+n);
  await page.keyboard.press('Escape');assert.equal(await root.getByRole('button',{name:'Comprendre les outils',exact:true}).evaluate(e=>e===document.activeElement),true);
 }
 // Demandes compréhensibles, copiables et sans exécution cachée.
 for(let n=25;n<=30;n++){
  root=await scene(n);await root.getByRole('button',{name:'Voir / copier la demande',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.waitFor();const field=dialog.getByRole('textbox');const value=await field.inputValue();assert(value.startsWith('Audit en lecture seule.'));assert(value.includes('[URL locale]')||value.includes('[projet]'));
  await dialog.getByRole('button',{name:'Copier la demande',exact:true}).click();assert.equal((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n'),value);
  const axe=await new AxeBuilder({page}).include('dialog[open]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(x=>x.id),[],'dialogue '+n);
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await root.getByRole('button',{name:'Voir / copier la demande',exact:true}).evaluate(e=>e===document.activeElement),true);
 }
 // Toutes les vues : images chargées, liens précis, aucune pseudo-mesure ni bouton mort.
 for(const [width,height]of [[1280,720],[1920,1080]]){
  await page.setViewportSize({width,height});
  for(const theme of ['light','dark'])for(let n=23;n<=31;n++){
   root=await scene(n);await page.evaluate(t=>document.documentElement.setAttribute('data-deck',t),theme);await layout(root);await layout(page.locator('.slide.active'));
   const choices=root.locator('button[aria-pressed]');
   for(let i=0;i<await choices.count();i++){await choices.nth(i).click();assert.equal(await choices.nth(i).getAttribute('aria-pressed'),'true');await root.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));await layout(root);if(n===24){const grid=await root.locator('.tool-definitions').boundingBox(),usage=await root.locator('.tool-usage').boundingBox();assert(grid.y+grid.height<=usage.y+1,'définitions sans chevauchement');}}
   const r=await new AxeBuilder({page}).include('.slide.active [data-lab]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(r.violations.map(v=>v.id),[],'axe '+n+' '+theme+' '+width);
  }
 }
 root=await scene(28);await root.getByRole('button',{name:'Carte de chaleur',exact:true}).click();assert.equal(await root.getByRole('link',{name:/MCP Contentsquare/}).getAttribute('href'),config.sources['ia-comportement'].find(x=>x.t==='MCP officiel').u);
 await root.getByRole('button',{name:/Agrandir/}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
 root=await scene(30);for(const label of ['Lighthouse','Performance','Network','Console']){await root.getByRole('button',{name:label,exact:true}).click();await root.getByRole('button',{name:/Agrandir/}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');}
 const lhr=await(await page.request.get(base+'/diapos/ux-ia/preuves/traverse-lighthouse.json')).json();assert.equal(lhr.categories.performance.score,.73);
 root=await scene(31);await root.getByLabel('Le bloc à examiner').selectOption('27');await root.getByRole('button',{name:'Ouvrir la fiche',exact:true}).click();await page.waitForURL('**/#27');
 // Les nouveaux noms restent consultables dans le lexique, sans sortir de la slide.
 await page.goto(base+'/diapos/ux-ia/#46');await page.waitForTimeout(350);
 const lexique=page.locator('[data-comp="lexique"]');
 assert.equal(await lexique.locator('.lex-term').count(),config.lexique.length);
 for(const term of await lexique.locator('.lex-term').all()){
  await term.click();await layout(lexique.locator('.lex-panel'));
 }
 assert(await lexique.locator('.lex-grid').evaluate(e=>e.clientHeight<=e.parentElement.clientHeight+1));
 // Conservation des rappels d'accessibilité de la partie 1, y compris les amendes révélées.
 for(const n of [14,15,17,18]){await page.goto(base+'/diapos/ux-ia/#'+n);await page.waitForTimeout(350);await page.evaluate(()=>document.querySelectorAll('.slide.active [data-step]').forEach(e=>e.classList.add('on')));await page.waitForTimeout(350);const body=page.locator('.slide.active .body');await layout(body);if(n===18){await body.getByRole('button',{name:'Tout révéler',exact:true}).click();await layout(body);}if(n===14){assert.equal(await body.locator('.acc-card').count(),4);assert.equal(await body.locator('.acc-audio').count(),0);assert((await body.innerText()).includes('Audio préenregistré'));assert((await body.innerText()).includes('Vidéo avec paroles'));}if(n===17){assert((await body.innerText()).includes('4,4 %'));assert((await body.innerText()).includes('ne s’additionnent pas'));}}
 await page.goto(base+'/ux/ux-ia/');await page.getByRole('link',{name:/Diapo 23/}).click();await page.waitForURL('**/diapos/?diapo=23');await page.locator('iframe.cadre-diapos[src$="#23"]').waitFor();
 assert.deepEqual(errors,[]);assert.deepEqual(httpErrors,[]);
 console.log('OK : 47 slides, six fiches outils et leurs définitions, toutes les vues dans deux thèmes et deux tailles, copie réelle, dialogues, navigation, images, axe et rappels de la partie 1.');
}finally{await browser.close();}
