// Les trois fiches du parcours Démarrer. Le texte vient de docs/parcours/ et ne se reformule pas :
// npm run verifier:fiches compare ce fichier aux originaux. Le corrigé du test n'est jamais dans ce dépôt.
import { typoProfonde } from '../typo';

export type Champ =
  | { id: string; type: 'ligne'; label: string; aide?: string }
  | { id: string; type: 'zone'; label: string; aide?: string; lignes: number; max?: number }
  | { id: string; type: 'choix'; label: string; options: string[]; multiple?: boolean; autre?: string }
  | { id: string; type: 'grille'; label: string; notions: string[] }
  | { id: string; type: 'mots'; label: string; nombre: number }
  | { id: string; type: 'tableau'; label: string; colonnes: string[]; lignes: number }
  | { id: string; type: 'fonctionnalites'; label: string }
  | { id: string; type: 'texte'; texte: string };

export type Section = { titre: string; intro?: string; champs: Champ[] };

export type Fiche = {
  slug: string;
  fichier: string;
  titre: string;
  court: string;
  intro: string;
  identite: { nom: string; projet?: string };
  sections: Section[];
};

export const PRIORITES = ['Indispensable au début', 'Important', 'À prévoir plus tard', 'Bonus'];
export const LIGNES_DEPART = 15;
export const SEUIL_MVP = 5;
export const IDEES = ['inscription et connexion', 'profil utilisateur', 'page d\'accueil', 'recherche', 'filtres', 'fiche produit ou service', 'panier', 'paiement', 'réservation', 'agenda', 'messagerie', 'notifications', 'avis et notes', 'favoris', 'tableau de bord', 'espace administrateur', 'statistiques', 'export de données', 'multilingue', 'mode sombre', 'partage sur les réseaux sociaux'];
export const CONTROLE = 'si tu as coché plus de 5 lignes en MVP, relis-les. Lesquelles pourrais-tu enlever et quand même tester ton idée ?';

const JNSP = 'Je ne sais pas';
const qcm = (id: string, label: string, ...options: string[]): Champ => ({ id, type: 'choix', label, options: [...options, JNSP] });
const ouiNon = (id: string, label: string): Champ => ({ id, type: 'choix', label, options: ['Oui', 'Non', JNSP] });
const plusTard = (id: string, label: string): Champ => ({ id, type: 'choix', label, options: ['Oui', 'Non', 'Plus tard'] });

