/* Exemples de demandes et de séquences possibles. Aucun appel d’outil depuis les diapos. */
window.UX_AGENT_PARCOURS={
 design:{
  prompt:'Sur [pages], compare les boutons de même rôle et les espacements. Relève les styles calculés, les sélecteurs et les captures. Demande mon intention avant de qualifier un écart d’erreur.',
  actions:[['Chrome DevTools MCP · take_snapshot','Ouvrir chaque page et repérer les composants à comparer.'],['Chrome DevTools MCP · evaluate_script','Lire les valeurs avec getComputedStyle ; get_css_styles peut compléter les règles CSS.'],['Chrome DevTools MCP · take_screenshot','Conserver les captures aux mêmes dimensions et relier chaque écart à ses valeurs.']],
  result:'À récupérer : pages, composants, valeurs comparées et captures. Puis décider quels écarts méritent une correction.',
  proof:['escale/styles-avant.png','Valeurs CSS relevées dans la démonstration Escale.','Archive réelle · inspection des styles'],
  proofNote:'Exemple de preuve à demander : des valeurs vérifiables, accompagnées de leur contexte.'
 },
 journey:{
  prompt:'Sur [formulaire], saisis des coordonnées fictives et un code postal invalide. Envoie puis vérifie que les autres champs sont conservés. Donne les étapes, le résultat attendu et le résultat observé.',
  actions:[['Playwright MCP · browser_fill_form','Remplir le formulaire avec les données fictives du scénario.'],['Playwright MCP · browser_click','Envoyer pour faire apparaître l’erreur, puis relire les champs.'],['Agent · test Playwright enregistré','Préparer un test rejouable avec une assertion de conservation et sa trace activée.']],
  result:'À récupérer : un scénario rejouable, le champ perdu, une capture et une trace si elle a été enregistrée.',
  proof:['escale/playwright-avant.png','Trace du test de conservation des saisies d’Escale avant correction.','Archive réelle · trace Playwright'],
  proofNote:'La trace provient d’un test enregistré. Une navigation via MCP ne produit pas automatiquement une trace ZIP.'
 },
 a11y:{
  prompt:'Sur [pages], ouvre le menu et la modale. Lance axe-core sur ces états. Pour chaque défaut, indique la règle et l’élément concerné. Teste aussi le clavier et le retour du focus.',
  actions:[['Playwright MCP · navigation et clics','Faire afficher les états à contrôler : menu, erreur, modale.'],['Terminal · Playwright + axe-core','Exécuter le scan dans ces états et conserver le rapport JSON.'],['Playwright MCP · clavier et captures','Essayer Tab, Maj+Tab et Échap ; relever où se trouve le focus.']],
  result:'À récupérer : règle axe, élément concerné, état testé, capture et contrôles manuels encore nécessaires.',
  proof:['escale/axe-avant.png','Rapport réel axe-core de la démonstration Escale avant correction.','Archive réelle · rapport axe-core'],
  proofNote:'L’agent doit relier les résultats aux éléments du site. Un scan seul ne prouve pas une conformité complète.'
 },
 behavior:{
  prompt:'Dans [projet Contentsquare], sur [période] et [segment], compare les passages entre [étapes]. Donne les effectifs et les taux disponibles. Sépare les observations des hypothèses sur leurs causes.',
  actions:[['MCP Contentsquare · accès','Lister les projets et fonctions réellement accessibles au compte.'],['MCP Contentsquare · interrogation','Appliquer la période et le segment, puis demander les métriques disponibles.'],['Agent IA · interprétation','Citer les données et proposer des questions pour vérifier les causes supposées.']],
  result:'À récupérer : projet, période, segment, effectifs et hypothèses à vérifier. Sur Escale, ce bloc reste théorique.',
  proof:['contentsquare-heatmap.png','Visuel officiel de présentation Contentsquare, sans données des apprenants.','Documentation officielle · exemple de heatmap'],
  proofNote:'Ce visuel ne prouve pas une lecture de heatmap via MCP. Sans données autorisées, l’agent doit annoncer la limite.'
 },
 copy:{
  prompt:'Sur [parcours], relève les boutons et messages dans les états erreur et succès. Avec [cible], [ton] et [règles du produit], propose deux variantes par texte, en expliquant leur intérêt.',
  actions:[['Playwright MCP · browser_snapshot','Faire afficher chaque état et relever le texte dans son contexte.'],['Agent IA · rédaction','Proposer deux variantes sans inventer de délai, de gratuité ou de fonction.'],['Playwright MCP · interaction','Vérifier les actions des boutons ; faire évaluer la compréhension par des personnes.']],
  result:'À récupérer : écran, état, texte actuel, variantes et raison de chaque proposition.',
  proof:['escale/microcopie-avant.png','Texte ambigu de la fenêtre d’annulation Escale dans son contexte.','Archive réelle · texte à examiner'],
  proofNote:'La capture fournit le contexte de départ. Une proposition de l’IA reste à valider avec le public.'
 },
 lighthouse:{
  prompt:'Sur [pages] en production locale, conserve un rapport Lighthouse HTML et JSON. Examine aussi la trace, le réseau et la console avec DevTools MCP. Relie chaque constat à une ressource ou une action.',
  actions:[['Terminal · Lighthouse','Auditer la version de production et conserver les rapports HTML et JSON.'],['Chrome DevTools MCP · performance_start_trace','Enregistrer le chargement puis examiner les requêtes avec list_network_requests.'],['Chrome DevTools MCP · list_console_messages','Relever les erreurs, leur origine et leur effet sur le parcours.']],
  result:'À récupérer : rapports, trace, ressources en cause, poids, délais et conditions de mesure.',
  proofNote:'Captures archivées ou documentaires, pas un audit déclenché par la slide. L’appel MCP lighthouse_audit exclut la performance : utiliser une trace et/ou Lighthouse complet.'
 }
};
