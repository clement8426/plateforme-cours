// Publie la comparaison « formulaire de départ / formulaire réparé » : les deux versions sont servies à l'intérieur
// de la page interactive (public/comparateur/formulaire-adresse/casse et /corrige).
// Usage : npm run comparateur -- ../Downloads/formulaire-adresse-formateur.zip
//
// ATTENTION : ce script publie la version RÉPARÉE, qui est la solution de l'exercice. C'est voulu : la page de comparaison
// est la « révélation », à ouvrir après l'exercice. Il ne publie jamais SOLUTIONS.md ni README.md du formateur :
// seuls les dossiers casse/ et corrige/ sont copiés.
//
// Deux ajustements sont appliqués à la version réparée :
//  - un petit fichier (demo-photon.js) simule les suggestions d'adresse dans le navigateur, pour que rien de ce que
//    tape une personne ne parte vers un service extérieur sans son accord ;
//  - les deux pages reçoivent « noindex » : ce sont des pages de démonstration, pas des pages à référencer.
import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const source = process.argv[2];
if (!source) {
  console.error('Usage : npm run comparateur -- <archive-formateur.zip>');
  process.exit(1);
}
const racine = resolve(import.meta.dirname, '..');
const chemin = resolve(source);
if (!existsSync(chemin)) {
  console.error(`Introuvable : ${chemin}`);
  process.exit(1);
}

function decompresser(zip, dossier) {
  const essais = [];
  if (process.platform === 'win32') essais.push([join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe'), ['-xf', zip, '-C', dossier]]);
  essais.push(['unzip', ['-q', '-o', zip, '-d', dossier]], ['tar', ['-xf', zip, '-C', dossier]]);
  return essais.some(([commande, args]) => {
    try {
      execFileSync(commande, args, { stdio: 'pipe' });
      return readdirSync(dossier).length > 0;
    } catch {
      return false;
    }
  });
}

// Trouve le dossier qui contient casse/ et corrige/.
function trouverRacine(dossier) {
  if (existsSync(join(dossier, 'casse')) && existsSync(join(dossier, 'corrige'))) return dossier;
  for (const nom of readdirSync(dossier)) {
    const p = join(dossier, nom);
    if (statSync(p).isDirectory()) {
      const trouve = trouverRacine(p);
      if (trouve) return trouve;
    }
  }
  return null;
}

const temporaire = mkdtempSync(join(tmpdir(), 'comparateur-'));
try {
  let dossier = chemin;
  if (statSync(chemin).isFile()) {
    if (!decompresser(chemin, temporaire)) {
      console.error('Impossible de décompresser l’archive. Décompressez-la à la main et passez le dossier obtenu.');
      process.exit(1);
    }
    dossier = temporaire;
  }
  const base = trouverRacine(dossier);
  if (!base) {
    console.error('Aucun dossier « casse » et « corrige » dans cette archive : ce n’est pas l’archive du formateur.');
    process.exit(1);
  }

  const cible = join(racine, 'public', 'comparateur', 'formulaire-adresse');
  rmSync(cible, { recursive: true, force: true });
  mkdirSync(cible, { recursive: true });
  for (const version of ['casse', 'corrige']) cpSync(join(base, version), join(cible, version), { recursive: true });

  // noindex sur les deux pages
  for (const version of ['casse', 'corrige']) {
    const fichier = join(cible, version, 'index.html');
    const html = readFileSync(fichier, 'utf8');
    if (!html.includes('<meta charset="utf-8">')) throw new Error(`${version}/index.html : balise meta charset introuvable`);
    writeFileSync(fichier, html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="robots" content="noindex">'));
  }

  // Version réparée : suggestions simulées par défaut
  const script = readFileSync(join(cible, 'corrige', 'script.js'), 'utf8');
  if (!script.includes('photon.komoot.io')) {
    console.warn('Avertissement : la version réparée ne contient plus d’appel à Photon. Le fichier de simulation est quand même ajouté.');
  }
  copyFileSync(join(racine, 'scripts', 'modeles', 'demo-photon.js'), join(cible, 'corrige', 'demo-photon.js'));
  const index = join(cible, 'corrige', 'index.html');
  let html = readFileSync(index, 'utf8');
  if (!html.includes('<script src="script.js"></script>')) throw new Error('corrige/index.html : balise script.js introuvable');
  html = html.replace('<script src="script.js"></script>', '<script src="demo-photon.js"></script>\n  <script src="script.js"></script>');
  html = html.replace('Suggestions d’adresses : ', 'Suggestions d’adresses (simulées dans cette démonstration, sauf accord de votre part) : ');
  writeFileSync(index, html);

  console.log('Comparateur publié : public/comparateur/formulaire-adresse/{casse,corrige}');
  console.log('Fichiers du formateur NON publiés : SOLUTIONS.md, README.md');
} finally {
  rmSync(temporaire, { recursive: true, force: true });
}
