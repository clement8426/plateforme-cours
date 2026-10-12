// Le catalogue de la plateforme : catégories, cours, ressources.
// Pour ajouter un cours, on ajoute une entrée ici ; les pages se génèrent toutes seules.
import type { BlocId } from './blocs';
import { typoProfonde } from './typo';
import sourcesUx from './ux-ia-sources.json';

export type Reference = { titre: string; source: string; url: string };
export type Terme = { terme: string; nom?: string; def: string };
export type GroupeReferences = { nom: string; bloc?: BlocId; references: Reference[] };

// Une démonstration : faite en direct devant la salle, avec son déroulé et une scène interactive.
// L'exercice à refaire chez soi est dans le dépôt GitHub du cours (champ « exercice » : le dossier).
export type EtapeDemo = { texte: string; action?: { texte: string; href: string; nouvelOnglet?: boolean } };
export type Demo = {
  slug: string;
  titre: string;
  resume: string;
  blocs: BlocId[];
  duree: string;
  apercu: string;
  scene: 'affiche' | 'tilleul' | 'comparateur';
  comparateur?: string; // pour scene « comparateur » : voir comparateurs.ts
  deroule: EtapeDemo[];
  aRetenir: string[];
  exercice: string;
  bonus?: boolean; // à montrer seulement s'il reste du temps
};

// Le déroulé du cours, calé sur les trois parties des diapos.
export type Partie = { titre: string; resume: string; duree: string; diapos: [number, number]; demos?: boolean };

export type Cours = {
  slug: string;
  titre: string;
  accroche: string;
  duree: string;
  public: string;
  objectifs: string[];
  diapos?: { href: string; apercu: string };
  parties: Partie[];
  demos: Demo[];
  depot?: string; // dépôt GitHub des exercices à refaire chez soi
  lexique: Terme[];
  references: GroupeReferences[];
};

export type Categorie = {
  slug: string;
  nom: string;
  court: string; // nom raccourci pour le menu, afin qu'il tienne sur une ligne sur téléphone
  description: string;
  cours: Cours[];
};

// Range les références dans des groupes lisibles, du plus général au plus pratique.
// Une adresse non reconnue tombe dans « Autres lectures » : rien ne se perd si le fichier des sources change.
const REGLES_GROUPES: { nom: string; bloc?: BlocId; adresses: string[] }[] = [
  { nom: 'Le modèle de référence', adresses: ['semanticstudios'] },
  { nom: 'Friction : décider et atteindre', bloc: 'friction', adresses: ['lawsofux.com', 'baymard.com', 'centercentre'] },
  // Avant « Accessibilité » : l'adresse du motif combobox (W3C) y serait sinon rangée par « w3.org ».
  { nom: 'Formulaires et autocomplétion', adresses: ['github.com/komoot', 'w3.org/WAI/ARIA'] },
  { nom: 'Accessibilité et obligations légales', bloc: 'accessibilite', adresses: ['w3.org', 'eur-lex', 'economie.gouv', 'fieldfisher', 'ebgb.admin'] },
  { nom: 'Performance perçue et émotion', bloc: 'performance', adresses: ['uxmag', 'umich', 'cnbc', 'wikipedia'] },
  { nom: 'Outils d’audit', adresses: ['pa11y', 'developer.chrome', 'unlighthouse'] },
  { nom: 'Agents IA et MCP', adresses: ['modelcontextprotocol', 'playwright.dev', 'chrome-devtools-mcp', 'clarity.microsoft', 'arxiv.org'] },
  { nom: 'L’IA dans la création', adresses: ['next.ink', 'penpot.app', 'developers.figma.com'] },
];

function grouper(references: Reference[]): GroupeReferences[] {
  const restantes = [...references];
  const groupes: GroupeReferences[] = REGLES_GROUPES.map((regle) => {
    const trouvees = restantes.filter((r) => regle.adresses.some((a) => r.url.includes(a)));
    trouvees.forEach((r) => restantes.splice(restantes.indexOf(r), 1));
    return { nom: regle.nom, bloc: regle.bloc, references: trouvees };
  }).filter((g) => g.references.length);
  if (restantes.length) groupes.push({ nom: 'Autres lectures', references: restantes });
  return groupes;
}

