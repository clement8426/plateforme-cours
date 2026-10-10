// Publie le formulaire d'exercice (version APPRENANTS) sur la plateforme :
//  - le formulaire en ligne, dans public/formulaires/adresse/ (pour le remplir sans rien installer) ;
//  - l'archive à télécharger, dans public/telechargements/ (pour le donner à l'assistant IA).
// Usage : npm run formulaire -- ../Downloads/formulaire-adresse-apprenants.zip
//
// Garde-fou : la plateforme est publique. Ce script refuse tout dossier qui contient des solutions
// (SOLUTIONS.md, dossiers « casse » ou « corrige », dossier « formateur »). Ne publiez jamais l'archive du formateur.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const source = process.argv[2];
if (!source) {
  console.error('Usage : npm run formulaire -- <archive-apprenants.zip>');
  process.exit(1);
}
const racine = resolve(import.meta.dirname, '..');
const chemin = resolve(source);
if (!existsSync(chemin)) {
  console.error(`Introuvable : ${chemin}`);
  process.exit(1);
}
if (/formateur/i.test(chemin)) {
  console.error('Refus : le nom de ce fichier indique la version formateur, qui contient les solutions. Publiez uniquement la version apprenants.');
  process.exit(1);
}

// Décompresse un zip avec ce que la machine offre : le « tar » de Windows (bsdtar), « unzip », ou « tar » (macOS).
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

const temporaire = mkdtempSync(join(tmpdir(), 'formulaire-'));
try {
  let dossier = chemin;
  if (statSync(chemin).isFile()) {
    if (!decompresser(chemin, temporaire)) {
      console.error('Impossible de décompresser l’archive. Décompressez-la à la main et passez le dossier obtenu.');
      process.exit(1);
    }
    dossier = temporaire;
  }

  const tous = [];
  (function parcourir(d) {
    for (const nom of readdirSync(d)) {
      const p = join(d, nom);
      tous.push(p);
      if (statSync(p).isDirectory()) parcourir(p);
    }
  })(dossier);

  const interdits = tous.filter((p) => /solutions|(^|[\\/])(casse|corrige|formateur)([\\/]|$)/i.test(p.slice(dossier.length)));
  if (interdits.length) {
    console.error('Refus : cette archive contient des éléments réservés au formateur :');
    interdits.forEach((p) => console.error(`  ${p.slice(dossier.length)}`));
    process.exit(1);
  }

  const index = tous.find((p) => /[\\/]index\.html$/.test(p) || p === join(dossier, 'index.html'));
  if (!index) {
    console.error('Aucun index.html dans l’archive.');
    process.exit(1);
  }
  const base = resolve(index, '..');
  const fichiers = ['index.html', 'script.js', 'style.css'];
  const manquants = fichiers.filter((f) => !existsSync(join(base, f)));
  if (manquants.length) {
    console.error(`Fichiers manquants : ${manquants.join(', ')}`);
    process.exit(1);
  }

  // Le formulaire publié ne doit contacter aucun service extérieur : la page promet qu'elle n'envoie aucune donnée.
  const contenu = fichiers.map((f) => readFileSync(join(base, f), 'utf8')).join('\n');
  if (/\bfetch\(|XMLHttpRequest|WebSocket|sendBeacon/.test(contenu)) {
    console.error('Refus : ce formulaire contient des appels réseau (fetch, XMLHttpRequest…). La version publiée doit rester sans envoi de données.');
    process.exit(1);
  }

  const cible = join(racine, 'public', 'formulaires', 'adresse');
  mkdirSync(cible, { recursive: true });
  fichiers.forEach((f) => copyFileSync(join(base, f), join(cible, f)));
  console.log(`Formulaire publié : public/formulaires/adresse/ (${fichiers.join(', ')})`);

  if (statSync(chemin).isFile()) {
    mkdirSync(join(racine, 'public', 'telechargements'), { recursive: true });
    copyFileSync(chemin, join(racine, 'public', 'telechargements', 'formulaire-adresse.zip'));
    console.log('Archive à télécharger : public/telechargements/formulaire-adresse.zip');
  } else {
    console.log('Dossier fourni : pas d’archive à télécharger (donnez l’archive .zip pour la publier).');
  }
} finally {
  rmSync(temporaire, { recursive: true, force: true });
}
