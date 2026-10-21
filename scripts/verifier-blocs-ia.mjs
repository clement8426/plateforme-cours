// Vérifie les comportements utiles des six blocs et la cohérence du diaporama.
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
assert.equal(config.minutes.length,45);
const keys=[...html.matchAll(/<section class="slide\b[^>]*data-key="([^"]+)"/g)].map(m=>m[1]);
assert(config.lexique.every(x=>keys.includes(x.cle)),'destination du lexique absente');
assert.equal(config.minutes.slice(22,31).reduce((a,b)=>a+b,0),19);
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
const errors=[],httpErrors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)httpErrors.push(r.status()+' '+r.url());});
// L'endpoint de télémétrie Vercel n'existe pas sur le serveur statique local ; il ne fait pas partie des diapos.
await page.route('**/_vercel/insights/script.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:''}));
async function scene(n,name){await page.goto(base+'/diapos/ux-ia/#'+n);const root=page.locator('[data-lab="'+name+'"]');await root.getByRole('button').first().waitFor();await page.waitForTimeout(350);return root;}
async function contains(l,s){assert((await l.innerText()).includes(s),s);}
async function layout(root){const overflow=await root.evaluate(r=>{const box=r.getBoundingClientRect();return [...r.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&b.width&&b.height&&(b.bottom>box.bottom+3||b.right>box.right+3||b.left<box.left-3);}).map(e=>e.className||e.tagName);});assert.deepEqual(overflow,[],'débordement '+await root.getAttribute('data-lab')+': '+overflow.join(', '));}
try{
  let root=await scene(23,'intro');assert.equal(await page.locator('section.slide').count(),45);
  const parts=await page.locator('section.slide').evaluateAll(ss=>ss.map(s=>Number(s.dataset.part)));
  config.parties.forEach((p,i)=>{for(let n=p.de;n<=p.a;n++)assert.equal(parts[n-1],i+1);});
  for(const label of ['Une conversation','Un agent équipé']){await root.getByRole('button',{name:label,exact:true}).click();await layout(root);}

  root=await scene(24,'context');for(const label of ['Site vitrine','Application métier','E-commerce']){await root.getByRole('button',{name:label,exact:true}).click();await contains(root,'Public :');await contains(root,'Objectif :');await layout(root);}

  root=await scene(25,'design');await root.getByRole('button',{name:'Comparer les styles'}).click();await contains(root.locator('.uxlab-measure'),'6px / 25px');await layout(root);
  await root.getByRole('button',{name:'Harmoniser la démo'}).click();const styles=await root.locator('.uxlab-demo-cta').evaluateAll(bs=>bs.map(b=>{const s=getComputedStyle(b);return [s.padding,s.borderRadius].join('|');}));assert.equal(new Set(styles).size,1);await layout(root);

  root=await scene(26,'journey');await root.getByLabel('Votre prénom').fill('Alex');await root.getByRole('button',{name:'Continuer',exact:true}).click();await root.getByRole('button',{name:'Retour pour corriger'}).click();assert.equal(await root.getByLabel('Votre prénom').inputValue(),'');await contains(root,'a disparu');await layout(root);
  await root.getByRole('button',{name:'Conserver la saisie : non'}).click();await root.getByLabel('Votre prénom').fill('Sam');await root.getByRole('button',{name:'Continuer',exact:true}).click();await root.getByRole('button',{name:'Retour pour corriger'}).click();assert.equal(await root.getByLabel('Votre prénom').inputValue(),'Sam');await layout(root);
  await root.getByRole('button',{name:'Voir les étapes observées'}).click();await contains(root,'. Retour : prénom conservé.');await layout(root);
  await root.getByRole('button',{name:'Continuer',exact:true}).click();await root.getByRole('button',{name:'Confirmer la démo'}).click();await contains(root,'Inscription simulée confirmée');await layout(root);

  root=await scene(27,'a11y');for(const label of ['Nom des boutons','Clavier','Audio et vidéo']){await root.getByRole('button',{name:label,exact:true}).click();await layout(root);}
  await contains(root,'sous-titres synchronisés');

  root=await scene(28,'behavior');await root.getByRole('button',{name:'E-mail confirmé',exact:true}).click();await contains(root,'30 / 60 = 50 %');await layout(root);await root.getByRole('button',{name:'D’où vient l’abandon ?'}).click();await contains(root,'ne donnent pas la cause');await layout(root);

  root=await scene(29,'copy');await root.getByRole('button',{name:'Tester le message'}).click();await contains(root.locator('[role=status]'),'Erreur 42');await root.getByRole('button',{name:'Voir une reformulation'}).click();await contains(root.locator('[role=status]'),'nom@exemple.ch');await root.getByRole('button',{name:'Chaleureux',exact:true}).click();await contains(root.locator('[role=status]'),'Essayez par exemple');await layout(root);await root.getByLabel('Votre adresse e-mail').fill('alex@example.ch');await root.getByRole('button',{name:'Tester le message'}).click();await contains(root,'Aucun envoi');

  root=await scene(30,'lighthouse');for(const label of ['Performance','Accessibilité','Les limites']){await root.getByRole('button',{name:label,exact:true}).click();await layout(root);}
  await root.getByRole('button',{name:'Agrandir la capture Lighthouse'}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  const lhr=await(await page.request.get(base+'/diapos/ux-ia/preuves/traverse-lighthouse.json')).json();assert.equal(lhr.categories.performance.score,.73);assert.equal(lhr.audits['button-name'].score,0);

  root=await scene(31,'workflow');const fix=root.getByRole('button',{name:'2. Appliquer les 2 corrections'}),verify=root.getByRole('button',{name:'3. Revérifier'});await root.getByRole('button',{name:'1. Auditer la démo'}).click();assert.equal(await fix.isDisabled(),true);await root.getByRole('button',{name:'Débogage · copie de test'}).click();await fix.click();await verify.click();await contains(root,'1 point reste à vérifier manuellement');await layout(root);

  // Le rappel médias et les statistiques ne doivent pas être interprétés comme un taux d'échec Web.
  for(const n of [14,15,17,18]){await page.goto(base+'/diapos/ux-ia/#'+n);await page.waitForTimeout(350);await page.evaluate(()=>document.querySelectorAll('.slide.active [data-step]').forEach(e=>e.classList.add('on')));await page.waitForTimeout(350);const body=page.locator('.slide.active .body');await layout(body);if(n===18){await body.getByRole('button',{name:'Tout révéler',exact:true}).click();await layout(body);}if(n===14)await contains(body,'Audio préenregistré');if(n===17){await contains(body,'4,4 %');await contains(body,'1 million');await contains(body,'ne s’additionnent pas');}}
  await page.goto(base+'/ux/ux-ia/');await page.getByRole('link',{name:/Diapo 23/}).click();await page.waitForURL('**/diapos/?diapo=23');await page.locator('iframe.cadre-diapos[src$="#23"]').waitFor();

  for(const [width,height]of [[1280,720],[1920,1080]]){await page.setViewportSize({width,height});for(const theme of ['light','dark'])for(let n=23;n<=31;n++){await page.goto(base+'/diapos/ux-ia/#'+n);await page.locator('[data-lab]:visible button').first().waitFor();await page.evaluate(t=>document.documentElement.setAttribute('data-deck',t),theme);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);const r=await new AxeBuilder({page}).include('[data-lab]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(r.violations.map(v=>v.id),[],'axe '+n+' '+theme);}}
  assert.deepEqual(errors,[]);assert.deepEqual(httpErrors,[]);
  console.log('OK : neuf slides, six blocs dans l’ordre, interactions, mesures DOM, parcours avec perte/conservation, messages, Lighthouse, audit/débogage, statistiques, mises en page, clavier et axe.');
}finally{await browser.close();}
