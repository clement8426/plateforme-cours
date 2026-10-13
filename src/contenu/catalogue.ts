// Le catalogue de la plateforme : catégories, cours, ressources.
// Pour ajouter un cours, on ajoute une entrée ici ; les pages se génèrent toutes seules.
import type { BlocId } from './blocs';
import { typoProfonde } from './typo';
import sourcesIa from './ia-donnees-sources.json';
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
  scene: 'affiche' | 'tilleul' | 'comparateur' | 'dossier' | 'reidentification';
  comparateur?: string; // pour scene « comparateur » : voir comparateurs.ts
  modeEmploi: string[]; // trois gestes, pour quelqu'un qui découvre la démo seul
  deroule: EtapeDemo[]; // pour le formateur, en direct
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
type RegleGroupe = { nom: string; bloc?: BlocId; adresses: string[] };
const REGLES_GROUPES: RegleGroupe[] = [
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

function grouper(references: Reference[], regles: RegleGroupe[] = REGLES_GROUPES): GroupeReferences[] {
  const restantes = [...references];
  const groupes: GroupeReferences[] = regles.map((regle) => {
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
      resume: 'Une boutique de céramiques très soignée, qui cache douze problèmes d’UX. Trouvez-les en jouant, puis voyez-les corrigés.',
      blocs: ['design-system', 'friction', 'accessibilite', 'comportement', 'microcopie', 'performance'],
      duree: '15 minutes',
      apercu: '/apercus/tilleul.jpg',
      scene: 'tilleul',
      modeEmploi: [
        'En « Sans aide », faites vos courses comme un client. Qu’est-ce qui vous agace ?',
        'Passez en « Mode cours », puis « Chercher les problèmes » : cliquez là où quelque chose vous gêne.',
        'Bloqué ? « Révéler » montre les problèmes de la page, et Avant / Après montre la correction.',
      ],
      deroule: [
        { texte: 'Sans aide, faites le parcours d’un client en pensant à voix haute : accueil, collection, fiche du vase Dune, panier, commande.' },
        { texte: 'Passez en mode cours, puis « Chercher » (touche C) : la salle dit où ça gêne, vous cliquez. Chaque bonne réponse fait apparaître le défaut.' },
        { texte: 'Ce que personne n’a trouvé : « Révéler » (R) le montre. « Visite guidée » (V) parcourt les douze, page par page.' },
        { texte: 'Sur chaque défaut, basculez Avant / Après (touche A) pour montrer la correction en direct.' },
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
      resume: 'Le même formulaire d’adresse, avant et après réparation. Remplissez les deux : sept problèmes ont disparu.',
      blocs: ['design-system', 'friction', 'accessibilite', 'comportement', 'microcopie', 'performance'],
      duree: '12 minutes',
      apercu: '/apercus/demo-formulaire.jpg',
      scene: 'comparateur',
      modeEmploi: [
        'Remplissez le formulaire « Avant » avec une adresse inventée, puis envoyez-le.',
        'Faites pareil avec « Après ». Dans « Rue et numéro », tapez par exemple « Rue du Seyon 10 ».',
        'À droite, ouvrez chaque problème : ce qui gênait, et ce qui a été réparé.',
      ],
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
      resume: 'Deux affiches pour la même promotion, montrées 3 secondes chacune. Laquelle retient-on ?',
      blocs: ['design-system', 'microcopie'],
      duree: '8 minutes',
      apercu: '/apercus/demo-affiche.jpg',
      scene: 'affiche',
      modeEmploi: [
        'Lancez le test : l’affiche apparaît seulement 3 secondes.',
        'Qu’avez-vous retenu ? Quoi, quand, où ?',
        'Révélez l’affiche, puis refaites le test avec l’autre affiche.',
      ],
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

// Le cours « IA, données et responsabilité » : ses sources, rangées du droit suisse aux cas réels.
const REGLES_IA: RegleGroupe[] = [
  { nom: 'Protection des données en Suisse', adresses: ['edoeb', 'fedlex.admin.ch', 'privatim', 'efd.admin'] },
  { nom: 'Droit européen et AI Act', adresses: ['eur-lex', 'edps'] },
  { nom: 'Cloud Act et États-Unis', adresses: ['justice.gov', 'dataprivacyframework', 'village-justice'] },
  { nom: 'Fournisseurs d’IA', adresses: ['anthropic', 'openai', 'infomaniak', 'fedlex.data'] },
  { nom: 'Cas réels', adresses: ['nbcnews', 'punto-informatico'] },
];

const iaDonnees: Cours = {
  slug: 'ia-donnees',
  titre: 'IA, données et responsabilité',
  accroche: 'Ce que l’on peut confier à une IA, ce que l’on ne doit pas lui confier, et ce que l’on risque.',
  duree: 'Environ 1 h 30',
  public: 'Professionnels qui traitent des données de clients, sans prérequis technique',
  objectifs: [
    'Distinguer un chat d’un agent, et savoir où part ce que l’on envoie à une IA.',
    'Reconnaître une donnée personnelle, une donnée sensible et une donnée sous secret.',
    'Savoir qui répond de quoi : AI Act, RGPD, nLPD, secret professionnel, Cloud Act.',
    'Choisir le bon chemin pour chaque donnée : en local, une IA suisse, ou un fournisseur américain.',
  ],
  diapos: { href: '/diapos/ia-donnees/', apercu: '/apercus/ia-donnees-diapos.jpg' },
  parties: [
    { titre: 'Comprendre l’outil', resume: 'Un chat répond, un agent agit. Le trajet d’un prompt, et qui voit quoi selon l’offre.', duree: '19 min', diapos: [1, 8] },
    { titre: 'Que puis-je envoyer ?', resume: 'Donnée personnelle, sensible ou sous secret, l’anonymisation, et les risques propres aux agents.', duree: '18 min', diapos: [9, 14] },
    { titre: 'Et si ça tourne mal ?', resume: 'AI Act, RGPD, nLPD, secret professionnel, Cloud Act : qui est visé, et ce que ça coûte.', duree: '27 min', diapos: [15, 26] },
    { titre: 'Les bons réflexes', resume: 'Trois questions avant d’envoyer, des briques locales et suisses, et le routage selon la sensibilité.', duree: '24 min', diapos: [27, 33], demos: true },
  ],
  demos: [
    {
      slug: 'dossier-mme-fictive',
      titre: 'Le dossier de Mme Fictive : à vous de choisir',
      resume: 'C’est vous qui traitez le dossier : un scan abîmé et une note vocale à transformer en compte rendu. À chaque étape, vos choix allument ou éteignent sept risques.',
      blocs: ['sensible', 'transfert', 'responsabilite'],
      duree: '12 minutes',
      apercu: '/apercus/demo-dossier.jpg',
      scene: 'dossier',
      modeEmploi: [
        'À gauche, choisissez pour chaque étape comment traiter la pièce du dossier.',
        'À droite, les risques s’allument ou s’éteignent. Cliquez sur un risque : la loi, et qui en répond.',
        'À la fin, lisez le compte rendu obtenu. Puis comparez avec « Version sûre ».',
      ],
      deroule: [
        { texte: 'Faites voter la salle à chaque étape, en commençant par le plus rapide : tout dans le chat.' },
        { texte: 'Montrez les risques allumés : ouvrez-en deux ou trois, la loi et qui paie.' },
        { texte: 'Montrez le compte rendu : sans relecture, « genou droit » part chez la cliente.' },
        { texte: 'Cliquez sur « Version sûre » : même nombre de clics, plus aucun risque.' },
        { texte: 'Concluez : l’IA générative n’intervient qu’à la fin, sur du texte.' },
      ],
      aRetenir: [
        'Le résultat est le même, les risques sont très différents.',
        'La version sûre n’est pas forcément plus lente, une fois les briques en place.',
        'L’IA générative n’intervient qu’à la fin, sur du texte.',
      ],
      exercice: '02-dossier-avant-apres',
    },
    {
      slug: 'reidentification',
      titre: 'Retrouver la personne en trois indices',
      resume: 'Un compte rendu dont le nom a été retiré, et l’annuaire public d’une vallée fictive. Retrouvez la personne en cliquant sur les indices, puis réécrivez le texte pour la protéger.',
      blocs: ['personnelles', 'sensible'],
      duree: '8 minutes',
      apercu: '/apercus/demo-reidentification.jpg',
      scene: 'reidentification',
      modeEmploi: [
        'Retrouver : cliquez sur les mots surlignés du compte rendu. Les habitants qui ne correspondent plus s’effacent.',
        'Protéger : rendez chaque indice moins précis, jusqu’à ce qu’au moins cinq personnes correspondent.',
        'Essayez aussi un seul indice : la date suffit, à cause d’un message du club de gym.',
      ],
      deroule: [
        { texte: 'Affichez le compte rendu sans nom : est-il anonyme ? Faites voter la salle.' },
        { texte: 'Cliquez sur les indices proposés par la salle : métier, âge, localité. Il reste une personne au troisième.' },
        { texte: 'Montrez que la date seule suffit : un message public du club de gym.' },
        { texte: 'Passez à « Protéger » : la salle généralise chaque indice jusqu’à cinq personnes possibles.' },
      ],
      aRetenir: [
        'Retirer le nom ne rend pas une donnée anonyme.',
        'Ce sont les indices combinés qui identifient quelqu’un.',
        'Généraliser garde ce qui sert au dossier, et rend la personne introuvable : visez au moins cinq personnes possibles.',
      ],
      exercice: 'bonus-reidentification',
      bonus: true,
    },
  ],
  depot: 'https://github.com/clement8426/ia-donnees-exercices',
  lexique: sourcesIa.lexique,
  references: grouper(sourcesIa.references, REGLES_IA),
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
    cours: [iaDonnees],
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
