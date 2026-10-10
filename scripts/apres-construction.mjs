// Après « next build » : Next.js 16 écrit ses fichiers de préchargement dans des sous-dossiers
// (__next.$d$categorie/__PAGE__.txt), mais le navigateur les demande sous un nom à plat
// (__next.$d$categorie.__PAGE__.txt). Sans réécriture côté hébergeur, chaque page produirait des erreurs 404.
// On ajoute donc une copie à plat de chacun de ces fichiers : le site marche alors chez n'importe quel hébergeur statique.
import { copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const sortie = resolve(fileURLToPath(import.meta.url), '..', '..', 'out');
let copies = 0;

function fichiers(dossier) {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}

function parcourir(dossier) {
  for (const nom of readdirSync(dossier)) {
    const chemin = join(dossier, nom);
    if (!statSync(chemin).isDirectory()) continue;
    if (nom.startsWith('__next.')) {
      for (const f of fichiers(chemin)) {
        copyFileSync(f, join(dossier, `${nom}.${relative(chemin, f).split(sep).join('.')}`));
        copies += 1;
      }
    } else if (nom !== '_next') {
      parcourir(chemin);
    }
  }
}

parcourir(sortie);
console.log(`Préchargement : ${copies} fichiers copiés à plat.`);
