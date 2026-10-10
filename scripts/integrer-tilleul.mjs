// Construit le site Tilleul pour qu'il vive dans /tilleul/ de la plateforme, et le copie dans public/tilleul.
// Usage : npm run tilleul   (TILLEUL_DIR=<dossier> si Tilleul n'est pas dans ../boutique-tilleul)
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = resolve(fileURLToPath(import.meta.url), '..', '..');
const tilleul = resolve(process.env.TILLEUL_DIR ?? join(racine, '..', 'boutique-tilleul'));
const sortie = join(racine, 'public', 'tilleul');

if (!existsSync(join(tilleul, 'package.json'))) {
  console.error(`Tilleul est introuvable dans ${tilleul}. Indiquez son dossier avec TILLEUL_DIR.`);
  process.exit(1);
}

const vite = join(tilleul, 'node_modules', 'vite', 'bin', 'vite.js');
execFileSync(process.execPath, [vite, 'build', '--base', '/tilleul/', '--outDir', sortie, '--emptyOutDir', '--logLevel', 'warn'], { cwd: tilleul, stdio: 'inherit' });

// Tilleul change de page sans recharger (routeur interne). Pour qu'un rechargement ou un lien direct fonctionne
// chez n'importe quel hébergeur statique, chaque route reçoit sa propre copie de index.html.
const donnees = readFileSync(join(tilleul, 'src', 'donnees.js'), 'utf8');
const produits = [...donnees.matchAll(/id: '([^']+)', nom:/g)].map((m) => m[1]); // les produits, pas les options du panier
const routes = ['boutique', 'panier', 'commande', ...produits.map((id) => `produit/${id}`)];
for (const route of routes) {
  mkdirSync(join(sortie, route), { recursive: true });
  copyFileSync(join(sortie, 'index.html'), join(sortie, route, 'index.html'));
}
console.log(`Tilleul intégré dans public/tilleul (${routes.length + 1} adresses).`);
