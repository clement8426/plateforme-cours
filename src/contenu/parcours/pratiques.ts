// Pages de bonnes pratiques. Chaque source a été ouverte à la date indiquée ; les exemples sont fictifs.
import { typoProfonde } from '../typo';

export const GROUPES = ['Principe', 'Tester', 'Légal et éthique', 'Technique'] as const;

export type Pratique = {
  id: string;
  groupe: (typeof GROUPES)[number];
  titre: string;
  resume: string;
  risque: string;
  exemple: string;
  verifications: [string, string, string];
  angles: string[];
  cours?: { href: string; nom: string };
  sources: { titre: string; url: string }[];
  blocs?: { titre: string; lignes: { nom: string; texte: string }[] }[];
};

export const DATE_VERIFICATION = '2026-11-09';

const LPD = { titre: 'Loi fédérale sur la protection des données (LPD), Fedlex', url: 'https://www.fedlex.admin.ch/eli/cc/2022/491/fr' };
const IA = { href: '/ia-legislation/ia-donnees/', nom: 'IA, données et responsabilité' };

export const PRATIQUES: Pratique[] = typoProfonde<Pratique[]>([
  {
    id: 'donnees-ia', groupe: 'Principe', titre: 'Ce qu’on envoie à l’IA',
    resume: 'Ce que tu envoies à l’IA compte plus que l’outil.',
    risque: 'Ce que tu envoies à une IA compte plus que le nom de l’outil. Un vrai fichier client collé dans un service en ligne sort de ton contrôle.',
    exemple: 'Une élève veut trier un fichier de clients. Elle donne à l’IA un tableur de même structure, rempli de faux noms et de fausses adresses, puis applique le résultat à son vrai fichier sur son ordinateur.',
    verifications: ['Le fichier envoyé contient-il de vrais noms, numéros ou adresses ?', 'Un tableur modèle avec de fausses données suffirait-il pour cette tâche ?', 'Pour des données médicales, juridiques ou RH, as-tu envisagé un agent open source avec un modèle européen ou hébergé en Suisse ?'],
    angles: ['cloud-act', 'confidentialite'], cours: IA,
    blocs: [
      { titre: 'Avant d’envoyer', lignes: [
        { nom: 'Les conditions de l’outil', texte: 'Lis ce qu’elles prévoient pour tes données et pour ce que l’outil produit. Elles changent d’un outil et d’une offre à l’autre.' },
        { nom: 'Le compte utilisé', texte: 'Si ton école ou ton entreprise fournit un compte, utilise-le pour le travail plutôt que ton compte personnel.' },
      ] },
    ],
    sources: [
      LPD,
      { titre: 'Connaître et faire valoir mes droits, PFPDT', url: 'https://www.edoeb.admin.ch/fr/connaitre-et-faire-valoir-mes-droits' },
      { titre: 'Lire les conditions d’utilisation des plateformes d’IA générative, site PME de la Confédération', url: 'https://www.kmu.admin.ch/fr/il-est-crucial-que-les-entreprises-lisent-les-conditions-dutilisation-des-plateformes-dia-generative' },
    ],
  },
  {
    id: 'cache', groupe: 'Tester', titre: 'Cache et hard refresh',
    resume: 'Avant de conclure qu’un correctif ne marche pas, vérifie que tu ne regardes pas une ancienne version.',
    risque: 'Ton navigateur, un service worker ou un CDN peuvent garder une ancienne version de ton site. Tu testes alors à l’aveugle : le correctif est en ligne, mais tu ne le vois pas.',
    exemple: 'Un élève corrige un bouton, met en ligne et recharge la page : le bouton semble toujours cassé. Il réécrit son code pendant une heure, alors que son navigateur affichait l’ancien fichier. Un rechargement forcé lui aurait montré que le premier correctif marchait.',
    verifications: ['As-tu forcé le rechargement avant de conclure qu’un correctif ne marche pas ?', 'Tes fichiers CSS et JavaScript changent-ils d’adresse à chaque mise en ligne, avec un hash ou une version ?', 'Si ton site a un service worker, sa version change-t-elle à chaque mise en ligne importante ?'],
    angles: ['test-cible', 'supervision'],
    blocs: [
      { titre: 'Où se cache l’ancienne version', lignes: [
        { nom: 'Le navigateur', texte: 'Il garde une copie privée sur ton appareil et la réutilise tant qu’elle est considérée comme fraîche.' },
        { nom: 'Le service worker', texte: 'Un script du site peut servir ses propres copies, même après une mise en ligne.' },
        { nom: 'Le CDN', texte: 'Des serveurs proches du visiteur gardent une copie partagée entre tous les visiteurs.' },
      ] },
      { titre: 'Forcer le rechargement', lignes: [
        { nom: 'Chrome sur Windows et Linux', texte: '`Ctrl + Maj + R` ou `Maj + F5`' },
        { nom: 'Chrome sur Mac', texte: '`⌘ + Maj + R`' },
        { nom: 'Chrome et Firefox, pendant les tests', texte: 'Dans les outils de développement, onglet Réseau, coche la case qui désactive le cache.' },
        { nom: 'Firefox', texte: '`Ctrl + Maj + R` ou `Ctrl + F5`, et `⌘ + Maj + R` sur Mac' },
        { nom: 'Safari', texte: '`⌥ + ⌘ + R` : « Recharger la page depuis l’origine », visible dans le menu Présentation en maintenant Option. Attention : `⌘ + Maj + R` ouvre le Lecteur et ne recharge rien.' },
        { nom: 'Sur un téléphone', texte: 'Il n’y a pas de rechargement forcé : ouvre la page dans un onglet de navigation privée ou vide le cache du navigateur.' },
      ] },
      { titre: 'Quand ça ne suffit pas', lignes: [
        { nom: 'Service worker', texte: 'Le rechargement forcé le contourne pour la page, mais sa nouvelle version attend que tous les onglets du site soient fermés. Dans Chrome, l’option « Update on reload » de l’onglet Application l’active à chaque chargement.' },
        { nom: 'CDN', texte: 'Regarde les en-têtes avec `curl -I https://ton-site.ch/` : `Age`, `Cache-Control` et, sur Vercel, `x-vercel-cache`.' },
        { nom: 'Réglage conseillé', texte: 'Pour le HTML : `Cache-Control: no-cache`, pour revalider à chaque visite. Pour les fichiers dont le nom contient un hash : `Cache-Control: public, max-age=31536000, immutable`.' },
      ] },
    ],
    sources: [
      { titre: 'HTTP caching, MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching' },
      { titre: 'Chrome keyboard shortcuts, aide Google Chrome', url: 'https://support.google.com/chrome/answer/157179?hl=en' },
      { titre: 'The service worker lifecycle, web.dev', url: 'https://web.dev/articles/service-worker-lifecycle' },
      { titre: 'Network features reference, Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools/network/reference' },
      { titre: 'Network Monitor toolbar, documentation Firefox', url: 'https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/toolbar/index.html' },
      { titre: 'Keyboard shortcuts, assistance Firefox', url: 'https://support.mozilla.org/en-US/kb/keyboard-shortcuts-perform-firefox-tasks-quickly' },
      { titre: 'Reload Page From Origin, notes de version Safari Technology Preview 27, WebKit', url: 'https://webkit.org/blog/7497/release-notes-for-safari-technology-preview-27/' },
      { titre: 'Vercel CDN Cache, documentation Vercel', url: 'https://vercel.com/docs/caching/cdn-cache' },
      { titre: 'Keyboard shortcuts in Safari, aide Apple', url: 'https://support.apple.com/guide/safari/keyboard-and-other-shortcuts-cpsh003/mac' },
    ],
  },
  {
    id: 'cloud-act', groupe: 'Légal et éthique', titre: 'Cloud Act',
    resume: 'Un serveur en Europe ne suffit pas si le fournisseur est américain.',
    risque: 'Les autorités américaines peuvent exiger d’un fournisseur américain des données qu’il contrôle, même stockées hors des États-Unis.',
    exemple: 'Une application suisse héberge ses données à Francfort chez un fournisseur américain. Le serveur est en Europe, mais la société qui contrôle les données reste soumise au droit américain.',
    verifications: ['Quelle société signe ton contrat, et où est sa maison mère ?', 'Ta communication promet-elle plus que ce que ton architecture garantit ?', 'Quelles données peux-tu garder chez un prestataire suisse ou européen ?'],
    angles: ['cloud-act', 'promesse-suisse', 'reversibilite'], cours: IA,
    sources: [
      { titre: 'CLOUD Act Resources, Département de la justice des États-Unis', url: 'https://www.justice.gov/criminal/cloud-act-resources' },
      { titre: 'Audition de Microsoft France, Sénat français, 10 juin 2025', url: 'https://www.senat.fr/compte-rendu-commissions/20250609/ce_commande_publique.html' },
    ],
  },
  {
    id: 'nlpd', groupe: 'Légal et éthique', titre: 'nLPD (Suisse)',
    resume: 'Informer, choisir ses transferts, annoncer les fuites graves.',
    risque: 'La loi suisse s’applique aux situations qui ont un effet en Suisse. Elle demande d’informer les personnes, d’encadrer les envois à l’étranger et d’annoncer certaines fuites.',
    exemple: 'Un formulaire de contact envoie ses réponses à un outil américain. La page de confidentialité doit nommer ce destinataire et le pays concerné, avec les garanties prévues.',
    verifications: ['Ta déclaration dit-elle qui traite les données, pourquoi et à qui elles sont transmises (art. 19) ?', 'Une décision prise uniquement par une machine est-elle annoncée, avec une revue humaine possible (art. 21) ?', 'Sais-tu qui annonce au PFPDT une violation à risque élevé, dans les meilleurs délais (art. 24) ?'],
    angles: ['confidentialite', 'decision-auto', 'fuite'], cours: IA,
    sources: [LPD, { titre: 'La nouvelle loi sur la protection des données du point de vue du PFPDT', url: 'https://www.edoeb.admin.ch/fr/la-nouvelle-loi-federale-sur-la-protection-des-donnees-du-point-de-vue-du-pfpdt' }],
  },
  {
    id: 'rgpd', groupe: 'Légal et éthique', titre: 'RGPD (Europe)',
    resume: 'Il peut s’appliquer dès que tu vises des personnes dans l’UE.',
    risque: 'Le RGPD peut s’appliquer à une entreprise suisse dès qu’elle propose des biens ou des services à des personnes dans l’UE, ou qu’elle suit leur comportement.',
    exemple: 'Une boutique de Neuchâtel affiche ses prix en euros et livre en France : elle vise des personnes dans l’UE et doit vérifier ses obligations européennes.',
    verifications: ['Proposes-tu une langue, une devise ou une livraison pour un pays de l’UE ?', 'Suis-tu le comportement de personnes dans l’UE ?', 'As-tu vérifié si un représentant dans l’UE est nécessaire (art. 27) ?'],
    angles: ['marche-ue', 'confidentialite'], cours: IA,
    sources: [{ titre: 'Règlement (UE) 2016/679 (RGPD), EUR-Lex', url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679' }],
  },
  {
    id: 'ai-act', groupe: 'Légal et éthique', titre: 'AI Act',
    resume: 'Transparence depuis août 2026, haut risque dès décembre 2027.',
    risque: 'Le règlement européen classe les usages de l’IA selon leur risque. Il peut concerner un projet suisse dont les résultats sont utilisés dans l’UE. Le tri de candidatures fait partie des usages à haut risque, même dans un petit projet.',
    exemple: 'Un outil interne classe des CV et écarte seul une partie des candidats. Ce n’est plus un simple assistant : c’est un usage à vérifier avant de le déployer.',
    verifications: ['Ton outil touche-t-il à l’emploi, à l’éducation ou au crédit ?', 'Une personne relit-elle ce que l’IA décide ?', 'Tes utilisateurs savent-ils quand ils parlent à une IA ou voient un contenu généré (art. 50) ?'],
    angles: ['decision-auto', 'droits-ia'], cours: IA,
    blocs: [
      { titre: 'Les dates', lignes: [
        { nom: '2 février 2025', texte: 'Les pratiques interdites s’appliquent.' },
        { nom: '2 août 2026', texte: 'Transparence (art. 50) : annoncer un chatbot, signaler les deepfakes. Les systèmes déjà sur le marché ont jusqu’au 2 décembre 2026 pour marquer les contenus générés.' },
        { nom: '2 décembre 2027', texte: 'Règles du haut risque de l’annexe III, dont l’emploi, l’éducation et le crédit. Ce report vient de l’Omnibus IA, en vigueur depuis le 27 juillet 2026.' },
        { nom: '2 août 2028', texte: 'Haut risque pour l’IA intégrée à des produits réglementés (annexe I).' },
      ] },
      { titre: 'Et en Suisse', lignes: [
        { nom: 'Aujourd’hui', texte: 'Pas de loi générale sur l’IA : la LPD et les lois existantes s’appliquent.' },
        { nom: 'Ensuite', texte: 'La Suisse veut ratifier la Convention du Conseil de l’Europe sur l’IA. La consultation sur le projet de loi est prévue au printemps 2027.' },
        { nom: 'Un projet suisse', texte: 'L’AI Act peut s’appliquer si tu mets un système sur le marché de l’UE ou si ses résultats y sont utilisés.' },
      ] },
    ],
    sources: [
      { titre: 'Règlement (UE) 2024/1689 (AI Act), EUR-Lex', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
      { titre: 'When does enforcement start?, AI Act Service Desk, Commission européenne', url: 'https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/when-does-enforcement-start' },
      { titre: 'AI Omnibus enters into force, Commission européenne', url: 'https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force' },
      { titre: 'Article 50 : obligations de transparence, AI Act Service Desk', url: 'https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50' },
      { titre: 'Un avant-projet pour réglementer l’IA d’ici début 2027, site PME de la Confédération', url: 'https://www.kmu.admin.ch/fr/un-avant-projet-visant-a-reglementer-lia-sera-elabore-dici-debut-2027' },
      { titre: 'Intelligence artificielle, OFCOM', url: 'https://www.bakom.admin.ch/fr/intelligence-artificielle' },
    ],
  },
  {
    id: 'marche-suisse', groupe: 'Légal et éthique', titre: 'Marché suisse et européen',
    resume: 'Impressum, processus de commande, CGV et conservation.',
    risque: 'Vendre en ligne en Suisse impose d’indiquer clairement son identité et un processus de commande transparent. Les pièces comptables se gardent au moins dix ans.',
    exemple: 'Une boutique n’affiche qu’un formulaire de contact. Il manque le nom de l’entreprise, l’adresse postale et l’adresse e-mail.',
    verifications: ['Ton impressum donne-t-il le nom, l’adresse postale et l’e-mail ?', 'Le client peut-il corriger sa commande, et reçoit-il une confirmation électronique ?', 'Tes factures restent-elles disponibles dix ans après la fin de l’exercice ?'],
    angles: ['mentions', 'cgv', 'factures', 'multilingue', 'tva'],
    sources: [
      { titre: 'Obligations légales du e-commerce, site PME de la Confédération', url: 'https://www.kmu.admin.ch/fr/obligations-legales-les-lois-suisses-et-europeennes-sur-le-e-commerce' },
      { titre: 'Commerce électronique, SECO', url: 'https://www.seco.admin.ch/fr/commerce-electronique' },
      { titre: 'Conservation électronique des livres de comptes, site PME', url: 'https://www.kmu.admin.ch/fr/conservation-electronique-des-livres-de-comptes' },
    ],
  },
  {
    id: 'rls', groupe: 'Technique', titre: 'Policies et RLS',
    resume: 'Chaque table doit refuser par défaut les données des autres.',
    risque: 'Sans règles sur chaque table exposée, un utilisateur peut lire ou modifier les données des autres.',
    exemple: 'Une application fictive liste les commandes du compte connecté. L’écran filtre bien, mais la table n’a pas de RLS : une requête directe renvoie les commandes de tout le monde.',
    verifications: ['RLS est-il activé sur chaque table d’un schéma exposé ?', 'Deux comptes de test voient-ils uniquement leurs données ?', 'La clé secrète reste-t-elle uniquement côté serveur ?'],
    angles: ['rls', 'roles', 'multi-clients'],
    sources: [{ titre: 'Row Level Security, documentation Supabase', url: 'https://supabase.com/docs/guides/database/postgres/row-level-security' }],
  },
  {
    id: 'injections-sql', groupe: 'Technique', titre: 'Injections SQL',
    resume: 'Ne jamais coller du texte saisi dans une requête.',
    risque: 'Une requête construite en collant du texte saisi peut être détournée pour lire ou effacer la base.',
    exemple: 'Un champ de recherche fictif colle directement le mot saisi dans la requête. Un visiteur y écrit du SQL, et la base l’exécute.',
    verifications: ['Toutes les requêtes utilisent-elles des paramètres ?', 'Le compte de la base a-t-il seulement les droits nécessaires ?', 'Ton agent a-t-il cherché les requêtes construites par concaténation ?'],
    angles: ['roles'],
    sources: [{ titre: 'SQL Injection Prevention Cheat Sheet, OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' }],
  },
  {
    id: 'xss', groupe: 'Technique', titre: 'Failles XSS',
    resume: 'Ne jamais afficher du contenu utilisateur sans l’échapper.',
    risque: 'Un contenu saisi par un utilisateur et affiché sans protection peut exécuter du code dans le navigateur des autres.',
    exemple: 'Un commentaire fictif contient une balise de script. La page l’insère telle quelle, et le code tourne chez chaque visiteur.',
    verifications: ['Le texte saisi est-il échappé à l’affichage ?', 'Le code utilise-t-il des insertions de HTML brut ?', 'Le HTML fourni par un utilisateur passe-t-il par un nettoyage reconnu ?'],
    angles: ['sessions'],
    sources: [{ titre: 'Cross Site Scripting Prevention Cheat Sheet, OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' }],
  },
  {
    id: 'sessions', groupe: 'Technique', titre: 'Jetons de session',
    resume: 'Durée limitée, stockage sûr, révocation possible.',
    risque: 'Un identifiant de session volé donne le même accès que le mot de passe, tant que le serveur ne l’a pas révoqué.',
    exemple: 'Dans une application fictive, la déconnexion vide seulement le cookie. Un jeton copié avant reste valable, car le serveur ne l’a pas invalidé.',
    verifications: ['Le serveur applique-t-il un délai d’inactivité et une durée maximale ?', 'Les cookies de session ont-ils les attributs Secure, HttpOnly et SameSite ?', 'La déconnexion invalide-t-elle la session côté serveur ?'],
    angles: ['sessions'],
    sources: [{ titre: 'Session Management Cheat Sheet, OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' }],
  },
  {
    id: 'vie-privee', groupe: 'Technique', titre: 'Vie privée des utilisateurs',
    resume: 'Collecter le minimum, expliquer pourquoi, permettre la suppression.',
    risque: 'Chaque donnée collectée devient une chose à protéger, à expliquer et à supprimer.',
    exemple: 'Un formulaire fictif demande la date de naissance alors qu’il sert seulement à envoyer une newsletter. Ce champ peut disparaître.',
    verifications: ['Chaque champ d’un formulaire a-t-il une utilité réelle ?', 'As-tu la liste des scripts tiers chargés par ton site ?', 'Une personne peut-elle demander la suppression de ses données ?'],
    angles: ['cookies', 'mesure', 'confidentialite'], cours: IA,
    sources: [
      LPD,
      { titre: 'Connaître et faire valoir mes droits, PFPDT', url: 'https://www.edoeb.admin.ch/fr/connaitre-et-faire-valoir-mes-droits' },
      { titre: 'Aide-mémoire sur les cookies et le suivi en ligne, PFPDT (27 mars 2026)', url: 'https://www.edoeb.admin.ch/dam/fr/sd-web/ByXs53ExpIEy/20260327%20Merkblatt%20Cookies_FR.pdf' },
    ],
  },
  {
    id: 'serveur', groupe: 'Technique', titre: 'Configuration serveur',
    resume: 'Ports fermés, secrets hors du code, mises à jour.',
    risque: 'Un serveur laissé par défaut expose des services, des secrets ou des failles déjà connues.',
    exemple: 'Un serveur fictif laisse sa base accessible depuis Internet alors que seule l’application en a besoin.',
    verifications: ['Seuls les ports nécessaires sont-ils ouverts ?', 'Les secrets sont-ils hors du code et du dépôt ?', 'Une sauvegarde a-t-elle déjà été restaurée pour de vrai ?'],
    angles: ['sauvegardes', 'supervision'],
    sources: [
      { titre: 'OWASP Top 10', url: 'https://owasp.org/Top10/' },
      { titre: 'Secrets Management Cheat Sheet, OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
    ],
  },
  {
    id: 'cles-exposees', groupe: 'Technique', titre: 'Clés exposées côté client',
    resume: 'Une clé visible dans le navigateur est publique.',
    risque: 'Tout ce que reçoit le navigateur est public. Une clé de service exposée donne un accès que tes règles ne contrôlent plus.',
    exemple: 'Chez Supabase, la clé publique est prévue pour le navigateur, mais la clé secrète contourne toutes les règles RLS et doit rester sur le serveur.',
    verifications: ['Distingues-tu la clé publique de la clé secrète ?', 'As-tu scanné le dépôt et son historique ?', 'Sais-tu révoquer une clé immédiatement ?'],
    angles: ['cles', 'rls'],
    sources: [
      { titre: 'Understanding API keys, documentation Supabase', url: 'https://supabase.com/docs/guides/api/api-keys' },
      { titre: 'Secrets Management Cheat Sheet, OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
    ],
  },
]);

export const trouverPratique = (id: string) => PRATIQUES.find((p) => p.id === id);
