# Plateforme de cours

Le site des cours de Clément Bastien : diapos, démonstrations et exercices interactifs, rangés par thème.
Site **entièrement statique** : pas de compte, pas de base de données, aucune donnée personnelle collectée.
Il s'installe comme une application (PWA) et les pages déjà consultées restent lisibles hors connexion.

Next.js 16, export statique. Polices Bricolage Grotesque et Instrument Sans, servies par le site (aucune requête vers Google).

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

## Ajouter ou modifier un cours

Tout le contenu est décrit dans `src/contenu/catalogue.ts` : thèmes, cours, exercices, objectifs. Les pages se génèrent toutes seules.

- **Un nouveau thème** : ajouter une entrée dans `CATEGORIES`, avec un nom court pour le menu (`court`). Sans cours, il s'affiche « En préparation ».
- **Un nouveau cours** : ajouter un objet `Cours` dans la liste `cours` de son thème. Le premier cours disponible est celui que l'accueil met en avant.
- **Les références** sont rangées en groupes (`REGLES_GROUPES`) d'après leur adresse. Un groupe peut porter la couleur d'un bloc du cours. Une référence non reconnue va dans « Autres lectures ».
- **Les diapos** : voir ci-dessous.
- **Le lexique et les sources du cours UX** viennent des diapos (`src/contenu/ux-ia-sources.json`).

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
- **Les aperçus** de la page d'un cours (première diapo, Tilleul) sont de vraies captures : `PLAYWRIGHT_DEPUIS=../ux-outils/node_modules/playwright npm run apercus`, avec le site servi. À refaire quand les diapos ou Tilleul changent.
- **Les liens profonds** : `/tilleul/?defaut=N` ouvre Tilleul sur le défaut N (les pastilles de l'accueil les utilisent) ; `?cours=non` ouvre Tilleul sans le panneau.

## Icônes

L'icône de l'application est `public/icones/icone.svg`. Si vous la changez, régénérez les PNG avec `npm run icones` (il faut Playwright sur la machine, par exemple celui de ux-outils : `PLAYWRIGHT_DEPUIS=../ux-outils/node_modules/playwright npm run icones`).

## Règles de design

Elles sont écrites en tête de `app/globals.css` et s'appliquent à tout ajout :

1. **Trois étages de taille**, chacun d'au moins 1,5 fois le suivant : titre de page, titre de section, texte.
2. **Le très gras (800) est réservé aux titres de page.** Sections en 650, éléments en 600, texte en 400.
3. **Un accent, un sens** : bleu = ce qu'on peut cliquer ; turquoise = ce qui est fait ; corail = attention ; safran = signature, jamais porteur d'information. Les six blocs du cours ont leurs couleurs (`--b-*`), les mêmes que dans Tilleul.
4. **Un seul bandeau sombre par page** : le point focal. Il se retourne en thème sombre (parchemin).
5. **Tout texte respecte le contraste AA (4,5:1)**, dans les deux thèmes. Les couleurs de blocs ont été calculées pour cela : ne les modifiez pas sans recalculer.
6. **Cibles tactiles d'au moins 44 px** pour tout ce qui se clique, sauf les liens dans une phrase.

## Mémoire de progression

Les étapes d'un cours déjà ouvertes sont marquées « Vue », et l'accueil propose « Reprendre ». Cette mémoire vit dans le navigateur de la personne (`localStorage`), sans compte et sans rien envoyer : elle n'existe que sur l'appareil. Si le stockage est bloqué, le site fonctionne sans.

## Organisation

```
app/                      pages (accueil, thème, cours, diapos, exercices, sources, hors connexion)
src/contenu/catalogue.ts  tout le contenu
src/contenu/blocs.ts      les six blocs et leurs couleurs
src/composants/           navigation, parcours, mémoire, lecteur de diapos, fil d'Ariane
public/sw.js              service worker (lecture hors connexion)
public/tilleul/           Tilleul construit pour /tilleul/
public/diapos/            les présentations HTML préparées
public/apercus/           les aperçus de la page d'un cours
scripts/                  diapos, Tilleul, aperçus, icônes, serveur local, étape après construction, vérification
```

## Comparaison avant / après (exercice du formulaire d’adresse)

Page : `/ux/ux-ia/comparer/formulaire-adresse/` (liée depuis l’exercice et depuis la page du cours).
Elle affiche le formulaire de départ et le formulaire réparé, avec une bascule (départ, réparé, côte à côte) et sept défauts expliqués qui se surlignent dans le formulaire.

- Mise à jour : `npm run comparateur -- ../Downloads/formulaire-adresse-formateur.zip` ne publie que `casse/` et `corrige/` (jamais `SOLUTIONS.md` ni le README formateur).
- Compromis : la version réparée est publique. C’est voulu pour cette page, mais l’exercice renvoie vers elle seulement après les consignes.
- Vie privée : les suggestions d’adresse sont simulées dans le navigateur (`scripts/modeles/demo-photon.js`). Le vrai service Photon n’est appelé que si la personne coche la case prévue.
- Contenu de la page : `src/contenu/comparateurs.ts`.
