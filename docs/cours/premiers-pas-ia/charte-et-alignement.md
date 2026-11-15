# Alignement avec le site et les diapos publiées

Relevé du 15 novembre 2026. Le site et les quatre fichiers HTML ont été interrogés directement ; aucune ancienne présentation n’a été modifiée.

| Référence | Diapos | Variables CSS distinctes déclarées | Police de texte |
|---|---:|---:|---|
| site | 0 | 51 | Instrument Sans |
| ux-ia | 46 | 78 | Instrument Sans |
| types-ia | 29 | 75 | Instrument Sans |
| harnais | 34 | 74 | Instrument Sans |
| ia-donnees | 35 | 75 | Public Sans |

## Logique retrouvée

- Les quatre présentations comprennent 144 diapos. Chacune a été parcourue dans les variantes claire et sombre pour relever les couleurs calculées et les limites de la scène.
- Le site déclare 51 variables distinctes ; les présentations en déclarent 74 à 78, avec des variables propres à certaines démonstrations. Leurs valeurs complètes et les sélecteurs sont dans charte-inventaire.json.
- Six familles p1 à p6 : bleu, vert, orange, violet, rose, jaune. Chaque famille possède vif, texte contrasté, remplissage et texte sur remplissage.
- Neutres communs au site ; couleur de texte, surface, ombre et mélanges adaptés au thème. Rôles ok, warn, bad ; rayons, espacements, typographies et tailles de cibles définis par jetons.
- Le site possède en plus des zones, un contraste élevé et ses propres largeurs responsive. Les diapos utilisent data-deck, data-part, une scène 1920 × 1080 mise à l’échelle, puis la lecture texte pour le redimensionnement.
- IA, données et responsabilité conserve Libre Baskerville et Public Sans. Les autres utilisent Bricolage Grotesque et Instrument Sans. Les variantes pédagogiques volontairement mauvaises ne servent pas de référence au nouveau cours.

## Application au nouveau cours

- Le HTML et le lecteur du Harnais publié servent de référence directe. Le moteur générique est repris ; seul CONFIG, le contenu et quelques adaptateurs structurels changent.
- Les 74 variables du gabarit, leurs variantes et leurs rôles sont conservés. Les compositions utilisent s-cover, g12, stack-m, plain, tbl, places et les classes typographiques existantes.
- Retrouvés : étapes progressives, sommaire G, navigation numérique, chronomètre S, plein écran F, thème T, écran noir B, vue présentateur N / Maj+N, impression et pont avec le lecteur du site.
- Le script et la feuille de lecture continue existants sont utilisés directement. Les polices sont locales.
- Exception volontaire à l’ancienne signature : la bande décorative .slide::before n’est pas reprise, conformément à la préférence de Clément. Les bordures de tableaux sont neutres ; la progression colorée est fonctionnelle.
- Le lien inférieur ouvre les exercices, puisque le nouveau cours n’a pas encore de page dans le catalogue.

## Contrôles

- Les 31 nouvelles diapos tiennent dans la scène avec tous leurs éléments affichés, dans les deux thèmes.
- Axe complet exécuté sur chaque nouvelle diapo dans le thème clair : aucune violation détectée. Le contraste sombre, le lecteur et les variantes mobiles sont vérifiés séparément dans le relevé de validation.
- Le contrôle géométrique des références relève un dépassement dans la diapo 44 du cours UX × IA, dans les deux thèmes. Ce contrôle ne constitue pas un audit complet de la démonstration ; elle n’est pas modifiée dans cette tâche.
- Aucun push ni déploiement. Les supports et le contenu pédagogique existants restent inchangés.

- Contrastes sombres des 31 diapos : aucune violation détectée. Lecture texte contrôlée en clair et sombre à 375 px, sans débordement ni violation axe.
- Scène vérifiée sur cinq formats, après prise en compte du redimensionnement. Sommaire, étapes, chronomètre, vue présentateur intégrée, écran noir et thème testés.
- Quinze variantes calculées du site sont conservées dans variantes-verifiees.json : cinq zones, chacune en clair, sombre et contraste élevé. Les sélecteurs de toutes les feuilles CSS accessibles, avec leurs contextes @media et autres règles imbriquées, figurent dans charte-inventaire.json.
