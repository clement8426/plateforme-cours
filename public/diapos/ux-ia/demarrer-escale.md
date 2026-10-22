# Préparer Escale, la démonstration du cours UX × IA

Je souhaite essayer Escale sur mon ordinateur. Prépare le projet pour moi, sans modifier ses défauts volontaires et sans installer Labo UX.

1. Dépôt : https://github.com/clement8426/labo-ux-demos ; dossier exercices/escale. Le dépôt est privé : vérifie mon accès, ou indique que je dois le demander au formateur. Ne remplace pas le projet par une autre boutique.
2. Lis le README. Vérifie Node.js, installe avec npm ci, puis compile avec npm run build. Prépare la version de production, pas une mesure sur le serveur de développement.
3. Démarre le serveur et conserve sa session. Le port prévu est 4201 ; s’il est occupé, identifie le service sans arrêter de processus inconnu, puis choisis un autre port si nécessaire. Vérifie la réponse HTTP et le titre Escale avant de me donner l’adresse réelle cliquable.
4. Laisse-moi d’abord essayer la boutique. Mission : acheter Le Week-end, renseigner des coordonnées fictives, confirmer puis annuler la commande fictive.
5. Compte de test : camille@example.test / Escale2026! ; autre compte : alex@example.test / Escale2026!. Aucune vraie carte bancaire. Pour montrer l’erreur de formulaire, utiliser 20 au lieu de 2000 comme NPA de Neuchâtel.

Le panneau DÉMO UX applique des corrections préparées, sans modifier le code source. Le bloc 4 comportement reste théorique : aucune donnée de visiteurs, aucun taux à inventer.

Ne lance aucun audit et ne corrige rien avant que je le demande. Quand je souhaite travailler avec un agent, utilise une copie du projet et les prompts fournis dans PROMPTS-AGENTS.md : constater, corriger réellement le code, puis rejouer les mêmes vérifications. Activer les bascules n’est pas une correction du code par l’agent.
