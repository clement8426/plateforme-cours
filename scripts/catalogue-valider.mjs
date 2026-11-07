// Publie des outils du catalogue après relecture : npm run catalogue:valider -- <id> <id> ...
// ou -- --tous. Seul Clément décide : ce script ne s'exécute jamais dans le pipeline automatique.
import { readFileSync, writeFileSync } from 'node:fs';

const fichier = new URL('../data/tools.json', import.meta.url);
const outils = JSON.parse(readFileSync(fichier, 'utf8'));
const demandes = process.argv.slice(2);
if (!demandes.length) { console.log(`À valider : ${outils.filter((o) => !o.validated_by).map((o) => o.id).join(' ') || 'aucun'}`); process.exit(0); }
const tous = demandes.includes('--tous');
const inconnus = demandes.filter((d) => d !== '--tous' && !outils.some((o) => o.id === d));
if (inconnus.length) { console.error(`Inconnu : ${inconnus.join(' ')}`); process.exit(1); }

const aujourdhui = new Date().toISOString().slice(0, 10);
let n = 0;
for (const o of outils) {
  if ((tous || demandes.includes(o.id)) && !o.validated_by) {
    if (!o.piliers.length || !o.project_types.length) { console.error(`${o.id} : catégories manquantes, ignoré.`); continue; }
    if (o.data_location && !o.constraints.length) { console.error(`${o.id} : stocke des données sans contraintes, ignoré.`); continue; }
    o.validated_by = 'Clément Bastien';
    o.validated_at = aujourdhui;
    n += 1;
  }
}
writeFileSync(fichier, `${JSON.stringify(outils, null, 1)}\n`);
console.log(`${n} outil(s) validé(s).`);
