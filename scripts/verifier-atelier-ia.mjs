// Tests de comportement des scènes interactives ; même boîte à outils que verifier-site.mjs.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

if (!process.env.UX_OUTILS) throw new Error('Définir UX_OUTILS vers la boîte à outils contenant Playwright et axe.');
const require = createRequire(resolve(process.env.UX_OUTILS, 'package.json'));
const {chromium} = require('playwright');
const {AxeBuilder} = require('@axe-core/playwright');
const base = process.env.SITE_URL ?? 'http://localhost:3000';
const html = readFileSync(new URL('../public/diapos/ux-ia/index.html', import.meta.url), 'utf8');
const config = vm.runInNewContext('('+html.match(/const CONFIG = ([\s\S]*?)\r?\n};/)[1]+'\n})');
assert.equal(config.minutes.length, 43);
assert.equal(config.minutes.slice(21,29).reduce((a,b)=>a+b,0),18);
const browser = await chromium.launch();
const context = await browser.newContext({viewport:{width:1440,height:900}});
const page = await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const warnings=[];
page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)warnings.push(r.status()+' '+r.url());});
async function scene(n, name) {
  await page.goto(base+'/diapos/ux-ia/#'+n);
  const root=page.locator('[data-lab="'+name+'"]');
  await root.getByRole('button').first().waitFor();
  return root;
}
async function contains(locator,s) { assert((await locator.innerText()).includes(s),s); }
async function layout(root) {
  const overflow=await root.evaluate(r=>{
    const box=r.getBoundingClientRect();
    return [...r.querySelectorAll('*')].filter(e=>{
      const s=getComputedStyle(e), b=e.getBoundingClientRect();
      return s.display!=='none'&&b.width&&b.height&&(b.bottom>box.bottom+3||b.right>box.right+3||b.left<box.left-3);
    }).map(e=>e.className||e.tagName);
  });
  assert.deepEqual(overflow,[], 'contenu hors de la scène : '+overflow.join(', '));
}
try {
  let root=await scene(22,'verdict');
  assert.equal(await page.locator('section.slide').count(),43);
  await root.getByRole('button',{name:'Je demande les preuves'}).click();
  await contains(root.locator('[role=status]'),'valeurs viennent du DOM');
  assert((await root.locator('.uxlab-measure').innerText()).includes('padding 6px / 25px'));
  await layout(root);
  await root.getByRole('button',{name:'Recommencer'}).click();
  assert.equal(await root.locator('.uxlab-marked').count(),0);

  root=await scene(23,'mission');
  await root.getByRole('button',{name:'Préparer la mission'}).click();
  await contains(root.locator('[role=status]'),'demander');
  for(const label of ['Pour qui ?','Sur quel appareil ?','Pour quel résultat ?']) await root.getByLabel(label).selectOption({index:1});
  await root.getByLabel('Pour qui ?').focus();await page.keyboard.press('ArrowDown');
  assert.equal(new URL(page.url()).hash,'#23');
  await root.getByRole('button',{name:'Préparer la mission'}).click();
  await contains(root.locator('[role=status]'),'Mission cadrée');await layout(root);

  root=await scene(24,'tools');
  const tool=root.getByRole('button',{name:/Lighthouse/});
  await tool.click();assert.equal(await tool.getAttribute('aria-pressed'),'true');
  await contains(root.locator('[role=status]'),'Connecté');await layout(root);
  await tool.click();assert.equal(await tool.getAttribute('aria-pressed'),'false');

  root=await scene(25,'evidence');
  for(const b of await root.locator('.uxlab-menu button').all()){await b.click();await layout(root);}
  await root.getByRole('button',{name:/4 · Comportement/}).click();await contains(root,'cohorte fictive');
  await root.getByRole('button',{name:/5 · Microcopie/}).click();
  await root.getByRole('button',{name:'Tester le message'}).click();await contains(root.locator('[role=status]'),'Erreur 42');
  await root.getByRole('button',{name:'Afficher une piste'}).click();await contains(root.locator('[role=status]'),'nom@exemple.ch');await layout(root);
  await root.getByLabel('Votre adresse e-mail').fill('alex@example.ch');await root.getByRole('button',{name:'Tester le message'}).click();await contains(root.locator('[role=status]'),'Aucun envoi');

  root=await scene(26,'lighthouse');
  for(const label of ['Performance','Accessibilité','Les limites']){await root.getByRole('button',{name:label,exact:true}).click();await layout(root);}
  await root.getByRole('button',{name:'Agrandir la capture Lighthouse'}).click();
  await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(),0);
  for(const ext of ['png','html','json'])assert.equal((await page.request.get(base+'/diapos/ux-ia/preuves/traverse-lighthouse.'+ext)).status(),200);
  const lhr=await (await page.request.get(base+'/diapos/ux-ia/preuves/traverse-lighthouse.json')).json();
  assert.equal(lhr.categories.performance.score,0.73);assert.equal(lhr.categories.accessibility.score,0.76);
  await root.getByRole('button',{name:'Accessibilité',exact:true}).click();await contains(root,'pourcentage de conformité');

  root=await scene(27,'sorting');
  const next=root.getByRole('button',{name:'Affirmation suivante →'});
  assert.equal(await next.isDisabled(),true);
  for(const answer of ['Constat','Hypothèse','Préférence']){await root.getByRole('button',{name:answer,exact:true}).click();await contains(root.locator('[role=status]'),'Oui.');await layout(root);await next.click();}

  root=await scene(28,'priority');
  for(const b of await root.locator('.uxlab-rank button').all()){await b.click();await layout(root);}

  root=await scene(29,'workflow');
  const fix=root.getByRole('button',{name:'2. Appliquer les 2 corrections'}), verify=root.getByRole('button',{name:'3. Revérifier'});
  await root.getByRole('button',{name:'1. Auditer la démo'}).click();assert.equal(await fix.isDisabled(),true);assert.equal(await verify.isDisabled(),true);
  await root.getByRole('button',{name:'Débogage · copie de test'}).click();assert.equal(await fix.isDisabled(),false);
  await fix.click();assert.equal(await verify.isDisabled(),false);await layout(root);
  await verify.click();await contains(root,'1 point reste à vérifier manuellement');await layout(root);
  await root.getByRole('button',{name:'Recommencer'}).click();await contains(root,'Aucun contrôle exécuté.');

  // Tous les états ouverts doivent rester lisibles, aussi en thème sombre et scène réduite.
  for(const [width,height]of [[1280,720],[1920,1080]]){
    await page.setViewportSize({width,height});
    for(const theme of ['light','dark']) for(let n=22;n<=29;n++){
      await page.goto(base+'/diapos/ux-ia/#'+n);await page.locator('[data-lab] button:visible').first().waitFor();
      await page.evaluate(t=>document.documentElement.setAttribute('data-deck',t),theme);
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(350); // Fin de l'animation d'entrée avant la mesure du contraste.
      const findings=await new AxeBuilder({page}).include('[data-lab]:not([hidden])').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      assert.deepEqual(findings.violations.map(v=>v.id),[],'accessibilité scène '+n);
    }
  }
  assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
  console.log('OK : 8 scènes, preuves DOM, cadrage, outils, galerie, archive Lighthouse, zoom clavier, tri, priorités, audit/débogage, affichage et axe.');
} finally {await browser.close();}
