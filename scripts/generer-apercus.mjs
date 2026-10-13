// Prend les captures d'aperçu des diapos, de Tilleul et des démonstrations, affichées sur la page du cours.
// La plateforme doit être servie (npm run build puis npm start) ; Playwright est pris sur la machine.
// Usage : PLAYWRIGHT_DEPUIS=../ux-outils/node_modules/playwright npm run apercus
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const exiger = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = exiger(process.env.PLAYWRIGHT_DEPUIS ?? 'playwright'));
} catch {
  console.error('Playwright est introuvable. Indiquez son chemin avec PLAYWRIGHT_DEPUIS.');
  process.exit(1);
}

const base = process.env.PLATEFORME_URL ?? 'http://localhost:3000';
const dossier = fileURLToPath(new URL('../public/apercus/', import.meta.url));
mkdirSync(dossier, { recursive: true });

const navigateur = await chromium.launch();
const page = await navigateur.newPage({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1 });

await page.goto(`${base}/diapos/ux-ia/`);
await page.waitForTimeout(1500);
await page.addStyleTag({ content: '#retour-cours { display: none !important; }' }); // le lien de retour n'appartient pas à l'aperçu
await page.screenshot({ path: dossier + 'ux-ia-diapos.jpg', type: 'jpeg', quality: 82 });

await page.goto(`${base}/diapos/ia-donnees/`);
await page.waitForTimeout(1500);
await page.addStyleTag({ content: '#retour-cours { display: none !important; }' });
await page.screenshot({ path: dossier + 'ia-donnees-diapos.jpg', type: 'jpeg', quality: 82 });

await page.goto(`${base}/tilleul/`);
await page.waitForTimeout(1200); // la fenêtre surgit après 1,5 s : on capture avant
await page.screenshot({ path: dossier + 'tilleul.jpg', type: 'jpeg', quality: 82 });

// Démonstration de l'affiche : les deux affiches révélées, côte à côte.
await page.setViewportSize({ width: 1440, height: 900 });
const affiches = [];
for (const nom of [/Affiche A/, /Affiche B/]) {
  await page.goto(`${base}/ux/ux-ia/demos/affiche/`);
  await page.getByRole('radio', { name: nom }).check();
  await page.getByRole('button', { name: /Lancer le test/ }).click();
  await page.getByRole('button', { name: 'Révéler l’affiche' }).click({ timeout: 10000 });
  await page.waitForTimeout(300);
  affiches.push((await page.locator('.affiche-cadre').screenshot()).toString('base64'));
}
await page.setContent(`<body style="margin:0;width:1440px;height:900px;display:flex;gap:56px;align-items:center;justify-content:center;background:#E9EBEF">${affiches.map((a) => `<img src="data:image/png;base64,${a}" style="height:780px;border-radius:6px;box-shadow:0 20px 40px -20px rgba(0,0,0,.4)">`).join('')}</body>`);
await page.screenshot({ path: dossier + 'demo-affiche.jpg', type: 'jpeg', quality: 82 });

// Démonstration du formulaire : les deux versions côte à côte.
await page.goto(`${base}/ux/ux-ia/demos/formulaire-adresse/?version=cote`);
await page.waitForTimeout(1500);
const scene = page.locator('.comparateur-scene');
const boite = await scene.boundingBox();
await page.screenshot({ path: dossier + 'demo-formulaire.jpg', type: 'jpeg', quality: 82, fullPage: true, clip: { x: boite.x, y: boite.y, width: boite.width, height: Math.round(boite.width / 1.6) } });

// Démonstrations du cours « IA, données et responsabilité »
await page.goto(`${base}/ia-legislation/ia-donnees/demos/dossier-mme-fictive/?v=1`);
for (const nom of [/^Le joindre/, /^L’envoyer au chat/, /^Le chat en ligne gratuit/, /^L’envoyer tel quel/]) await page.getByRole('radio', { name: nom }).check();
await page.waitForTimeout(400);
await page.evaluate(() => window.scrollTo(0, 0));
const boiteDossier = await page.locator('.dossier').boundingBox();
await page.screenshot({ path: dossier + 'demo-dossier.jpg', type: 'jpeg', quality: 82, fullPage: true, clip: { x: boiteDossier.x, y: boiteDossier.y, width: boiteDossier.width, height: Math.round(boiteDossier.width / 1.6) } });
await page.goto(`${base}/ia-legislation/ia-donnees/demos/reidentification/`);
await page.getByRole('button', { name: /Indice métier/ }).click();
await page.getByRole('button', { name: /Indice âge/ }).click();
await page.waitForTimeout(500);
const boiteReid = await page.locator('.reid').boundingBox();
await page.screenshot({ path: dossier + 'demo-reidentification.jpg', type: 'jpeg', quality: 82, fullPage: true, clip: { x: boiteReid.x, y: boiteReid.y, width: boiteReid.width, height: Math.round(boiteReid.width / 1.6) } });

await navigateur.close();
console.log('Aperçus enregistrés dans public/apercus/.');
