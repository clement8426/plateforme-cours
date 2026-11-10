// Après build + serveur local. Playwright et axe utilisent la boîte à outils existante.
// Exemple PowerShell : $env:UX_OUTILS='../ux-outils'; $env:SITE_URL='http://127.0.0.1:4187'; node scripts/verifier-types-ia.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const require = createRequire(resolve(process.env.UX_OUTILS ?? '../ux-outils', 'package.json'));
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const base = process.env.SITE_URL ?? 'http://127.0.0.1:4187';
const sortie = process.env.PREUVES_TYPES ?? 'preuves-types-ia';
mkdirSync(sortie, { recursive: true });
const html = readFileSync('public/diapos/types-ia/index.html', 'utf8');
const config = vm.runInNewContext('('+html.match(/const CONFIG = ([\s\S]*?);\s*\(\(\) =>/)[1]+')');
const browser = await chromium.launch();
const erreurs = [];
const resultats = [];
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base) && !r.url().includes('/_vercel/insights/')) erreurs.push(`${r.status()} ${r.url()}`); });
  for (const [width,height] of [[1920,1080],[1280,720],[768,1024],[375,667],[667,375]]) {
    await page.setViewportSize({ width,height });
    await page.goto(base+'/diapos/types-ia/');
    await page.evaluate(() => document.fonts.ready);
    const keys = await page.locator('.slide').evaluateAll(ss => ss.map(s => s.dataset.key));
    assert.equal(keys.length, config.minutes.length, 'budget par diapo');
    assert.equal(new Set(keys).size, keys.length, 'identifiants uniques');
    assert.equal(config.parties.at(-1).a, keys.length, 'fin des annexes');
    assert(config.lexique.every(t => keys.includes(t.cle)), 'renvois du lexique');
    for (const theme of ['light','dark']) {
      await page.evaluate(t => document.documentElement.dataset.deck = t, theme);
      for (let i=0; i<keys.length; i++) {
        await page.evaluate(n => { location.hash=String(n); }, i+1);
        await page.waitForFunction(k => document.querySelector('.slide.active')?.dataset.key===k, keys[i]);
        // Révéler les étapes uniquement pour mesurer leur mise en page finale.
        const debords = await page.locator('.slide.active').evaluate(s => {
          s.querySelectorAll('[data-step]').forEach(e=>e.classList.add('on'));
          const stage=document.querySelector('#stage').getBoundingClientRect();
          const scale=stage.width/1920;
          return [...s.querySelectorAll('.body *,.title')].filter(e=>{
            if (e.closest('[hidden]') || e.classList.contains('sr') || !e.getClientRects().length) return false;
            const r=e.getBoundingClientRect();
            return r.width>0 && r.height>0 && (r.bottom>stage.bottom-45*scale || r.right>stage.right-70*scale || r.left<stage.left+70*scale);
          }).map(e=>`${e.tagName}.${e.className}: ${e.textContent.trim().slice(0,65)}`);
        });
        if(debords.length) erreurs.push(`${width}×${height} ${theme} ${keys[i]}: ${debords.join(' | ')}`);
        if (width===1920 && ['generation-audio','generation-video','pratiquer','huggingface','mode-emploi'].includes(keys[i])) {
          const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
          for(const v of axe.violations) erreurs.push(`${theme} ${keys[i]} axe ${v.id}: ${v.nodes.map(n=>n.target.join(' ')).join(', ')}`);
          await page.screenshot({path:resolve(sortie,`${keys[i]}-${theme}.png`)});
        }
      }
      resultats.push(`${keys.length} diapos : ${width}×${height}, ${theme}`);
    }
  }
  await page.setViewportSize({width:1440,height:810});
  await page.goto(base+'/diapos/types-ia/');
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({path:resolve(sortie,'couverture.png')});
  await page.keyboard.press('g');
  assert(await page.locator('#grid').isVisible(), 'grille au clavier');
  await page.keyboard.press('Escape');
  await page.keyboard.type('25'); await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.slide.active')?.dataset.key==='mode-emploi');
  assert(await page.locator('.slide.active .course-link').getAttribute('href')==='/comprendre-ia/types-ia/exercice-hugging-face/');
  await page.keyboard.press('t');
  assert.equal(await page.locator('html').getAttribute('data-deck'),'dark');
  const quiz=await page.locator('[data-comp="quiz"]').textContent();
  assert(quiz.includes('Transformer une facture'), 'quiz initial disponible');
  await page.keyboard.type('17'); await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.slide.active')?.dataset.key==='quiz');
  const quizElement=page.locator('[data-comp="quiz"]');
  for(let tour=0;tour<2;tour++) {
    const boutons=quizElement.getByRole('button',{name:/Révéler la réponse/});
    while(await boutons.count()) await boutons.first().click();
    const horsCadre=await quizElement.evaluate(el=>{
      const stage=document.querySelector('#stage').getBoundingClientRect();
      return [...el.querySelectorAll('.vf-row:not([hidden]) *')].some(e=>e.getBoundingClientRect().right>stage.right || e.getBoundingClientRect().bottom>stage.bottom);
    });
    assert.equal(horsCadre,false,'réponses du quiz entièrement visibles');
    if(tour===0) await quizElement.getByRole('button',{name:'Suivantes',exact:true}).click();
  }
  assert((await quizElement.textContent()).includes('Génération vidéo'),'réponse vidéo disponible');
  await page.emulateMedia({media:'print'});
  assert.equal(await quizElement.locator('.vf-row:visible').count(),config.quiz.length,'toutes les questions dans le PDF');
  await page.emulateMedia({media:'screen'});
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    for(const theme of ['clair','sombre']) {
      await page.goto(base+'/comprendre-ia/types-ia/');
      await page.evaluate(t=>localStorage.setItem('theme',t),theme); await page.reload();
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('.exercice-hors').count(),1);
      assert.equal(await page.locator('.exercice-hors a[href="/comprendre-ia/types-ia/exercice-hugging-face/"]').count(),1);
      assert.equal(await page.getByRole('link',{name:'Ouvrir le cours Le Harnais'}).count(),0);
      assert.equal(await page.locator('.exercice-hors a[href="https://github.com/clement8426/atelier-des-ia"]').count(),0);
      const apercu=page.locator('a.apercu-diapos');
      assert.equal(await apercu.getAttribute('aria-hidden'),null,'aperçu annoncé aux aides techniques');
      assert.equal(await apercu.getByRole('img',{name:/Ouvrir les diapos/}).count(),1,'texte alternatif de l’image-lien');
      await page.getByRole('link',{name:'Ouvrir les diapos',exact:true}).focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.getByRole('link',{name:'Passer à la pratique',exact:true}).evaluate(e=>document.activeElement===e),true,'accès clavier aux exercices');
      await page.keyboard.press('Tab');
      assert.equal(await apercu.evaluate(e=>document.activeElement===e),true,'aperçu dans le parcours Tab');
      assert.notEqual(await apercu.evaluate(e=>getComputedStyle(e).outlineStyle),'none','focus visible sur l’aperçu');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'pas de débordement de la page');
      const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      for(const v of axe.violations) erreurs.push(`page cours ${width} ${theme} axe ${v.id}`);
      await page.keyboard.press('Enter');
      await page.waitForURL('**/comprendre-ia/types-ia/diapos/');
    }
  }
} finally { await browser.close(); }
writeFileSync(resolve(sortie,'rapport.json'),JSON.stringify({date:new Date().toISOString(),resultats,erreurs},null,2));
console.log(resultats.join('\n'));
console.log(erreurs.length ? erreurs.join('\n') : 'Navigation, liens, axe et cadrage : OK');
process.exitCode=erreurs.length ? 1 : 0;
