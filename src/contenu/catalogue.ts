// Le catalogue de la plateforme : catégories, cours, ressources.
// Pour ajouter un cours, on ajoute une entrée ici ; les pages se génèrent toutes seules.
import type { BlocId } from './blocs';
import { typoProfonde } from './typo';
import sourcesIa from './ia-donnees-sources.json';
import sourcesUx from './ux-ia-sources.json';
import sourcesTypes from './types-ia-sources.json';

export type Reference = { titre: string; source: string; url: string };
export type Terme = { terme: string; nom?: string; def: string };
export type GroupeReferences = { nom: string; bloc?: BlocId; references: Reference[] };

// Une démonstration : une scène interactive, avec son mode d'emploi. Les notes du formateur ne sont pas sur le site.
// L'exercice à refaire chez soi est dans le dépôt GitHub du cours (champ « exercice » : le dossier).
export type Demo = {
  slug: string;
  titre: string;
  resume: string;
  blocs: BlocId[];
  duree: string;
  apercu: string;
  scene: 'affiche' | 'escale' | 'traverse' | 'comparateur' | 'dossier' | 'reidentification' | 'tri';
  comparateur?: string; // pour scene « comparateur » : voir comparateurs.ts
  modeEmploi: string[]; // trois gestes, pour quelqu'un qui découvre la démo seul
  aRetenir: string[];
  exercice: string;
  exerciceUrl?: string; // un exercice peut vivre dans un dépôt distinct de celui du cours
  bonus?: boolean; // à montrer seulement s'il reste du temps
  indisponible?: boolean; // carte visible, sans lien vers l'exercice
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
  misAJour?: string; // date de la dernière modification, AAAA-MM-JJ
  enPreparation?: boolean; // annoncé : une page de présentation seulement, sans diapos ni démonstrations
  // Un exercice hors du site : une application à installer. Un prototype le dit, avec ses conditions.
  exercice?: { titre: string; resume: string; prototype: string; conditions: string[]; lien?: string; tuto?: { href: string; titre: string; parties: { titre: string; diapo: number }[] } };
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
  { nom: 'Friction : décider et atteindre', bloc: 'friction', adresses: ['lawsofux.com', 'baymard.com', 'centercentre', 'nngroup.com/articles/why'] },
  // Avant « Accessibilité » : l'adresse du motif combobox (W3C) y serait sinon rangée par « w3.org ».
  { nom: 'Formulaires et autocomplétion', adresses: ['github.com/komoot', 'w3.org/WAI/ARIA'] },
  { nom: 'Accessibilité et obligations légales', bloc: 'accessibilite', adresses: ['w3.org', 'eur-lex', 'economie.gouv', 'francenum.gouv', 'gesetze-im-internet', 'ris.bka', 'agid.gov', 'dlapiper', 'universaldesign.ie', 'irishstatutebook.ie', 'ebgb.admin'] },
  { nom: 'Performance perçue et émotion', bloc: 'performance', adresses: ['uxmag', 'umich', 'nngroup.com/articles/visibility-system-status', 'cnbc', 'wikipedia'] },
  { nom: 'Outils d’audit', adresses: ['pa11y', 'developer.chrome', 'unlighthouse', 'learn.microsoft.com/en-us/clarity'] },
  { nom: 'Agents IA et MCP', adresses: ['support.claude.com', 'learn.chatgpt.com', 'modelcontextprotocol', 'playwright.dev', 'chrome-devtools-mcp', 'clarity.microsoft', 'arxiv.org'] },
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
  misAJour: '2026-10-22',
  titre: 'UX × IA',
  accroche: 'Rendre un site web, une boutique en ligne, un SaaS ou une application mobile pratique, puis le corriger avec l’IA.',
  duree: 'Environ 1 h 30, selon les démonstrations choisies',
  public: 'Débutants, aucun prérequis technique',
  objectifs: [
    'Comprendre comment l’interface (UI) contribue à l’expérience vécue (UX).',
    'Repérer les défauts d’un site avec six blocs : design system, friction, accessibilité, analyse comportementale, microcopie, performances réelle et perçue.',
    'Comprendre ce qu’un outil d’audit mesure, et ce qu’il ne voit pas.',
    'Préparer un agent avec un objectif, un périmètre et des outils, puis vérifier ses résultats.',
  ],
  diapos: { href: '/diapos/ux-ia/', apercu: '/apercus/ux-ia-diapos.jpg' },
  parties: [
    { titre: 'Théorie', resume: 'Joli ne veut pas dire pratique : quatre types de produits, la cible, le tunnel de conversion, et six blocs pour repérer ce qui gêne.', duree: '35 à 40 min', diapos: [1, 22] },
    { titre: 'L’IA, bloc par bloc', resume: 'Reprendre les six blocs avec l’IA : des outils concrets, des demandes à adapter et des preuves à vérifier. Exemples de site vitrine, d’application métier et de formulaires.', duree: '18 à 20 min avec les échanges', diapos: [23, 31] },
    { titre: 'Pratique', resume: 'Escale : observer cinq blocs sur une boutique fictive, découvrir les preuves avec les outils, puis retrouver les prompts pour les agents. Le comportement reste théorique ; le formulaire d’adresse reste en bonus.', duree: 'Environ 25 minutes, hors bonus', diapos: [32, 45], demos: true },
  ],
  demos: [
    {
      slug: 'escale',
      titre: 'Escale : les outils UX en pratique',
      resume: 'Une boutique fictive de 18 produits : repérer les défauts, comparer les corrections et découvrir les outils à la main, puis avec un agent.',
      blocs: ['design-system', 'friction', 'accessibilite', 'microcopie', 'performance'],
      duree: 'Environ 25 minutes',
      apercu: '/diapos/ux-ia/preuves/escale/boutique.png',
      scene: 'escale',
      modeEmploi: [
        'Suivez la mission sur Escale : choisir Le Week-end, renseigner les coordonnées, confirmer puis annuler la commande fictive.',
        'Dans les slides, comparez avant/après, consultez la preuve de l’outil et ouvrez les gestes manuels détaillés.',
        'Pour prolonger la démonstration, donnez le prompt du bloc à un agent équipé et travaillez sur une copie du projet.',
      ],
      aRetenir: [
        'Le panneau applique des corrections préparées ; il ne fait pas intervenir un agent.',
        'Un contrôle doit montrer le problème et sa preuve, puis vérifier le même scénario après correction.',
        'Le comportement reste théorique : aucun taux d’abandon ni faux résultat de visiteurs.',
        'Un scan automatique ne suffit pas à vérifier toute l’accessibilité.',
      ],
      exercice: 'exercices/escale',
      exerciceUrl: 'https://github.com/clement8426/labo-ux-demos/tree/main/exercices/escale',
    },
    {
      slug: 'formulaire-adresse',
      titre: 'Le formulaire d’adresse, avant et après',
      resume: 'Comparez deux versions du même formulaire : six corrections pour mieux saisir et corriger ses informations, plus des suggestions pour compléter l’adresse.',
      blocs: ['design-system', 'friction', 'accessibilite', 'comportement', 'microcopie', 'performance'],
      duree: '14 minutes',
      apercu: '/apercus/demo-formulaire.jpg',
      scene: 'comparateur',
      modeEmploi: [
        'Envoyez le formulaire vide, puis saisissez un e-mail incomplet. Repérez ce qui vous empêche de comprendre et de corriger les erreurs.',
        'Refaites ces essais dans « Après ». Puis cherchez « Rue du Seyon 10 » et choisissez une suggestion : le NPA et la localité se complètent.',
        'Ouvrez une correction dans « Ce qui change », puis utilisez « Montrer dans le formulaire » pour voir les éléments concernés. « Les deux » permet de comparer sans perdre votre saisie.',
      ],
      comparateur: 'formulaire-adresse',
      aRetenir: [
        'Un formulaire joli peut cacher plusieurs défauts.',
        'Le navigateur sait remplir une adresse, si on le laisse faire.',
        'Une erreur dit quoi corriger, en toutes lettres, pas seulement en rouge.',
      ],
      exercice: '02-formulaire-adresse',
      bonus: true,
    },
    {
      slug: 'affiche',
      titre: 'L’affiche qui se lit en 3 secondes',
      indisponible: true,
      resume: 'Deux affiches pour le même événement, la Grande Soupe d’automne, montrées 3 secondes chacune. Laquelle retient-on ?',
      blocs: ['design-system', 'microcopie'],
      duree: '8 minutes',
      apercu: '/apercus/demo-affiche.jpg',
      scene: 'affiche',
      modeEmploi: [
        'Lancez le test : l’affiche apparaît seulement 3 secondes.',
        'Qu’avez-vous retenu ? Quoi, quand, où ?',
        'Révélez l’affiche, puis refaites le test avec l’autre affiche.',
      ],
      aRetenir: [
        'Trois informations, pas une de plus : quoi, quand, où.',
        'Une seule chose en très grand : l’œil sait par où commencer.',
        'Une image générée peut être retouchée, mais elle ne sépare pas le texte et les objets comme une maquette. Un agent relié à Penpot construit une affiche modifiable.',
      ],
      exercice: 'bonus-affiche',
      bonus: true,
    },
  ],
  depot: 'https://github.com/clement8426/le-labo/tree/main/ux/ux-ia',
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

// Le cours « Les types d'IA » : ses sources, de l'histoire aux outils libres.
const REGLES_TYPES: RegleGroupe[] = [
  { nom: 'Avant ChatGPT : les grandes étapes', adresses: ['cse.msu.edu', 'Kurzweil', 'ibm.com', 'paulgraham', 'papers.nips', 'research.google', 'deepl.com'] },
  { nom: 'Lire, voir, écouter, parler : des outils libres', adresses: ['wikipedia.org/wiki/Reconnaissance', 'tesseract', 'facebookresearch', 'openai/whisper', 'alphacephei', 'OHF-Voice'] },
  { nom: 'Générer des images', adresses: ['2006.11239', 'stability.ai'] },
  { nom: 'Les LLM', adresses: ['1706.03762', 'cdn.openai.com', '2005.14165', 'openai.com/index'] },
  { nom: 'La loi suisse', adresses: ['fedlex.admin.ch'] },
];

const typesIa: Cours = {
  slug: 'types-ia',
  misAJour: '2026-10-18',
  titre: 'Les types d’IA',
  accroche: 'OCR, vision, voix, traduction, images, LLM : l’IA existait bien avant ChatGPT. Chaque famille a son entrée, sa sortie et ses limites.',
  duree: 'Environ 1 h, plus l’exercice du Harnais',
  public: 'Débutants, aucun prérequis technique',
  objectifs: [
    'Situer les grandes étapes de l’IA depuis 1950 : elle ne commence pas avec ChatGPT.',
    'Reconnaître les familles d’IA par leur entrée et leur sortie : OCR, vision, description d’image, transcription, synthèse vocale, traduction, génération d’images, LLM.',
    'Comprendre ce qu’est un LLM : un modèle qui prédit la suite d’un texte, avec ses forces et ses limites.',
    'Choisir entre une IA spécialisée et un LLM, et les combiner : les sens sur l’ordinateur, le LLM pour rédiger.',
  ],
  diapos: { href: '/diapos/types-ia/', apercu: '/apercus/types-ia-diapos.jpg' },
  parties: [
    { titre: 'L’IA avant ChatGPT', resume: 'Ce qu’est une IA, plus de soixante-dix ans d’histoire, et l’idée clé : une entrée, une sortie.', duree: '15 min', diapos: [1, 6] },
    { titre: 'Les familles d’IA', resume: 'OCR, vision, description d’image, transcription, synthèse vocale, traduction, génération d’images : ce que chacune fait, et où elle se trompe.', duree: '25 min', diapos: [7, 15] },
    { titre: 'Les LLM', resume: 'Prédire le mot suivant, le Transformer, les forces et les limites, et comment combiner un LLM avec les autres IA.', duree: '15 min', diapos: [16, 21] },
    { titre: 'Pratique', resume: 'Donner des sens à une IA avec Le Harnais : dicter, écouter, lire un scan, voir une image.', duree: '5 min, puis l’exercice', diapos: [22, 23] },
  ],
  demos: [],
  exercice: {
    titre: 'Le Harnais',
    resume: 'Une surcouche d’OpenCode (licence MIT) pour comprendre comment fonctionne un harnais, en le manipulant. Une application de bureau où votre IA arrive sans aucun outil. Vous débloquez la dictée, la lecture à voix haute, la lecture d’un scan et la reconnaissance d’images en vous en servant, puis le terminal, le navigateur et les connecteurs. OCR, dictée et détection sont locales dans ce parcours ; leurs textes peuvent partir vers le modèle. La lecture vocale peut utiliser un service distant.',
    prototype: 'Le Harnais est un prototype, pas un produit fini : version 0.1.0 en bêta, des défauts sont possibles, sans garantie ni assistance. Utilisez des données fictives uniquement. C’est une surcouche d’OpenCode : l’application est celle d’OpenCode, avec des missions par-dessus. Ce n’est pas un produit officiel d’OpenCode.',
    conditions: [
      'Windows 10 ou 11 (64 bits) seulement. Pas de macOS, pas de Linux.',
      'Application non signée : Windows 11 peut la bloquer.',
      'Environ 0,9 Go à télécharger, puis les modèles de voix et d’image à la première utilisation (environ 3 Go sur le disque, 8 Go de mémoire conseillés).',
      'Une IA à brancher : un abonnement ChatGPT ou une clé d’API. Dans cette version, Claude se configure par API ; les options gratuites d’OpenCode peuvent échouer. Consultez le guide du prototype.',
      'Pas de mise à jour automatique : pour mettre à jour, on relance l’installateur.',
    ],
    lien: 'https://github.com/clement8426/le-harnais',
    tuto: {
      href: '/diapos/harnais/',
      titre: 'Le tuto, pas à pas',
      parties: [
        { titre: 'Comprendre', diapo: 1 },
        { titre: 'Installer et démarrer', diapo: 6 },
        { titre: 'Les missions', diapo: 15 },
        { titre: 'Quand ça ne marche pas', diapo: 28 },
      ],
    },
  },
  lexique: sourcesTypes.lexique,
  references: grouper(sourcesTypes.references, REGLES_TYPES),
};

const iaDonnees: Cours = {
  slug: 'ia-donnees',
  misAJour: '2026-10-18',
  titre: 'IA, données et responsabilité',
  accroche: 'Ce que l’on peut confier à une IA, ce que l’on ne doit pas lui confier, et ce que l’on risque.',
  duree: 'Environ 1 h 30',
  public: 'Professionnels qui traitent des données de clients, sans prérequis technique',
  objectifs: [
    'Distinguer un chat d’un agent, et savoir où part ce que l’on envoie à une IA.',
    'Reconnaître une donnée personnelle, une donnée sensible et une donnée sous secret.',
    'Savoir qui répond de quoi : AI Act, RGPD, nLPD, secret professionnel, Cloud Act.',
    'Choisir un traitement adapté à la donnée : local maîtrisé ou prestataire validé, selon les accès, le contrat et le secret.',
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
      slug: 'dossier-exemple',
      titre: 'Le dossier Exemple : à vous de choisir',
      resume: 'C’est vous qui traitez le dossier : un scan abîmé et une note vocale à transformer en compte rendu. À chaque étape, vos choix allument ou éteignent sept risques.',
      blocs: ['sensible', 'transfert', 'responsabilite'],
      duree: '12 minutes',
      apercu: '/apercus/demo-dossier.jpg',
      scene: 'dossier',
      modeEmploi: [
        'Pour chaque étape, choisissez comment traiter la pièce du dossier.',
        'Dans « Ce que vous risquez », les risques s’allument ou s’éteignent. Cliquez sur un risque : la loi, et qui en répond.',
        'À la fin, lisez le compte rendu obtenu. Puis, avec « Comparer avec », comparez le parcours sans précautions et celui avec précautions.',
      ],
      aRetenir: [
        'Le résultat est le même, les risques sont très différents.',
        'Le parcours avec précautions réduit les risques dans les conditions de cette simulation, sans garantie de risque nul.',
        'L’IA générative n’intervient qu’à la fin, sur du texte.',
      ],
      exercice: '02-dossier-exemple',
    },
    {
      slug: 'puis-je-l-envoyer',
      titre: 'Puis-je l’envoyer à une IA ?',
      resume: 'Douze fichiers de l’étude : un PDF, des tableurs, une photo, un audio, une capture d’écran. Pour chacun, trois questions, et la couleur tombe : vert, orange ou rouge.',
      blocs: ['sensible', 'personnelles', 'transfert'],
      duree: '15 minutes',
      apercu: '/apercus/demo-tri.jpg',
      scene: 'tri',
      modeEmploi: [
        'Choisissez un fichier dans la liste. Regardez ce qu’il contient, et ce que vous voulez en faire.',
        'Répondez aux trois questions, dans l’ordre. La couleur tombe, avec l’outil qui convient.',
        'Comparez avec la réponse attendue, puis passez au fichier suivant. Chaque fichier se télécharge.',
      ],
      aRetenir: [
        'Le format ne compte pas : PDF, tableur, photo ou audio, c’est le contenu qui décide.',
        'Une seule colonne, ou un détail à l’arrière-plan d’une capture, peut faire passer un fichier au rouge.',
        'Trois questions, toujours dans le même ordre : sensible ou secret ? réservé ou personnel ? anonymisable ?',
      ],
      exercice: '03-puis-je-l-envoyer',
    },
    {
      slug: 'reidentification',
      titre: 'Retrouver la personne en trois indices',
      resume: 'Un compte rendu dont le nom a été retiré, et un annuaire public du canton de Neuchâtel, aux habitants fictifs. Retrouvez la personne en cliquant sur les indices, puis réécrivez le texte pour la protéger.',
      blocs: ['personnelles', 'sensible'],
      duree: '8 minutes',
      apercu: '/apercus/demo-reidentification.jpg',
      scene: 'reidentification',
      modeEmploi: [
        'Retrouver : cliquez sur les mots surlignés du compte rendu. Les habitants qui ne correspondent plus s’effacent.',
        'Protéger : rendez chaque indice moins précis, jusqu’à ce qu’au moins cinq personnes correspondent. Le genre aussi est un indice : « la patiente » écarte tous les hommes.',
        'Essayez aussi un seul indice : la date suffit, à cause d’un message du club de gym.',
      ],
      aRetenir: [
        'Retirer le nom ne rend pas une donnée anonyme.',
        'Ce sont les indices combinés qui identifient quelqu’un.',
        'Généraliser réduit les indices distinctifs. Cinq profils est l’objectif de ce jeu, sans garantie d’anonymat dans le monde réel.',
      ],
      exercice: 'bonus-reidentification',
      bonus: true,
    },
  ],
  depot: 'https://github.com/clement8426/le-labo/tree/main/ia-legislation/ia-donnees',
  lexique: sourcesIa.lexique,
  references: grouper(sourcesIa.references, REGLES_IA),
};

