// Compare src/contenu/parcours/fiches.ts aux fiches d'origine de docs/parcours/ :
// chaque titre, question et option doit être présent, sans reformulation, et dans le même ordre.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath décode les accents du chemin (ex. un dossier utilisateur « Clément »).
const racine = fileURLToPath(new URL('..', import.meta.url));
const normaliser = (v) => v.normalize('NFC').replace(/\\'/g, "'").replace(/[’]/g, "'").replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const source = normaliser(readFileSync(join(racine, 'src/contenu/parcours/fiches.ts'), 'utf8'));
const debuts = { '00-test-positionnement.md': "slug: 'test'", '01-fiche-clarifier-idee.md': "slug: 'idee'", '02-fiche-aspect-technique.md': "slug: 'technique'" };

// Des libellés que le formulaire remplace par sa propre structure, sans perdre de contenu.
const ignorer = /^(nom et prénom|nom du porteur de projet|nom du projet :|question|ta réponse|réponse|notion|étape|n°|fonctionnalité|pourquoi l'utilisateur|mvp|priorité|idées de fonctionnalités|que fait le client|autre : |autre, à décrire|règle : pas d'ia|ce test n'est pas noté|date)/;

function morceaux(md) {
  const sortie = [];
  for (const ligne of md.split(/\r?\n/)) {
    const t = ligne.trim();
    if (t.startsWith('# ')) sortie.push(t.slice(2));
    else if (t.startsWith('## ')) sortie.push(t.slice(3));
    else if (t.startsWith('|') && !/^\|[-\s|]+\|$/.test(t)) {
      const cellules = t.split('|').map((c) => c.trim()).filter(Boolean);
      if (cellules[0] && !/^\d+$/.test(cellules[0])) sortie.push(cellules[0]);
      for (const c of cellules.slice(1)) if (c.includes('☐')) sortie.push(...c.split('☐').map((o) => o.trim()).filter(Boolean));
    } else if (t.includes('☐')) sortie.push(...t.split('☐').map((o) => o.replace(/_+/g, '').replace(/:\s*$/, '').trim()).filter(Boolean));
    else { const m = t.match(/^\*\*(.+?)\*\*/); if (m) sortie.push(m[1].replace(/\s*:$/, '')); }
  }
  return sortie.map(normaliser).filter((m) => m.length > 1 && !ignorer.test(m) && !m.startsWith('étape'));
}

let erreurs = 0;
for (const [fichier, debut] of Object.entries(debuts)) {
  let position = source.indexOf(debut);
  const liste = morceaux(readFileSync(join(racine, 'docs/parcours', fichier), 'utf8'));
  const options = /^(oui|non|plus tard|je ne sais pas|je ne sais pas encore)$/;
  for (const m of liste) {
    const trouve = source.indexOf(m, options.test(m) ? Math.max(0, position - 400) : position);
    if (trouve === -1) { erreurs += 1; console.log(`ÉCHEC ${fichier} : absent ou déplacé : ${m}`); continue; }
    if (!options.test(m)) position = trouve;
  }
  console.log(`${fichier} : ${liste.length} éléments contrôlés`);
}
if (erreurs) { console.log(`${erreurs} écart(s)`); process.exit(1); }
console.log('TOUT PASSE');
