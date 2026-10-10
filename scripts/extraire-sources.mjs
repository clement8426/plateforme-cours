// Lit le lexique et les références dans la présentation HTML et met à jour src/contenu/ux-ia-sources.json.
// Usage : npm run sources -- ../Downloads/ux-ia-presentation.html [ux-ia]
// Les deux listes sont des littéraux JavaScript : on les évalue dans un contexte vide, sans accès au reste de l'ordinateur.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const [source, nom = 'ux-ia'] = process.argv.slice(2);
if (!source) {
  console.error('Usage : npm run sources -- <presentation.html> [nom-du-cours]');
  process.exit(1);
}
const html = readFileSync(resolve(source), 'utf8');

function liste(cle) {
  // La clé est suivie d'un crochet, par exemple « lexique: [ ».
  const debut = html.search(new RegExp(`\\b${cle}\\s*:\\s*\\[`));
  if (debut < 0) throw new Error(`Liste « ${cle} » introuvable dans ${source}`);
  const ouvrante = html.indexOf('[', debut);
  let profondeur = 0;
  for (let i = ouvrante; i < html.length; i += 1) {
    if (html[i] === '[') profondeur += 1;
    if (html[i] === ']') {
      profondeur -= 1;
      if (profondeur === 0) return vm.runInNewContext(`(${html.slice(ouvrante, i + 1)})`, Object.create(null), { timeout: 1000 });
    }
  }
  throw new Error(`Liste « ${cle} » mal fermée`);
}

const lexique = liste('lexique');
const references = liste('references');
if (!Array.isArray(lexique) || !Array.isArray(references) || !lexique.length || !references.length) {
  throw new Error('Listes vides ou invalides : fichier inattendu');
}
const sortie = resolve(import.meta.dirname, '..', 'src', 'contenu', `${nom}-sources.json`);
writeFileSync(sortie, `${JSON.stringify({ lexique, references }, null, 2)}\n`);
console.log(`${lexique.length} termes et ${references.length} références écrits dans src/contenu/${nom}-sources.json`);
