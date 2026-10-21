/* Interactions locales de la partie 2. Aucune IA, télémétrie ou commande externe.
   Le rapport Lighthouse est une archive réelle ; les autres cas sont pédagogiques. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const make = (tag, attrs = {}, ...children) => {
    const n = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'text') n.textContent = value;
      else if (key === 'class') n.className = value;
      else n.setAttribute(key, value);
    }
    for (const child of children.flat()) if (child) n.append(child);
    return n;
  };
  const text = (s, cls = '') => make('p', {text:s, class:cls});
  const button = (s, fn, cls = '') => { const b = make('button', {type:'button', text:s, class:cls}); b.addEventListener('click', fn); return b; };
  const status = () => make('p', {class:'uxlab-feedback', role:'status', 'aria-live':'polite', 'aria-atomic':'true'});
  const panel = (...kids) => make('div', {class:'uxlab-panel'}, ...kids);
  const actions = (...kids) => make('div', {class:'uxlab-actions'}, ...kids);
  const heading = s => make('h3', {text:s});
  function setup(name, caption) {
    const root = $('[data-lab="'+name+'"]');
    root.classList.add('uxlab'); root.setAttribute('data-arrows', 'true');
    root.append(text(caption, 'uxlab-kicker'));
    // Les touches des champs appartiennent au champ, pas aux raccourcis du diaporama.
    root.addEventListener('keydown', e => { if (/^(SELECT|INPUT)$/.test(e.target.tagName) && e.key !== 'Escape') e.stopPropagation(); });
    return root;
  }
  function resettable(root, reset) { const row=actions(button('Recommencer', reset),text('Démonstration pédagogique locale · aucune IA connectée.', 'uxlab-foot'));row.classList.add('uxlab-reset');root.append(row); }
  function pressed(buttons, selected) { buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === selected))); }

  // 22 : demander une preuve sur un véritable petit DOM de démonstration.
  {
    const root = setup('verdict', '01 / 08 · À vous de contester le verdict');
    const feedback = status(), measures = text('', 'uxlab-measure');
    const site = panel(make('div', {class:'uxlab-brand', text:'traverse ↗'}), make('div', {class:'uxlab-landscape', 'aria-hidden':'true'}), heading('Choisissez votre sortie'));
    site.classList.add('uxlab-web');
    const offers = make('div', {class:'uxlab-offers'});
    ['Au lac', 'En forêt', 'En ville'].forEach((name, i) => offers.append(make('div', {class:'uxlab-offer'}, text(name), button('Choisir', () => { feedback.textContent = 'Sortie « '+name+' » sélectionnée dans cette démonstration.'; }, 'uxlab-demo-cta '+['','second','third'][i]))));
    site.append(offers);
    const answer = panel(text('VERDICT PROPOSÉ', 'uxlab-kicker'), heading('« Aucun problème. Tout est cohérent. »'), text('Aucun outil, aucune page et aucune preuve ne sont cités.'), actions(
      button('Je fais confiance', () => { feedback.textContent = 'Sur quoi repose cette confiance ? Un verdict sans preuve ne permet pas de vérifier le travail.'; }),
      button('Je demande les preuves', () => {
        site.classList.add('uxlab-marked');
        answer.classList.add('uxlab-proved');
        measures.textContent = Array.from(site.querySelectorAll('.uxlab-demo-cta'), (b,i) => { const s=getComputedStyle(b); return 'Bouton '+(i+1)+' : padding '+s.paddingTop+' / '+s.paddingRight+' ; arrondi '+s.borderRadius; }).join('\n');
        feedback.textContent = 'Les valeurs viennent du DOM de cette démo. Les boutons ont le même rôle : leur différence est à examiner, pas à corriger sans connaître l’intention.';
      }, 'uxlab-primary')),
      measures, feedback);
    root.append(make('div', {class:'uxlab-split'}, site, answer));
    resettable(root, () => { site.classList.remove('uxlab-marked'); answer.classList.remove('uxlab-proved'); measures.textContent=''; feedback.textContent=''; });
    root.append(text('À retenir : un conseil peut aider ; un constat vérifiable doit renvoyer à une observation.', 'uxlab-print'));
  }

  // 23 : composer un objectif, puis constater les questions manquantes.
  {
    const root=setup('mission', '02 / 08 · Construisez la mission avec le groupe');
    const prompt=text('« Audite mon site. »', 'uxlab-prompt'), feedback=status();
    const fields=make('div', {class:'uxlab-fields'}), selects=[];
    for (const [label, values] of [['Pour qui ?',['Une première visite','Une personne déjà cliente']],['Sur quel appareil ?',['Un téléphone','Un ordinateur']],['Pour quel résultat ?',['Réserver une sortie et voir la confirmation','Trouver le prix et les conditions']]]) {
      const select=make('select', {'aria-label':label}, make('option', {value:'', text:'À préciser…'}), values.map(v=>make('option',{value:v,text:v})));
      selects.push(select); fields.append(make('label',{},document.createTextNode(label),select));
      select.addEventListener('change',()=>{prompt.textContent='Public : '+(selects[0].value||'à préciser')+'. Appareil : '+(selects[1].value||'à préciser')+'. Objectif : '+(selects[2].value||'à préciser')+'.';feedback.textContent='';});
    }
    root.append(fields, prompt, actions(button('Préparer la mission',()=>{
      const missing=selects.filter(s=>!s.value).map(s=>s.getAttribute('aria-label'));
      feedback.textContent=missing.length?'L’agent doit encore vous demander : '+missing.join(' · '):'Mission cadrée. Il faut aussi préciser les pages, le compte fictif, les intentions graphiques et le ton si des textes sont à réécrire.';
    },'uxlab-primary'),button('Recommencer',()=>{selects.forEach(s=>s.value='');prompt.textContent='« Audite mon site. »';feedback.textContent='';})), feedback,
      text('Scénario pédagogique · copie de test, données fictives, sans paiement ni e-mail réel. Aucune IA connectée.', 'uxlab-foot'));
  }

  // 24 : aucun bouton ne lance réellement un outil ; l'équipement est illustré.
  {
    const root=setup('tools', '03 / 08 · Branchez les outils, regardez ce qui devient possible');
    const info=status(), enabled=new Set();
    const tools=[['Navigateur','Ouvrir et essayer','Parcours de test et captures : observer une erreur, une confirmation ou une perte de saisie.'],['Lighthouse','Mesurer une page','Rapport de laboratoire : performance, accessibilité automatisée et autres contrôles.'],['Styles + axe','Inspecter l’interface','Valeurs CSS et défauts automatisables : des observations à compléter par une évaluation humaine.'],['Données d’usage','Lire des événements','Un tunnel chiffré exige des événements adaptés. Sans données, on ne mesure pas les abandons réels.']];
    const grid=make('div',{class:'uxlab-tools'}), buttons=[];
    tools.forEach(([name,desc,detail],i)=>{const b=button('',()=>{enabled.has(i)?enabled.delete(i):enabled.add(i);b.setAttribute('aria-pressed',String(enabled.has(i)));info.textContent=(enabled.has(i)?'Connecté dans le schéma : ':'Déconnecté du schéma : ')+name+'. '+detail;summary.textContent=enabled.size+' outil'+(enabled.size>1?'s':'')+' sélectionné'+(enabled.size>1?'s':'');},'uxlab-tool');b.append(make('strong',{text:name}),make('span',{text:desc}));b.setAttribute('aria-pressed','false');buttons.push(b);grid.append(b);});
    const summary=make('em',{text:'0 outil sélectionné'});
    root.append(make('div',{class:'uxlab-wire'},text('Votre mission'),text('→'),text('Agent équipé'),text('→'),summary),grid,info,
      text('MCP : une façon commune de présenter et d’appeler des outils. Le serveur peut utiliser des API ou des outils locaux.', 'uxlab-feedback'),
      text('Une conversation sans outil conseille sur ce qu’on lui donne. Un agent équipé peut exécuter des contrôles autorisés ; une même application peut proposer les deux.', 'uxlab-small'));
    resettable(root,()=>{enabled.clear();buttons.forEach(b=>b.setAttribute('aria-pressed','false'));summary.textContent='0 outil sélectionné';info.textContent='';});
  }

  // 25 : six pièces différentes, sans répéter six longues consignes.
  {
    const root=setup('evidence', '04 / 08 · Ouvrez une pièce du dossier');
    const menu=make('div',{class:'uxlab-menu',role:'group','aria-label':'Les six blocs'}), detail=panel();detail.classList.add('uxlab-evidence');
    detail.setAttribute('role','region');detail.setAttribute('aria-label','Preuve sélectionnée');detail.setAttribute('aria-live','polite');
    const cases=[
      ['1 · Design system','12 / 6 / 18 px','Même rôle, styles différents','Les espacements des boutons de la première scène sont mesurables. L’intention graphique reste à confirmer.','La valeur CSS est une preuve de différence, pas de son effet sur les ventes.'],
      ['2 · Friction','Saisie perdue','Une étape à reproduire','Scénario pédagogique : après avoir renseigné ses coordonnées, revenir à l’étape précédente vide les champs.','Conserver la séquence et l’état avant/après. Observer de vrais utilisateurs pour comprendre leurs difficultés.'],
      ['3 · Accessibilité','Un nom manque','Qui est gêné ?','Le rapport Lighthouse archivé signale des boutons sans nom accessible. La pièce technique est consultable sur la scène suivante.','Le contrôle automatique ne certifie pas l’accessibilité. Compléter notamment au clavier et au lecteur d’écran.'],
      ['4 · Comportement','100 → 60 → 30','Que sait-on vraiment ?','Jeu fictif : 100 personnes entrent, 60 atteignent l’étape suivante, 30 terminent. Aucune cause n’est fournie.','30 % terminent dans ce jeu. On ne peut pas en déduire que les autres abandonnent à cause d’un bouton.'],
      ['5 · Microcopie','« Erreur 42 »','Aidez la personne à continuer','Cas fictif : une adresse e-mail invalide déclenche seulement « Erreur 42 ». Quelle information manque ?','Proposition à discuter : « Saisissez une adresse e-mail au format nom@exemple.ch. » Le texte doit correspondre à la vraie règle.'],
      ['6 · Performances','73 / 100','Une mesure située','Le rapport archivé de Traverse donne 73 en performance, avec une simulation mobile. Ce n’est pas une note d’UX.','Ouvrir le rapport, regarder les métriques et les conditions, puis refaire les mesures après correction.']
    ];
    const buttons=cases.map(([label,value,title,observation,limit],i)=>button(label,()=>{
      pressed(buttons,i);
      if(i===3){
        const bars=make('div',{class:'uxlab-bars',role:'img','aria-label':'Cohorte fictive : 100 entrées, 60 à l’étape suivante, 30 confirmations.'});
        [100,60,30].forEach(n=>{const bar=make('div',{class:'uxlab-bar',text:String(n),'aria-hidden':'true'});bar.style.height=(n+30)+'px';bars.append(bar);});
        detail.replaceChildren(heading('Où perd-on du monde ?'),bars,text('Même cohorte fictive : 100 entrées, 60 à l’étape suivante, 30 confirmations.'),text('30 % terminent ici. La cause des abandons reste inconnue : une hypothèse n’est pas une explication prouvée.','uxlab-feedback'));
      }else if(i===4){
        let helpful=false;
        const input=make('input',{type:'email',id:'uxlab-email',required:'',value:'clem@','aria-describedby':'uxlab-email-result'});
        const result=status();result.id='uxlab-email-result';
        const check=()=>{input.setAttribute('aria-invalid',String(!input.validity.valid));result.textContent=input.validity.valid?'Adresse recevable dans cette démo. Aucun envoi.':helpful?'Saisissez une adresse e-mail au format nom@exemple.ch.':'Erreur 42';};
        detail.replaceChildren(heading('Une erreur qui aide à continuer'),make('label',{class:'uxlab-email-label',for:'uxlab-email',text:'Votre adresse e-mail'}),input,
          actions(button('Tester le message',check,'uxlab-primary'),button('Afficher une piste',()=>{helpful=true;check();})),result,
          text('Cas fictif. Comparez les messages : lequel permet de comprendre le problème et de poursuivre ?','uxlab-small'));
      }else detail.replaceChildren(text(value,'uxlab-big'),heading(title),text(observation),text(limit,'uxlab-feedback'));
    }));
    buttons.forEach(b=>b.setAttribute('aria-pressed','false')); menu.append(...buttons);
    detail.append(text('6 pièces','uxlab-big'),heading('Un bloc, une preuve adaptée'),text('Choisissez un bloc à gauche. Certaines pièces sont fictives ; les résultats Lighthouse viennent du rapport conservé.'));
    root.append(make('div',{class:'uxlab-gallery'},menu,detail),text('Les exemples ne sont ni un audit en cours ni une promesse de couverture complète du plugin.', 'uxlab-foot'));
  }

  // 26 : les chiffres proviennent exactement du rapport Lighthouse archivé.
  {
    const root=setup('lighthouse', '05 / 08 · Un vrai rapport, pas une note d’UX');
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

  // 27 : choix individuel puis explication, sans prétendre mesurer un vote collectif.
  {
    const root=setup('sorting', '06 / 08 · Constat, hypothèse ou préférence ?');let index=0;
    const items=[['Ces trois boutons ont des espacements différents.','Constat','Dans la première scène, les valeurs CSS permettent de vérifier cette différence.'],['Cette différence fait perdre des clients.','Hypothèse','Le lien de cause à effet n’est pas établi par les styles. Il faut des données ou une étude adaptée.'],['Je préfère les boutons arrondis.','Préférence','C’est un goût exprimé. Il peut guider une direction graphique, sans devenir une preuve sur les utilisateurs.']];
    const quote=text('', 'uxlab-quote'), feedback=status(), progress=make('div',{class:'uxlab-progress','aria-hidden':'true'}), box=panel(progress,quote);
    const buttons=['Constat','Hypothèse','Préférence'].map(label=>button(label,()=>{feedback.textContent=(label===items[index][1]?'Oui. ':'À reconsidérer : ')+items[index][1]+'. '+items[index][2];next.disabled=false;}));
    const next=button('Affirmation suivante →',()=>{index=(index+1)%items.length;draw();},'uxlab-primary');
    function draw(){quote.textContent='« '+items[index][0]+' »';feedback.textContent='';next.disabled=true;progress.replaceChildren(...items.map((_,i)=>make('span',{class:i===index?'current':''})));}
    box.append(actions(...buttons),feedback,actions(next));root.append(box,text('Faites d’abord voter le groupe à main levée, puis choisissez une réponse pour en discuter.', 'uxlab-foot'));draw();
  }

  // 28 : un choix de priorité explicable, pas un classement universel.
  {
    const root=setup('priority', '07 / 08 · Une seule correction avant la prochaine ouverture');
    root.append(text('Objectif : permettre de réserver. Les trois problèmes sont confirmés dans ce scénario fictif.', 'uxlab-small'));
    const feedback=status(), cards=make('div',{class:'uxlab-rank'});
    const data=[['Des boutons différents','Trois styles pour la même action.','À traiter pour la cohérence, mais le scénario indique qu’ils restent utilisables. Pourquoi passer avant le blocage de réservation ?'],['La réservation est bloquée','Le bouton de confirmation ne répond jamais.','Dans ce contexte, ce blocage empêche l’objectif principal. C’est une première priorité défendable ; il faut aussi vérifier qui est touché et comment.'],['Une grande image lourde','Le chargement est lent sur mobile.','L’impact dépend du délai et des personnes touchées. Si le chargement empêche d’arriver au formulaire, cette priorité peut aussi devenir critique.']];
    const buttons=data.map(([t,d,explanation],i)=>{const b=button('',()=>{pressed(buttons,i);feedback.textContent=explanation;});b.append(make('strong',{text:t}),make('span',{text:d}));return b;});pressed(buttons,-1);cards.append(...buttons);root.append(cards,feedback,text('Décider avec l’impact sur les personnes, la fréquence, la gravité et l’effort. Pas uniquement avec le score d’un outil.', 'uxlab-feedback'));
    resettable(root,()=>{pressed(buttons,-1);feedback.textContent='';});
  }

  // 29 : machine à états explicite : audit, correction puis revérification.
  {
    const root=setup('workflow', '08 / 08 · Un rapport n’est pas une correction');let mode='audit', phase=0;
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
