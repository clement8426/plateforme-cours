window.ESCALE_PRATIQUE = {
  "repo": "https://github.com/clement8426/escale-eleves",
  "globalPrompt": "Lis DEMARRER.md. Prépare l’atelier Escale sur mon ordinateur, démarre le parcours et donne-moi son lien. Accompagne-moi comme une personne débutante. Ne corrige rien pour le moment et ne fais pas toutes les missions à ma place.",
  "cases": [
    {
      "key": "escale-coherence",
      "block": 1,
      "title": "Bloc 1 · Les mêmes boutons, les mêmes repères",
      "question": "Ces boutons font-ils vraiment la même chose ?",
      "before": "scene-carte-avant.png",
      "after": "scene-carte-apres.png",
      "proofBefore": "styles-avant.png",
      "proofAfter": "styles-apres.png",
      "tool": "Chrome DevTools · Éléments",
      "steps": [
        "Inspecter « Ajouter au panier » sur les trois pages.",
        "Comparer rayon, couleur et padding dans Calculé.",
        "Comparer les marges internes des cartes du catalogue."
      ],
      "result": "Un composant commun pour les mêmes rôles. Une règle d’espacement pour les mêmes cartes.",
      "limit": "Une différence de style n’est pas toujours une erreur : ici, les rôles sont comparables.",
      "switches": "1 et 2",
      "caption": "Carte réelle du catalogue ; la preuve DevTools montre les valeurs du bouton de la fiche.",
      "human": [
        {
          "tool": "Chrome DevTools · Éléments",
          "source": "https://developer.chrome.com/docs/devtools/css/reference/",
          "steps": [
            "Ouvrez la boutique en grand. Faites un clic droit sur « Ajouter au panier », puis Inspecter.",
            "Dans DevTools, ouvrez Calculé / Computed. Cherchez padding (espace intérieur), border-radius (arrondi) et background-color (couleur).",
            "Comparez le catalogue, Le Week-end et le panier. Inspectez aussi les zones de texte des trois premières cartes : leurs espaces intérieurs diffèrent.",
            "Dans l’atelier élève, « Vérifier automatiquement mes observations » lance un script, pas un agent IA. Lisez son fonctionnement avant de le lancer.",
            "Pour corriger : ouvrez la consigne de cette mission dans l’atelier, créez un point de retour et faites modifier son code par votre agent. Relancez le même contrôle."
          ],
          "expected": "Vous devriez relever des valeurs différentes pour des boutons de même rôle et des cartes comparables. Une variation graphique n’est pas toujours une erreur : expliquez ce qui gêne ici."
        }
      ],
      "agents": [
        {
          "tool": "Une mission à la fois",
          "prompt": "Je fais le bloc 1 dans l’atelier Escale élève. Lis AGENTS.md. URL locale : {URL}. Dossier de cette mission uniquement : travail/bloc-1/. Comparer les styles calculés des boutons de même rôle sur le catalogue, Le Week-end et le panier, ainsi que les espaces intérieurs des trois premières cartes. Commence en lecture seule avec les MCP réellement connectés, ou annonce leur absence. Exécute node atelier.mjs auditer 1 pour conserver le constat dans l’atelier. Explique les actions et les preuves. Attends ma demande avant de corriger. Pour une correction autorisée : crée d’abord une sauvegarde avec node atelier.mjs sauvegarder 1, modifie réellement cette copie puis exécute node atelier.mjs verifier 1. Ne modifie ni le modèle, ni les vérificateurs, ni les autres missions. Aucun interrupteur ne remplace une correction du code."
        }
      ],
      "sources": [
        {
          "t": "Chrome DevTools",
          "u": "https://developer.chrome.com/docs/devtools/css/reference"
        }
      ]
    },
    {
      "key": "escale-friction",
      "block": 2,
      "title": "Bloc 2 · Une erreur, toutes les saisies perdues",
      "question": "Que devrait conserver le formulaire ?",
      "before": "scene-formulaire-avant.png",
      "after": "scene-formulaire-apres.png",
      "proofBefore": "playwright-avant.png",
      "proofAfter": "playwright-apres.png",
      "tool": "Navigateur · Playwright",
      "steps": [
        "Remplir les coordonnées fictives et mettre « 20 » comme NPA.",
        "Envoyer, puis regarder si le nom est encore présent.",
        "Rejouer le même contrôle Playwright après correction."
      ],
      "result": "Les saisies restent en place. Le message explique comment corriger le NPA.",
      "limit": "Le rouge avant correction est l’échec attendu du contrôle de conservation.",
      "switches": "3",
      "caption": "Même formulaire, même erreur de NPA. Le test exige que « Camille Démo » reste présent.",
      "reports": [
        [
          "Playwright avant",
          "playwright-avant/index.html"
        ],
        [
          "Playwright après",
          "playwright-apres/index.html"
        ]
      ],
      "human": [
        {
          "tool": "Le navigateur, puis Playwright",
          "source": "https://playwright.dev/docs/trace-viewer",
          "steps": [
            "Dans la boutique en grand, remplissez les six champs avec les coordonnées fictives. Mettez 20 comme NPA.",
            "Confirmez la commande fictive. Regardez si le nom, l’e-mail et l’adresse sont toujours présents.",
            "Votre attente : seul le NPA est à corriger ; les autres informations ne devraient pas disparaître.",
            "Dans l’atelier élève, « Vérifier automatiquement mes observations » lance un script, pas un agent IA. Lisez son fonctionnement avant de le lancer.",
            "Pour corriger : ouvrez la consigne de cette mission dans l’atelier, créez un point de retour et faites modifier son code par votre agent. Relancez le même contrôle."
          ],
          "expected": "Dans la version de départ, les six champs se vident. Le contrôle va rejouer exactement cette erreur et vérifier les six valeurs."
        }
      ],
      "agents": [
        {
          "tool": "Une mission à la fois",
          "prompt": "Je fais le bloc 2 dans l’atelier Escale élève. Lis AGENTS.md. URL locale : {URL}. Dossier de cette mission uniquement : travail/bloc-2/. Vérifier la conservation des six coordonnées après une erreur de NPA : 20 au lieu de 2000. Commence en lecture seule avec les MCP réellement connectés, ou annonce leur absence. Exécute node atelier.mjs auditer 2 pour conserver le constat dans l’atelier. Explique les actions et les preuves. Attends ma demande avant de corriger. Pour une correction autorisée : crée d’abord une sauvegarde avec node atelier.mjs sauvegarder 2, modifie réellement cette copie puis exécute node atelier.mjs verifier 2. Ne modifie ni le modèle, ni les vérificateurs, ni les autres missions. Aucun interrupteur ne remplace une correction du code."
        }
      ],
      "sources": [
        {
          "t": "Navigateur",
          "u": "https://playwright.dev/docs/test-ui-mode"
        }
      ]
    },
    {
      "key": "escale-accessibilite",
      "block": 3,
      "title": "Bloc 3 · Un cœur sans nom, un prix trop clair",
      "question": "Un bouton visible est-il forcément compréhensible ?",
      "before": "scene-accessibilite-avant.png",
      "after": "scene-accessibilite-apres.png",
      "proofBefore": "axe-avant.png",
      "proofAfter": "axe-apres.png",
      "tool": "axe-core · Playwright",
      "steps": [
        "Ouvrir Le Week-end et attendre son chargement.",
        "Scanner le nom du bouton et le contraste du prix.",
        "Corriger, puis relancer le même scan sur la même page."
      ],
      "result": "Le cœur reçoit un nom accessible. Le prix retrouve un contraste vérifié.",
      "limit": "Zéro violation automatique sur cette page ne signifie pas conformité complète du site.",
      "switches": "4 et 9",
      "caption": "Rapport réel du moteur axe-core 4.14.0 avec Playwright ; ce n’est pas l’extension axe DevTools.",
      "humanOnly": 0,
      "agentOnly": 0,
      "reports": [
        [
          "axe avant",
          "axe-avant.html"
        ],
        [
          "axe après",
          "axe-apres.html"
        ]
      ],
      "human": [
        {
          "tool": "axe-core et un essai au clavier",
          "source": "https://playwright.dev/docs/accessibility-testing",
          "steps": [
            "Ouvrez Le Week-end en grand. Examinez le cœur et le prix. Un scan axe-core peut signaler le nom absent du bouton et un contraste insuffisant.",
            "Ouvrez la confirmation depuis le lien de l’étape J’essaie. Atteignez « Annuler cette commande » au clavier et activez-le avec Entrée.",
            "Dans la fenêtre, essayez Tab, Maj+Tab et Échap : le focus devrait rester dedans, puis revenir au bouton après fermeture.",
            "Dans l’atelier élève, « Vérifier automatiquement mes observations » lance un script, pas un agent IA. Lisez son fonctionnement avant de le lancer.",
            "Pour corriger : ouvrez la consigne de cette mission dans l’atelier, créez un point de retour et faites modifier son code par votre agent. Relancez le même contrôle."
          ],
          "expected": "Le scan et le clavier sont complémentaires. Aucun résultat automatique ne prouve la conformité complète du site."
        }
      ],
      "agents": [
        {
          "tool": "Une mission à la fois",
          "prompt": "Je fais le bloc 3 dans l’atelier Escale élève. Lis AGENTS.md. URL locale : {URL}. Dossier de cette mission uniquement : travail/bloc-3/. Examiner le nom accessible du cœur et le contraste, puis le focus, Tab, Maj+Tab et Échap dans la fenêtre d’annulation. Commence en lecture seule avec les MCP réellement connectés, ou annonce leur absence. Exécute node atelier.mjs auditer 3 pour conserver le constat dans l’atelier. Explique les actions et les preuves. Attends ma demande avant de corriger. Pour une correction autorisée : crée d’abord une sauvegarde avec node atelier.mjs sauvegarder 3, modifie réellement cette copie puis exécute node atelier.mjs verifier 3. Ne modifie ni le modèle, ni les vérificateurs, ni les autres missions. Aucun interrupteur ne remplace une correction du code."
        }
      ],
      "sources": [
        {
          "t": "axe-core",
          "u": "https://playwright.dev/docs/accessibility-testing"
        },
        {
          "t": "Clavier",
          "u": "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
        }
      ]
    },
    {
      "key": "escale-clavier",
      "block": 3,
      "title": "Bloc 3 · La modale à l’épreuve du clavier",
      "question": "Peut-on garder sa commande sans toucher la souris ?",
      "before": "clavier-avant.png",
      "after": "clavier-apres.png",
      "proofBefore": "clavier-avant.png",
      "proofAfter": "clavier-apres.png",
      "tool": "Clavier · Tab, Maj+Tab, Échap",
      "steps": [
        "Atteindre « Annuler cette commande » avec Tab et Entrée.",
        "Essayer les actions puis Échap : avant, le focus reste derrière.",
        "Après : rester dans la modale et revenir au déclencheur."
      ],
      "result": "Le focus entre dans la modale, y reste et revient au bouton après fermeture.",
      "limit": "Une capture situe le focus ; le fonctionnement demande de rejouer le parcours.",
      "switches": "5",
      "caption": "Capture après une tabulation. Pour isoler le clavier, corriger le texte séparément.",
      "humanOnly": 1,
      "agentOnly": 1,
      "human": [
        {
          "tool": "axe-core et un essai au clavier",
          "source": "https://playwright.dev/docs/accessibility-testing",
          "steps": [
            "Ouvrez Le Week-end en grand. Examinez le cœur et le prix. Un scan axe-core peut signaler le nom absent du bouton et un contraste insuffisant.",
            "Ouvrez la confirmation depuis le lien de l’étape J’essaie. Atteignez « Annuler cette commande » au clavier et activez-le avec Entrée.",
            "Dans la fenêtre, essayez Tab, Maj+Tab et Échap : le focus devrait rester dedans, puis revenir au bouton après fermeture.",
            "Dans l’atelier élève, « Vérifier automatiquement mes observations » lance un script, pas un agent IA. Lisez son fonctionnement avant de le lancer.",
            "Pour corriger : ouvrez la consigne de cette mission dans l’atelier, créez un point de retour et faites modifier son code par votre agent. Relancez le même contrôle."
          ],
          "expected": "Le scan et le clavier sont complémentaires. Aucun résultat automatique ne prouve la conformité complète du site."
        }
      ],
      "agents": [
        {
          "tool": "Une mission à la fois",
          "prompt": "Je fais le bloc 3 dans l’atelier Escale élève. Lis AGENTS.md. URL locale : {URL}. Dossier de cette mission uniquement : travail/bloc-3/. Examiner le nom accessible du cœur et le contraste, puis le focus, Tab, Maj+Tab et Échap dans la fenêtre d’annulation. Commence en lecture seule avec les MCP réellement connectés, ou annonce leur absence. Exécute node atelier.mjs auditer 3 pour conserver le constat dans l’atelier. Explique les actions et les preuves. Attends ma demande avant de corriger. Pour une correction autorisée : crée d’abord une sauvegarde avec node atelier.mjs sauvegarder 3, modifie réellement cette copie puis exécute node atelier.mjs verifier 3. Ne modifie ni le modèle, ni les vérificateurs, ni les autres missions. Aucun interrupteur ne remplace une correction du code."
        }
      ],
      "sources": [
        {
          "t": "axe-core",
          "u": "https://playwright.dev/docs/accessibility-testing"
        },
        {
          "t": "Clavier",
          "u": "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
        }
      ]
    },
    {
      "key": "escale-comportement",
      "block": 4,
      "title": "Bloc 4 · Les comportements demandent de vraies visites",
      "theory": true,
      "human": [
        {
          "tool": "Discussion · analyse comportementale",
          "source": "https://contentsquare.com/platform/capabilities/mcp-server/",
          "steps": [
            "Expliquez qu’une boutique locale sans visiteurs ne fournit pas de véritable entonnoir comportemental.",
            "Sur un projet réel, demandez : à quelle étape les personnes quittent-elles le parcours ? Quels clics ou difficultés reviennent ?",
            "Les données peuvent orienter une enquête ; elles ne prouvent pas la cause d’un abandon. Il faut confronter les hypothèses au contexte et aux utilisateurs."
          ],
          "expected": "Pas de fausse capture Hotjar ou Contentsquare, pas de taux d’abandon inventé, pas de correction activable pour ce bloc."
        }
      ],
      "agents": [
        {
          "tool": "Contentsquare MCP · uniquement avec un vrai compte et des données autorisées",
          "url": "https://contentsquare.com/platform/capabilities/mcp-server/",
          "prompt": "Sur mon projet réel, commence par vérifier les données et les outils Contentsquare auxquels tu as accès. Demande-moi le parcours, la période et les segments pertinents. Décris les abandons et comportements observés avec leurs effectifs et leurs limites. Sépare faits, hypothèses et questions à poser aux utilisateurs. Ne fabrique aucune donnée et ne prétends pas expliquer une cause à partir du seul taux d’abandon. Si aucune donnée n’est disponible, indique-le et propose un plan de collecte adapté, sans installer de traceur sans autorisation."
        }
      ],
      "sources": [
        {
          "t": "Discussion",
          "u": "https://contentsquare.com/platform/capabilities/mcp-server/"
        }
      ]
    },
    {
      "key": "escale-microcopie",
      "block": 5,
      "title": "Bloc 5 · « Oui » veut dire garder ou annuler ?",
      "question": "À main levée : quel bouton garde la commande ?",
      "before": "scene-microcopie-avant.png",
      "after": "scene-microcopie-apres.png",
      "proofBefore": "microcopie-avant.png",
      "proofAfter": "microcopie-apres.png",
      "tool": "Lecture en contexte · vote de la salle",
      "steps": [
        "Ouvrir la confirmation d’annulation.",
        "Lire la double négation et faire voter Oui / Non.",
        "Afficher les libellés explicites puis tester les deux actions."
      ],
      "result": "« Garder ma commande » et « Annuler la commande » annoncent le résultat du clic.",
      "limit": "Le vote illustre une ambiguïté ; il ne constitue pas une étude représentative.",
      "switches": "6",
      "caption": "Même modale, clavier corrigé dans les deux captures pour isoler le texte.",
      "human": [
        {
          "tool": "Lecture en contexte et Playwright",
          "source": "https://playwright.dev/docs/intro",
          "steps": [
            "Dans la confirmation, ouvrez « Annuler cette commande ». Lisez la question et les réponses Oui / Non.",
            "Décidez quel bouton devrait garder la commande. Cliquez, puis regardez ce qui s’est réellement passé.",
            "Proposez deux libellés qui annoncent les actions : garder ou annuler. Le sens doit être vérifié avec des personnes.",
            "Dans l’atelier élève, « Vérifier automatiquement mes observations » lance un script, pas un agent IA. Lisez son fonctionnement avant de le lancer.",
            "Pour corriger : ouvrez la consigne de cette mission dans l’atelier, créez un point de retour et faites modifier son code par votre agent. Relancez le même contrôle."
          ],
          "expected": "Le problème est l’effort pour interpréter une double négation. Un script peut contrôler les textes et les actions, pas prouver que tout le monde les comprend."
        }
      ],
      "agents": [
        {
          "tool": "Une mission à la fois",
          "prompt": "Je fais le bloc 5 dans l’atelier Escale élève. Lis AGENTS.md. URL locale : {URL}. Dossier de cette mission uniquement : travail/bloc-5/. Examiner le titre et les actions de la fenêtre d’annulation, sans confondre présence de textes explicites et compréhension mesurée. Commence en lecture seule avec les MCP réellement connectés, ou annonce leur absence. Exécute node atelier.mjs auditer 5 pour conserver le constat dans l’atelier. Explique les actions et les preuves. Attends ma demande avant de corriger. Pour une correction autorisée : crée d’abord une sauvegarde avec node atelier.mjs sauvegarder 5, modifie réellement cette copie puis exécute node atelier.mjs verifier 5. Ne modifie ni le modèle, ni les vérificateurs, ni les autres missions. Aucun interrupteur ne remplace une correction du code."
        }
      ],
      "sources": [
        {
          "t": "Lecture en contexte",
          "u": "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
        }
      ]
    },
    {
      "key": "escale-performance",
      "block": 6,
      "title": "Bloc 6 · Une image de 11,54 Mo pour un seul produit",
      "question": "Qu’est-ce qui pèse dans ce chargement ?",
      "before": "network-avant.png",
      "after": "network-apres.png",
      "proofBefore": "lighthouse-avant.png",
      "proofAfter": "lighthouse-apres.png",
      "tool": "Chrome DevTools · Network et Lighthouse",
      "steps": [
        "Ouvrir Network, désactiver le cache et recharger.",
        "Filtrer « api/image » : poids, type et Cache-Control.",
        "Comparer deux rapports Lighthouse de même configuration."
      ],
      "result": "PNG sans compression : 11,54 Mo. WebP adapté : 103 ko, avec cache HTTP explicite.",
      "limit": "Captures du 22 octobre 2026. Scores et durées varient selon les conditions.",
      "switches": "7",
      "caption": "Mesures réelles : 11 540 161 octets contre 103 292. Cache désactivé pour comparer les transferts.",
      "reports": [
        [
          "Lighthouse avant",
          "lighthouse-avant.html"
        ],
        [
          "Lighthouse après",
          "lighthouse-apres.html"
        ]
      ],
      "human": [
        {
          "tool": "Chrome DevTools · Network, puis Lighthouse",
          "source": "https://developer.chrome.com/docs/lighthouse/overview",
          "steps": [
            "Ouvrez Le Week-end en grand. Clic droit → Inspecter → Network / Réseau. Rechargez et repérez la requête d’image ; ouvrez ses en-têtes pour lire Cache-Control.",
            "Utilisez « Rejouer le chargement ». Regardez ce qui indique que le produit arrive ; un skeleton explique l’attente sans la raccourcir.",
            "Pour les mesures Lighthouse, utilisez le contrôle ci-dessous : il prépare une version de production locale et conserve le rapport HTML.",
            "Dans l’atelier élève, « Vérifier automatiquement mes observations » lance un script, pas un agent IA. Lisez son fonctionnement avant de le lancer.",
            "Pour corriger : ouvrez la consigne de cette mission dans l’atelier, créez un point de retour et faites modifier son code par votre agent. Relancez le même contrôle."
          ],
          "expected": "Dans la version de départ, l’image est lourde, le cache est désactivé et aucun statut n’explique l’attente. Le score Lighthouse varie avec les conditions."
        }
      ],
      "agents": [
        {
          "tool": "Une mission à la fois",
          "prompt": "Je fais le bloc 6 dans l’atelier Escale élève. Lis AGENTS.md. URL locale : {URL}. Dossier de cette mission uniquement : travail/bloc-6/. Examiner le poids et le cache de l’image, le retour de chargement et le rapport Lighthouse en production. Commence en lecture seule avec les MCP réellement connectés, ou annonce leur absence. Exécute node atelier.mjs auditer 6 pour conserver le constat dans l’atelier. Explique les actions et les preuves. Attends ma demande avant de corriger. Pour une correction autorisée : crée d’abord une sauvegarde avec node atelier.mjs sauvegarder 6, modifie réellement cette copie puis exécute node atelier.mjs verifier 6. Ne modifie ni le modèle, ni les vérificateurs, ni les autres missions. Aucun interrupteur ne remplace une correction du code."
        }
      ],
      "sources": [
        {
          "t": "Chrome DevTools",
          "u": "https://developer.chrome.com/docs/devtools/network/"
        },
        {
          "t": "Lighthouse",
          "u": "https://developer.chrome.com/docs/lighthouse/overview"
        }
      ]
    },
    {
      "key": "escale-attente",
      "block": 6,
      "title": "Bloc 6 · Trois secondes : vide ou retour visuel ?",
      "question": "La version avec un skeleton est-elle plus rapide ?",
      "before": "scene-attente-avant.png",
      "after": "scene-attente-apres.png",
      "proofBefore": "skeleton-avant.png",
      "proofAfter": "skeleton-apres.png",
      "tool": "Chrome DevTools · Network",
      "steps": [
        "Filtrer « api/produit » dans Network.",
        "Rejouer sans puis avec le skeleton.",
        "Comparer l’attente et la durée réelle de la requête."
      ],
      "result": "Le skeleton explique l’attente. Le délai serveur volontaire reste de trois secondes.",
      "limit": "Un retour visuel ne prouve ni un gain de vitesse ni une préférence universelle.",
      "switches": "8",
      "caption": "Deux captures pendant le même délai serveur. La durée totale peut légèrement varier.",
      "humanOnly": 0,
      "agentOnly": 0,
      "human": [
        {
          "tool": "Chrome DevTools · Network, puis Lighthouse",
          "source": "https://developer.chrome.com/docs/lighthouse/overview",
          "steps": [
            "Ouvrez Le Week-end en grand. Clic droit → Inspecter → Network / Réseau. Rechargez et repérez la requête d’image ; ouvrez ses en-têtes pour lire Cache-Control.",
            "Utilisez « Rejouer le chargement ». Regardez ce qui indique que le produit arrive ; un skeleton explique l’attente sans la raccourcir.",
            "Pour les mesures Lighthouse, utilisez le contrôle ci-dessous : il prépare une version de production locale et conserve le rapport HTML.",
            "Dans l’atelier élève, « Vérifier automatiquement mes observations » lance un script, pas un agent IA. Lisez son fonctionnement avant de le lancer.",
            "Pour corriger : ouvrez la consigne de cette mission dans l’atelier, créez un point de retour et faites modifier son code par votre agent. Relancez le même contrôle."
          ],
          "expected": "Dans la version de départ, l’image est lourde, le cache est désactivé et aucun statut n’explique l’attente. Le score Lighthouse varie avec les conditions."
        }
      ],
      "agents": [
        {
          "tool": "Une mission à la fois",
          "prompt": "Je fais le bloc 6 dans l’atelier Escale élève. Lis AGENTS.md. URL locale : {URL}. Dossier de cette mission uniquement : travail/bloc-6/. Examiner le poids et le cache de l’image, le retour de chargement et le rapport Lighthouse en production. Commence en lecture seule avec les MCP réellement connectés, ou annonce leur absence. Exécute node atelier.mjs auditer 6 pour conserver le constat dans l’atelier. Explique les actions et les preuves. Attends ma demande avant de corriger. Pour une correction autorisée : crée d’abord une sauvegarde avec node atelier.mjs sauvegarder 6, modifie réellement cette copie puis exécute node atelier.mjs verifier 6. Ne modifie ni le modèle, ni les vérificateurs, ni les autres missions. Aucun interrupteur ne remplace une correction du code."
        }
      ],
      "sources": [
        {
          "t": "Chrome DevTools",
          "u": "https://developer.chrome.com/docs/devtools/network/"
        },
        {
          "t": "Lighthouse",
          "u": "https://developer.chrome.com/docs/lighthouse/overview"
        }
      ]
    }
  ]
};
