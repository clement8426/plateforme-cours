// Les pages de comparaison « version de départ / version réparée ».
// Chaque défaut est rattaché à un bloc du cours, avec ce qu'on vit, ce qui est réparé, pourquoi, et ce que mesure l'outil d'audit.
// Les sélecteurs (« cibles ») servent à surligner les éléments concernés dans chaque version.
import type { BlocId } from './blocs';
import { typoProfonde } from './typo';

export type DefautComparateur = {
  id: string;
  bloc: BlocId;
  titre: string;
  depart: string;
  repare: string;
  pourquoi: string;
  essayer: string;
  outil: string;
  lien?: { texte: string; url: string };
  cibles: { depart: string[]; repare: string[] };
};

export type Comparateur = {
  slug: string;
  titre: string;
  accroche: string;
  versions: { depart: string; repare: string };
  titreFormulaire: string;
  etapes: string[];
  defauts: DefautComparateur[];
};

const formulaireAdresse: Comparateur = {
  slug: 'formulaire-adresse',
  titre: 'Le formulaire d’adresse, avant et après',
  accroche: 'Le même formulaire, deux versions. Basculez de l’une à l’autre, remplissez-les, et ouvrez chaque défaut pour comprendre ce qui a été réparé.',
  versions: {
    depart: '/comparateur/formulaire-adresse/casse/',
    repare: '/comparateur/formulaire-adresse/corrige/',
  },
  titreFormulaire: 'Atelier Rayon, adresse de livraison',
  etapes: [
    'Remplissez la version de départ avec une adresse fictive, puis envoyez-la : qu’est-ce qui vous gêne ?',
    'Passez à la version réparée et refaites la même chose. Tapez « Rue du Seyon 10 » dans « Rue et numéro » pour voir l’autocomplétion.',
    'Ouvrez chaque défaut de la liste : « Montrer dans le formulaire » surligne l’élément concerné dans la version affichée.',
  ],
  defauts: [
    {
      id: 'champs',
      bloc: 'design-system',
      titre: 'Quatre styles de champs pour une seule idée',
      depart: 'Les champs ont quatre hauteurs (de 40 à 52 px), quatre arrondis (de 0 à 14 px) et trois largeurs. Rien n’est faux pris seul, mais l’ensemble paraît bricolé.',
      repare: 'Un seul jeu de variables de style (hauteur, arrondi) pour tous les champs, et des largeurs calées sur une grille.',
      pourquoi: 'Un design system rend la cohérence réutilisable : un même rôle, un même style. Sinon chaque champ semble venir d’un autre site, et l’œil doit se réadapter à chacun.',
      essayer: 'Comparez les bords des champs : alignés et identiques d’un côté, tous différents de l’autre.',
      outil: 'Mesuré : 4 styles de champs différents (hauteurs et arrondis), 0 sur la version réparée.',
      lien: { texte: 'Cohérence et standards, Nielsen Norman Group', url: 'https://www.nngroup.com/articles/consistency-and-standards/' },
      cibles: { depart: ['input'], repare: ['input'] },
    },
    {
      id: 'remplissage',
      bloc: 'friction',
      titre: 'Un formulaire qui ne se remplit pas tout seul',
      depart: 'La saisie automatique du navigateur est coupée (autocomplete="off"), il faut tout retaper. Le NPA et la localité sont demandés avant la rue. Le NPA et le téléphone n’ouvrent pas le clavier numérique sur mobile.',
      repare: 'L’ordre naturel d’une adresse (rue, complément, NPA, localité), des attributs autocomplete précis sur chaque champ, et inputmode="numeric" pour le NPA.',
      pourquoi: 'Chaque caractère à retaper est une chance d’abandonner. Le navigateur sait remplir une adresse en un clic, à condition qu’on le laisse faire et qu’on lui dise quel champ est quoi.',
      essayer: 'Sur un téléphone, touchez le NPA de chaque version : le clavier n’est pas le même. Dans la version de départ, notez l’ordre des champs.',
      outil: 'Mesuré : saisie automatique bloquée sur 8 champs, 3 champs sans le bon clavier mobile (e-mail, téléphone, NPA). À juger : l’ordre NPA avant la rue.',
      lien: { texte: 'WCAG 2.2, identifier la finalité d’un champ', url: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html' },
      cibles: { depart: ['input[name="npa"]', 'input[name="localite"]', 'input[name="rue"]'], repare: ['#rue', '#npa', '#localite'] },
    },
    {
      id: 'autocompletion',
      bloc: 'friction',
      titre: 'L’autocomplétion : de l’UX qui demande du code',
      depart: 'Aucune aide pour saisir la rue : tout se tape à la main, sans savoir si l’adresse existe.',
      repare: 'Des suggestions d’adresse apparaissent après 3 caractères et une pause de 300 ms. Elles se parcourent au clavier, remplissent le NPA et la localité au clic, et la saisie manuelle reste possible.',
      pourquoi: 'C’est le gain le plus visible, mais ce n’est plus un travail de designer : il faut un service d’adresses, des délais, la navigation au clavier. L’UX dépasse l’UI.',
      essayer: 'Dans la version réparée, tapez « Rue du Seyon 10 », puis choisissez avec les flèches et Entrée. Les suggestions sont simulées ici ; la case sous le formulaire active le vrai service.',
      outil: 'Ne se mesure pas de façon générale : l’outil ne voit pas une fonction absente. C’est une personne qui la remarque.',
      lien: { texte: 'Motif « combobox », WAI-ARIA', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/' },
      cibles: { depart: ['input[name="rue"]'], repare: ['#rue'] },
    },
    {
      id: 'textes',
      bloc: 'microcopie',
      titre: 'Des textes qui ne disent pas quoi faire',
      depart: 'Le bouton dit « Soumettre ». L’erreur dit « Erreur champ 1 ». Les étiquettes sont des textes indicatifs qui disparaissent dès qu’on tape : on oublie ce qu’on était en train de remplir.',
      repare: 'Le bouton dit « Valider l’adresse de livraison ». Chaque erreur dit quoi corriger, avec un exemple. Les étiquettes restent visibles au-dessus des champs.',
      pourquoi: 'Les petits textes font la vente. Un bouton dit ce qui va se passer, une erreur dit quoi corriger. Un texte indicatif n’est pas une étiquette : il disparaît au moment où l’on en a besoin.',
      essayer: 'Envoyez chaque version à vide, puis tapez dans un champ de la version de départ : le texte indicatif disparaît.',
      outil: 'Mesuré : 6 champs dont la seule étiquette est un texte indicatif. À juger, à partir des textes extraits : « Soumettre » et « Erreur champ N ».',
      lien: { texte: 'WCAG 2.2, étiquettes ou instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html' },
      cibles: { depart: ['button[type="submit"]', 'input[placeholder]'], repare: ['#envoyer', 'label'] },
    },
    {
      id: 'accessibilite',
      bloc: 'accessibilite',
      titre: 'Des étiquettes non reliées, des erreurs rouges et muettes',
      depart: 'Les étiquettes « Prénom » et « Nom » ne sont pas reliées à leur champ : un lecteur d’écran ne les annonce pas. Un champ en erreur change seulement de bordure : sans texte, et invisible pour qui ne distingue pas le rouge.',
      repare: 'Chaque étiquette est reliée (for/id). L’erreur est écrite sous le champ, avec une icône, et annoncée aux lecteurs d’écran (aria-invalid, aria-describedby). Un résumé des erreurs, avec des liens, apparaît en haut.',
      pourquoi: 'Environ une personne sur cinq vit avec un handicap. Ne dire une erreur que par la couleur exclut celles et ceux qui ne la voient pas. Un lecteur d’écran ne devine pas à quoi sert un champ sans étiquette.',
      essayer: 'Envoyez les deux versions à vide : comparez comment les champs en erreur sont signalés.',
      outil: 'Mesuré : 2 champs sans libellé relié (axe), 7 champs signalés par la couleur seule. 0 sur la version réparée.',
      lien: { texte: 'WCAG 2.2, ne pas utiliser la couleur seule', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html' },
      cibles: { depart: ['label', 'input[name="prenom"]', 'input[name="nom"]'], repare: ['label', '.erreur', '#resume'] },
    },
    {
      id: 'attente',
      bloc: 'performance',
      titre: '1,8 seconde de silence après l’envoi',
      depart: 'On clique sur « Soumettre » : rien ne bouge pendant près de deux secondes. On reclique, au cas où.',
      repare: 'Le bouton passe aussitôt à « Envoi en cours… », un indicateur tourne, et un second clic est bloqué.',
      pourquoi: 'Le système doit toujours dire ce qu’il fait. Sans retour, la personne doute et recommence, ce qui crée des erreurs. Le temps d’attente est le même : c’est la sensation qui change.',
      essayer: 'Remplissez correctement chaque version et envoyez-la : regardez le bouton pendant l’attente.',
      outil: 'Mesuré : aucun retour visible pendant 1,82 s après le clic sur « Soumettre ». Sur la version réparée, le retour est immédiat.',
      lien: { texte: 'Visibilité de l’état du système, Nielsen Norman Group', url: 'https://www.nngroup.com/articles/visibility-system-status/' },
      cibles: { depart: ['button[type="submit"]'], repare: ['#envoyer'] },
    },
    {
      id: 'verification',
      bloc: 'comportement',
      titre: 'On découvre toutes les erreurs d’un coup, à la fin',
      depart: 'Rien n’est vérifié avant l’envoi : on remplit tout, puis on apprend qu’un e-mail ou un NPA était faux.',
      repare: 'Chaque champ est vérifié quand on le quitte, sans gêner la frappe, et le message disparaît dès qu’on corrige.',
      pourquoi: 'Corriger tout de suite, quand on a encore le champ en tête, coûte moins qu’à la fin. Ce que les gens font vraiment se voit dans les enregistrements de sessions, une fois le site en ligne : on y repère où ils s’arrêtent.',
      essayer: 'Tapez « x » dans « E-mail », puis passez au champ suivant, dans chaque version.',
      outil: 'À juger, c’est un indice : aucune vérification à la sortie du champ « E-mail » sur la version de départ. L’abandon réel ne se mesure qu’avec de vraies sessions : l’outil ne l’invente pas.',
      lien: { texte: 'WCAG 2.2, identifier les erreurs', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html' },
      cibles: { depart: ['input[name="email"]'], repare: ['#email'] },
    },
  ],
};

export const COMPARATEURS: Comparateur[] = typoProfonde([formulaireAdresse]);
export const trouverComparateur = (slug: string) => COMPARATEURS.find((c) => c.slug === slug);
