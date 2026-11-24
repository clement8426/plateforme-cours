# Premiers pas avec l’IA — première rédaction

État : intégré au site local le 15 novembre 2026, après mise à jour de la copie locale depuis main. Le cours apparaît dans l’accueil, le catalogue et la rubrique Comprendre l’IA. Aucun déploiement effectué.

## Livrables

- `public/diapos/premiers-pas-ia/index.html` : 32 diapos, avec un seul exercice en trois volets.
- `?lecture=1` : lecture continue, adaptée à la relecture et au redimensionnement du texte.
- Pratique guidée : `/comprendre-ia/premiers-pas-ia/exercices/` (composant `src/composants/PratiqueGuideeIa.tsx`), douze étapes.
- `exercices/01-mini-brief.md` et `exercices/02-consignes-assistant.md` : documents de travail, fictifs.
- `diapos.md` et `contenu.json` : contenu éditorial.

## Progression modulable

Le cours s’utilise à n’importe quel moment, en une ou plusieurs séances. Aucun horaire ni chronomètre n’est imposé. Les durées du brief fictif sont uniquement des contraintes de l’exercice.

## Présentation

Gabarit et lecteur du Harnais, alignés sur les quatre présentations publiées. Flèches, Page précédente/suivante et Espace : navigation par étapes. Un numéro puis Entrée : accès direct. G : sommaire ; T : thème ; F : plein écran ; B : écran noir ; N : vue présentateur ; Maj+N : vue présentateur intégrée. Lecture continue avec `?lecture=1`, impression A4 paysage. Sur téléphone, la scène utilise un format 16:11, plus haut que les autres cours ; utiliser la lecture texte pour un texte redimensionnable.

Le relevé complet des variables et variantes est dans `charte-inventaire.json` et son analyse dans `charte-et-alignement.md`. Aucune bande décorative colorée sur un côté n’est ajoutée.

## Accès et sources

Méthode commune : instructions enregistrées localement puis collées dans une nouvelle conversation. Les fonctions de personnalisation des produits ne sont pas interchangeables. OpenAI restreint la création des GPT ; Google fait évoluer les Gems vers des compétences ; Claude propose des instructions de projet. Les sources officielles sont liées dans les diapos, vérifiées le 15 novembre 2026. Les accès, autorisations scolaires et conditions d’âge doivent être vérifiés avec les comptes utilisés avant la séance. Le cours n’impose pas la création de comptes personnels.

La préparation de la séance et les repères du formateur sont conservés hors du dépôt public, dans le dossier d’artefacts de ce chat. Les démonstrations externes Hugging Face n’ont pas été exécutées lors de la rédaction.

## Intégration au site

- Page du cours : `/comprendre-ia/premiers-pas-ia/`.
- Lecteur intégré : `/comprendre-ia/premiers-pas-ia/diapos/` ; les liens `?diapo=N` ouvrent la partie attendue.
- Sources et lexique : `/comprendre-ia/premiers-pas-ia/sources/`.
- Exercices dans la navigation du site : `/comprendre-ia/premiers-pas-ia/exercices/`.
- Le dossier HTML détaillé et les fichiers restent disponibles dans `public/diapos/premiers-pas-ia/exercices/`.
- L’aperçu du catalogue est une capture de la première diapo ; la version du service worker passe à v64.
- Les dix-huit sources et huit termes sont centralisés dans `src/contenu/premiers-pas-ia-sources.json` et repris par le générateur des diapos.

## Tester

Après `npm run build`, lancer `$env:PORT='3111'; node scripts/servir.mjs` dans PowerShell. Ouvrir `http://127.0.0.1:3111/` pour parcourir le site complet. Le serveur 3113 utilisé pendant la rédaction ne sert que les fichiers publics : il ne permet pas de naviguer dans les pages du site.

## Avant publication

Relire le contenu et les durées, puis exécuter tous les contrôles requis par AGENTS.md avant un éventuel push autorisé. La compilation, TypeScript et le contrôle ciblé du parcours d’intégration sont réalisés localement ; cela ne constitue pas une publication.

## Révision de lisibilité et interactions

Le cours utilise désormais une scène 1600 × 1100 et des textes de contenu de 42 px avant mise à l’échelle (contre 28 à 32 px dans le gabarit initial). Le lecteur du site adopte le même rapport pour ce cours seulement. Six diapos comportent des modules : explorer les outils, comparer chat/assistant/agent, composer une demande, vérifier un calcul, préparer/exporter un assistant, puis suivre trois tests réels. Toutes les interactions sont locales ; elles n’appellent aucun modèle et ne stockent aucune saisie. Les fichiers interactions.json, interactions.css et interactions.js complètent le générateur.

## Ouverture animée

