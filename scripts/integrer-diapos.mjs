// Prépare une présentation HTML pour la plateforme et la copie dans public/diapos/.
// Usage : npm run diapos -- <fichier.html> <nom> [--retour /thème/cours/diapos/]
//   ex. : npm run diapos -- ../Downloads/ux-ia-presentation.html ux-ia --retour /ux/ux-ia/diapos/
// Le fichier d'origine n'est jamais modifié : on réécrit une copie.
//
// Deux ajustements sont appliqués :
//  1. le lien vers Tilleul (SITE_URL) pointe vers /tilleul/, et celui du formulaire (FORM_URL) vers /formulaires/adresse/ ;
//  2. un « pont » se branche sur la plateforme (voir PONT ci-dessous) pour que le plein écran
//     garde toujours un bouton « Quitter » visible, et que Échap en sorte.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const options = {};
const positionnels = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i].startsWith('--')) options[args[i].slice(2)] = args[++i];
  else positionnels.push(args[i]);
}
const [source, nom] = positionnels;
if (!source || !nom) {
  console.error('Usage : npm run diapos -- <fichier.html> <nom> [--retour /thème/cours/diapos/]');
  process.exit(1);
}
const chemin = resolve(source);
if (!existsSync(chemin)) {
  console.error(`Fichier introuvable : ${chemin}`);
  process.exit(1);
}

let html = readFileSync(chemin, 'utf8');

const SITE_URL = /SITE_URL: '[^']*'/;
if (SITE_URL.test(html)) html = html.replace(SITE_URL, "SITE_URL: '/tilleul/?cours=non'");
else console.warn('Avertissement : SITE_URL introuvable, le lien vers Tilleul n’est pas modifié.');

// Un chemin comme /ux/ux-ia/ peut être converti en « C:/Program Files/Git/ux/ux-ia/ » par Git Bash sous Windows : on refuse.
// Le formulaire de l'exercice C (diapos 29 à 31) est publié par « npm run formulaire » : le lien des diapos y mène.
// La démonstration de l'affiche : la page du site, en adresse relative.
html = html.replace(/AFFICHE_URL: '[^']*'/, "AFFICHE_URL: '/ux/ux-ia/demos/affiche/'");
const FORM_URL = /FORM_URL: '[^']*'/;
if (FORM_URL.test(html)) html = html.replace(FORM_URL, "FORM_URL: '/formulaires/adresse/'");

const retour = options.retour ?? '/';
if (!retour.startsWith('/') || /^[A-Za-z]:/.test(retour) || retour.includes('Program Files')) {
  console.error(`Adresse de retour invalide : ${retour}
Sous Git Bash, faites précéder la commande de MSYS_NO_PATHCONV=1.`);
  process.exit(1);
}
const PONT = `
<script id="pont-plateforme">
/* Ajouté par la plateforme (scripts/integrer-diapos.mjs). Aucune donnée n'est envoyée : messages internes à la page. */
(() => {
  const dansCadre = window.parent !== window;
  const $ = (id) => document.getElementById(id);
  const saisie = (e) => { const t = e.target, tag = t.tagName || ''; return tag === 'TEXTAREA' || (tag === 'INPUT' && !/^(range|color|checkbox|radio|file|button)$/.test(t.type)); };
  // Rien n'est ouvert dans les diapos (grille, écran noir, saisie d'un numéro, vue présentateur) ?
  const libre = () => $('grid')?.hidden !== false && $('black')?.hidden !== false && $('toast')?.hidden !== false && !$('pv')?.classList.contains('overlay');
  if (dansCadre) {
    // Dans la plateforme : F et Échap sont confiés au lecteur, qui garde un bouton « Quitter » visible.
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      if ((e.key === 'f' || e.key === 'F') && !saisie(e)) {
        e.preventDefault(); e.stopImmediatePropagation();
        parent.postMessage({ type: 'diapos:plein-ecran' }, location.origin);
      } else if (e.key === 'Escape' && libre()) {
        parent.postMessage({ type: 'diapos:quitter' }, location.origin);
      }
    }, true);
  } else {
    // Ouvertes seules : un lien de retour toujours visible.
    const a = document.createElement('a');
    a.id = 'retour-cours';
    a.href = ${JSON.stringify(retour)};
    a.textContent = '← Retour au cours';
    a.style.cssText = 'position:fixed;left:14px;bottom:18px;z-index:50;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:14px;background:#17153B;color:#FBF4E4;font:600 15px/1 system-ui,sans-serif;text-decoration:none;box-shadow:0 8px 20px -10px rgba(0,0,0,.5)';
    document.body.append(a);
  }
})();
</script>
`;

if (!html.includes('</body>')) {
  console.error('Balise </body> introuvable : fichier inattendu.');
  process.exit(1);
}
html = html.replace(/<script id="pont-plateforme">[\s\S]*?<\/script>\s*/, '');
html = html.replace('</body>', `${PONT}</body>`);

// Un dossier avec index.html : l'adresse /diapos/<nom>/ marche partout (Vercel renvoie 404 pour un .html avec trailingSlash).
const dossier = resolve(import.meta.dirname, '..', 'public', 'diapos', nom);
mkdirSync(dossier, { recursive: true });
writeFileSync(resolve(dossier, 'index.html'), html);
console.log(`Diapos intégrées : public/diapos/${nom}/index.html (retour : ${retour})`);
