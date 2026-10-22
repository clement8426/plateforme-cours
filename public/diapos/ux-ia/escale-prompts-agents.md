# Escale — les mêmes contrôles avec un agent

Remplacez {URL} par l’adresse effective de votre serveur local. Travaillez sur une copie si vous voulez conserver la démo volontairement défectueuse.

## Parcours complet

Tu vas auditer puis corriger ma copie locale de la boutique Escale, accessible à {URL}.
Reprends les six blocs du cours UX × IA : 1 cohérence, 2 friction, 3 accessibilité, 4 comportement, 5 microcopie, 6 performances.
Le bloc 4 est théorique : aucune donnée de visiteurs n’existe. Ne crée aucun taux d’abandon ni capture d’analytics.
Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
Pour chaque bloc pratique : indique l’outil disponible (Chrome DevTools MCP, Playwright MCP ou scripts Playwright, axe-core, Lighthouse CLI), rejoue le parcours concerné, enregistre les constats avant, corrige puis rejoue exactement les mêmes contrôles. Si un outil manque, annonce la limite et utilise un équivalent disponible sans inventer de rapport.
Tous les comptes et paiements sont fictifs. Identifiants de test : camille@example.test / Escale2026! ou alex@example.test / Escale2026!.
Termine par les cinq blocs pratiques, chacun avec problème, conséquence, preuve, correction et nouvelle vérification. Sépare les faits mesurés, les observations manuelles et les avis. Fais un parcours complet de commande fictive après correction et signale ce qui reste non vérifié.

## Bloc 1 — Cohérence

### Chrome DevTools MCP

Outil : https://github.com/ChromeDevTools/chrome-devtools-mcp

Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
URL : {URL}
Bloc 1 uniquement. Compare les trois boutons [data-role="ajout-panier"] du catalogue, de la fiche Le Week-end et de la recommandation du panier. Relève leurs styles calculés et les paddings des trois premières zones .card-copy. Harmonise les composants de même rôle sans changer les autres défauts. Vérifie les valeurs calculées après correction et prends des captures aux mêmes dimensions.

## Bloc 2 — Friction

### Playwright MCP / test Playwright

Outil : https://github.com/microsoft/playwright-mcp

Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
URL : {URL}
Bloc 2 uniquement. Ajoute Le Week-end au panier, passe à la commande, remplis tous les champs avec des données fictives puis saisis le code postal invalide « 20 ». Soumets et vérifie quelles valeurs ont disparu. Corrige la perte de saisies dans le gestionnaire de formulaire. Ajoute ou adapte un test Playwright qui exige leur conservation. Exécute le même scénario avant/après, puis termine une commande fictive avec 2000.

## Bloc 3 — Accessibilité

### axe-core + Playwright

Outil : https://playwright.dev/docs/accessibility-testing

Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
URL : {URL}
Bloc 3 : nom accessible. Ouvre /produits/sac-weekend, attends le chargement, exécute axe-core avec Playwright et sauvegarde son JSON. Inspecte le bouton cœur. Corrige son nom accessible selon l’action et son état favori. Vérifie aussi le contraste du prix de taille courante, relève les couleurs et corrige-le en visant au moins 4,5:1. Relance le même scan. Distingue violations corrigées, résultats restants et limites automatiques.

### Playwright MCP · clavier

Outil : https://github.com/microsoft/playwright-mcp

Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
URL : {URL}
Bloc 3 : modale. Sur /confirmation, atteins « Annuler cette commande » uniquement au clavier et ouvre la modale. Vérifie le focus initial, Tab, Maj+Tab, Échap et le retour au déclencheur. Corrige la gestion du focus et l’inertie de l’arrière-plan. Crée un test de ces cinq comportements. Ne considère pas le scan axe comme une preuve de fonctionnement du clavier.

## Bloc 4 — Comportement

### Contentsquare MCP · uniquement avec un vrai compte et des données autorisées

Outil : https://contentsquare.com/platform/capabilities/mcp-server/

Sur mon projet réel, commence par vérifier les données et les outils Contentsquare auxquels tu as accès. Demande-moi le parcours, la période et les segments pertinents. Décris les abandons et comportements observés avec leurs effectifs et leurs limites. Sépare faits, hypothèses et questions à poser aux utilisateurs. Ne fabrique aucune donnée et ne prétends pas expliquer une cause à partir du seul taux d’abandon. Si aucune donnée n’est disponible, indique-le et propose un plan de collecte adapté, sans installer de traceur sans autorisation.

## Bloc 5 — Microcopie

### Playwright MCP + analyse du texte par l’IA

Outil : https://github.com/microsoft/playwright-mcp

Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
URL : {URL}
Bloc 5 uniquement. Sur /confirmation, ouvre l’annulation et relève la question et les deux libellés réels. Explique les interprétations possibles, propose des libellés explicites puis corrige le texte dans ma copie. Vérifie que « Garder » ferme sans annuler et que « Annuler » affiche l’état annulé. Prends deux captures à dimensions identiques. Présente ton jugement rédactionnel comme une proposition, pas comme un résultat mesuré auprès d’utilisateurs.

## Bloc 6 — Performances

### Chrome DevTools MCP · réseau et traces

Outil : https://github.com/ChromeDevTools/chrome-devtools-mcp

Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
URL : {URL}
Bloc 6 : inspecte /produits/sac-weekend. Relève le poids transféré, les dimensions, le type et les en-têtes de cache de /api/image. Enregistre une trace de chargement et identifie les ressources coûteuses. Corrige le format/dimensionnement/cache de l’image dans ma copie. Vérifie les nouveaux en-têtes et le poids dans les mêmes conditions. Inspecte aussi /api/produit : ajoute un retour de chargement accessible sans masquer ni modifier artificiellement sa durée. Fournis les mesures et les limites.

### Lighthouse CLI

Outil : https://developer.chrome.com/docs/lighthouse/overview

Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.
URL : {URL}
Bloc 6 : exécute Lighthouse en CLI sur la fiche Le Week-end avant modification, puis après les optimisations réellement effectuées. Sauvegarde les rapports HTML et JSON. Garde identiques URL, mode mobile, paramètres réseau, fenêtre et version Lighthouse ; consigne les différences de configuration. Compare les métriques et ressources, pas seulement le score. N’invente pas de résultat et n’attribue pas au skeleton un gain de vitesse non mesuré.
