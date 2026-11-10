import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { readFile, unlink } from 'node:fs/promises';
const require = createRequire(resolve(process.env.UX_OUTILS ?? '../ux-outils', 'package.json'));
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const base = process.env.SITE_URL ?? 'http://127.0.0.1:4193';
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const erreurs = [];
  const requetes = [];
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('request', r => requetes.push(r.url()));
  await page.goto(base + '/comprendre-ia/types-ia/exercice-hugging-face/');
  await page.getByRole('heading', { name: 'Essayez. Changez. Comparez.' }).waitFor();
  const choix = page.getByRole('group', { name: 'Choisir une mission' });
  assert.equal(await choix.getByRole('button').count(), 7);
  const espaces = ['merve/compare_clip_siglip', 'hysts/image-captioning-with-blip', 'PaddlePaddle/PP-OCRv5_Online_Demo', 'Xenova/yolov10-web', 'hf-audio/whisper-large-v3', 'Xenova/kokoro-web', 'black-forest-labs/FLUX.1-schnell'];
  const saisies = ['Je prévois une catégorie.', 'Le modèle reconnaît le chien.', 'Le recadrage change le résultat.', 'Utile pour trier ; vérifier les erreurs.'];
  for (let i = 0; i < saisies.length; i++) await page.getByRole('textbox').nth(i).fill(saisies[i]);
  await choix.getByRole('button').nth(2).click();
  assert.equal(await page.getByRole('textbox').first().inputValue(), '');
  const menu = page.getByRole('link', { name: 'Télécharger le menu fictif' });
  assert.equal((await page.request.get(base + await menu.getAttribute('href'))).status(), 200);
  await choix.getByRole('button').first().click();
  assert.equal(await page.getByRole('textbox').first().inputValue(), saisies[0]);
  assert.match(await page.getByText(/fiches remplies/).innerText(), /1 \/ 7/);
  const attente = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger mes observations (.md)' }).click();
  const fichier = await attente;
  const chemin = await fichier.path();
  const contenu = await readFile(chemin, 'utf8');
  for (const saisie of saisies) assert(contenu.includes(saisie));
  await unlink(chemin);
  assert(!requetes.some(url => url.startsWith('https://huggingface.co/')), 'Pas de chargement de démo avant un clic');
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['clair', 'sombre']) {
      await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
      for (let i = 0; i < 7; i++) {
        await choix.getByRole('button').nth(i).click();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Pas de débordement');
        const liens = page.getByRole('link', { name: /^Tester / });
        assert.equal(await liens.getAttribute('href'), 'https://huggingface.co/spaces/' + espaces[i]);
        assert.equal(await page.getByRole('link', { name: /Autre démo/ }).count(), 0);
      }
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      assert.deepEqual(axe.violations.map(v => ({ id: v.id, cibles: v.nodes.map(n => n.target) })), []);
    }
  }
  assert.deepEqual(erreurs, []);
  await page.screenshot({ path: resolve(process.env.TEMP ?? '.', 'exercice-hugging-face.png'), fullPage: true });
  console.log('Exercice Hugging Face : navigation, notes, export, mobile et accessibilité OK');
} finally { await browser.close(); }