const uxIa: Cours = {
  slug: 'ux-ia',
  titre: 'UX × IA',
  accroche: 'Rendre un produit pratique, puis le corriger avec l’IA.',
  duree: 'Environ 1 h 30, selon les démonstrations choisies',
  public: 'Débutants, aucun prérequis technique',
  objectifs: [
    'Distinguer l’UX (le vécu) de l’UI (le visuel).',
    'Repérer les défauts d’un site avec six blocs : design system, friction, accessibilité, analyse comportementale, microcopie, performance perçue.',
    'Comprendre ce qu’un outil d’audit mesure, et ce qu’il ne voit pas.',
    'Choisir entre un outil simple, une conversation et un agent IA, et lui donner les bonnes clés : l’intention, la cible, le ton.',
  ],
  diapos: { href: '/diapos/ux-ia/', apercu: '/apercus/ux-ia-diapos.jpg' },
  parties: [
    { titre: 'Théorie', resume: 'Joli ne veut pas dire pratique : la cible, le tunnel de conversion, et six blocs pour repérer ce qui gêne.', duree: '35 min', diapos: [1, 19] },
    { titre: 'L’IA, bloc par bloc', resume: 'Agents et MCP, puis pour chaque bloc : l’outil simple, le prompt, et ce qu’il faut vérifier.', duree: '25 min', diapos: [20, 32] },
    { titre: 'Pratique', resume: 'Une ou deux démonstrations devant la salle, selon le temps qui reste. Tout se refait chez soi.', duree: '25 à 40 min', diapos: [33, 47], demos: true },
  ],
  demos: [
    {
      slug: 'tilleul',
      titre: 'Tilleul, la boutique piégée',
      resume: 'Une boutique de céramiques très soignée, avec douze défauts d’UX. Faites le parcours devant la salle, puis révélez les défauts avec le mode cours.',
      blocs: ['design-system', 'friction', 'accessibilite', 'comportement', 'microcopie', 'performance'],
      duree: '15 minutes',
      apercu: '/apercus/tilleul.jpg',
      scene: 'tilleul',
      deroule: [
        { texte: 'Sans aide, faites le parcours d’un client : accueil, collection, fiche produit, panier, commande. Pensez à voix haute.' },
        { texte: 'À chaque étape, demandez à la salle où ça gêne, et rangez les réponses dans les six blocs.' },
        { texte: 'Passez en mode cours : les pastilles révèlent les douze défauts. Ouvrez-en un par bloc.' },
        { texte: 'Cliquez sur « Améliorer » : le défaut est corrigé en direct. Comparez avant et après.' },
        { texte: 'Montrez ce que l’audit automatique voit, et ce qu’il rate.', action: { texte: 'Diapo de la révélation', href: '/ux/ux-ia/diapos/?diapo=35' } },
      ],
      aRetenir: [
        'Un site soigné peut être pénible à utiliser.',
        'Chaque défaut se range dans un bloc, et gêne quelqu’un de précis.',
        'L’audit automatique voit un contraste trop faible, pas un bouton « Soumettre ».',
      ],
      exercice: '01-audit-tilleul',
    },
    {
      slug: 'formulaire-adresse',
      titre: 'Le formulaire d’adresse, avant et après',
      resume: 'Le même formulaire, deux versions. Remplissez la première devant la salle, passez à la version réparée, puis ouvrez les sept défauts un par un.',
      blocs: ['design-system', 'friction', 'accessibilite', 'comportement', 'microcopie', 'performance'],
      duree: '12 minutes',
      apercu: '/apercus/demo-formulaire.jpg',
      scene: 'comparateur',
      comparateur: 'formulaire-adresse',
      deroule: [
        { texte: 'Remplissez la version de départ avec une adresse fictive, chrono lancé, et envoyez-la.' },
        { texte: 'Demandez à la salle ce qui a gêné : l’écran est soigné, les défauts sont ailleurs.' },
        { texte: 'Passez à la version réparée et refaites la même chose.' },
        { texte: 'Tapez « Rue du Seyon 10 » dans « Rue et numéro » : l’autocomplétion, c’est de l’UX qui demande du code.' },
        { texte: 'Ouvrez les défauts un par un : « Montrer dans le formulaire » surligne l’élément concerné.' },
      ],
      aRetenir: [
        'Un formulaire joli peut cacher un défaut par bloc.',
        'Le navigateur sait remplir une adresse, si on le laisse faire.',
        'Une erreur dit quoi corriger, en toutes lettres, pas seulement en rouge.',
      ],
      exercice: '02-formulaire-adresse',
    },
    {
      slug: 'affiche',
      titre: 'L’affiche qui se lit en 3 secondes',
      resume: 'Deux affiches pour la même promotion. Montrez chacune 3 secondes à la salle : laquelle a été retenue ?',
      blocs: ['design-system', 'microcopie'],
      duree: '8 minutes',
      apercu: '/apercus/demo-affiche.jpg',
      scene: 'affiche',
      deroule: [
        { texte: 'Lancez le test avec l’affiche A, sans rien annoncer.' },
        { texte: 'Demandez à la salle : quoi, quand, où ? Notez les réponses.' },
        { texte: 'Révélez l’affiche : tout y était, mais rien ne ressortait.' },
        { texte: 'Refaites le test avec l’affiche B, puis comparez les réponses.' },
        { texte: 'Montrez la méthode : construire l’affiche avec un agent relié à Penpot, plutôt que la générer en image.', action: { texte: 'Diapo de la méthode', href: '/ux/ux-ia/diapos/?diapo=42' } },
      ],
      aRetenir: [
        'Trois informations, pas une de plus : quoi, quand, où.',
        'Une seule chose en très grand : l’œil sait par où commencer.',
        'Une IA d’images régénère tout en pixels. Un agent relié à Penpot construit une affiche modifiable.',
      ],
      exercice: 'bonus-affiche-promo',
      bonus: true,
    },
  ],
  depot: 'https://github.com/clement8426/ux-ia-exercices',
  lexique: sourcesUx.lexique,
  references: grouper(sourcesUx.references),
};

export const CATEGORIES: Categorie[] = typoProfonde([
  {
    slug: 'ux',
    nom: 'UX et design',
    court: 'UX et design',
    description: 'Rendre un produit pratique : parcours, accessibilité, petits textes, vitesse ressentie.',
    cours: [uxIa],
  },
  {
    slug: 'ia-legislation',
    nom: 'IA : obligations et législation',
    court: 'IA et législation',
    description: 'Ce que l’AI Act européen et le droit suisse demandent aux entreprises qui utilisent l’IA.',
    cours: [],
  },
]);

export const trouverCategorie = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const trouverCours = (categorie: string, cours: string) => trouverCategorie(categorie)?.cours.find((c) => c.slug === cours);

// Le premier cours disponible : celui que l'accueil met en avant.
export const premierCours = () => {
  for (const categorie of CATEGORIES) if (categorie.cours[0]) return { categorie, cours: categorie.cours[0] };
  return null;
};

export const trouverDemo = (cours: Cours, slug: string) => cours.demos.find((d) => d.slug === slug);

export const compterReferences = (cours: Cours) => cours.references.reduce((n, g) => n + g.references.length, 0);
