# Le Labo (plateforme-cours)

Instructions pour tout agent qui travaille dans ce dépôt (Claude Code, Codex, OpenCode…). Elles complètent `README.md` (commandes et organisation détaillées) et `INTEGRATION-PLAN.md` (décisions de produit). En cas de doute, ces trois fichiers font foi.

## Le projet

Site de cours de numérique de Clément Bastien (Suisse romande), en ligne sur **https://www.labonumerique.ch**. Next.js 16 en export statique (`output: 'export'`, `trailingSlash`), déployé sur Vercel à chaque push sur `main`. Dépôt public : `clement8426/plateforme-cours`. Pas de base de données, pas de compte, pas de serveur applicatif.

Quatre zones : **Cours** (`/cours/`, quatre cours : UX × IA, Les types d'IA, Le Harnais, IA données et responsabilité), **Démarrer** (`/demarrer/`, test et deux fiches), **Diagnostic** (`/diagnostic/`, plan d'angles morts, kit pour agent IA, annuaire d'outils en `/diagnostic/catalogue/`), **Bonnes pratiques** (`/bonnes-pratiques/`, lisibles par les élèves et par les agents IA).

## Règles permanentes (décisions de Clément, à ne jamais contourner)

- **Ne rien pousser sur GitHub sans son accord explicite.** Un commit local est possible ; un push, une release, un secret, un déploiement ne le sont pas sans accord. Dire toujours ce qui est local et ce qui est en ligne.
- **Ne pas modifier les cours existants (diapos, démonstrations) sans qu'il l'ait demandé.**
- **Le corrigé du test de positionnement n'entre jamais dans le dépôt** (il est public). `src/contenu/parcours/score.ts` ne contient que des empreintes.
- **Aucune réponse d'élève ne quitte le navigateur** : ni serveur, ni service tiers, ni API d'IA, ni statistiques. Les fiches et le test sont éphémères.
- **Aucun secret, jeton ou clé dans le code, les JSON ou les journaux.** Le robot de l'annuaire refuse toute adresse qui contient un identifiant (`contientSecret` dans `scripts/annuaire/outils.mjs`) ; GitHub bloque d'ailleurs les pushs qui en contiennent.
- **Rien d'inventé.** Données fictives pour les exemples. Sources légales vérifiées et datées. Un chiffre non vérifié est dit non vérifié.
- **Pas de première personne du formateur** dans le texte du site, pas d'interaction de salle. « Tu » dans Démarrer, Diagnostic et Bonnes pratiques ; « vous » sur l'accueil et dans les cours.
- **Port 8766 réservé** (autre projet) : ne pas l'utiliser.
- Réponses à Clément : **en français, courtes, simples**, une ou deux décisions à la fois, avec une recommandation.

## Commandes

```bash
npm run build                 # build + copie à plat (scripts/apres-construction.mjs)
PORT=3111 node scripts/servir.mjs   # sert out/ : reconstruire pour voir une modification
npx tsc --noEmit              # toujours APRÈS un build (types .next périmés sinon)
SITE_URL=http://127.0.0.1:3111 UX_OUTILS=../ux-outils npm run verifier:parcours   # ~3 min
SITE_URL=http://127.0.0.1:3111 UX_OUTILS=../ux-outils npm run verifier            # ~8 min
GITHUB_TOKEN=… npm run annuaire:collecter   # annuaire, voir plus bas
```

Lancer en arrière-plan toute commande de plus de 2 minutes. Avant tout push : build, `tsc`, `verifier:parcours` et `verifier` doivent passer. Autres contrôles : `verifier:fiches`, `verifier:qualite`, `verifier:atelier`, `verifier:scenes`.

Commits : `git -c user.name="Clément Bastien" -c user.email=<adresse de ses commits précédents> commit`, message en français, avec la ligne `Co-Authored-By:` du modèle utilisé. Ne pas committer `tsconfig.tsbuildinfo`, les `.log`, `data/raw/`.

## Organisation

- `app/` : pages (App Router), `app/globals.css` (jetons et règles de design, en tête du fichier).
- `src/composants/` : composants. `src/contenu/` : contenu (`catalogue.ts` = cours, `parcours/` = fiches, moteur du diagnostic, bonnes pratiques).
- `data/` : `blind_spots.json`, `rules.json`, `taxonomy.json`, `tools.json` (outils du diagnostic, saisis à la main), `classement.config.json` et `annuaire-ajouts.json` (annuaire).
- `public/diapos/<cours>/index.html` : les diapos (HTML autonome). `public/annuaire/` : données de l'annuaire. `public/apercus/` : images d'aperçu. `public/sw.js` : service worker.
- `scripts/` : vérifications, intégrations, robot de l'annuaire. `.github/workflows/catalogue.yml` : mise à jour planifiée de l'annuaire.

## Design : la palette et sa logique

Identité : **la fiole du Labo**, six couleurs vives sur fond gris froid. Les jetons sont en tête de `app/globals.css` ; ne pas coder de couleur en dur dans un composant.

| Couleur | Vif (aplats, bandeaux, pastilles) | Profond (texte sur clair) | Bloc du cours UX × IA |
|---|---|---|---|
| Violet | `#C3A6F0` | `#6E4A8E` | Design System |
| Orange | `#FF9C73` | `#A63F17` | Friction |
| Bleu clair | `#8CBDF2` | `#24609A` | Accessibilité |
| Jaune | `#E6C85C` | `#7A6514` | Comportement |
| Vert | `#62D8A2` | `#2F7356` | Microcopie |
| Rose | `#FF92B0` | `#A3304F` | Performances |

- Jetons : `--vif-violet|orange|bleu|jaune|vert|rose`, `--b-design|friction|access|comportement|micro|perf` (le profond en clair, le vif en sombre), `--sur-vif` = `#14161B` (encre sur un aplat vif).
- **Neutres** : fond `#F3F4F6`, surface `#FFFFFF`, ligne `#DCDFE5`, encre `#14161B`, discret `#4A505A`. Sombre : fond `#1E2129`, surface `#272B35`, ligne `#3D4350`, encre `#EEF0F4`, discret `#BCC1CB`.
- **Bleu d'action `#2B44E8`** (sombre `#93A3FF`) : uniquement ce qui se clique, le bandeau d'accueil (hero) et le pied de page. **Réussi** : `#0B6B4F` (sombre `#5FD3A8`).
- **Logique** : un aplat est vif avec de l'encre dessus (contraste 8,6 à 11) ; un texte coloré sur clair est profond (5,1 à 6,3) ; en thème sombre le texte coloré redevient vif (7,7 à 9,8). Ne jamais mettre du texte vif sur fond clair.
- **Zones** : Cours = rose, Démarrer = vert, Diagnostic = jaune, Bonnes pratiques = violet, autres pages = orange. Classe `zone-*` sur `.page`, variable `--zone`. L'onglet actif du menu prend la couleur de sa zone.
- **Signature** : la bande des six (`.six`), le hero bleu avec la fiole (`FioleAccueil`), les couches de liquide à vagues de l'accueil, les bandeaux de titre colorés à vague (`.page > .tete`, masque `--vague`), le liquide qui monte au survol des cartes, le pied bleu à vague.
- **Typographie** : Bricolage Grotesque (titres, `--police-titre`) et Instrument Sans (texte, `--police-texte`). Largeur de contenu `--largeur` : 1120, 1440 et 1760 px (écrans de 2200 px et plus).
- **Interdits** (retours de Clément) : petites vagues sous les `h2` ; bordure de couleur d'un seul côté ; grilles de cartes génériques qui « font IA » ; cartes qui ne s'ouvrent pas.
- **Accessibilité** : WCAG 2.2 AA dans les deux thèmes et en contraste élevé (`data-contraste="eleve"`) ; cibles de 44 px ; `prefers-reduced-motion` respecté ; focus visible au clavier avec `:has(a:focus-visible)` et non `:focus-within` (qui s'affichait au clic de souris).

### Les diapos

Les trois decks partagent le même système de variables (haut de chaque `index.html`) et la même palette que le site :

- `--p1…--p6` = bleu, vert, orange, violet, rose, jaune. Pour chacun : `--pN` et `--pN-fill` (vif), `--pN-text` (profond en clair, vif en sombre), `--on-pN` (encre).
- Rôles : `--ok` vert, `--warn` orange, `--bad` rose (vrai, attention, faux) ; `--hot-val` jaune.
- `[data-part="N"]` donne l'accent d'une partie (p1 à p4) ; `--sun` (le quartier de cercle de l'angle) est cet accent mélangé (`--sun-mix`).
- `.slide::before` : la bande des six couleurs ; `.chips > .chip` : pastilles qui tournent sur p1 à p6.
- Neutres identiques à ceux du site ; thème sombre avec la touche T (`data-deck="dark"`).
- Polices : UX × IA et Types d'IA = celles du site ; **IA données et responsabilité garde Libre Baskerville et Public Sans** (alignement à décider avec Clément).
- Les maquettes de « mauvaises pages » (exemples volontairement ratés) gardent leurs couleurs hors charte : ne pas les corriger.
- **Vérifier** : Playwright et axe (`color-contrast`) sur chaque `section.slide`, en retirant l'attribut `hidden` de la slide visée et en basculant `data-deck`. Attendu : aucun défaut sauf `#b-price` du cours UX × IA (maquette).
- Après un changement de diapos : régénérer `public/apercus/*-diapos.jpg` (masquer `#retour-cours`), changer le `?v=` de l'aperçu dans `src/contenu/catalogue.ts`, et incrémenter `VERSION` dans `public/sw.js`.

## L'annuaire MCP, plugins et skills

`public/annuaire/` (`mcp.json`, `plugins.json`, `skills.json`, `index.json`, lignes en tableaux dont les colonnes sont décrites dans `index.json`). Reconstruit par `scripts/annuaire-collecter.mjs` et `scripts/annuaire/` ; règles et sources dans `data/classement.config.json`. Pas de relecture humaine : la page l'affirme et porte un avertissement.

- **Publié si** : référencé par un répertoire reconnu (Claude, OpenAI, Google, GitHub, Docker, Cursor, AWS, projet MCP, skills.sh à 1 000 installations, dépôt d'éditeur), ou au moins 1 000 étoiles sur un dépôt qui appartient à l'auteur, ou éditeur prouvé et 10 000 téléchargements npm par semaine, ou ajout manuel. Un MCP peut être en ligne, en local, ou les deux.
- **Ajouts manuels** : `data/annuaire-ajouts.json`, toujours avec la preuve (Higgsfield en est le premier).
- **Sûreté** : une source en échec ou une liste qui perd plus de 15 % ⇒ rien n'est publié (codes 2 et 3 ; `ANNUAIRE_FORCER=1` pour passer outre). La mémoire de la recherche GitHub est `data/raw/etat.json` (non versionné), copiée dans la prerelease `annuaire-etat`.
- **Lectures limitées** : fiches des connecteurs Claude et pages de skills.sh sont lues une fois par semaine, une page par seconde, nom et adresse seulement. Les conditions d'Anthropic ne tranchent pas ce cas et Anthropic n'a pas été consulté.
- **Planification** : `catalogue.yml`, chaque jour à 5 h 23 UTC (répertoires) et chaque dimanche à 1 h 17 UTC (en plus, recherche GitHub longue). Jeton automatique de GitHub Actions par défaut ; secrets facultatifs `ANNUAIRE_GH_TOKEN` et `VERCEL_DEPLOY_HOOK`. Le robot commite `public/annuaire` : faire `git pull --ff-only` avant de pousser.

## Pièges connus

- Un fichier écrit avec un caractère invisible littéral dans une expression régulière casse le script : écrire `new RegExp('\\u200B…')`.
- Windows : sous Git Bash, préfixer `MSYS_NO_PATHCONV=1` pour les scripts qui prennent une adresse ; Python toujours en `python -I` pour les fichiers téléchargés.
- Le service worker garde des copies : tester avec un rechargement forcé (Ctrl + Maj + R) ou en le désinscrivant.
- `geminicli.com` peut ne pas répondre depuis certains réseaux (c'est le cas depuis le poste de Clément) alors qu'il répond depuis GitHub : sa source n'est pas critique pour le robot.

## Points ouverts (au 9 novembre 2026)

1. Le premier passage planifié n'avait pas démarré le 9 novembre à 7 h 42 UTC ; vérifier le suivant.
2. Avis juridique suisse sur la publication automatique de commandes d'installation : non fait ; l'avertissement de la page est en place.
3. Anthropic n'a pas été contacté au sujet de la lecture des fiches de ses connecteurs.
4. skills.sh : plafond de 6 000 pages lues par passage, des skills peuvent manquer.
5. Étoiles GitHub non auditées : certains dépôts très étoilés en peu de temps restent suspects, sans moyen de le vérifier.
6. Palette des diapos : appliquée aux trois cours ; l'aspect doit être validé par Clément avant publication.
