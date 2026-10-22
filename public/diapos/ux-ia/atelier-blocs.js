/* Fiches outils. Consultation locale uniquement : aucun audit ni MCP lancé par la slide. */
(() => {
    'use strict';
    const docs = { chrome: 'https://github.com/ChromeDevTools/chrome-devtools-mcp', reference: 'https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md', playwright: 'https://github.com/microsoft/playwright-mcp', trace: 'https://playwright.dev/docs/trace-viewer', axe: 'https://playwright.dev/docs/accessibility-testing', axeMcp: 'https://www.deque.com/axe/mcp-server/', lighthouse: 'https://developer.chrome.com/docs/lighthouse/overview', network: 'https://developer.chrome.com/docs/devtools/network/overview', console: 'https://developer.chrome.com/docs/devtools/console/', performance: 'https://developer.chrome.com/docs/devtools/performance/overview', contentsquare: 'https://contentsquare.com/platform/capabilities/mcp-server/', learning: 'https://learning.hotjar.com/page/course-catalog', university: 'https://learn.contentsquare.com/' };
    const definitions = {
        "chrome": {
            "name": "Chrome DevTools",
            "kind": "Outils intégrés à Chrome",
            "definition": "La boîte à outils du navigateur pour inspecter une page : styles, chargement, requêtes réseau et erreurs.",
            "example": "Vous ouvrez DevTools pour voir pourquoi une image ne se charge pas.",
            "url": "https://developer.chrome.com/docs/devtools/overview",
            "slide": "cles"
        },
        "chromeMcp": {
            "name": "Chrome DevTools MCP",
            "kind": "Serveur MCP · connecteur pour l’IA",
            "definition": "Il donne à un agent compatible des outils pour piloter Chrome, inspecter une page et recueillir des mesures.",
            "example": "L’agent ouvre votre page, examine ses requêtes et vous montre une capture.",
            "url": "https://github.com/ChromeDevTools/chrome-devtools-mcp",
            "slide": "ia-design-system"
        },
        "playwright": {
            "name": "Playwright",
            "kind": "Outil d’automatisation du navigateur",
            "definition": "Il permet de programmer des clics, des saisies et des vérifications, puis de rejouer le même parcours.",
            "example": "Tester qu’une inscription arrive à une confirmation, sans tout refaire à la main.",
            "url": "https://playwright.dev/docs/intro",
            "slide": "ia-friction"
        },
        "playwrightMcp": {
            "name": "Playwright MCP",
            "kind": "Serveur MCP · connecteur pour l’IA",
            "definition": "Il met des actions de navigation à disposition de l’agent : ouvrir, cliquer, remplir et observer la page.",
            "example": "Vous décrivez une tâche ; l’agent utilise ces actions pour essayer le parcours.",
            "url": "https://github.com/microsoft/playwright-mcp",
            "slide": "ia-friction"
        },
        "contentsquare": {
            "name": "Contentsquare",
            "kind": "Plateforme d’analyse des usages",
            "definition": "Elle aide à analyser les visites enregistrées : parcours, clics, défilement et passages entre les étapes.",
            "example": "Repérer à quelle étape les visiteurs quittent une inscription.",
            "url": "https://contentsquare.com/platform/capabilities/heatmaps/",
            "slide": "ia-comportement"
        },
        "contentsquareMcp": {
            "name": "MCP Contentsquare",
            "kind": "Connecteur vers les données du compte",
            "definition": "Il permet à un agent autorisé d’interroger les données accessibles de votre projet Contentsquare.",
            "example": "Demander le taux de passage d’un tunnel sur une période précise.",
            "url": "https://contentsquare.com/platform/capabilities/mcp-server/",
            "slide": "ia-comportement"
        },
        "hotjar": {
            "name": "Hotjar",
            "kind": "Outil d’observation des visites",
            "definition": "Connu pour ses cartes de chaleur et ses sessions enregistrées, Hotjar fait désormais partie de Contentsquare.",
            "example": "Examiner une carte de clics, puis des sessions pour enquêter sur un obstacle.",
            "url": "https://www.hotjar.com/homepage/",
            "slide": "ia-comportement"
        },
        "axeCore": {
            "name": "axe-core",
            "kind": "Bibliothèque de code · moteur de contrôle",
            "definition": "Du code que l’on ajoute à un test pour repérer des défauts d’accessibilité détectables automatiquement.",
            "example": "Un test Playwright lance axe-core et reçoit une liste d’éléments à examiner.",
            "url": "https://github.com/dequelabs/axe-core",
            "slide": "ia-accessibilite"
        },
        "axeDevTools": {
            "name": "axe DevTools",
            "kind": "Ici : l’extension pour le navigateur",
            "definition": "Une interface pour lancer des contrôles d’accessibilité sur la page ouverte et consulter les éléments signalés.",
            "example": "Vous ouvrez l’extension, lancez une analyse et examinez les résultats.",
            "url": "https://www.deque.com/axe/devtools/extension/",
            "slide": "ia-accessibilite"
        },
        "axeMcp": {
            "name": "Axe MCP",
            "kind": "Serveur MCP de Deque · connecteur pour l’IA",
            "definition": "Il apporte à un agent de développement des fonctions et recommandations d’accessibilité de Deque.",
            "example": "L’agent propose une correction que vous pouvez examiner avant de l’appliquer.",
            "url": "https://www.deque.com/axe/mcp-server/",
            "slide": "ia-accessibilite"
        },
        "lighthouse": {
            "name": "Lighthouse",
            "kind": "Outil d’audit automatisé d’une page",
            "definition": "Il produit un rapport de contrôles et de mesures : performance, accessibilité, référencement et bonnes pratiques.",
            "example": "Vous lancez l’audit dans Chrome ou en ligne de commande, puis l’IA vous aide à lire le rapport.",
            "url": "https://developer.chrome.com/docs/lighthouse/overview",
            "slide": "ia-performance"
        },
        "mcp": {
            "name": "MCP",
            "kind": "Protocole · règles de connexion communes",
            "definition": "Une manière standard de présenter des outils et des données à une application d’IA. Un serveur MCP fournit les fonctions accessibles.",
            "example": "L’agent utilise un outil de capture proposé par un serveur MCP connecté.",
            "url": "https://modelcontextprotocol.io/docs/learn/server-concepts",
            "slide": "cles"
        },
        "agent": {
            "name": "Agent IA",
            "kind": "Logiciel d’IA équipé d’outils",
            "definition": "Il peut enchaîner des actions pour réaliser une tâche, avec les accès et les autorisations qui lui sont donnés.",
            "example": "Il ouvre des pages, relève des textes et prépare une proposition de reformulation.",
            "url": "https://modelcontextprotocol.io/docs/learn/server-concepts",
            "slide": "agent"
        }
    };
    definitions.api={name:'API',kind:'Interface entre logiciels',definition:'Des fonctions qu’un logiciel propose à d’autres logiciels pour demander des données ou déclencher une action.',example:'Le formulaire appelle une API pour rechercher une adresse.',url:'https://developer.mozilla.org/en-US/docs/Glossary/API',slide:'cles'};
    function el(tag, attrs = {}, ...kids) { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) {
        if (k === 'text')
            n.textContent = v;
        else
            n.setAttribute(k, v);
    } kids.flat().filter(Boolean).forEach(c => n.append(c)); return n; }
    const p = (s, c = '') => el('p', { text: s, class: c }), h = s => el('h3', { text: s });
    const btn = (s, fn, c = '') => { const b = el('button', { type: 'button', text: s, class: c }); b.addEventListener('click', fn); return b; };
    const link = (s, u) => el('a', { href: docs[u] || u, target: '_blank', rel: 'noopener', text: s + ' ↗' });
    const panel = (...k) => el('div', { class: 'uxlab-panel' }, ...k), actions = (...k) => el('div', { class: 'uxlab-actions' }, ...k);
    function setup(name, kicker) { const r = document.querySelector('[data-lab="' + name + '"]'); r.classList.add('uxlab'); r.setAttribute('data-arrows', 'true'); r.append(p(kicker, 'uxlab-kicker')); return r; }
    function tabs(items, render) { const content = el('div', { class: 'tool-content' }), row = actions(); row.setAttribute('aria-label', 'Choisir une fiche'); const bs = items.map((v, i) => btn(v.label, () => draw(i))); function draw(i) { bs.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j))); content.replaceChildren(...render(items[i])); } row.append(...bs); draw(0); return [row, content]; }
    function modal(title, ...nodes) { const d = el('dialog', { class: 'uxlab-dialog', 'aria-label': title }); d.append(btn('Fermer', () => d.close()), h(title), ...nodes); d.addEventListener('keydown', e => e.stopPropagation()); d.addEventListener('click', e => { if (e.target === d)
        d.close(); }); document.body.append(d); return d; }

    function definitionCards(keys) {
        return el('div', {class:'tool-definitions'}, keys.map(key => {
            const d=definitions[key];
            return el('section', {class:'tool-definition'}, p(d.kind,'tool-kind'), el('h4',{text:d.name}), p(d.definition), p(d.example,'tool-example'), link('Source officielle',d.url));
        }));
    }
    function definitionsButton(keys) {
        const d=modal('Les outils, en clair',definitionCards(keys));
        d.classList.add('tool-definition-dialog');
        return btn('Comprendre les outils',()=>d.showModal());
    }
    const blockDefinitions={design:['chrome','chromeMcp'],journey:['playwright','playwrightMcp'],a11y:['axeCore','axeDevTools','axeMcp'],behavior:['contentsquare','contentsquareMcp','hotjar'],copy:['agent','playwrightMcp'],lighthouse:['lighthouse','chrome','chromeMcp']};
    function requestButton(title, body) { const value = 'Audit en lecture seule. Aucun fichier à modifier.\n\n' + body + '\n\nCommence par vérifier les outils réellement disponibles. Si un contrôle est impossible, indique-le. Distingue observations prouvées, hypothèses et recommandations. N’utilise que des données fictives ou autorisées ; aucune transaction réelle. Termine par les preuves, les limites et les contrôles non exécutés.'; const field = el('textarea', { readonly: '', 'aria-label': 'Demande à adapter avant envoi', rows: '10' }); field.value = value; const feedback = p('Remplacez les champs entre crochets avant envoi à votre agent.', 'tool-dialog-help'); feedback.setAttribute('role', 'status'); const copy = btn('Copier la demande', async () => { try {
        await navigator.clipboard.writeText(field.value);
        feedback.textContent = 'Demande copiée. Adaptez les champs entre crochets dans votre conversation.';
    }
    catch {
        field.focus();
        field.select();
        feedback.textContent = 'Sélection faite : utilisez Ctrl+C ou Cmd+C pour copier.';
    } }); const d = modal(title, field, actions(copy), feedback); return btn('Voir / copier la demande', () => d.showModal(), 'uxlab-primary'); }
    const imageDialogs = new Map();
    function picture(file, alt, caption) { const image = el('img', { src: './preuves/' + file, alt, class: 'uxlab-capture', loading: 'lazy' }); let d = imageDialogs.get(file); if (!d) {
        d = modal(caption, image.cloneNode());
        imageDialogs.set(file, d);
    } const zoom = btn('', () => d.showModal(), 'uxlab-zoom'); zoom.setAttribute('aria-label', 'Agrandir : ' + caption); zoom.append(image); return el('figure', { class: 'tool-figure' }, zoom, el('figcaption', { text: caption + ' · cliquer pour agrandir' })); }
    function steps(items) { return el('ol', { class: 'tool-steps' }, items.map(([t, d]) => el('li', {}, el('strong', { text: t }), p(d)))); }
    function card(d) {
        const flow=window.UX_AGENT_PARCOURS[d.name],r=setup(d.name,d.tool),left=panel(steps(d.steps));
        left.classList.add('tool-how');left.append(actions(requestButton('Bloc '+d.number+' · '+d.subject,d.request),definitionsButton(blockDefinitions[d.name])),el('div',{class:'uxlab-links'},d.links.map(([s,u])=>link(s,u))));
        const choices=[{label:'Demande',mode:'request'},{label:'Actions',mode:'actions'},{label:'Preuves',mode:'proof'}];
        const images=flow.proof?[{image:flow.proof,label:'Exemple archivé'}]:d.views.filter(v=>v.image);
        const render=v=>{
            if(v.mode==='request')return [h('Ce que je demande à mon agent'),el('div',{class:'agent-brief'},p('EXEMPLE À ADAPTER','agent-label'),el('blockquote',{class:'agent-request',text:flow.prompt})),p('Les champs entre crochets sont à remplacer par votre projet. La demande complète est disponible à gauche.','uxlab-small')];
            if(v.mode==='actions')return [h('Une séquence possible pour l’agent'),el('ol',{class:'agent-actions'},flow.actions.map(([tool,action])=>el('li',{},el('strong',{text:tool}),p(action)))),p('À exécuter dans votre agent. '+flow.result,'uxlab-small')];
            const box=el('div',{class:'agent-proof'}),select=el('select',{'aria-label':'Choisir la preuve'}),shown=el('div',{class:'agent-proof-image'});
            function show(i){shown.replaceChildren(picture(...images[i].image));}
            if(images.length>1){images.forEach((v,i)=>select.append(el('option',{value:String(i),text:v.label})));select.addEventListener('change',()=>show(Number(select.value)));box.append(select);}
            show(0);box.append(shown);return [h('Les preuves à récupérer'),box,p(flow.proofNote,'uxlab-small')];
        };
        const right=panel(...tabs(choices,render));right.classList.add('tool-view');r.append(el('div',{class:'uxlab-split'},left,right),p(d.limit,'uxlab-foot'));
    }
    {
        const r = setup('intro', 'Six besoins · des outils à retrouver et à utiliser'), grid = el('div', { class: 'tool-grid' });
        [['1', 'Design System', 'Chrome DevTools MCP', 'Styles, boutons, espacements', 25], ['2', 'Friction', 'Playwright MCP', 'Parcours, retours, formulaires', 26], ['3', 'Accessibilité', 'axe + Playwright', 'Contrôles et tests manuels', 27], ['4', 'Comportement', 'Hotjar / Contentsquare', 'Cartes de chaleur, sessions, données', 28], ['5', 'Microcopie', 'Agent + navigateur', 'Inventaire, reformulation, contexte', 29], ['6', 'Performances', 'Lighthouse + DevTools MCP', 'Vitesse, réseau, erreurs, cache', 30]].forEach(([n, t, tool, what, s]) => grid.append(el('a', { class: 'tool-tile', href: '#' + s }, el('span', { class: 'tool-number', text: n }), el('strong', { text: t }), p(tool), el('span', { text: what }))));
        r.append(grid, p('Choisissez un bloc : l’outil, la marche à suivre et la demande à adapter sont sur sa slide.', 'uxlab-foot'));
    }
    {
        const r=setup('context','Un nom, une fonction, une façon de l’utiliser');
        const items=[
            {label:'Chrome',keys:['chrome','chromeMcp'],use:'Inspecter une page soi-même dans Chrome, ou laisser l’agent utiliser les outils du MCP.',links:[['Guide du MCP Chrome DevTools','chrome']]},
            {label:'Playwright',keys:['playwright','playwrightMcp'],use:'Écrire des tests qui se rejouent, ou faire explorer un parcours par un agent équipé.',links:[['Guide du MCP Playwright','playwright']]},
            {label:'Contentsquare',keys:['contentsquare','contentsquareMcp','hotjar'],use:'Analyser des données de visites déjà collectées. Le connecteur exige un compte, un projet et les accès nécessaires.',links:[['Connexion MCP Contentsquare','contentsquare']]},
            {label:'La famille axe',keys:['axeCore','axeDevTools','axeMcp'],use:'Trois façons de travailler : dans le code, dans le navigateur ou avec l’agent. Les tests humains restent nécessaires.',links:[]},
            {label:'Lighthouse',keys:['lighthouse'],use:'Lancer l’audit dans Chrome DevTools ou en ligne de commande ; l’IA peut ensuite expliquer les résultats.',links:[['Utiliser Lighthouse','lighthouse']]},
            {label:'MCP et API',keys:['mcp','api'],use:'Connecter le serveur à une application d’IA compatible, puis vérifier les outils accessibles. Une demande seule ne fait pas cette installation.',links:[]}
        ];
        r.append(...tabs(items,v=>[definitionCards(v.keys),p(v.use,'tool-usage'),el('div',{class:'uxlab-links'},v.links.map(([title,url])=>link(title,url)))]),p('Un outil recueille des observations. L’IA aide à les interpréter ; vous gardez les décisions.','uxlab-foot'));
    }
    card({ name: 'design', number: 1, subject: 'Design System', tool: 'OUTIL · Chrome DevTools MCP → styles calculés + captures', steps: [['Vous donnez', 'Deux ou trois pages, les tailles d’écran et le rôle des composants.'], ['L’agent fait', 'Il compare les styles réellement appliqués aux boutons et aux mises en page.'], ['Vous récupérez', 'Page, élément, valeurs CSS, différence et capture pour chaque écart.']], links: [['MCP Chrome DevTools', 'chrome'], ['Outils disponibles', 'reference']], request: 'Projet : [chemin]. URL : [URL locale]. Pages : [pages]. Public : [cible]. Compare les boutons de même rôle et les espacements à [tailles d’écran]. Avec Chrome DevTools MCP, relève les styles calculés : padding, gap, tailles, polices, couleurs et arrondis. Donne les sélecteurs, les valeurs comparées et des captures. Demande mon intention avant de déclarer une variation incohérente.', views: [], limit: 'La mesure établit une différence ; l’intention graphique permet de décider si elle pose problème.' });
    card({ name: 'journey', number: 2, subject: 'Friction', tool: 'OUTIL · Playwright MCP → clics, saisies, clavier, captures', steps: [['Vous donnez', 'Un formulaire, des valeurs fictives et ce qui doit rester après une erreur.'], ['L’agent fait', 'Il saisit Camille et un code postal invalide, envoie puis relit le prénom.'], ['Vous récupérez', 'Attendu : Camille reste. Observé : le champ est vide. La trace montre les étapes.']], links: [['Playwright MCP', 'playwright'], ['Trace Viewer', 'trace']], request: 'URL : [URL locale]. Public : [cible]. Tâche : [réserver une activité / demander un devis / créer un compte de test]. Résultat attendu : [résultat visible]. Utilise Playwright MCP et [données fictives]. Teste le chemin normal, une saisie invalide, un retour arrière et la conservation de saisie. Consigne chaque étape et capture les blocages. Ne valide aucun achat ni envoi réel. Si tu crées un test Playwright, active sa trace et joins-la au rapport.', views: [], limit: 'Le parcours automatisé révèle des obstacles reproductibles ; il ne remplace pas les tests avec des utilisateurs.' });
    card({ name: 'a11y', number: 3, subject: 'Accessibilité', tool: 'OUTILS · axe-core + Playwright · axe DevTools · Axe MCP', steps: [['Vous donnez', 'Les pages et les états : menu ouvert, formulaire en erreur, dialogue affiché.'], ['L’agent fait', 'Il exécute axe dans ces états et explique les éléments signalés.'], ['Vous récupérez', 'La règle, les éléments concernés, l’impact et les vérifications restantes.']], links: [['axe + Playwright', 'axe'], ['Axe MCP officiel', 'axeMcp']], request: 'URL : [URL locale]. Pages et états : [liste]. Lance axe-core avec Playwright sur chaque état, ou indique la solution axe disponible. Fournis la règle, le critère associé quand il existe, le sélecteur et l’état concerné. Complète par un essai clavier : focus visible, ordre, activation et sortie des dialogues. Sépare ce que tu as testé de ce qui demande un lecteur d’écran ou une évaluation humaine. Ne déclare pas le site conforme sur la seule base d’un score.', views: [], limit: 'Un contrôle sans erreur signifie seulement : aucun défaut détecté par ces règles, dans ces états.' });
    card({ name: 'behavior', number: 4, subject: 'Comportement', tool: 'OUTILS · Hotjar / Contentsquare → heatmaps, sessions · MCP Contentsquare', steps: [['Vous donnez', 'Un projet autorisé, une période, un appareil et un objectif.'], ['Vous observez', 'Carte de clics ou de défilement, puis sessions autour d’un point de friction.'], ['L’IA vous aide', 'Elle interroge les métriques via MCP, ou analyse vos captures et exports.']], links: [['MCP Contentsquare', 'contentsquare'], ['Cours Hotjar', 'learning'], ['Learning Hub actuel', 'university']], request: 'Projet Contentsquare : [projet]. Période : [dates]. Segment : [appareil / public]. Objectif : [conversion]. Liste d’abord les projets et outils accessibles via le MCP Contentsquare. Analyse le passage entre [étapes] en indiquant les effectifs, les dénominateurs et la période. Pour les heatmaps ou sessions non accessibles via les outils disponibles, demande des captures ou exports autorisés. Sépare les signaux observés des hypothèses sur les causes ; propose une vérification complémentaire.', views: [], limit: 'Données réelles nécessaires, collecte autorisée et informations sensibles masquées. Ces slides ne collectent aucune session.' });
    card({ name: 'copy', number: 5, subject: 'Microcopie', tool: 'OUTILS · votre agent IA + Playwright MCP pour lire les vrais états', steps: [['Vous donnez', 'La cible, le ton, la tâche et les règles du produit.'], ['L’agent fait', 'Il ouvre succès et erreurs, relève les textes puis propose deux variantes.'], ['Vous récupérez', 'Texte actuel → proposition → raison ; chaque variante reste liée à son écran.']], links: [['Naviguer avec Playwright MCP', 'playwright']], request: 'URL : [URL locale]. Public : [cible]. Ton : [ton]. Tâche : [tâche]. Contraintes réelles : [règles]. Avec Playwright MCP, ouvre les états de chargement, vide, erreur et succès accessibles sans action réelle. Relève boutons, aides et messages affichés. Pour chaque texte problématique, donne la page, l’état, le texte actuel et deux propositions avec leur raison. N’invente ni délai, ni gratuité, ni validation que le produit ne garantit pas.', views: [], limit: 'L’IA aide à rédiger ; vous vérifiez la promesse, le vocabulaire et la compréhension auprès du public.' });
    card({ name: 'lighthouse', number: 6, subject: 'Performances', tool: 'OUTILS · Lighthouse + Chrome DevTools MCP → Performance, Network, Console', steps: [['Vous donnez', 'URL, pages, appareil et scénario ; version de production locale si possible.'], ['L’agent fait', 'Lighthouse, trace, requêtes lentes ou échouées, erreurs et en-têtes de cache.'], ['Vous récupérez', 'Rapport HTML/JSON, fichiers en cause et mesures avant toute correction.']], links: [['Lighthouse', 'lighthouse'], ['MCP Chrome DevTools', 'chrome'], ['Rapport réel archivé', './preuves/escale/lighthouse-avant.html']], request: 'Projet : [chemin]. URL : [URL locale]. Pages/scénario : [liste]. Appareil : [mobile / ordinateur]. Mesure une version de production locale si possible. Lance Lighthouse complet via DevTools ou CLI et conserve HTML/JSON. Avec Chrome DevTools MCP, enregistre une trace de chargement, examine les requêtes lentes, lourdes, répétées et échouées, puis les messages de console. Relève Cache-Control et vérifie un second chargement avec cache activé ; ne confonds pas cache navigateur et cache serveur. Relie chaque constat à une ressource, une durée et un impact observé. Examine aussi le retour pendant l’attente (loader/skeleton).', views: [{ label: 'Lighthouse', title: 'Un bilan mesuré, avec ses détails', image: ['escale/lighthouse-avant.png', 'Rapport Lighthouse réel archivé de la boutique Escale avant correction.', 'Archive réelle · Escale · 22/10/2026'], detail: 'Rapport complet via DevTools ou CLI. Dans la référence MCP vérifiée, lighthouse_audit exclut la performance : utiliser aussi une trace.' }, { label: 'Performance', title: 'Voir ce qui occupe le navigateur', image: ['chrome-performance.png', 'Capture officielle du panneau Performance et de sa chronologie.', 'Google · capture documentaire'], detail: 'Enregistrer pendant le chargement ou une action. Repérer les tâches longues et ressources qui retardent l’affichage ; conserver la trace.' }, { label: 'Network', title: 'Voir ce qui se charge… ou échoue', image: ['chrome-network.png', 'Capture officielle Network : requêtes, statuts et durées.', 'Google · capture documentaire'], detail: 'Recharger, trier par poids/durée, ouvrir les requêtes en erreur. 404 = ressource introuvable ; examiner aussi les échecs sans réponse HTTP.' }, { label: 'Console', title: 'Retrouver une erreur et son origine', image: ['chrome-console.png', 'Capture officielle Console : messages JavaScript et assertion en échec.', 'Google · capture documentaire'], detail: 'Rejouer l’action ; relever message, fichier et ligne. Une erreur est un indice technique : vérifier son effet réel sur le parcours.' }], limit: 'Mesures de laboratoire ≠ vécu de tous les utilisateurs. Noter les conditions ; une trace ne constitue pas un audit de sécurité.' });
})();
