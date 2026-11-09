@AGENTS.md

# Consignes propres à Claude Code

- **Mémoire persistante** : `C:\Users\Clem\.claude\projects\C--Users-Clem\memory\` (index `MEMORY.md`). Les fiches `project_labo_*`, `project_annuaire_mcp` et `feedback_general` décrivent ce projet et la façon de travailler avec Clément. Les relire en début de session et les corriger quand un fait change ; ne pas y copier ce que le dépôt dit déjà.
- **Vercel** : le serveur MCP `vercel` est connecté (à l'échelle de l'utilisateur). Il sert à lire l'état des déploiements ; ne rien modifier sur Vercel sans accord.
- **Sous-agents** : seulement quand Clément le demande. Pour une réflexion de fond (sources, critères), les lancer en parallèle avec une consigne de lecture seule, puis faire la synthèse soi-même.
- **Avant de dire que c'est fini** : build, `tsc`, vérifications et un contrôle visuel (captures, thèmes clair et sombre, mobile) ; annoncer les échecs tels quels.
- **Secrets** : ne jamais demander ni afficher un jeton. Ne pas utiliser le jeton de connexion `gh` de Clément comme secret de dépôt.
- **Actions à confirmer d'abord** : push, release, suppression, modification d'un cours, publication d'un nouvel outil dans l'annuaire par ajout manuel sans preuve.
- **Attendre** : un `sleep` seul est bloqué par l'outil Bash ; lancer la commande en arrière-plan et attendre la notification.
