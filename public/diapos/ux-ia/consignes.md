# UX × IA — Les six consignes du cours

À adapter à votre projet et à un agent disposant des outils nécessaires. Ces consignes ne sont pas une installation du plugin.

## Le contexte à fournir

- Projet local ou environnement de test : [dossier et adresse de test].
- Objectif et résultat attendu : [tâche et preuve de réussite].
- Cible et contexte : [personnes, appareil, situation].
- Périmètre : [pages, compte fictif, actions autorisées et limite d’arrêt].
- Intention graphique et ton : [règles à respecter et exemples].

Avant de tester, demander les informations manquantes et annoncer les contrôles réellement disponibles. Ne pas inventer un résultat, un taux ou une mesure. Distinguer les mesures et observations, les hypothèses et les avis. Signaler les contrôles non exécutés.

Les modifications sont proposées avant d’être appliquées selon les autorisations convenues. Après correction, refaire les contrôles et le parcours.

## 1. design system : comparer des composants de même rôle

Compare ces [pages de test] à 375, 768 et 1440 px. Relève les styles des titres, boutons et champs de même rôle. Donne les valeurs observées et les écarts. Demande-moi l’intention avant de proposer une correction.

## 2. friction : explorer un parcours et relever les obstacles

Sur cette copie de test, réalise [objectif] avec le compte fictif prévu. Respecte les limites convenues. Relève les étapes bloquées, erreurs, pertes de saisie et confirmations absentes. Sépare ce que tu observes de ce qu’il faudrait vérifier avec des utilisateurs.

## 3. accessibilité : mesurer et compléter l’évaluation

Sur ces [pages de test], lance un contrôle d’accessibilité disponible. Indique l’outil, la page et l’état analysés. Explique qui est gêné par chaque défaut. Signale ce qui reste à vérifier au clavier, avec un lecteur d’écran et sur le sens des textes. Propose les corrections avant de modifier.

## 4. comportement : lire les données sans inventer les causes

À partir de ces [données] et du tunnel [étapes], décris les passages et abandons observables. Pour chaque taux, précise la période et ce qu’on compte. Sépare les chiffres des hypothèses. Si une analyse n’est pas possible, indique les données manquantes.

## 5. microcopie : observer les messages, puis proposer

Sur ce [formulaire de test], provoque les erreurs prévues : champ vide, e-mail invalide. Relève les messages réellement affichés. Pour [la cible], lesquels sont vagues ou techniques ? Propose deux variantes dans ce ton : [exemples]. Ne change pas le sens de l’action ni les termes métier.

## 6. performance : mesurer les délais et expliquer l’attente

Sur ces [pages de test], lance Lighthouse et explique les ressources ou requêtes à examiner. Si tes outils le permettent, mesure le délai avant un retour visible après [actions]. Sinon, dis ce qui manque. Propose une amélioration, puis une mesure avant/après dans les mêmes conditions.

## Limites du kit Labo UX actuel

Labo UX couvre une partie de ces contrôles. Les comparaisons entre plusieurs pages et largeurs, le clavier, tous les états d’erreur et les délais après clic demandent des vérifications complémentaires. Lighthouse ne vérifie pas les requêtes SQL, Redis ou le fonctionnement d’une application native.
