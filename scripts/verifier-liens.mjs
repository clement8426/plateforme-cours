// Vérifie les liens externes du contenu publié, sans appeler d’API payante.
// Usage : node scripts/verifier-liens.mjs [--json]
// Un refus 403/429 est signalé comme bloqué, jamais comme un lien valide ou un 404.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const racine = resolve(import.meta.dirname, '..');
function textes(dossier) {
  return readdirSync(resolve(racine, dossier), { withFileTypes: true }).flatMap((entree) => {
    const chemin = `${dossier}/${entree.name}`;
    return entree.isDirectory() ? textes(chemin) : /\.(tsx?|md)$/.test(entree.name) ? [chemin] : [];
  });
}
const fichiers = [
  ...readdirSync(resolve(racine, 'public/diapos')).map((nom) => `public/diapos/${nom}/index.html`),
  ...readdirSync(resolve(racine, 'src/contenu')).filter((nom) => /\.(json|ts)$/.test(nom)).map((nom) => `src/contenu/${nom}`),
  ...textes('src/composants'), ...textes('app'), 'README.md',
];
const liens = new Map();
for (const fichier of fichiers) {
  const contenu = readFileSync(resolve(racine, fichier), 'utf8');
  for (const match of contenu.matchAll(/https?:\/\/[^\s<>"'`\\]+/g)) {
    const adresse = match[0].replace(/&amp;/g, '&').replace(/[),.;]+$/, '');
    let url;
    try { url = new URL(adresse); } catch { continue; }
    if (!url.hostname.includes('.') || url.hostname.endsWith('.example') || url.hostname === 'example.com') continue;
    // Origines techniques de preconnect et espace de noms SVG : ce ne sont pas des pages liées.
    if (url.href === 'https://fonts.gstatic.com/' || url.href === 'http://www.w3.org/2000/svg') continue;
    url.hash = '';
    const cle = url.href;
    if (!liens.has(cle)) liens.set(cle, new Set());
    liens.get(cle).add(fichier);
  }
}

async function verifier([url, fichiers]) {
  let resultat;
  for (let essai = 0; essai < 2; essai++) {
    try {
      const reponse = await fetch(url, {
        redirect: 'follow', signal: AbortSignal.timeout(18000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; verification-pedagogique/1.0)', Accept: 'text/html,application/pdf,*/*' },
      });
      resultat = { url, statut: reponse.status, finale: reponse.url, fichiers: [...fichiers] };
      await reponse.body?.cancel();
      if (reponse.status < 500 && reponse.status !== 429) break;
    } catch (erreur) {
      resultat = { url, statut: null, erreur: erreur.message, fichiers: [...fichiers] };
    }
  }
  resultat.etat = resultat.statut >= 200 && resultat.statut < 300 ? 'accessible'
    : [401, 403, 429].includes(resultat.statut) ? 'bloque' : 'a-verifier';
  return resultat;
}

const attente = [...liens];
const resultats = [];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (attente.length) resultats.push(await verifier(attente.shift()));
}));
resultats.sort((a, b) => a.url.localeCompare(b.url));
const bilan = {
  verifieLe: new Date().toISOString(),
  fichiers: fichiers.map((f) => relative(racine, resolve(racine, f))),
  total: resultats.length,
  accessibles: resultats.filter((r) => r.etat === 'accessible').length,
  bloques: resultats.filter((r) => r.etat === 'bloque').length,
  aVerifier: resultats.filter((r) => r.etat === 'a-verifier').length,
  resultats,
};
if (process.argv.includes('--json')) console.log(JSON.stringify(bilan, null, 2));
else {
  console.log(`${bilan.total} liens : ${bilan.accessibles} accessibles, ${bilan.bloques} bloqués, ${bilan.aVerifier} à vérifier.`);
  for (const r of resultats.filter((r) => r.etat !== 'accessible')) console.log(`${r.statut ?? r.erreur} ${r.url}`);
}
if (bilan.bloques || bilan.aVerifier) process.exitCode = 1;
