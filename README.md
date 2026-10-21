# Plateforme de cours

Le Labo, la plateforme de cours de Clément Bastien : diapos et démonstrations interactives, rangées par thème. Les exercices à refaire chez soi sont dans le dépôt GitHub [le-labo](https://github.com/clement8426/le-labo).
Site **entièrement statique** : pas de compte, pas de base de données, pas de cookie. Seules des statistiques de visite anonymes sont comptées, par Vercel Web Analytics (sans cookie ni profil individuel dans les statistiques ; à activer dans le projet Vercel, onglet Analytics).
Il s'installe comme une application (PWA) et les pages déjà consultées restent lisibles hors connexion.

Next.js 16, export statique. Polices Bricolage Grotesque et Instrument Sans, servies par le site (aucune requête vers Google).


## Labo UX : installation faite par l’agent

Donner à son agent local le [fichier d’installation de Labo UX](public/diapos/ux-ia/installation-labo-ux.md). Il prépare les outils et réalise un audit de contrôle. L’apprenant n’a pas à taper de commandes. Le téléchargement du plugin reste soumis aux droits d’accès GitHub.

## Lancer en local

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

Le script contrôle, sur toutes les pages : l'accessibilité automatique (axe, WCAG 2.2 AA) en thème clair et sombre, sur ordinateur et sur mobile, l'absence de débordement, la structure des titres, l'ordre du clavier, la mémoire de progression, et les liens profonds vers Tilleul. Il se termine en échec si un contrôle échoue. Il utilise Playwright et axe de la boîte à outils `ux-outils`. `SITE_URL` permet de viser une autre adresse.

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

Il pointe le lien vers Tilleul vers `/tilleul/` et branche le plein écran : F et Échap passent par le lecteur de la plateforme, qui garde toujours un bouton « Quitter le plein écran » visible. Ouvertes seules dans un onglet, les diapos affichent un lien « Retour au cours ». À relancer à chaque mise à jour de la présentation.
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

- **L'affiche qui se lit en 3 secondes** (`affiche`) : deux affiches pour la même promotion, montrées 3 secondes, puis révélées avec quoi, quand et où entourés.
- **Tilleul, la boutique piégée** (`tilleul`) : la boutique dans un cadre, avec un interrupteur « Sans aide » / « Mode cours ».
- **Le formulaire d'adresse, avant et après** (`formulaire-adresse`) : la comparaison des deux versions et les sept défauts.

Les anciennes adresses (`/exercices/`, `/comparer/formulaire-adresse/`) redirigent vers les nouvelles. Le contenu est dans `src/contenu/catalogue.ts` (déroulé, à retenir, dossier de l'exercice).

Les diapos s'ouvrent à une diapo précise avec `?diapo=22`.

### Sources et dates

- **Chaque chiffre ou fait cité doit avoir une source.** Dans une présentation, `CONFIG.sources` associe l'identifiant d'une diapo (`data-key`) à une liste `{ t: nom court, u: adresse }` : les liens « source » s'affichent en haut de la diapo, avec une flèche. Les passages très précis (la frise des types d'IA) ont aussi une pastille « source » dans le texte.
- **Une source se vérifie avant d'être citée** : on ouvre la page, on relit le chiffre. Les pages qui bloquent les robots (erreur 403) se vérifient dans un navigateur.
- **Les chiffres illustratifs et simulations le disent explicitement.** Un score d’audit réel doit être accompagné d’un rapport daté et de la version testée. Le seuil de cinq profils du jeu de réidentification n’est pas une garantie d’anonymat. Le choix d’un hébergement suisse ne suffit pas à valider un traitement sensible.
- **La date de dernière modification** d'un cours est le champ `misAJour` (AAAA-MM-JJ) du catalogue. Elle s'affiche sur la page du cours et au-dessus des diapos, avec un rappel : certaines informations peuvent être datées, la curiosité est le meilleur allié. À mettre à jour à chaque modification d'un cours.

### La comparaison du formulaire

- Mise à jour : `npm run comparateur -- ../Downloads/formulaire-adresse-formateur.zip` ne publie que `casse/` et `corrige/` (jamais `SOLUTIONS.md` ni le README formateur).
- Compromis : la version réparée est publique. C’est voulu : c'est la démonstration.
- Vie privée : les suggestions d’adresse sont simulées dans le navigateur (`scripts/modeles/demo-photon.js`). Le vrai service Photon n’est appelé que si la personne coche la case prévue.
- Contenu des défauts : `src/contenu/comparateurs.ts`.
