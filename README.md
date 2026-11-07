# Plateforme de cours

Le Labo, la plateforme de cours de Clément Bastien : diapos et démonstrations interactives, rangées par thème. Les exercices à refaire chez soi sont dans le dépôt GitHub [le-labo](https://github.com/clement8426/le-labo).
Site **entièrement statique** : pas de compte, pas de base de données, pas de cookie. Seules des statistiques de visite anonymes sont comptées, par Vercel Web Analytics (sans cookie ni profil individuel dans les statistiques ; à activer dans le projet Vercel, onglet Analytics).
Il s'installe comme une application (PWA) et les pages déjà consultées restent lisibles hors connexion.

Next.js 16, export statique. Polices Bricolage Grotesque et Instrument Sans, servies par le site (aucune requête vers Google).


## Pratique UX × IA : Escale

La pratique principale est **Escale**, une boutique Next.js de 18 produits et neuf défauts activables séparément : `/ux/ux-ia/demos/escale/`.
Les diapos 31 à 40 présentent la mission et les cinq blocs pratiques. Le bloc 4 comportement reste théorique, sans données inventées. Le formulaire d’adresse reste en bonus (41 à 43), la conclusion est en 44 et les annexes en 45 et 46.

Les gestes manuels, les captures avant/après et les prompts agents sont intégrés aux slides. Les anciens liens Traverse et Tilleul redirigent vers Escale. La partie 3 ne dépend pas du plugin Labo UX.

Le [fichier de préparation](public/diapos/ux-ia/demarrer-escale.md) accompagne la démonstration. Le [dépôt public escale-eleves](https://github.com/clement8426/escale-eleves) contient les missions et le démarrage pour les apprenants.

Les données pédagogiques sont dans `pratique-escale-data.js`, les interactions dans `pratique-escale.js` et les styles dans `pratique-escale.css`. `scripts/preparer-pratique-escale.mjs` réimporte explicitement les tutoriels et prompts depuis le dépôt des démos ; le build Vercel utilise les fichiers déjà versionnés et ne dépend pas de ce dépôt local.

## Lancer en local

### Présenter sur Mac, même sans Internet

Installez **Node.js 22 ou plus récent** avant la formation, puis clonez et préparez le cours pendant que vous avez Internet :

```bash
git clone https://github.com/clement8426/plateforme-cours.git
cd plateforme-cours
chmod +x lancer.sh
./lancer.sh --preparer
```

Le script installe les dépendances, construit toutes les pages puis ouvre le navigateur. Gardez ce terminal ouvert. L’adresse affichée commence par `http://127.0.0.1:4187` ; si le port est occupé, le suivant est choisi automatiquement. **Ctrl+C** arrête le serveur.

Le jour du cours, même sans connexion :

```bash
cd /chemin/vers/plateforme-cours
./lancer.sh --hors-ligne
```

Ou simplement `bash lancer.sh` : si le dossier `out/` est prêt, le démarrage ne fait aucune installation ni reconstruction. Conservez le dossier du projet avec `out/` sur le Mac : un clone seul ne contient pas encore la copie construite. Après une mise à jour : `git pull`, puis `./lancer.sh --preparer` avec Internet.

Les pages du cours, diapos, captures, PDF et démonstrations embarquées sont locales. Les liens GitHub, les sites externes (dont Escale en ligne), les outils IA et la recherche réelle Photon demandent Internet. Pour le formulaire d’adresse, désactivez « Rechercher avec Photon » pour utiliser les exemples locaux. Pour présenter la boutique Escale sans Internet, préparez et lancez aussi le dépôt professeur avant la formation.

Linux : mêmes commandes. Windows : `node scripts/lancer.mjs --preparer`, puis `node scripts/lancer.mjs --hors-ligne`. `--sans-ouvrir` désactive l’ouverture du navigateur ; `--aide` affiche les options.

### Développer

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:3000. En développement, le mode hors connexion est désactivé.

Pour tester la version finale, comme chez un hébergeur :

```bash
npm run build
npm start
```

## Mettre en ligne

`npm run build` produit le dossier `out/`. Il suffit de déposer **son contenu** chez n'importe quel hébergeur de fichiers statiques (Infomaniak, Hostinger, Cloudflare Pages…). Aucun réglage de serveur n'est nécessaire.

Après une mise à jour importante, changez `VERSION` dans `public/sw.js` : les appareils qui ont installé le site videront leurs anciennes copies.

## Vérifier le site

Avec le site construit et servi (`npm run build`, puis `npm start` dans un autre terminal) :

```bash
UX_OUTILS=../ux-outils npm run verifier
```

Le script contrôle les pages des parcours répertoriés : l'accessibilité automatique (axe, WCAG 2.2 AA) en thème clair et sombre, sur ordinateur et sur mobile, l'absence de débordement, la structure des titres, l'ordre du clavier, la mémoire de progression, et les liens profonds vers les diapos. Il se termine en échec si un contrôle échoue. Il utilise Playwright et axe de la boîte à outils `ux-outils`. `SITE_URL` permet de viser une autre adresse. `--parcours-seulement` relance les interactions après un audit d’affichage déjà réussi ; ce mode annonce explicitement les contrôles non relancés.

L’audit complet du 7 novembre 2026 est documenté dans [docs/audits/2026-11-07.md](docs/audits/2026-11-07.md). Les commandes complémentaires utilisent le même `UX_OUTILS` et `SITE_URL` :

- `npm run audit:site` inventorie les routes du build et les annexes HTML, les métadonnées et les liens internes, puis passe axe sur six affichages (bureau/mobile, clair/sombre, 320 px et contraste élevé). `AUDIT_ANNEXES=1` examine aussi les exemples et rapports HTML. `AUDIT_SORTIE` change le dossier de preuves (par défaut `.audit-site/`, ignoré par Git).
- `npm run audit:diapos` examine les 140 diapos dans les deux thèmes. Les erreurs volontaires portant `data-contrast-skip` restent dans le rapport, avec leur motif ; elles ne sont pas effacées pour obtenir un score artificiel.
- `npm run verifier:qualite` vérifie les métadonnées des pages du sitemap, la lecture texte des quatre diaporamas, le clavier et le mode théâtre.

Les scores automatiques ne constituent pas une déclaration de conformité. La page publique `/accessibilite/` décrit les aides disponibles, les contre-exemples pédagogiques et les vérifications restant à compléter avec des technologies d’assistance.

## Référencement et lecture

Le domaine de référence est `https://www.labonumerique.ch`. `src/contenu/site.ts` centralise les URL canoniques, les aperçus Open Graph/Twitter et les pages du sitemap ; les pages en préparation, indisponibles ou de service ne sont pas indexables. `app/sitemap.ts` et `app/robots.ts` sont exportés statiquement. Les données Schema.org reprennent l’auteur, les cours, leur liste et le fil d’Ariane, sans note ou avis inventé. Les dates de modification viennent du contenu, pas de l’heure du build.

Les anciennes adresses disposent de redirections HTTP permanentes sur Vercel (`vercel.json`) et d’un repli HTML/JavaScript pour les autres hébergeurs statiques. Les diapos brutes, rapports d’outils et exemples portent directement une métadonnée `noindex`, qui reste valable quel que soit l’hébergement. Cette méthode est vérifiée en production ; les en-têtes de dossiers statiques n’étaient pas appliqués par Vercel. Le référencement des moteurs de réponse IA repose ici sur les mêmes fondations : contenu lisible, auteur identifié, sources et accès des robots. Aucun classement ou reprise par une IA n’est garanti.

Le lien « Lire la version texte » active `?lecture=1` sur une présentation. `public/diapos/lecture.js` reprend son contenu réel et les réponses du lexique/quiz ; `lecture.css` fournit une lecture continue, un sommaire repliable et des tableaux focalisables. Le mode présentation reste disponible. Les polices des quatre diaporamas sont locales ; les licences sont conservées dans `public/polices/` et `public/diapos/types-ia/polices/`.

Pour contrôler les liens externes des quatre présentations, du catalogue et des sources : `npm run liens`. Le script effectue des requêtes GET, suit les redirections et distingue les erreurs des refus d’accès (403/429). Aucun lien bloqué n’est déclaré valide. `node scripts/verifier-liens.mjs --json` donne les adresses et les fichiers concernés. Un succès HTTP ne remplace pas la lecture de la source : il faut aussi vérifier qu’elle étaye le texte.

## Ajouter ou modifier un cours

Tout le contenu est décrit dans `src/contenu/catalogue.ts` : thèmes, cours, déroulé en trois parties, démonstrations, objectifs, adresse du dépôt d'exercices. Les pages se génèrent toutes seules.

- **Un nouveau thème** : ajouter une entrée dans `CATEGORIES`, avec un nom court pour le menu (`court`). Sans cours, il s'affiche « En préparation ».
- **Un nouveau cours** : ajouter un objet `Cours` dans la liste `cours` de son thème. Le premier cours disponible est celui que l'accueil met en avant.
- **Les références** sont rangées en groupes (`REGLES_GROUPES`) d'après leur adresse. Un groupe peut porter la couleur d'un bloc du cours. Une référence non reconnue va dans « Autres lectures ».
- **Les diapos** : voir ci-dessous.
- **Les lexiques et bibliographies** viennent des diapos. Après modification : `npm run sources -- public/diapos/<cours>/index.html <cours>` pour synchroniser le fichier `src/contenu/<cours>-sources.json`.

La typographie française (espaces insécables avant `: ; ! ?`) est appliquée automatiquement aux textes du catalogue.

## Les diapos

Un script prépare la présentation HTML pour la plateforme (le fichier d'origine n'est jamais modifié) :

```bash
npm run diapos -- ../Downloads/ux-ia-presentation.html ux-ia --retour /ux/ux-ia/diapos/
```

Il pointe le lien de pratique vers `/ux/ux-ia/demos/escale/` et branche le plein écran : F et Échap passent par le lecteur de la plateforme, qui garde toujours un bouton « Quitter le plein écran » visible. Ouvertes seules dans un onglet, les diapos affichent un lien « Retour au cours ». À relancer à chaque mise à jour de la présentation.
Sous Git Bash, faites précéder la commande de `MSYS_NO_PATHCONV=1` (le script refuse une adresse de retour mal convertie).

## Tilleul et les aperçus

- **Tilleul**, la boutique interactive, vit dans `public/tilleul/`. Après une modification de Tilleul : `npm run tilleul` (Tilleul doit se trouver dans `../boutique-tilleul`, ou indiquez `TILLEUL_DIR`).
- **Les aperçus** de la page d'un cours (première diapo, Tilleul, démonstrations) sont de vraies captures : `PLAYWRIGHT_DEPUIS=../ux-outils/node_modules/playwright npm run apercus`, avec le site servi. À refaire quand les diapos ou Tilleul changent.
- **Les liens profonds** : `/tilleul/?defaut=N` ouvre Tilleul sur le défaut N (les pastilles de l'accueil les utilisent) ; `?cours=non` ouvre Tilleul sans le panneau.

## Icônes

L'icône de l'application est `public/icones/icone.svg`. Si vous la changez, régénérez les PNG avec `npm run icones` (il faut Playwright sur la machine, par exemple celui de ux-outils : `PLAYWRIGHT_DEPUIS=../ux-outils/node_modules/playwright npm run icones`).

## Règles de design

Elles sont écrites en tête de `app/globals.css` et s'appliquent à tout ajout :

1. **Trois étages de taille** : titre de page, titre de section, texte. Les titres d'éléments restent proches du texte.
2. **Le bleu ne sert qu'à ce qui se clique.** Les couleurs des six blocs (`--b-*`, les mêmes que dans Tilleul) ne servent qu'à désigner un bloc : en bande en haut de page, ou en puces.
3. **Une carte blanche = une chose qu'on ouvre.** Pas de carte décorative, pas de bordure de couleur sur un côté.
4. **Tout texte respecte le contraste AA (4,5:1)**, dans les deux thèmes. Les couleurs de blocs ont été calculées pour cela : ne les modifiez pas sans recalculer.
5. **Cibles tactiles d'au moins 44 px** pour tout ce qui se clique, sauf les liens dans une phrase.

## Mémoire de progression

Les démonstrations déjà faites sont marquées « Vue », et l'accueil propose « Reprendre ». Cette mémoire vit dans le navigateur de la personne (`localStorage`), sans compte et sans rien envoyer : elle n'existe que sur l'appareil. Si le stockage est bloqué, le site fonctionne sans.

## Organisation

```
app/                      pages (accueil, thème, cours, diapos, démonstrations, sources, hors connexion)
src/contenu/catalogue.ts  tout le contenu
src/contenu/blocs.ts      les six blocs et leurs couleurs
src/composants/           navigation, mémoire, lecteur de diapos, scènes des démonstrations (affiche, Tilleul, comparateur)
public/sw.js              service worker (lecture hors connexion)
public/tilleul/           Tilleul construit pour /tilleul/
public/diapos/            les présentations HTML préparées
public/apercus/           les aperçus de la page d'un cours
scripts/                  diapos, Tilleul, aperçus, icônes, serveur local, étape après construction, vérification
```

## Les démonstrations

Une page par démonstration, `/ux/ux-ia/demos/<slug>/` : le déroulé à suivre devant la salle, une scène interactive, ce qu'il faut retenir, et le lien vers l'exercice correspondant dans le dépôt GitHub.

- **Escale, mon atelier UX pas à pas** (`escale`) : le démarrage et les missions du dépôt public apprenants, à préparer avec leur agent.
- **Le formulaire d'adresse, avant et après** (`formulaire-adresse`) : la comparaison des deux versions et les sept défauts.
- **L'affiche qui se lit en 3 secondes** (`affiche`) : conservée mais signalée indisponible dans le catalogue ; aucun lien d’action sur sa carte.

Tilleul est une ancienne boutique volontairement piégée, conservée comme exemple archivé. Son ancienne page de démonstration renvoie vers Escale.

Les anciennes adresses (`/exercices/`, `/comparer/formulaire-adresse/`) redirigent vers les nouvelles. Le contenu est dans `src/contenu/catalogue.ts` (déroulé, à retenir, dossier de l'exercice).

Les diapos s'ouvrent à une diapo précise avec `?diapo=22`.

### Les types d’IA

Le cours comprend 29 diapos : histoire (1–6), familles d’IA (7–17, dont génération d’images, de sons, de musique et de vidéos), LLM (18–23), pratique (24–27), puis lexique et sources (28–29). La palette crème, cobalt, sarcelle et corail reprend la direction visuelle d’UX × IA. Les deux polices de cette présentation sont servies localement, avec leurs licences dans `public/diapos/types-ia/polices/`.

Préférence visuelle de Clément : aucune bordure colorée décorative sur un seul côté d’une carte, ni bande équivalente ajoutée avec un pseudo-élément. Utiliser l’espace, la typographie et des surfaces simples. La diapo 24 garde une seule phrase et un lien par exercice ; le cercle central de la couverture laisse une marge confortable autour de son texte.

L’aperçu d’un cours est un vrai lien : accessible au clavier, avec un texte alternatif qui annonce l’ouverture des diapos. Ne pas le masquer avec `aria-hidden` ou `tabIndex=-1`. Après une nouvelle capture, actualiser aussi sa version `?v=…` dans le catalogue pour renouveler les copies en cache. La version de l’aperçu Types d’IA correspond aux dix premiers caractères de son SHA-256.

Deux exercices complémentaires sont liés depuis les diapos et la page du cours : **Atelier des IA** pour découvrir trois capacités locales séparées, **Le Harnais** pour les combiner avec un assistant. L’Atelier est un prototype dont le code est public, sans installateur publié ; les textes ne doivent pas laisser croire que Windows, macOS, Linux ou les portables des apprenants sont déjà qualifiés. La capture de son accueil vient du dépôt de l’application. La musique et la vidéo sont expliquées, sans génération intégrée à ce prototype.

Après une modification, synchroniser le lexique et les références avec `npm run sources -- public/diapos/types-ia/index.html types-ia`, puis construire le site. Vérifier la navigation, les liens de pratique et les deux thèmes ; les plages du catalogue doivent correspondre à `CONFIG.parties`. Le cours et le tuto du Harnais restent accessibles à leurs adresses existantes.

Vérification ciblée : après avoir servi le site construit, `node scripts/verifier-types-ia.mjs` contrôle le cadrage des 29 diapos en deux thèmes et cinq tailles d’écran, l’accessibilité des ajouts et de la page du cours, le quiz et la navigation. Variables : `UX_OUTILS` pour Playwright/axe, `SITE_URL` pour le serveur et `PREUVES_TYPES` pour les captures et le rapport JSON (par défaut `preuves-types-ia/`, ignoré par Git).

Validation ciblée des Types d’IA : construction avec Next.js 16.4.5, navigation et contrôle des 29 diapos réussis le 6 novembre 2026. L’audit du 7 novembre actualise aussi les attentes historiques du test général sur Escale et les cartes indisponibles ; son périmètre et ses résultats sont dans le rapport d’audit.

### Sources et dates

- **Chaque chiffre ou fait cité doit avoir une source.** Dans une présentation, `CONFIG.sources` associe l'identifiant d'une diapo (`data-key`) à une liste `{ t: nom court, u: adresse }` : les liens « source » s'affichent en haut de la diapo, avec une flèche. Les passages très précis (la frise des types d'IA) ont aussi une pastille « source » dans le texte.
- **Une source se vérifie avant d'être citée** : on ouvre la page, on relit le chiffre. Les pages qui bloquent les robots (erreur 403) se vérifient dans un navigateur.
- **Les chiffres illustratifs et simulations le disent explicitement.** Un score d’audit réel doit être accompagné d’un rapport daté et de la version testée. Le seuil de cinq profils du jeu de réidentification n’est pas une garantie d’anonymat. Le choix d’un hébergement suisse ne suffit pas à valider un traitement sensible.
- **La date de dernière modification** d'un cours est le champ `misAJour` (AAAA-MM-JJ) du catalogue. Elle s'affiche sur la page du cours et au-dessus des diapos, avec un rappel : certaines informations peuvent être datées, la curiosité est le meilleur allié. À mettre à jour à chaque modification d'un cours.

### La comparaison du formulaire

- Mise à jour : `npm run comparateur -- ../Downloads/formulaire-adresse-formateur.zip` ne publie que `casse/` et `corrige/` (jamais `SOLUTIONS.md` ni le README formateur).
- Compromis : la version réparée est publique. C’est voulu : c'est la démonstration.
- Vie privée : la recherche Photon est active par défaut et son fonctionnement est expliqué avant le formulaire. La case « Rechercher avec Photon » permet de passer aux exemples locaux, sans requête externe. Utiliser des adresses fictives pour le cours.
- Contenu des défauts : `src/contenu/comparateurs.ts`.

## Démarrer et Bonnes pratiques

Le site a trois zones : `/cours/`, `/demarrer/` et `/bonnes-pratiques/`. Les décisions sont dans `INTEGRATION-PLAN.md`.

- **Fiches :** `src/contenu/parcours/fiches.ts`. Le texte vient de `docs/parcours/` ; `npm run verifier:fiches` détecte toute reformulation.
- **Corrigé du test :** il ne doit jamais entrer dans ce dépôt, qui est public.
- **Score du test :** `src/contenu/parcours/score.ts` ne contient que des empreintes des bonnes réponses.
- **Modèles vides :** `public/telechargements/parcours/` pour Word et Markdown ; le PDF se crée dans le navigateur.
- **Angles morts et règles :** `data/blind_spots.json`, `data/rules.json` et `data/taxonomy.json`.
- **Catalogue :** `data/tools.json`. Un outil n'est public qu'une fois validé : `npm run catalogue:valider -- <id>`, ou `-- --tous`.
- **Aperçu du catalogue :** `NEXT_PUBLIC_CATALOGUE_APERCU=1 npm run build` montre aussi les outils non validés.
- **Collecte :** `.github/workflows/catalogue.yml` ouvre chaque lundi une pull request de candidats. Seuils dans `data/collecte.config.json`.
- **Vérification :** `SITE_URL=http://127.0.0.1:3000 UX_OUTILS=../ux-outils npm run verifier:parcours`.
