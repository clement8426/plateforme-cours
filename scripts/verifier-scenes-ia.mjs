// Vérifie les gestes pédagogiques, leurs résultats et l’absence de chevauchement après interaction.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const require=createRequire(resolve(process.env.UX_OUTILS,'package.json'));
const {chromium}=require('playwright'),{AxeBuilder}=require('@axe-core/playwright');
const browser=await chromium.launch(),context=await browser.newContext(),page=await context.newPage();
const base=process.env.SITE_URL||'http://localhost:4187';
await page.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,body:''}));
async function open(n){await page.goto(base+'/diapos/ux-ia/#'+n);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);return page.locator('.slide.active');}
async function bounds(root){const problems=await root.locator('.tool-content').evaluateAll(areas=>areas.flatMap(area=>{const children=[...area.children].filter(e=>e.getBoundingClientRect().height);const issues=[];for(let i=1;i<children.length;i++)if(children[i-1].getBoundingClientRect().bottom>children[i].getBoundingClientRect().top+2)issues.push('chevauchement des contenus');for(const e of area.querySelectorAll('.tool-stage')){const rect=e.getBoundingClientRect();if([...e.children].some(c=>c.getBoundingClientRect().bottom>rect.bottom+2))issues.push('contenu hors du mini-labo');}return issues;}));assert.deepEqual(problems,[]);}
try{
 for(const [width,height]of [[1280,720],[1920,1080]])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height});
  let r=await open(25);await page.evaluate(t=>document.documentElement.setAttribute('data-deck',t),theme);await page.waitForTimeout(350);
  await r.getByRole('button',{name:'Boutons',exact:true}).click();await r.getByRole('button',{name:'Inspecter Enregistrer, écran 2',exact:true}).click();assert.match(await r.locator('.style-readout').innerText(),/22px 32px/);await bounds(r);
  await r.getByRole('button',{name:'Espacements',exact:true}).click();await r.getByRole('button',{name:'Inspecter la carte 2',exact:true}).click();assert.match(await r.locator('.style-readout').innerText(),/42px/);await bounds(r);
  r=await open(26);await r.locator('input').fill('Alex');await r.getByRole('button',{name:'Tester l’erreur de NPA',exact:true}).click();assert.equal(await r.locator('input').inputValue(),'');assert.match(await r.locator('.stage-feedback').innerText(),/Alex.*champ vide/);await bounds(r);await r.getByRole('button',{name:'Réessayer',exact:true}).click();assert.equal(await r.locator('input').inputValue(),'Camille');
  r=await open(27);for(const label of ['Relancer seulement axe','Essayer le clavier']){await r.getByRole('button',{name:label,exact:true}).click();await bounds(r);}assert.match(await r.locator('.stage-feedback').innerText(),/retour du focus/);
  r=await open(29);await r.getByRole('button',{name:'Proposition utile',exact:true}).click();assert.match(await r.locator('.copy-message').innerText(),/adresse e-mail/);await bounds(r);await r.getByRole('button',{name:'Message technique',exact:true}).click();assert.equal(await r.locator('.copy-message').innerText(),'Erreur 42');
  r=await open(30);await r.getByRole('button',{name:'Cache',exact:true}).click();for(const value of ['no-store','max-age=3600']){await r.getByRole('button',{name:'Réponse : Cache-Control: '+value,exact:true}).click();await bounds(r);}assert.match(await r.locator('.stage-feedback').innerText(),/heure/);
  for(const n of [25,26,27,29,30]){r=await open(n);const scan=await new AxeBuilder({page}).include('.slide.active [data-lab]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(scan.violations.map(v=>v.id),[]);}
 }
 const r=await open(32);assert.match(await r.innerText(),/public/);assert.equal(await r.getByRole('link',{name:'Escale sur GitHub',exact:true}).getAttribute('href'),'https://github.com/clement8426/escale-eleves');
 await open(34);await page.locator('.slide.active').getByRole('button',{name:'Les gestes, pas à pas',exact:true}).click();assert.match(await page.getByRole('dialog').innerText(),/Inspecter/);await page.keyboard.press('Escape');
 await page.locator('.slide.active').getByRole('button',{name:'Avec un agent',exact:true}).click();const value=await page.getByRole('dialog').locator('textarea').inputValue();assert.match(value,/travail\/bloc-1/);assert.match(value,/Attends ma demande avant de corriger/);
 console.log('OK : interactions réelles, comparaison CSS, erreur/reprise, clavier, microcopie, cache, lisibilité et liaison avec l’atelier public.');
}finally{await browser.close();}
