# Plan d'intégration : Cours, Démarrer et Bonnes pratiques

Décisions validées par Clément le 7 novembre 2026.

## Décisions

| Sujet | Décision |
|---|---|
| Nom | Le Labo, `labonumerique.ch`. Aucune marque Learn ni Digitalizers sur le site. |
| Accueil | Trois portes : Cours, Démarrer, Bonnes pratiques. |
| `/cours/` | Nouvelle page avec tous les cours, classés par thème. |
| Adresses des cours | Inchangées (`/<thème>/<cours>/`), pour ne casser ni les diapos ni les liens déjà partagés. |
| Test et fiches | Éphémères : aucune sauvegarde, alerte avant de quitter, téléchargement à la fin. |
| Export | PDF direct en un clic, Markdown disponible à côté. |
| Corrigé du test | Hors du dépôt, qui est public. |
| Statistiques | Vercel Analytics ne reçoit plus ni paramètres ni fragment d'adresse. |
| Lien de l'entonnoir | Fragment d'adresse (`#i=…`) calculé dans le navigateur. |
| Lecture par les agents | Kit, `llms.txt`, `/api/catalog.json`, `/api/rules.json` et pages statiques. |
| Catalogue | Saisie manuelle, registre MCP, marketplace Claude et GitHub. Sans Smithery ni skills.sh. |
| Validation | Un outil sans `validated_by` n'est jamais publié. Seul Clément valide. |
| Accessibilité | WCAG 2.2 AA. |
| Gravité | Bloquant, important, confort. |
| CGV | Important, et non bloquant : elles ne sont pas obligatoires en Suisse. |
| Types de projet | Huit cartes, dont « Application web ou SaaS », plus « Je ne sais pas ». |
| Écran Contexte | Sept questions. Les conditions non posées passent dans « À vérifier aussi ». |
| Hébergement | Vercel reste ; la promesse « hébergée en Suisse » est retirée. |

## Adresses

| Espace | Adresse |
|---|---|
| Tous les cours | `/cours/` |
| Démarrer | `/demarrer/` |
| Test de positionnement | `/demarrer/test/` |
| Fiche 1 | `/demarrer/idee/` |
| Fiche 2 | `/demarrer/technique/` |
| Entonnoir | `/demarrer/entonnoir/` |
| Catalogue | `/demarrer/catalogue/` et `/demarrer/catalogue/<id>/` |
| Bonnes pratiques | `/bonnes-pratiques/` et `/bonnes-pratiques/<id>/` |
| Angles morts | `/bonnes-pratiques/angles-morts/<id>/` |

## Lots

1. **Zones et fiches.** Navigation, accueil, `/cours/`, trois fiches, exports, filtre des statistiques.
2. **Données.** `data/blind_spots.json`, `taxonomy.json`, `rules.json`.
3. **Catalogue.** `data/tools.json`, pages, contraintes et alternatives.
4. **Entonnoir.** Quatre écrans, plan, kit agent, lien partageable, import d'une fiche.
5. **Bonnes pratiques.** Pages sourcées, `llms.txt`, JSON publics.
6. **Pipeline.** Collecte hebdomadaire et pull request de validation.

## Critères de fin

- `npm run build` et la vérification du parcours passent.
- Toutes les questions des fiches sont présentes, dans l'ordre des fichiers de `docs/parcours/`.
- Le corrigé est absent du dépôt et du dossier `out/`.
- Aucune réponse ne quitte le navigateur, statistiques comprises.
- axe ne signale aucune erreur sur les nouvelles pages, en clair, en sombre et sur mobile.
