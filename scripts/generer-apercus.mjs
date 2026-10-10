// Prend les captures d'aperçu des diapos et de Tilleul, affichées sur la page du cours.
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

await page.goto(`${base}/tilleul/`);
await page.waitForTimeout(1200); // la fenêtre surgit après 1,5 s : on capture avant
await page.screenshot({ path: dossier + 'tilleul.jpg', type: 'jpeg', quality: 82 });

await navigateur.close();
console.log('Aperçus enregistrés dans public/apercus/.');