// Les cours annoncés : seule leur page de présentation est en ligne.
const iaSouveraine: Cours = {
  slug: 'ia-souveraine',
  titre: 'Débuter avec une IA souveraine',
  accroche: 'Utiliser l’IA sans que vos données partent aux États-Unis : un outil au choix, branché sur un modèle hébergé en Suisse ou sur votre ordinateur.',
  duree: 'À venir',
  public: 'Débutants, et professionnels qui traitent des données sensibles : santé, droit, finances',
  objectifs: [
    'Distinguer le harnais (l’application ou l’agent que vous utilisez) du modèle qui répond derrière.',
    'Comparer abonnement, API et modèle local : qui reçoit vos données, et sous quelle loi. Une API américaine reste soumise au Cloud Act : ce qui compte, c’est le fournisseur.',
    'Brancher un harnais ouvert sur une API hébergée en Suisse, ou sur un modèle qui tourne sur votre ordinateur.',
    'Savoir ce qu’il faut en plus pour des données médicales : un contrat, le secret professionnel, une relecture humaine.',
  ],
  parties: [],
  demos: [],
  lexique: [],
  references: [],
  enPreparation: true,
};


const appSuisse: Cours = {
  slug: 'app-hebergee-suisse',
  titre: 'Une app web et mobile, hébergée en Suisse',
  accroche: 'Construire une application web et mobile sur votre propre serveur en Suisse : vous choisissez où les données sont traitées, en vérifiant aussi les prestataires, leurs juridictions et les sous-traitants.',
  duree: 'À venir',
  public: 'Personnes qui développent, ou qui veulent comprendre où vont les données de leur application',
  objectifs: [
    'Comprendre ce que change le lieu d’hébergement : nLPD, RGPD et Cloud Act.',
    'Installer Supabase (base de données, comptes, fichiers) sur un serveur privé chez Infomaniak.',
    'Brancher une application web et une application mobile sur ce serveur.',
    'Sécuriser, mettre à jour et sauvegarder ce serveur soi-même.',
  ],
  parties: [],
  demos: [],
  lexique: [],
  references: [],
  enPreparation: true,
};

