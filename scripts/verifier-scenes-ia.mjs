// Vérifie les fiches IA : demande, outils, preuves, titres et contrastes au survol.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const require=createRequire(resolve(process.env.UX_OUTILS,'package.json'));
const {chromium}=require('playwright'),{AxeBuilder}=require('@axe-core/playwright');
const browser=await chromium.launch(),context=await browser.newContext(),page=await context.newPage();
const base=process.env.SITE_URL||'http://localhost:4187';
await page.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,body:''}));
async function open(n){await page.goto(base+'/diapos/ux-ia/#'+n);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);return page.locator('.slide.active');}
async function bounds(root){const problems=await root.locator('.tool-content').evaluateAll(areas=>areas.flatMap(area=>{const children=[...area.children].filter(e=>e.getBoundingClientRect().height);const issues=[];for(let i=1;i<children.length;i++)if(children[i-1].getBoundingClientRect().bottom>children[i].getBoundingClientRect().top+2)issues.push('chevauchement des contenus');return issues;}));assert.deepEqual(problems,[]);}
async function hover(root){for(const name of ['Voir / copier la demande','Comprendre les outils']){const button=root.getByRole('button',{name,exact:true});await button.hover();const result=await button.evaluate(b=>{const s=getComputedStyle(b),parent=getComputedStyle(b.closest('.tool-how'));const lum=rgb=>{const v=rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});return v[0]*.2126+v[1]*.7152+v[2]*.0722;};const x=lum(s.color),y=lum(s.backgroundColor);return {ratio:(Math.max(x,y)+.05)/(Math.min(x,y)+.05),different:s.backgroundColor!==parent.backgroundColor};});assert.ok(result.different);assert.ok(result.ratio>=4.5,'Contraste au survol : '+result.ratio);}}
try{
 const names=['Design System','Friction','Accessibilité','Comportement','Microcopie','Performances'];
 for(const [width,height]of [[1280,720],[1920,1080]])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height});await open(25);await page.evaluate(t=>document.documentElement.setAttribute('data-deck',t),theme);await page.waitForTimeout(350);
  for(let n=25;n<=30;n++){
   const r=await open(n);assert.match(await r.locator('h2.title').innerText(),new RegExp('Bloc '+(n-24)+' · '+names[n-25]));await hover(r);
   await r.getByRole('button',{name:'Demande',exact:true}).click();assert((await r.locator('.agent-request').innerText()).includes('['));await bounds(r);
   await r.getByRole('button',{name:'Actions',exact:true}).click();assert.equal(await r.locator('.agent-actions li').count(),3);assert.match(await r.locator('.agent-actions').innerText(),/MCP|Lighthouse/);await bounds(r);
   await r.getByRole('button',{name:'Preuves',exact:true}).click();await r.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));await bounds(r);
   const scan=await new AxeBuilder({page}).include('.slide.active [data-lab]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(scan.violations.map(v=>v.id),[]);
  }
 }
 const r=await open(31);assert.match(await r.innerText(),/public/);assert.equal(await r.getByRole('link',{name:'Escale sur GitHub',exact:true}).getAttribute('href'),'https://github.com/clement8426/escale-eleves');
 await open(33);await page.locator('.slide.active').getByRole('button',{name:'Avec un agent',exact:true}).click();const value=await page.getByRole('dialog').locator('textarea').inputValue();assert.match(value,/travail\/bloc-1/);assert.match(value,/Attends ma demande avant de corriger/);
 console.log('OK : six titres explicites, demandes IA, actions des outils, preuves réelles, contraste au survol et atelier public.');
}finally{await browser.close();}
