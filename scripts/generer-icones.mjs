// Génère les icônes PNG de l'application à partir de public/icones/icone.svg.
// Utilise le Chromium de Playwright s'il est installé sur la machine (pas de dépendance ajoutée au projet).
// Usage : npm run icones   (à relancer seulement si l'icône change)
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const exiger = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = exiger(process.env.PLAYWRIGHT_DEPUIS ?? 'playwright'));
} catch {
  console.error('Playwright est introuvable. Indiquez son chemin : PLAYWRIGHT_DEPUIS=<dossier>/node_modules/playwright npm run icones');
  process.exit(1);
}

const svg = readFileSync(new URL('../public/icones/icone.svg', import.meta.url), 'utf8');
const formats = [
  { fichier: 'icone-192.png', taille: 192, marge: 0 },
  { fichier: 'icone-512.png', taille: 512, marge: 0 },
  { fichier: 'apple-touch-icon.png', taille: 180, marge: 0 },
  // Icône « masquable » : le système peut la rogner en cercle, on garde une marge de sécurité de 10 %.
  { fichier: 'icone-masquable-512.png', taille: 512, marge: 0.1, fond: '#2B44E8' },
];

const navigateur = await chromium.launch();
for (const f of formats) {
  const page = await navigateur.newPage({ viewport: { width: f.taille, height: f.taille } });
  const interieur = Math.round(f.taille * (1 - 2 * f.marge));
  await page.setContent(`<html><body style="margin:0;display:grid;place-items:center;width:${f.taille}px;height:${f.taille}px;background:${f.fond ?? 'transparent'}">
    <div style="width:${interieur}px;height:${interieur}px">${svg.replace('<svg ', `<svg width="${interieur}" height="${interieur}" `)}</div></body></html>`);
  await page.screenshot({ path: new URL(`../public/icones/${f.fichier}`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), omitBackground: !f.fond });
  await page.close();
  console.log('icône :', f.fichier);
}
await navigateur.close();