const wordpressBoutique: Cours = {
  slug: 'wordpress-e-commerce',
  titre: 'Une boutique en ligne avec WordPress',
  accroche: 'Pourquoi WordPress plutôt qu’un abonnement Shopify ou un site généré par Lovable, maintenant que l’IA aide à construire la boutique.',
  duree: 'À venir',
  public: 'Commerçants, indépendants, et toute personne qui veut vendre en ligne',
  objectifs: [
    'Comparer le vrai coût sur trois ans : abonnement, commissions, extensions, hébergement.',
    'Savoir à qui appartiennent la boutique et ses données, selon la solution choisie.',
    'Construire une boutique WordPress et WooCommerce avec l’aide de l’IA.',
    'Connaître ce que cela demande ensuite : mises à jour, sécurité, maintenance.',
  ],
  parties: [],
  demos: [],
  lexique: [],
  references: [],
  enPreparation: true,
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
    slug: 'comprendre-ia',
    nom: 'Comprendre l’IA',
    court: 'Comprendre l’IA',
    description: 'Ce qu’est une IA, ses grandes familles et leurs limites, avant de s’en servir.',
    cours: [typesIa],
  },
  {
    slug: 'ia-legislation',
    nom: 'IA : obligations et législation',
    court: 'IA et législation',
    description: 'Ce que l’on peut confier à une IA, ce que la loi demande, et comment l’utiliser sans que les données partent aux États-Unis.',
    cours: [iaDonnees, iaSouveraine],
  },
  {
    slug: 'developpement',
    nom: 'Développement et hébergement',
    court: 'Développement',
    description: 'Construire des sites et des applications, et choisir où les héberger : coût, données, indépendance.',
    cours: [appSuisse, wordpressBoutique],
  },
]);

export const trouverCategorie = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const trouverCours = (categorie: string, cours: string) => trouverCategorie(categorie)?.cours.find((c) => c.slug === cours);

// Le premier cours disponible : celui que l'accueil met en avant.
export const premierCours = () => {
  for (const categorie of CATEGORIES) {
    const cours = categorie.cours.find((c) => !c.enPreparation);
    if (cours) return { categorie, cours };
  }
  return null;
};

export const trouverDemo = (cours: Cours, slug: string) => cours.demos.find((d) => d.slug === slug);

export const compterReferences = (cours: Cours) => cours.references.reduce((n, g) => n + g.references.length, 0);
