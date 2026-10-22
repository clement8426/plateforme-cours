window.ESCALE_PRATIQUE = {
  "repo": "https://github.com/clement8426/labo-ux-demos/tree/main/exercices/escale",
  "globalPrompt": "Tu vas auditer puis corriger ma copie locale de la boutique Escale, accessible à {URL}.\nReprends les six blocs du cours UX × IA : 1 cohérence, 2 friction, 3 accessibilité, 4 comportement, 5 microcopie, 6 performances.\nLe bloc 4 est théorique : aucune donnée de visiteurs n’existe. Ne crée aucun taux d’abandon ni capture d’analytics.\nTravaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nPour chaque bloc pratique : indique l’outil disponible (Chrome DevTools MCP, Playwright MCP ou scripts Playwright, axe-core, Lighthouse CLI), rejoue le parcours concerné, enregistre les constats avant, corrige puis rejoue exactement les mêmes contrôles. Si un outil manque, annonce la limite et utilise un équivalent disponible sans inventer de rapport.\nTous les comptes et paiements sont fictifs. Identifiants de test : camille@example.test / Escale2026! ou alex@example.test / Escale2026!.\nTermine par les cinq blocs pratiques, chacun avec problème, conséquence, preuve, correction et nouvelle vérification. Sépare les faits mesurés, les observations manuelles et les avis. Fais un parcours complet de commande fictive après correction et signale ce qui reste non vérifié.",
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
          "source": "https://developer.chrome.com/docs/devtools/css/reference",
          "steps": [
            "Ouvrez la collection. Gardez les corrections 1 et 2 désactivées. Descendez jusqu’aux trois premières cartes.",
            "Appuyez sur F12. Cliquez sur la flèche de sélection en haut à gauche de DevTools, puis sur « Ajouter au panier » dans la première carte.",
            "Dans le volet de droite, ouvrez Calculé / Computed. Cherchez padding, border-radius et background-color. Notez les valeurs.",
            "Ouvrez Le Week-end, attendez son chargement, puis inspectez le même bouton. Comparez les valeurs ; faites de même dans le panier avec l’ajout d’étiquette.",
            "Sur le catalogue, sélectionnez la zone de texte de chaque carte : le modèle de boîte montre 12, 24 puis 36 px de padding sur ordinateur.",
            "Activez 1 puis 2 dans DÉMO UX. Réinspectez les mêmes éléments : les rôles comparables partagent maintenant les mêmes valeurs."
          ],
          "expected": "Le navigateur montre une différence de styles, pas un verdict UX automatique. Le problème vient ici de fonctions et de contextes volontairement équivalents."
        }
      ],
      "agents": [
        {
          "tool": "Chrome DevTools MCP",
          "url": "https://github.com/ChromeDevTools/chrome-devtools-mcp",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 1 uniquement. Compare les trois boutons [data-role=\"ajout-panier\"] du catalogue, de la fiche Le Week-end et de la recommandation du panier. Relève leurs styles calculés et les paddings des trois premières zones .card-copy. Harmonise les composants de même rôle sans changer les autres défauts. Vérifie les valeurs calculées après correction et prends des captures aux mêmes dimensions."
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
          "tool": "Navigateur · puis Playwright",
          "source": "https://playwright.dev/docs/test-ui-mode",
          "steps": [
            "Ajoutez Le Week-end au panier et passez à la commande. Si vous ouvrez la page directement, cliquez sur « Charger le panier de démonstration ». Désactivez la correction 3.",
            "Saisissez Camille Démo, camille@example.test, Rue de la Démo 12, Neuchâtel et 079 123 45 67. Dans le code postal, écrivez 20 au lieu de 2000.",
            "Cliquez sur « Confirmer la commande fictive ». Constatez que les champs se vident : une erreur a fait perdre les autres saisies.",
            "Activez la correction 3. Remplissez les mêmes valeurs et recommencez avec le même code postal invalide : l’erreur apparaît, mais vos données restent.",
            "Pour montrer Playwright : ouvrez LANCER-PLAYWRIGHT.cmd dans le dossier de la démo. Dans l’interface, lancez le test « conservation des saisies ». Le contrôle avant est volontairement rouge ; le contrôle après est vert.",
            "Vous pouvez aussi ouvrir les rapports HTML déjà préparés ci-dessous et cliquer sur l’étape de soumission pour voir la trace."
          ],
          "expected": "Le test vérifie une attente précise : le nom saisi existe encore après une soumission invalide. Il ne mesure pas à lui seul toute la facilité du parcours."
        }
      ],
      "agents": [
        {
          "tool": "Playwright MCP / test Playwright",
          "url": "https://github.com/microsoft/playwright-mcp",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 2 uniquement. Ajoute Le Week-end au panier, passe à la commande, remplis tous les champs avec des données fictives puis saisis le code postal invalide « 20 ». Soumets et vérifie quelles valeurs ont disparu. Corrige la perte de saisies dans le gestionnaire de formulaire. Ajoute ou adapte un test Playwright qui exige leur conservation. Exécute le même scénario avant/après, puis termine une commande fictive avec 2000."
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
          "tool": "axe-core · rapport réel généré avec Playwright",
          "source": "https://playwright.dev/docs/accessibility-testing",
          "steps": [
            "Ouvrez Le Week-end et attendez que son titre apparaisse. Désactivez la correction 4. Le bouton cœur est visible, mais ne possède pas de nom accessible ; le prix est trop clair.",
            "Ouvrez le rapport axe-core « avant » ci-dessous. Dépliez le problème button-name et retrouvez l’élément concerné. Il s’agit du moteur axe exécuté avec Playwright, pas d’une capture de l’extension axe DevTools.",
            "Pour refaire ce contrôle dans l’extension : installez axe DevTools depuis le site officiel Deque, ouvrez F12 → axe DevTools, puis lancez une analyse de page. Les libellés exacts peuvent varier selon la version.",
            "Activez les corrections 4 et 9, puis relancez le scan. Vérifiez que le problème du bouton a disparu ; ne concluez pas que tout le site est accessible."
          ],
          "expected": "Le nom accessible de ce bouton est un défaut automatisable. Le rapport indique sa version, son URL et ses violations."
        }
      ],
      "agents": [
        {
          "tool": "axe-core + Playwright",
          "url": "https://playwright.dev/docs/accessibility-testing",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 3 : nom accessible. Ouvre /produits/sac-weekend, attends le chargement, exécute axe-core avec Playwright et sauvegarde son JSON. Inspecte le bouton cœur. Corrige son nom accessible selon l’action et son état favori. Vérifie aussi le contraste du prix de taille courante, relève les couleurs et corrige-le en visant au moins 4,5:1. Relance le même scan. Distingue violations corrigées, résultats restants et limites automatiques."
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
          "tool": "Clavier · Tab, Maj+Tab et Échap",
          "source": "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
          "steps": [
            "Ouvrez la confirmation et désactivez la correction 5. Activez la correction 6 pour que le texte soit clair et que seul le clavier soit testé.",
            "Avec Tab, atteignez « Annuler cette commande », puis appuyez sur Entrée. Continuez avec Tab : les actions de la modale ne sont pas atteignables ; Échap ne ferme pas.",
            "Pour sortir de cet état pendant la démo, cliquez à la souris sur « Garder ma commande ». Le blocage est volontaire.",
            "Activez la correction 5 et recommencez au clavier. Le focus entre dans la modale, Tab et Maj+Tab restent dans ses actions, Échap ferme puis le focus revient au déclencheur."
          ],
          "expected": "Ce contrôle porte sur l’interaction, pas seulement sur le résultat du scan. Une capture seule ne prouve pas la navigation : rejouez-la ou utilisez la trace."
        }
      ],
      "agents": [
        {
          "tool": "Playwright MCP · clavier",
          "url": "https://github.com/microsoft/playwright-mcp",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 3 : modale. Sur /confirmation, atteins « Annuler cette commande » uniquement au clavier et ouvre la modale. Vérifie le focus initial, Tab, Maj+Tab, Échap et le retour au déclencheur. Corrige la gestion du focus et l’inertie de l’arrière-plan. Crée un test de ces cinq comportements. Ne considère pas le scan axe comme une preuve de fonctionnement du clavier."
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
          "tool": "Lecture en contexte · vote de la salle",
          "source": "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
          "steps": [
            "Ouvrez la confirmation. Activez la correction 5 pour que le fonctionnement de la modale ne gêne pas l’exemple de texte. Désactivez la correction 6.",
            "Cliquez sur « Annuler cette commande » et lisez la question à voix haute. Demandez quel bouton garderait la commande ; laissez chacun interpréter Oui / Non.",
            "Activez la correction 6 sans fermer la modale. Comparez la nouvelle question et les boutons « Garder ma commande » / « Annuler la commande ».",
            "Demandez si l’action est maintenant compréhensible avant de cliquer. Le vote est une interaction pédagogique, pas une étude représentative."
          ],
          "expected": "Il n’existe pas ici de score automatique de bonne microcopie. La compréhension doit se vérifier dans le contexte et auprès des personnes concernées."
        }
      ],
      "agents": [
        {
          "tool": "Playwright MCP + analyse du texte par l’IA",
          "url": "https://github.com/microsoft/playwright-mcp",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 5 uniquement. Sur /confirmation, ouvre l’annulation et relève la question et les deux libellés réels. Explique les interprétations possibles, propose des libellés explicites puis corrige le texte dans ma copie. Vérifie que « Garder » ferme sans annuler et que « Annuler » affiche l’état annulé. Prends deux captures à dimensions identiques. Présente ton jugement rédactionnel comme une proposition, pas comme un résultat mesuré auprès d’utilisateurs."
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
          "tool": "Chrome DevTools · Network",
          "source": "https://developer.chrome.com/docs/devtools/network/",
          "steps": [
            "Ouvrez Le Week-end. Appuyez sur F12 puis ouvrez Network / Réseau. Cochez Disable cache et gardez DevTools ouvert.",
            "Désactivez la correction 7. Effacez le journal Réseau et rechargez la page. Filtrez « api/image ». Cliquez sur la requête : comparez Content-Type, Content-Length et Cache-Control dans Headers.",
            "Activez 7. Effacez puis rechargez. Le PNG lourd est remplacé par un WebP plus léger ; l’en-tête autorise un cache d’une heure. Avec Disable cache coché, le cache n’est pas utilisé : décochez-le et rechargez pour observer sa réutilisation éventuelle.",
            "Pour l’attente, filtrez « api/produit ». Désactivez 8 et cliquez sur « Rejouer le chargement » : la zone produit reste vide pendant environ trois secondes.",
            "Activez 8 et rejouez. Un skeleton apparaît ; la requête conserve son délai serveur. Comparez les durées plutôt que de promettre une durée strictement identique à la milliseconde."
          ],
          "expected": "Le poids transféré et les en-têtes sont mesurés. Le skeleton apporte un retour visuel ; il ne supprime pas le délai serveur."
        },
        {
          "tool": "Lighthouse · rapport de chargement",
          "source": "https://developer.chrome.com/docs/lighthouse/overview",
          "steps": [
            "Sur Le Week-end, ouvrez F12 → Lighthouse. Sélectionnez Navigation, Mobile et Performance. Gardez les mêmes options pour les deux essais.",
            "Lancez l’analyse avant correction. Lisez les ressources et métriques avec leurs unités, pas uniquement le score global.",
            "Activez la correction 7 et relancez dans les mêmes conditions. Le panneau conserve un état dans votre navigateur ; pour une comparaison reproductible, utilisez les URL ?mode=avant et ?mode=apres des rapports préparés.",
            "Si le temps manque, ouvrez les deux vrais rapports ci-dessous. Leurs scores peuvent varier entre machines et entre exécutions. Le skeleton ne garantit pas une hausse du score Lighthouse."
          ],
          "expected": "Un rapport Lighthouse porte sur une URL et des conditions de laboratoire, pas sur l’ensemble de l’UX du site."
        }
      ],
      "agents": [
        {
          "tool": "Chrome DevTools MCP · réseau et traces",
          "url": "https://github.com/ChromeDevTools/chrome-devtools-mcp",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 6 : inspecte /produits/sac-weekend. Relève le poids transféré, les dimensions, le type et les en-têtes de cache de /api/image. Enregistre une trace de chargement et identifie les ressources coûteuses. Corrige le format/dimensionnement/cache de l’image dans ma copie. Vérifie les nouveaux en-têtes et le poids dans les mêmes conditions. Inspecte aussi /api/produit : ajoute un retour de chargement accessible sans masquer ni modifier artificiellement sa durée. Fournis les mesures et les limites."
        },
        {
          "tool": "Lighthouse CLI",
          "url": "https://developer.chrome.com/docs/lighthouse/overview",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 6 : exécute Lighthouse en CLI sur la fiche Le Week-end avant modification, puis après les optimisations réellement effectuées. Sauvegarde les rapports HTML et JSON. Garde identiques URL, mode mobile, paramètres réseau, fenêtre et version Lighthouse ; consigne les différences de configuration. Compare les métriques et ressources, pas seulement le score. N’invente pas de résultat et n’attribue pas au skeleton un gain de vitesse non mesuré."
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
          "tool": "Chrome DevTools · Network",
          "source": "https://developer.chrome.com/docs/devtools/network/",
          "steps": [
            "Ouvrez Le Week-end. Appuyez sur F12 puis ouvrez Network / Réseau. Cochez Disable cache et gardez DevTools ouvert.",
            "Désactivez la correction 7. Effacez le journal Réseau et rechargez la page. Filtrez « api/image ». Cliquez sur la requête : comparez Content-Type, Content-Length et Cache-Control dans Headers.",
            "Activez 7. Effacez puis rechargez. Le PNG lourd est remplacé par un WebP plus léger ; l’en-tête autorise un cache d’une heure. Avec Disable cache coché, le cache n’est pas utilisé : décochez-le et rechargez pour observer sa réutilisation éventuelle.",
            "Pour l’attente, filtrez « api/produit ». Désactivez 8 et cliquez sur « Rejouer le chargement » : la zone produit reste vide pendant environ trois secondes.",
            "Activez 8 et rejouez. Un skeleton apparaît ; la requête conserve son délai serveur. Comparez les durées plutôt que de promettre une durée strictement identique à la milliseconde."
          ],
          "expected": "Le poids transféré et les en-têtes sont mesurés. Le skeleton apporte un retour visuel ; il ne supprime pas le délai serveur."
        }
      ],
      "agents": [
        {
          "tool": "Chrome DevTools MCP · réseau et traces",
          "url": "https://github.com/ChromeDevTools/chrome-devtools-mcp",
          "prompt": "Travaille sur une copie locale de mon projet. Commence par constater le problème dans le navigateur, puis retrouve sa cause dans le code. Corrige réellement le code de cette copie : n’utilise pas les interrupteurs pédagogiques ni le mode après comme preuve de correction. Conserve les autres défauts volontaires. Fournis les preuves avant/après, les actions effectuées et les limites du contrôle. Ne promets pas une conformité ou une efficacité commerciale globale.\nURL : {URL}\nBloc 6 : inspecte /produits/sac-weekend. Relève le poids transféré, les dimensions, le type et les en-têtes de cache de /api/image. Enregistre une trace de chargement et identifie les ressources coûteuses. Corrige le format/dimensionnement/cache de l’image dans ma copie. Vérifie les nouveaux en-têtes et le poids dans les mêmes conditions. Inspecte aussi /api/produit : ajoute un retour de chargement accessible sans masquer ni modifier artificiellement sa durée. Fournis les mesures et les limites."
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