const brut: Fiche[] = [
  {
    slug: 'test',
    fichier: 'test-positionnement',
    titre: 'Test de positionnement : numérique, IA et développement web',
    court: 'Test de positionnement',
    intro: 'Ce test n\'est pas noté. Il sert à savoir d\'où tu pars. Réponds sans aide et sans IA. Si tu ne sais pas, coche « Je ne sais pas » : c\'est une réponse utile.',
    identite: { nom: 'Nom et prénom' },
    sections: [
      {
        titre: 'Partie 1 : Auto-positionnement',
        champs: [{
          id: 'niveaux', type: 'grille',
          label: 'Pour chaque notion, entoure ton niveau : 1 = je n\'en ai jamais entendu parler, 5 = je pourrais l\'expliquer à quelqu\'un.',
          notions: ['Terminal / ligne de commande', 'Front-end et back-end', 'Base de données', 'API', 'Hébergement et nom de domaine', 'IA générative (ChatGPT, Claude, Gemini...)', 'Agents IA', 'Accessibilité numérique', 'Expérience utilisateur (UX)', 'Sécurité et données personnelles'],
        }],
      },
      {
        titre: 'Partie 2 : Bases du numérique et du développement',
        champs: [
          qcm('q1', 'Q1. Qu\'est-ce qu\'un terminal ?', 'Un écran tactile', 'Une fenêtre où l\'on donne des instructions à l\'ordinateur en tapant du texte', 'Un câble qui relie l\'ordinateur à Internet'),
          qcm('q2', 'Q2. Le front-end d\'un site, c\'est :', 'Ce que l\'utilisateur voit et avec quoi il interagit (boutons, pages, formulaires)', 'Le serveur qui stocke les données', 'Le contrat entre le client et l\'agence'),
          qcm('q3', 'Q3. Le back-end, c\'est :', 'Le design du site', 'La partie invisible qui traite les données, gère les comptes et fait tourner la logique', 'La page d\'accueil'),
          qcm('q4', 'Q4. Une base de données sert à :', 'Ranger et retrouver des informations de façon organisée (utilisateurs, commandes, produits)', 'Accélérer la connexion Wi-Fi', 'Créer des logos'),
          qcm('q5', 'Q5. Une API, c\'est :', 'Un logiciel de dessin', 'Un moyen pour deux logiciels de communiquer et d\'échanger des données', 'Un type d\'écran'),
          qcm('q6', 'Q6. Quelle est la différence entre un nom de domaine et un hébergement ?', 'C\'est la même chose', 'Le nom de domaine est l\'adresse (monsite.ch), l\'hébergement est l\'endroit où le site est stocké', 'L\'hébergement est l\'adresse, le nom de domaine est le serveur'),
          qcm('q7', 'Q7. Quelle est la différence entre un site web et une application mobile ?', 'Aucune', 'Le site s\'ouvre dans un navigateur, l\'application s\'installe depuis un store', 'Une application ne fonctionne jamais sans Internet'),
          { id: 'q8', type: 'zone', label: 'Q8. Explique avec tes mots : que se passe-t-il quand tu tapes une adresse dans ton navigateur ?', lignes: 3 },
        ],
      },
      {
        titre: 'Partie 3 : Intelligence artificielle',
        champs: [
          qcm('q9', 'Q9. Quelle est la différence entre un chatbot, un assistant IA et un agent IA ?', 'Ce sont trois noms pour la même chose', 'Le chatbot répond à des questions, l\'assistant aide sur des tâches quand on lui demande, l\'agent peut enchaîner des actions seul pour atteindre un objectif', 'L\'agent est un humain qui surveille l\'IA'),
          qcm('q10', 'Q10. Un prompt, c\'est :', 'L\'instruction ou la question qu\'on donne à une IA', 'Un virus informatique', 'Le prix d\'un abonnement'),
          qcm('q11', 'Q11. Une « hallucination » d\'IA, c\'est :', 'Quand l\'IA plante', 'Quand l\'IA invente une information fausse mais la présente comme vraie', 'Quand l\'IA génère une image'),
          qcm('q12', 'Q12. Un modèle d\'IA (par exemple GPT, Claude, Mistral), c\'est :', 'Le programme entraîné qui génère les réponses', 'Le site web sur lequel on discute', 'Un modèle de document Word'),
          qcm('q13', 'Q13. Peut-on coller des données personnelles de clients dans une IA en ligne sans réfléchir ?', 'Oui, c\'est sans risque', 'Non, il faut vérifier où vont les données et ce que dit la loi (RGPD, nLPD)'),
          { id: 'q14-texte', type: 'texte', texte: 'Q14. Cite un usage de l\'IA que tu fais déjà, et un usage que tu aimerais apprendre.' },
          { id: 'q14a', type: 'ligne', label: 'Déjà :' },
          { id: 'q14b', type: 'ligne', label: 'À apprendre :' },
        ],
      },
      {
        titre: 'Partie 4 : Accessibilité et expérience utilisateur',
        champs: [
          qcm('q15', 'Q15. L\'accessibilité numérique, c\'est :', 'Rendre un site utilisable par tous, y compris les personnes en situation de handicap', 'Rendre un site gratuit', 'Rendre un site plus rapide'),
          { id: 'q16', type: 'choix', multiple: true, label: 'Q16. Parmi ces exemples, lesquels améliorent l\'accessibilité ? (plusieurs réponses possibles)', options: ['Un texte alternatif sur les images', 'Un bon contraste entre le texte et le fond', 'Pouvoir naviguer au clavier', 'Du texte gris clair sur fond blanc', JNSP] },
          qcm('q17', 'Q17. L\'UX (expérience utilisateur), c\'est :', 'Uniquement les couleurs et le logo', 'Tout ce que ressent et vit l\'utilisateur quand il utilise un produit : facilité, clarté, plaisir, frustration', 'Le code du site'),
          qcm('q18', 'Q18. Quelle est la différence entre UX et UI ?', 'Aucune', 'L\'UI est l\'interface visuelle (boutons, écrans), l\'UX est l\'expérience globale', 'L\'UX est le visuel, l\'UI est la logique'),
          { id: 'q19', type: 'zone', label: 'Q19. Pense à une application ou un site qui t\'a énervé. Qu\'est-ce qui n\'allait pas ?', lignes: 2 },
        ],
      },
      {
        titre: 'Partie 5 : Sécurité de base',
        champs: [
          qcm('q20', 'Q20. Un bon mot de passe, c\'est :', 'Ta date de naissance', 'Le même partout pour ne pas l\'oublier', 'Long, unique pour chaque service, idéalement stocké dans un gestionnaire de mots de passe'),
          qcm('q21', 'Q21. Le phishing (hameçonnage), c\'est :', 'Un faux message qui cherche à te faire cliquer ou donner tes identifiants', 'Un logiciel de retouche photo'),
          qcm('q22', 'Q22. La double authentification (2FA), c\'est :', 'Avoir deux comptes', 'Une deuxième vérification en plus du mot de passe (code SMS, application)'),
        ],
      },
      {
        titre: 'Partie 6 : Ton rapport au numérique',
        champs: [
          { id: 'q23', type: 'choix', multiple: true, autre: 'Autre', label: 'Q23. Avec quels outils es-tu à l\'aise ? (coche)', options: ['Suite bureautique (Word, Google Docs...)', 'Canva / Figma', 'WordPress / Wix / Shopify', 'Outils IA', 'Code (HTML, CSS, JavaScript, Python...)', 'Autre'] },
          { id: 'q24', type: 'zone', label: 'Q24. Qu\'est-ce qui te fait le plus peur ou te bloque dans le numérique ?', lignes: 2 },
        ],
      },
    ],
  },
  {
    slug: 'idee',
    fichier: 'fiche-clarifier-idee',
    titre: 'Fiche 1 : Clarifier son idée de produit digital',
    court: 'Fiche 1 : clarifier son idée',
    intro: 'Règle : pas d\'IA. Réponds avec tes mots. Des mots-clés, des phrases courtes ou des schémas, tout est accepté. Si tu ne sais pas encore, écris « je ne sais pas encore » : c\'est une information utile.',
    identite: { nom: 'Nom du porteur de projet' },
    sections: [
      {
        titre: '1. L\'idée',
        champs: [
          { id: 'nom-projet', type: 'ligne', label: 'Nom du projet (même provisoire) :' },
          { id: 'idee', type: 'zone', label: 'Décris ton idée en 5 lignes maximum.', lignes: 5, max: 5 },
          { id: 'phrase', type: 'zone', label: 'Si tu devais l\'expliquer en une phrase à un ami :', lignes: 1 },
        ],
      },
      {
        titre: '2. Le problème',
        champs: [
          { id: 'probleme', type: 'zone', label: 'Quel problème ton produit résout-il ?', lignes: 2 },
          { id: 'aujourdhui', type: 'zone', label: 'Comment les gens font-ils aujourd\'hui sans ton produit ?', lignes: 2 },
          { id: 'important', type: 'zone', label: 'Pourquoi est-ce important pour toi ?', lignes: 1 },
        ],
      },
      {
        titre: '3. La cible finale',
        champs: [
          { id: 'cible', type: 'ligne', label: 'À qui s\'adresse le projet ?' },
          { id: 'age', type: 'choix', label: 'Tranche d\'âge', options: ['moins de 18 ans', '18-25', '25-40', '40-60', 'plus de 60', 'tous âges'] },
          { id: 'b2', type: 'choix', label: 'Particuliers ou professionnels ?', options: ['Particuliers (B2C)', 'Professionnels (B2B)', 'Les deux'] },
          { id: 'style', type: 'zone', label: 'Style de personne (métier, habitudes, centres d\'intérêt)', lignes: 2 },
          { id: 'lieu', type: 'ligne', label: 'Où se trouve-t-elle ? (ville, région, pays, en ligne)' },
          { id: 'aisance', type: 'choix', label: 'Son aisance avec le numérique', options: ['Faible', 'Moyenne', 'Forte'] },
          { id: 'besoins', type: 'zone', label: 'A-t-elle des besoins particuliers ? (handicap, langue, mauvaise connexion...)', lignes: 2 },
          { id: 'paie', type: 'ligne', label: 'Qui paie ? (la même personne que l\'utilisateur ou quelqu\'un d\'autre ?)' },
          { id: 'persona', type: 'zone', label: 'Décris une personne précise qui utiliserait ton produit (prénom inventé, âge, situation, journée type) :', lignes: 3 },
        ],
      },
      {
        titre: '4. Image de marque',
        champs: [
          { id: 'mots', type: 'mots', label: 'Ta marque en 3 mots :', nombre: 3 },
          { id: 'ressenti', type: 'choix', multiple: true, autre: 'Autre', label: 'Qu\'est-ce que le client doit ressentir en utilisant ton produit ?', options: ['Confiance', 'Simplicité', 'Plaisir', 'Sérieux', 'Fierté', 'Sécurité', 'Autre'] },
          { id: 'ton', type: 'choix', label: 'Quel ton pour parler à tes clients ?', options: ['Tutoiement, décontracté', 'Vouvoiement, professionnel', 'Fun, humour', 'Expert, rassurant'] },
          { id: 'couleurs', type: 'zone', label: 'Quelles couleurs, quelles ambiances te viennent en tête ?', lignes: 1 },
          { id: 'marques', type: 'zone', label: 'Cite une ou deux marques dont tu aimes l\'image, et pourquoi :', lignes: 1 },
          { id: 'pas-etre', type: 'zone', label: 'Qu\'est-ce que ta marque ne doit surtout pas être ?', lignes: 1 },
        ],
      },
      {
        titre: '5. Le parcours client',
        intro: 'Décris les étapes que vit ton client, de la découverte jusqu\'à son retour.',
        champs: [
          { id: 'decouverte', type: 'zone', label: 'Découverte : comment il entend parler de toi', aide: 'Que fait le client ? Que ressent-il ?', lignes: 2 },
          { id: 'contact', type: 'zone', label: 'Premier contact : ce qu\'il voit en premier', aide: 'Que fait le client ? Que ressent-il ?', lignes: 2 },
          { id: 'decision', type: 'zone', label: 'Décision : ce qui le convainc', aide: 'Que fait le client ? Que ressent-il ?', lignes: 2 },
          { id: 'usage', type: 'zone', label: 'Utilisation ou achat', aide: 'Que fait le client ? Que ressent-il ?', lignes: 2 },
          { id: 'apres', type: 'zone', label: 'Après : ce qui le fait revenir ou te recommander', aide: 'Que fait le client ? Que ressent-il ?', lignes: 2 },
          { id: 'abandon', type: 'zone', label: 'À quel moment risque-t-il d\'abandonner ?', lignes: 1 },
        ],
      },
      {
        titre: '6. Ce qui existe déjà',
        champs: [
          { id: 'concurrents', type: 'tableau', label: 'Concurrents ou solutions existantes', colonnes: ['Concurrent ou solution existante', 'Ce qui est bien', 'Ce qui manque'], lignes: 3 },
          { id: 'pourquoi-toi', type: 'zone', label: 'Pourquoi un client choisirait-il ton produit plutôt qu\'un autre ?', lignes: 2 },
        ],
      },
      {
        titre: '7. Réussite et premier pas',
        champs: [
          { id: 'reussite', type: 'zone', label: 'Comment sauras-tu que ton produit marche ?', aide: '(nombre d\'utilisateurs, ventes, avis, temps gagné...)', lignes: 1 },
          { id: 'argent', type: 'choix', multiple: true, label: 'Comment gagnes-tu de l\'argent ?', options: ['Vente unique', 'Abonnement', 'Publicité', 'Commission', 'Gratuit', 'Je ne sais pas encore'] },
          { id: 'premier-pas', type: 'zone', label: 'Quel est ton premier pas concret cette semaine ?', lignes: 1 },
        ],
      },
    ],
  },
  {
    slug: 'technique',
    fichier: 'fiche-aspect-technique',
    titre: 'Fiche 2 : Aspect technique et réalisation du produit',
    court: 'Fiche 2 : aspect technique',
    intro: 'Règle : pas d\'IA. Réponds avec tes mots. « Je ne sais pas » est une réponse acceptée : on le verra ensemble.',
    identite: { nom: 'Ton nom', projet: 'Nom du projet' },
    sections: [
      {
        titre: '1. Type de produit',
        champs: [
          { id: 'type', type: 'choix', multiple: true, autre: 'Autre, à décrire', label: 'Type de produit', options: ['Site vitrine (présenter une activité)', 'Site e-commerce (vendre en ligne)', 'Application web (outil utilisé dans le navigateur)', 'Application mobile (iPhone, Android)', 'Logiciel à installer sur ordinateur', 'Campagne d\'emailing ou newsletter', 'Automatisation ou outil interne', 'Autre, à décrire'] },
          { id: 'appareils', type: 'choix', multiple: true, label: 'Sur quels appareils sera-t-il utilisé ?', options: ['Téléphone', 'Tablette', 'Ordinateur'] },
          ouiNon('hors-ligne', 'Doit-il fonctionner sans Internet ?'),
        ],
      },
      {
        titre: '2. Utilisateurs et comptes',
        champs: [
          ouiNon('compte', 'Faut-il créer un compte / s\'inscrire ?'),
          { id: 'connexion', type: 'choix', multiple: true, label: 'Comment se connecter ?', options: ['Email + mot de passe', 'Google / Apple', 'Code par SMS', 'Autre'] },
          { id: 'roles', type: 'ligne', label: 'Y a-t-il plusieurs types d\'utilisateurs ? (client, admin, vendeur...)' },
          { id: 'volume', type: 'ligne', label: 'Combien d\'utilisateurs au début ? Dans un an ?' },
        ],
      },
      {
        titre: '3. Données',
        champs: [
          { id: 'stockage', type: 'zone', label: 'Quelles informations faut-il stocker ? (profils, commandes, photos, messages...)', lignes: 2 },
          ouiNon('sensibles', 'Y a-t-il des données personnelles ou sensibles ?'),
          { id: 'acces', type: 'ligne', label: 'Qui doit pouvoir voir ou modifier ces données ?' },
        ],
      },
      {
        titre: '4. Paiement, communication et services externes',
        champs: [
          plusTard('paiement', 'Paiement en ligne ?'),
          plusTard('emails', 'Envoi d\'emails (confirmation, newsletter, relances) ?'),
          plusTard('notifications', 'Notifications sur téléphone ?'),
          { id: 'liens', type: 'ligne', label: 'Liens avec d\'autres outils ? (agenda, réseaux sociaux, CRM, carte...)' },
          ouiNon('ia', 'IA intégrée dans le produit ?'),
          { id: 'langues', type: 'ligne', label: 'Langues du produit' },
        ],
      },
      {
        titre: '5. Fonctionnalités',
        champs: [
          { id: 'etape1', type: 'texte', texte: 'Étape 1 : liste toutes les fonctionnalités que tu imagines, même les plus ambitieuses. Une fonctionnalité = une action que l\'utilisateur peut faire (« réserver un créneau », « payer », « laisser un avis »).' },
          { id: 'etape2', type: 'texte', texte: 'Étape 2 : coche la colonne MVP uniquement pour ce qui est indispensable pour tester ton idée avec de vrais utilisateurs. Le MVP (produit minimum viable) est la plus petite version qui permet de vérifier que ton idée répond à un vrai besoin. On ne peut pas tout mettre au début : on teste d\'abord l\'essentiel, puis on ajoute.' },
          { id: 'etape3', type: 'texte', texte: 'Étape 3 : pour chaque ligne, choisis une priorité : Indispensable au début, Important, À prévoir plus tard ou Bonus.' },
          { id: 'fonctionnalites', type: 'fonctionnalites', label: 'Fonctionnalités' },
          { id: 'controle', type: 'zone', label: 'Question de contrôle : si tu as coché plus de 5 lignes en MVP, relis-les. Lesquelles pourrais-tu enlever et quand même tester ton idée ?', lignes: 2 },
        ],
      },
      {
        titre: '6. Outils et stack technique',
        champs: [
          { id: 'outil', type: 'ligne', label: 'As-tu déjà un outil en tête ? (WordPress, Shopify, Wix, Webflow, Bubble, code sur mesure...)' },
          { id: 'outils-connus', type: 'ligne', label: 'Quels outils sais-tu déjà utiliser ?' },
          { id: 'domaine', type: 'choix', label: 'As-tu déjà un nom de domaine ou un hébergement ?', options: ['Oui', 'Non'] },
          { id: 'charte', type: 'choix', label: 'As-tu déjà un logo, une charte graphique, des maquettes ?', options: ['Oui', 'Non', 'En partie'] },
          { id: 'constructeur', type: 'choix', label: 'Qui va construire le produit ?', options: ['Moi', 'Moi avec de l\'aide', 'Un prestataire', JNSP] },
          { id: 'maintenance', type: 'ligne', label: 'Qui va le maintenir et le mettre à jour ensuite ?' },
        ],
      },
      {
        titre: '7. Contraintes',
        champs: [
          { id: 'budget', type: 'choix', label: 'Budget de départ', options: ['0', 'moins de 500', '500 à 2 000', 'plus de 2 000', JNSP] },
          { id: 'budget-mois', type: 'ligne', label: 'Budget mensuel possible (abonnements, hébergement)' },
          { id: 'lancement', type: 'ligne', label: 'Date de lancement souhaitée' },
          { id: 'temps', type: 'ligne', label: 'Temps disponible par semaine pour le projet' },
          { id: 'legal', type: 'zone', label: 'Obligations légales identifiées (mentions légales, cookies, RGPD / nLPD, accessibilité)', lignes: 2 },
        ],
      },
      {
        titre: '8. Ce qui me manque',
        champs: [
          { id: 'manque', type: 'zone', label: 'Qu\'est-ce que je ne sais pas encore faire pour réaliser ce projet ?', lignes: 2 },
          { id: 'question', type: 'zone', label: 'Quelle question technique veux-tu poser au formateur ?', lignes: 1 },
        ],
      },
    ],
  },
];

// Apostrophe typographique et espaces insécables : la forme change, jamais les mots.
const typographier = <T,>(valeur: T): T => {
  const apostrophes = (v: unknown): unknown => typeof v === 'string' ? v.replace(/'/g, '’')
    : Array.isArray(v) ? v.map(apostrophes)
      : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, apostrophes(x)])) : v;
  return typoProfonde(apostrophes(valeur)) as T;
};

export const FICHES: Fiche[] = typographier(brut);
export const IDEES_FONCTIONS: string[] = typographier(IDEES);
export const QUESTION_CONTROLE: string = typographier(CONTROLE);
export const trouverFiche = (slug: string) => FICHES.find((f) => f.slug === slug);
