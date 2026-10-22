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
  ajout?: boolean;
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
  accroche: 'Sept corrections du formulaire, plus une aide à la saisie : les suggestions d’adresse.',
  versions: {
    depart: '/comparateur/formulaire-adresse/casse/',
    repare: '/comparateur/formulaire-adresse/corrige/',
  },
  titreFormulaire: 'Atelier Rayon, adresse de livraison',
  etapes: [
    'Remplissez le prénom et la rue, laissez le nom vide puis envoyez : les valeurs disparaissent-elles ? Comparez ensuite les messages d’erreur.',
    'Refaites ces essais dans « Après ». Puis cherchez « Rue du Seyon 10 » et choisissez une suggestion : le NPA et la localité se complètent.',
    'Ouvrez une correction dans « Ce qui change », puis utilisez « Montrer dans le formulaire » pour voir les éléments concernés. « Les deux » permet de comparer sans perdre votre saisie.',
  ],
  defauts: [
    {
      id: 'champs',
      bloc: 'design-system',
      titre: 'Quatre styles de champs',
      depart: 'Quatre hauteurs, quatre arrondis, trois largeurs.',
      repare: 'Un seul style pour tous les champs.',
      pourquoi: 'Même rôle, même style : sinon le formulaire paraît bricolé.',
      essayer: 'Comparez les bords des champs.',
      outil: 'Mesuré : 4 styles de champs avant, 1 après.',
      lien: { texte: 'Cohérence et standards, Nielsen Norman Group', url: 'https://www.nngroup.com/articles/consistency-and-standards/' },
      cibles: { depart: ['input'], repare: ['input'] },
    },
    {
      id: 'remplissage',
      bloc: 'friction',
      titre: 'Un formulaire qui ne se remplit pas tout seul',
      depart: 'Saisie automatique coupée, NPA avant la rue, pas de clavier numérique.',
      repare: 'Ordre naturel, saisie automatique, clavier numérique pour le NPA.',
      pourquoi: 'Chaque caractère à retaper est une occasion d’abandonner.',
      essayer: 'Sur téléphone, touchez le NPA de chaque version.',
      outil: 'Dans le code : remplissage automatique désactivé sur 8 champs. Le comportement dépend du navigateur.',
      lien: { texte: 'WCAG 2.2, identifier la finalité d’un champ', url: 'https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html' },
      cibles: { depart: ['input[name="npa"]', 'input[name="localite"]', 'input[name="rue"]'], repare: ['#rue', '#npa', '#localite'] },
    },
    {
      id: 'conservation',
      bloc: 'friction',
      titre: 'Une erreur efface toute la saisie',
      depart: 'Un champ obligatoire vide suffit à effacer tous les champs, même ceux déjà remplis.',
      repare: 'Les valeurs restent présentes pour ne corriger que les champs en erreur.',
      pourquoi: 'Une erreur ne devrait pas obliger à recommencer toute la saisie.',
      essayer: 'Saisissez un prénom et une rue, laissez le nom vide puis envoyez. Comparez les valeurs avant et après.',
      outil: 'Test fonctionnel : après un envoi invalide, vérifier que le prénom et la rue sont conservés.',
      cibles: { depart: ['input[name="prenom"]', 'input[name="rue"]', 'button[type="submit"]'], repare: ['#prenom', '#rue', '#envoyer'] },
    },
    {
      id: 'autocompletion',
      ajout: true,
      bloc: 'friction',
      titre: 'Choisir une adresse plutôt que tout retaper',
      depart: 'Tout se tape à la main.',
      repare: 'Des suggestions dès 3 lettres, au clavier ou au clic.',
      pourquoi: 'Choisir une suggestion renseigne la rue, le NPA et la localité. L’absence de suggestions n’est pas, à elle seule, un défaut d’accessibilité.',
      essayer: 'Tapez « Rue du Seyon 10 » dans la version réparée.',
      outil: 'Non couvert : ce contrôle automatique d’accessibilité ne détecte pas l’absence de suggestions. Un test fonctionnel le ferait.',
      lien: { texte: 'Motif « combobox », WAI-ARIA', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/' },
      cibles: { depart: ['input[name="rue"]'], repare: ['#rue'] },
    },
    {
      id: 'textes',
      bloc: 'microcopie',
      titre: 'Des textes qui ne disent pas quoi faire',
      depart: '« Soumettre », « Erreur champ 1 », des étiquettes qui disparaissent.',
      repare: 'Un bouton qui dit ce qu’il fait, des erreurs qui disent quoi corriger.',
      pourquoi: 'Un texte indicatif disparaît au moment où on en a besoin.',
      essayer: 'Envoyez chaque version à vide.',
      outil: 'Mesuré : 6 champs sans vraie étiquette.',
      lien: { texte: 'WCAG 2.2, étiquettes ou instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html' },
      cibles: { depart: ['button[type="submit"]', 'input[placeholder]'], repare: ['#envoyer', 'label'] },
    },
    {
      id: 'accessibilite',
      bloc: 'accessibilite',
      titre: 'Des erreurs rouges et muettes',
      depart: 'Étiquettes non reliées, erreurs signalées par la couleur seule.',
      repare: 'Étiquettes reliées, erreurs écrites et annoncées.',
      pourquoi: 'Sans le rouge, ou sans la vue, on ne sait pas quoi corriger.',
      essayer: 'Envoyez les deux versions à vide.',
      outil: 'Mesuré : 2 champs sans libellé, 7 erreurs par la couleur seule.',
      lien: { texte: 'WCAG 2.2, ne pas utiliser la couleur seule', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html' },
      cibles: { depart: ['label', 'input[name="prenom"]', 'input[name="nom"]'], repare: ['label', '.erreur', '#resume'] },
    },
    {
      id: 'attente',
      bloc: 'performance',
      titre: '1,8 seconde de silence après l’envoi',
      depart: 'Rien ne bouge : on reclique.',
      repare: '« Envoi en cours… » tout de suite, second clic bloqué.',
      pourquoi: 'Même attente, autre sensation : le site dit ce qu’il fait.',
      essayer: 'Envoyez chaque version et regardez le bouton.',
      outil: 'Dans le code : 1,8 s d’attente programmée sans retour avant, retour immédiat après.',
      lien: { texte: 'Visibilité de l’état du système, Nielsen Norman Group', url: 'https://www.nngroup.com/articles/visibility-system-status/' },
      cibles: { depart: ['button[type="submit"]'], repare: ['#envoyer'] },
    },
    {
      id: 'verification',
      bloc: 'friction',
      titre: 'Toutes les erreurs d’un coup, à la fin',
      depart: 'Rien n’est vérifié avant l’envoi.',
      repare: 'Un champ rempli est vérifié quand on le quitte ; un champ obligatoire vide, à l’envoi. Les erreurs sont signalées au moment utile.',
      pourquoi: 'On corrige mieux quand le champ est encore en tête.',
      essayer: 'Tapez « x » dans E-mail, puis changez de champ.',
      outil: 'Hypothèse : les erreurs signalées trop tard font revenir en arrière. À observer sur des parcours réels, pas seulement dans le code.',
      lien: { texte: 'WCAG 2.2, identifier les erreurs', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html' },
      cibles: { depart: ['input[name="email"]'], repare: ['#email'] },
    },
  ],
};

export const COMPARATEURS: Comparateur[] = typoProfonde([formulaireAdresse]);
export const trouverComparateur = (slug: string) => COMPARATEURS.find((c) => c.slug === slug);
