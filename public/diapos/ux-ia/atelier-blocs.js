/* Partie 2 : une explication et une manipulation par bloc.
   Interactions locales, sans IA connectée ni envoi de données.
   Le rapport Lighthouse est une archive réelle ; les autres cas sont pédagogiques. */
(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const make = (tag, attrs={}, ...children) => {
    const n=document.createElement(tag);
    for(const [key,value] of Object.entries(attrs)) {
      if(key==='text') n.textContent=value;
      else if(key==='class') n.className=value;
      else n.setAttribute(key,value);
    }
    children.flat().forEach(c=>{if(c)n.append(c);});
    return n;
  };
  const text=(s,cls='')=>make('p',{text:s,class:cls});
  const heading=s=>make('h3',{text:s});
  const panel=(...kids)=>make('div',{class:'uxlab-panel'},...kids);
  const actions=(...kids)=>make('div',{class:'uxlab-actions'},...kids);
  const button=(s,fn,cls='')=>{const b=make('button',{type:'button',text:s,class:cls});b.addEventListener('click',fn);return b;};
  const status=()=>make('p',{class:'uxlab-feedback',role:'status','aria-live':'polite','aria-atomic':'true'});
  const pressed=(buttons,index)=>buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  function setup(name,caption){
    const root=$('[data-lab="'+name+'"]');root.classList.add('uxlab');root.setAttribute('data-arrows','true');root.append(text(caption,'uxlab-kicker'));
    root.addEventListener('keydown',e=>{if(/^(SELECT|INPUT)$/.test(e.target.tagName)&&e.key!=='Escape')e.stopPropagation();});return root;
  }
  function resettable(root,reset){const row=actions(button('Recommencer',reset),text('Démonstration locale · aucune IA connectée, aucun envoi.','uxlab-foot'));row.classList.add('uxlab-reset');root.append(row);}
  function split(root,demo,lesson){root.append(make('div',{class:'uxlab-split'},demo,lesson));}
  function explanation(verb,request,limit){return panel(text('Ce qu’on peut demander à l’IA','uxlab-kicker'),heading(verb),text(request),text(limit,'uxlab-small'));}

  // Introduction : des modes de travail, pas un classement de marques.
  {
    const root=setup('intro','La même grille de lecture, avec une aide supplémentaire');
    root.append(text('On reprend les six blocs : l’IA aide à examiner, expliquer et proposer. Les outils apportent des preuves. Vous gardez les décisions.','uxlab-intro'));
    const content=panel(), buttons=[
      button('Une conversation',()=>draw(0)),button('Un agent équipé',()=>draw(1))
    ];
    function draw(i){pressed(buttons,i);content.replaceChildren(heading(i?'Lire le projet et utiliser des outils':'Analyser ce que vous lui fournissez'),text(i?'Avec les accès et les autorisations nécessaires, l’agent peut ouvrir une page, suivre un parcours, lancer des contrôles et proposer des modifications.':'Vous donnez le contexte, des textes ou des captures. L’IA explique et propose des pistes ; ce qu’elle n’a pas observé reste à vérifier.'),text('Une même application peut proposer les deux modes. Le nom du produit ne suffit pas à connaître ses capacités.','uxlab-small'));}
    root.append(actions(...buttons),content,make('div',{class:'uxlab-six'},['1 · Design system','2 · Friction','3 · Accessibilité','4 · Comportement','5 · Microcopie','6 · Performances'].map(s=>text(s))),text('Dans les scènes qui suivent, on manipule des exemples. La vraie utilisation du plugin arrive en partie 3.','uxlab-foot'));draw(0);
  }

  // Cadrage : varier les produits et donner de vraies cibles, pas seulement un type de visite.
  {
    const root=setup('context','Avant les six blocs · préciser le contexte et l’équipement');
    const contexts=[
      ['Site vitrine','Une association locale','Des habitants qui cherchent une activité accessible près de chez eux.','Trouver une activité, ses conditions et le moyen de contacter l’association.','Téléphone ; peu de temps ; vocabulaire simple.'],
      ['Application métier','Un outil de congés','Des salariés qui posent leur première demande de congé.','Choisir des dates, envoyer une demande fictive et voir son statut.','Ordinateur ; usage occasionnel ; aucune notification réelle.'],
      ['E-commerce','Une boutique en ligne','Des personnes qui achètent pour la première fois dans cette boutique.','Comprendre le prix total et arriver à la confirmation d’une commande de test.','Téléphone ; compte fictif ; aucun paiement réel.']
    ];
    const target=panel(), tools=panel(heading('Vérifier les outils disponibles'),text('Navigateur : essayer le parcours et relever les styles. Lighthouse ou axe : exécuter leurs contrôles. Données d’usage : calculer ce qu’elles permettent.'),text('MCP présente les outils et leur façon d’être appelés. Un serveur MCP peut utiliser une API ou des outils locaux.','uxlab-small'));
    const buttons=contexts.map((c,i)=>button(c[0],()=>draw(i)));
    function draw(i){pressed(buttons,i);const [,name,audience,goal,context]=contexts[i];target.replaceChildren(heading(name),text('Public : '+audience),text('Objectif : '+goal),text(context,'uxlab-small'));}
    root.append(actions(...buttons));split(root,target,tools);root.append(text('À convenir avant le test : projet local ou de test, pages, résultat attendu et actions autorisées. L’intention graphique et le ton guideront les corrections.','uxlab-foot'));draw(0);
  }

  // Bloc 1 : comparer réellement les styles d'actions de même rôle dans un petit DOM.
  {
    const root=setup('design','Bloc 1 · comparer les composants qui ont le même rôle');
    const demo=panel(text('Application de gestion · trois écrans','uxlab-small')), grid=make('div',{class:'uxlab-samples'}), output=status();
    const ctas=['Profil','Préférences','Notifications'].map((label,i)=>{
      const cta=button('Enregistrer',()=>{output.textContent='Enregistrement simulé de l’écran '+label+'.';},'uxlab-demo-cta '+['','second','third'][i]);
      grid.append(make('div',{class:'uxlab-sample'},text(label,'uxlab-small'),cta));return cta;
    });
    const values=text('Cliquez sur « Comparer les styles » pour relever les valeurs de cette démo.','uxlab-measure');
    const measure=()=>{values.textContent=ctas.map((b,i)=>{const s=getComputedStyle(b);return ['Profil','Préférences','Notifications'][i]+' : espacements '+s.paddingTop+' / '+s.paddingRight+' ; arrondi '+s.borderRadius;}).join('\n');output.textContent='Différences observées. Il faut confirmer qu’elles sont involontaires avant de les corriger.';};
    demo.append(grid,actions(button('Comparer les styles',measure,'uxlab-primary'),button('Harmoniser la démo',()=>{ctas.forEach(b=>b.classList.remove('second','third'));measure();output.textContent='Les mêmes règles sont maintenant appliquées aux trois boutons de cette démo. Les valeurs ci-dessus ont été relevées à nouveau.';})),values,output);
    split(root,demo,explanation('Comparer avant de corriger','« Compare les boutons de même rôle sur ces pages et ces tailles d’écran. Montre les valeurs et les différences. »','Une variation peut être volontaire. Un bouton principal et une action secondaire n’ont pas forcément le même style.'));
  }

  // Bloc 2 : une vraie petite séquence avec retour arrière et conservation de saisie.
  {
    const root=setup('journey','Bloc 2 · faire essayer un parcours et conserver les étapes observées');
    let step=1,name='',keep=false;const log=[],demo=panel(), feedback=status();
    const keepButton=button('Conserver la saisie : non',()=>{keep=!keep;keepButton.setAttribute('aria-pressed',String(keep));keepButton.textContent='Conserver la saisie : '+(keep?'oui':'non');});keepButton.setAttribute('aria-pressed','false');
    function draw(){
      demo.replaceChildren(text('Association · inscription fictive à une activité','uxlab-small'),heading('Étape '+step+' / 3'));
      if(step===1){const input=make('input',{id:'uxlab-name',type:'text',value:name,autocomplete:'off'});demo.append(make('label',{for:'uxlab-name',text:'Votre prénom'}),input,actions(button('Continuer',()=>{if(!input.value.trim()){feedback.textContent='Saisissez un prénom fictif pour continuer.';return;}name=input.value.trim();log.push('1. Prénom renseigné ; passage au récapitulatif.');step=2;feedback.textContent='';draw();},'uxlab-primary'),keepButton));}
      if(step===2)demo.append(text('Prénom saisi : '+name),actions(button('Retour pour corriger',()=>{const lost=!keep;log.push('2. Retour : '+(lost?'prénom effacé.':'prénom conservé.'));if(lost)name='';step=1;feedback.textContent=lost?'Le prénom a disparu au retour : c’est une perte de saisie reproductible.':'Le prénom est conservé. On peut poursuivre la vérification.';draw();}),button('Confirmer la démo',()=>{step=3;log.push('3. Confirmation fictive affichée.');feedback.textContent='Aucune inscription ni aucun e-mail réel.';draw();},'uxlab-primary')));
      if(step===3)demo.append(heading('Inscription simulée confirmée'),text('Le résultat attendu est visible.'));
      demo.append(feedback,actions(button('Voir les étapes observées',()=>{trace.textContent=log.length?log.join('\n'):'Aucune étape exécutée.';}),button('Recommencer',()=>{step=1;name='';log.length=0;trace.textContent='';feedback.textContent='';draw();})));
    }
    const trace=text('','uxlab-measure'), lesson=explanation('Décrire une tâche, puis la faire rejouer','« Essaie ce parcours avec des données fictives. Relève les blocages, pertes de saisie et confirmations absentes. »','L’agent peut constater un obstacle. Il ne représente pas vos utilisateurs et ne mesure pas leur satisfaction.');lesson.append(trace);split(root,demo,lesson);draw();
  }

  // Bloc 3 : une preuve technique archivée et des vérifications humaines distinctes.
  {
    const root=setup('a11y','Bloc 3 · lancer des contrôles et expliquer ce qui reste à vérifier');
    const content=panel(), choices=[
      ['Nom des boutons','Un défaut signalé par Lighthouse','Le rapport archivé de la démonstration signale : « Buttons do not have an accessible name ». Il faut retrouver les éléments et leur état dans le rapport.','C’est une preuve d’un contrôle précis, pas une certification de toute l’accessibilité.'],
      ['Clavier','Essayer le parcours sans souris','Vérifier que les actions sont atteignables et utilisables, que le focus reste visible et que l’on ne se retrouve pas bloqué.','La présence d’un bouton dans le code ne prouve pas que tout le parcours fonctionne au clavier.'],
      ['Audio et vidéo','Vérifier les alternatives et leur qualité','Audio préenregistré : transcription. Vidéo avec paroles : sous-titres synchronisés. Informations visuelles essentielles : description si elles ne sont pas expliquées à l’oral.','L’IA peut préparer une transcription ou des sous-titres. Une personne doit vérifier leur fidélité et leur utilisation dans le lecteur.']
    ];
    const buttons=choices.map((c,i)=>button(c[0],()=>{pressed(buttons,i);content.replaceChildren(heading(c[1]),text(c[2]),text(c[3],'uxlab-feedback'));}));
    const demo=panel(text('Choisissez un contrôle','uxlab-small'),actions(...buttons),content);content.classList.add('uxlab-inset');
    split(root,demo,explanation('Demander les preuves et les limites','« Lance les contrôles disponibles sur ces pages et ces états. Explique qui est gêné et ce qui reste à tester manuellement. »','axe et Lighthouse détectent certains défauts automatisables. Le sens d’un texte, les médias et l’expérience complète demandent une évaluation complémentaire.'));buttons[0].click();
  }

  // Bloc 4 : calculer sans inventer une cause, avec un dénominateur explicite.
  {
    const root=setup('behavior','Bloc 4 · lire les données disponibles, sans inventer leur cause');
    const demo=panel(text('Newsletter : ouvrir → valider → confirmer','uxlab-small')), bars=make('div',{class:'uxlab-bars',role:'img','aria-label':'100 personnes ouvrent le formulaire, 60 le valident, 30 confirment leur e-mail.'});
    [100,60,30].forEach(n=>{const b=make('div',{class:'uxlab-bar',text:String(n),'aria-hidden':'true'});b.style.height=(n*1.3)+'px';bars.append(b);});
    const result=status();
    const choices=[['Formulaire validé','60 / 100 = 60 % des personnes entrées.'],['E-mail confirmé','30 / 100 = 30 % des personnes entrées. Entre validation et confirmation : 30 / 60 = 50 %.']];
    const buttons=choices.map((c,i)=>button(c[0],()=>{pressed(buttons,i);result.textContent=c[1];}));
    demo.append(bars,actions(...buttons),result,actions(button('D’où vient l’abandon ?',()=>{result.textContent='Ces données ne donnent pas la cause. Problème d’e-mail, changement d’avis ou autre : il faut enquêter.';})));
    split(root,demo,explanation('Calculer et formuler des hypothèses','« Voici les événements, la période et les étapes. Calcule les passages et abandons, puis sépare les chiffres des explications possibles. »','Jeu pédagogique : même cohorte fictive, même période. Sans données d’usage, pas de taux réel ; un tunnel ne prouve pas la cause.'));buttons[0].click();
  }

  // Bloc 5 : le texte proposé reste lié à une vraie règle de validation de la démo.
  {
    const root=setup('copy','Bloc 5 · proposer des messages qui aident à continuer');
    const demo=panel(text('Site d’association · formulaire de contact','uxlab-small')), result=status();let tone=0,helpful=false;
    const input=make('input',{id:'uxlab-email',type:'email',required:'',value:'clem@','aria-describedby':'uxlab-email-result'});result.id='uxlab-email-result';
    const tones=['Clair et direct','Chaleureux'].map((s,i)=>button(s,()=>{tone=i;pressed(tones,i);if(helpful)check();}));pressed(tones,0);
    function check(){input.setAttribute('aria-invalid',String(!input.validity.valid));result.textContent=input.validity.valid?'Adresse recevable dans cette démo. Aucun envoi.':!helpful?'Erreur 42':tone?'Il manque une adresse e-mail valide. Essayez par exemple nom@exemple.ch.':'Saisissez une adresse e-mail au format nom@exemple.ch.';}
    demo.append(make('label',{for:'uxlab-email',text:'Votre adresse e-mail'}),input,actions(button('Tester le message',check,'uxlab-primary'),button('Voir une reformulation',()=>{helpful=true;check();})),result,actions(...tones));
    split(root,demo,explanation('Donner la cible, le ton et l’erreur réelle','« Voici le message affiché et la règle de validation. Propose deux variantes compréhensibles pour des habitants qui nous contactent. »','Relire en contexte. Le texte ne doit ni promettre une action inexistante ni masquer une vraie contrainte.'));
  }

  // 26 : les chiffres proviennent exactement du rapport Lighthouse archivé.
  {
    const root=setup('lighthouse', 'Bloc 6 · Faire mesurer la vitesse réelle et examiner l’attente');
    const img=make('img',{src:'./preuves/traverse-lighthouse.png',alt:'Rapport Lighthouse archivé de Traverse : performance 73, accessibilité 76, bonnes pratiques 96 et SEO 91.',class:'uxlab-capture',width:'1440',height:'1000'});
    const dialog=make('dialog',{class:'uxlab-dialog','aria-label':'Capture complète du rapport Lighthouse'});
    dialog.append(button('Fermer la capture',()=>dialog.close()),img.cloneNode());
    dialog.addEventListener('keydown',e=>e.stopPropagation());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    document.body.append(dialog);
    const zoom=button('',()=>dialog.showModal(),'uxlab-zoom');zoom.setAttribute('aria-label','Agrandir la capture Lighthouse');zoom.append(img);
    const figure=make('figure',{class:'uxlab-figure'},zoom,make('figcaption',{text:'Cliquer pour agrandir · Traverse · 21/10/2026 · mobile simulé'}));
    const detail=panel(), value=text('73 / 100','uxlab-big'), title=heading('Performance'), desc=text('Le score résume plusieurs métriques. Ouvrez les détails avant de conclure.');
    const choices=[['Performance','73 / 100','Performance','Premier contenu affiché : 1,1 s. Plus grand élément affiché (LCP) : 86,0 s. Blocage total : 170 ms. Mesures locales, sur mobile simulé.'],['Accessibilité','76 / 100','Accessibilité automatisée','Le rapport signale notamment des boutons sans nom accessible. Ce score ne représente pas un pourcentage de conformité.'],['Les limites','1 page','Une archive, pas l’état actuel','Ce rapport concerne la page d’entrée de l’exercice dans son état au moment du test. Il ne couvre pas tout le tunnel et ne mesure pas la satisfaction.']];
    const buttons=choices.map(([label,n,t,d],i)=>button(label,()=>{pressed(buttons,i);value.textContent=n;title.textContent=t;desc.textContent=d;}));pressed(buttons,0);
    detail.append(actions(...buttons),value,title,desc,make('div',{class:'uxlab-links'},make('a',{href:'./preuves/traverse-lighthouse.html',target:'_blank',rel:'noopener',text:'Ouvrir le rapport complet ↗'}),make('a',{href:'./preuves/traverse-lighthouse.json',download:'traverse-lighthouse.json',text:'Télécharger le JSON'})));
    root.append(make('div',{class:'uxlab-report'},figure,detail),text('Le rapport est déjà calculé : consulter cette scène ne lance aucun audit sur l’ordinateur des apprenants.', 'uxlab-foot'));
  }



  // 29 : machine à états explicite : audit, correction puis revérification.
  {
    const root=setup('workflow', 'Pour conclure · Un audit, des corrections, une nouvelle vérification');let mode='audit', phase=0;
    const pipeline=make('div',{class:'uxlab-pipeline'}), out=text('Aucun contrôle exécuté.', 'uxlab-prompt');
    out.setAttribute('role','status');out.setAttribute('aria-live','polite');
    const auditMode=button('Audit · lecture seule',()=>{mode='audit';draw();}),debugMode=button('Débogage · copie de test',()=>{mode='debug';draw();});
    const audit=button('1. Auditer la démo',()=>{phase=1;out.textContent='3 constats pédagogiques : boutons incohérents, message d’erreur vague, libellé à évaluer avec une personne.';draw();},'uxlab-primary');
    const fix=button('2. Appliquer les 2 corrections',()=>{phase=2;out.textContent='Styles et message modifiés dans le scénario. Le libellé reste à évaluer : aucune preuve de résolution à ce stade.';draw();});
    const verify=button('3. Revérifier',()=>{phase=3;out.textContent='2 constats résolus dans cette simulation. 1 point reste à vérifier manuellement. Le travail n’est pas déclaré entièrement terminé.';draw();});
    function draw(){auditMode.setAttribute('aria-pressed',String(mode==='audit'));debugMode.setAttribute('aria-pressed',String(mode==='debug'));fix.disabled=mode!=='debug'||phase!==1;verify.disabled=phase!==2;pipeline.replaceChildren(...['Cadrer','Auditer','Corriger','Revérifier'].map((s,i)=>{const n=make('div',{class:'uxlab-stage '+(i<=phase?'done':'')},make('strong',{text:s}),document.createTextNode(['Mission définie',phase>=1?'3 constats':'À lancer',phase>=2?'2 corrections':'Sur copie autorisée',phase>=3?'1 point restant':'Preuves attendues'][i]));return n;}));}
    root.append(actions(auditMode,debugMode),pipeline,actions(audit,fix,verify),out);
    resettable(root,()=>{mode='audit';phase=0;out.textContent='Aucun contrôle exécuté.';draw();});draw();
  }

})();
