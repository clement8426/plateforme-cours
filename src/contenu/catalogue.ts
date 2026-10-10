// Le catalogue de la plateforme : catégories, cours, ressources.
// Pour ajouter un cours, on ajoute une entrée ici ; les pages se génèrent toutes seules.
import type { BlocId } from './blocs';
import { typoProfonde } from './typo';
import sourcesUx from './ux-ia-sources.json';

export type Reference = { titre: string; source: string; url: string };
export type Terme = { terme: string; nom?: string; def: string };
export type GroupeReferences = { nom: string; bloc?: BlocId; references: Reference[] };

export type Exercice = {
  slug: string;
  titre: string;
  resume: string;
  duree: string;
  optionnel?: boolean; // exercice bonus, à passer si le temps manque
  consignes: string[];
  invite?: { titre: string; texte: string }; // texte à copier-coller dans l'assistant IA
  aSavoir?: string[];
  lien?: { texte: string; href: string };
  suite?: { texte: string; href: string };
  telechargement?: { texte: string; href: string; nom: string };
  revelation?: { texte: string; href: string; aide: string }; // à ouvrir après l'exercice : la solution
};

export type Cours = {
  slug: string;
  titre: string;
  accroche: string;
  duree: string;
  public: string;
  objectifs: string[];
  diapos?: { href: string; apercu: string };
  demo?: { titre: string; description: string; href: string; apercu: string };
  comparateurs?: string[]; // pages « avant / après » du cours (voir comparateurs.ts)
  exercices: Exercice[];
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
  { nom: 'Outils d’audit', adresses: ['pa11y', 'developer.chrome'] },
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
  duree: 'Environ 1 h 20, plus 15 minutes en option',
  public: 'Débutants, aucun prérequis technique',
  objectifs: [
    'Distinguer l’UX (le vécu) de l’UI (le visuel).',
    'Repérer les défauts d’un site avec six blocs : design system, friction, accessibilité, analyse comportementale, microcopie, performance perçue.',
    'Comprendre ce qu’un outil d’audit mesure, et ce qu’il ne voit pas.',
    'Utiliser l’IA pour auditer, planifier et corriger, sans oublier les bases.',
  ],
  diapos: { href: '/diapos/ux-ia.html', apercu: '/apercus/ux-ia-diapos.jpg' },
  demo: {
    titre: 'Tilleul, la boutique piégée',
    description: 'Une boutique de céramiques très soignée, avec douze défauts d’UX. Le mode cours les révèle un par un, explique pourquoi ils gênent, et les corrige en direct.',
    href: '/tilleul/',
    apercu: '/apercus/tilleul.jpg',
  },
  comparateurs: ['formulaire-adresse'],
  exercices: [
    {
      slug: 'reperer-les-defauts',
      titre: 'Repérer les défauts d’un site e-commerce',
      resume: 'Faites vos courses sur Tilleul sans aide, notez tout ce qui vous gêne, puis comparez avec le mode cours.',
      duree: '15 minutes',
      consignes: [
        'Ouvrez Tilleul sans le mode cours.',
        'Faites le parcours d’un client : accueil, collection, fiche produit, ajout au panier, panier, commande.',
        'Notez chaque moment où vous hésitez, attendez ou vous trompez, et classez-le dans l’un des six blocs.',
        'Refaites une partie du parcours au clavier seulement, avec la touche Tab.',
        'Ouvrez enfin le mode cours : combien des douze défauts aviez-vous trouvés ?',
      ],
      lien: { texte: 'Ouvrir Tilleul sans aide', href: '/tilleul/?cours=non' },
      suite: { texte: 'Voir la révélation (mode cours)', href: '/tilleul/' },
    },
    {
      slug: 'affiche-promo',
      titre: 'Créer une affiche promo',
      resume: 'Une affiche A4 n’a pas de deuxième chance : tout doit se lire d’un coup d’œil.',
      duree: '8 minutes',
      consignes: [
        'Créez une affiche A4 pour la promotion annoncée par votre formateur.',
        'Trois informations sont obligatoires : quoi, quand, où.',
        'Ne gardez que l’information réellement nécessaire.',
        'Outil libre : papier, Canva, Figma ou une IA générative.',
        'En groupe, comparez ce qui se lit en premier sur chaque affiche.',
      ],
    },
    {
      slug: 'formulaire-adresse',
      titre: 'Réparer un formulaire d’adresse',
      resume: 'Un formulaire d’adresse très soigné cache un défaut par bloc du cours. Remplissez-le, notez ce qui gêne, puis faites-le corriger par l’IA.',
      duree: '14 minutes',
      optionnel: true,
      consignes: [
        'Remplissez le formulaire, chrono lancé, avec une adresse fictive en Suisse. Ne mettez pas vos vraies coordonnées.',
        'Notez tout ce qui vous gêne, même un détail : ce qui ralentit, ce qui fait douter, ce qui énerve. L’écran est soigné : cherchez ailleurs.',
        'Corrigez avec l’IA : donnez le dossier à votre assistant (Claude, ChatGPT, Codex…) et demandez-lui de corriger ce que vous avez repéré, défaut par défaut.',
        'Dernière étape, l’autocomplétion : demandez à l’assistant d’ajouter les suggestions d’adresse, avec l’invite ci-dessous.',
      ],
      invite: {
        titre: 'Invite pour l’autocomplétion',
        texte: 'Ajoute l’autocomplétion d’adresse sur le champ « Rue et numéro » avec l’API Photon (https://photon.komoot.io/api/), gratuite et sans clé. Limite les résultats à la Suisse, attends 300 ms après la dernière frappe et 3 caractères minimum avant de chercher, propose 5 adresses au plus, remplis le NPA et la localité au clic, rends la liste utilisable au clavier, garde la saisie manuelle possible si rien ne convient, et affiche l’attribution « © contributeurs OpenStreetMap ».',
      },
      aSavoir: [
        'Le serveur public de Photon est gratuit pour un usage raisonnable : pas de recherche à chaque frappe sans délai.',
        'L’autocomplétion envoie ce que vous tapez à un service tiers : c’est pourquoi l’adresse doit être fictive.',
        'Le formulaire de départ, lui, n’envoie aucune donnée.',
      ],
      lien: { texte: 'Ouvrir le formulaire', href: '/formulaires/adresse/' },
      telechargement: { texte: 'Télécharger le dossier à donner à l’IA', href: '/telechargements/formulaire-adresse.zip', nom: 'formulaire-adresse.zip' },
      revelation: {
        texte: 'Comparer avec la version réparée',
        href: '/ux/ux-ia/comparer/formulaire-adresse/',
        aide: 'À ouvrir après l’exercice : le formulaire avant et après, avec les sept défauts expliqués.',
      },
    },
  ],
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

export const compterReferences = (cours: Cours) => cours.references.reduce((n, g) => n + g.references.length, 0);