La première diapo possède une composition dédiée : fond bleu du Labo, grand titre, fiole animée, bulles de conversation et éléments en mouvement. Le fichier ouverture.html alimente le générateur ; ouverture.css et le module interactions.js gèrent la présentation, la pause et le mouvement réduit. Le bouton de démarrage ouvre la diapo 2. Les autres diapos ne changent pas. Animation, pause, démarrage et contrastes contrôlés.

La dernière diapo « Demander. Cadrer. Vérifier. » a été retirée à la demande de Clément. Les annexes de sources terminent désormais le support.

## Captures réelles

La diapo 8 montre les interfaces de Gemini et Grok, capturées le 15 novembre 2026 sans compte connecté, avec une demande fictive préparée mais non envoyée. Les images sont locales, sélectionnables et agrandissables. La provenance est dans captures-provenance.json. Les pages de protection d’accès rencontrées sur d’autres outils ne sont pas utilisées comme captures de démonstration.

## Révision des sources et de la temporalité

Aucun horaire de cours, créneau de journée ou chronomètre. Les phases de travail sont librement répartissables ; seules les durées du projet fictif demeurent des données à vérifier. Les liens externes des diapos sont centralisés dans sources-par-diapo.json et repris dans CONFIG.sources ; le registre verification-sources.json précise la vérification documentaire. Les exercices citent leur brief fictif, sans le présenter comme une preuve scientifique. La limite des contextes longs est attribuée à l’étude de 2023, et les différences mémoire / fil / instructions sont précisées.

## Guide illustré pour débutants

La pratique guidée du site comprend huit étapes avec six captures réelles : ouvrir Gemini, copier/coller et envoyer une demande, lire la réponse, préciser la demande, préparer les consignes localement, les fournir dans un nouveau chat, tester et enregistrer le bilan. Le guide explique les onglets, les raccourcis Windows/Mac, le téléchargement, les résultats attendus et les blocages. Ses saisies restent en mémoire de page et s’exportent en texte ; aucun envoi du guide vers un serveur. La provenance des captures est dans captures-guide-provenance.json. Les réponses d’exemple sont réellement générées ; elles ne sont pas un corrigé.

## Révision du 24 novembre 2026 : un seul cours, un seul exercice en trois volets

Demandes de Clément : un ordre plus logique pour les débutants, ChatGPT à la place de Gemini, retirer la mission Déclic numérique et faire un seul exercice « Votre premier assistant » en volets, pour montrer qu’une discussion ne garde rien, puis faire créer un assistant. Non publié.

- **32 diapos** : essayer un chat (1 à 7, volet 1 en diapo 7), vérifier et se repérer (8 à 12), de la discussion à l’assistant (13 à 26 : volet 2 en diapo 13, GPT, projet et plugin en 17 et 18, volet 3 en 23 et 24), agents et suite (27 à 30), sources (31 et 32).
- **Mission retirée** : les diapos de la mission et de Hugging Face, la section de la page des exercices, l’exercice complémentaire du catalogue. Les fichiers `03` à `07`, `dossier-clairlieu.zip` et `exercices/index.html` ont été supprimés à la demande de Clément (le 24 novembre 2026).
- **Pratique guidée, douze étapes** : volet 1 « Bien demander » (1 à 4), volet 2 « Une discussion ne garde rien » (5 à 7 : demande sans cadre, cadre recollé, nouvelle discussion qui a oublié), volet 3 « Créer votre assistant » (8 à 11 : projet, instructions, deux conversations, trois tests), bilan (12).
- **Pourquoi un projet et pas un GPT** : d’après l’aide d’OpenAI lue le 24 novembre 2026, les comptes personnels ne peuvent plus créer de GPT ; retrait standard le 11 décembre 2026 au profit des plugins ; OpenAI propose le projet pour un travail continu. Choix validé par Clément.
- **Projet de démonstration** : « Atelier ClairLieu », créé dans le compte ChatGPT de Clément le 24 novembre 2026, mémoire « projet seulement », avec deux conversations de test. Il peut être supprimé depuis ses paramètres une fois les captures validées.
- **Captures** : volets 1 et 2 sans compte (1280 × 850). Volet 3 dans le panneau navigateur avec le compte de Clément (800 × 531) ; l’historique et l’avatar sont recouverts de barres neutres. Détail dans `captures-guide-provenance.json`. Les anciennes captures Gemini du guide ont été supprimées ; `captures/gemini-exemple.png` et `captures/grok-exemple.png` restent utilisées par la diapo 3.
- **Après le 11 décembre 2026** : relire les diapos 17 et 18 (GPT, plugins) et l’introduction du guide.
- Modules interactifs : 3 (captures), 5 (demande), 8 (vérifier), 11 (outils), 22 (instructions), 24 (tests), 27 (chat, assistant, agent). Service worker : v66.
