/* Interactions locales : aucune IA appelée, aucun stockage ni envoi de saisie. */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const cover=document.querySelector('[data-key="intro-1"]');
  if(cover){
    const pause=cover.querySelector('.launch-pause'),svg=cover.querySelector('.launch-path'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let paused=false;
    const apply=()=>{const stop=paused||reduce.matches;cover.classList.toggle('launch-paused',stop);pause.setAttribute('aria-pressed',String(stop));pause.textContent=reduce.matches?'Animations désactivées':paused?'Relancer l’animation':'Mettre l’animation en pause';pause.disabled=reduce.matches;if(stop)svg.pauseAnimations?.();else svg.unpauseAnimations?.();};
    pause.addEventListener('click',()=>{paused=!paused;apply()});reduce.addEventListener('change',apply);apply();
    cover.querySelector('.launch-start').addEventListener('click',()=>document.querySelector('#edge-next').click());
    cover.addEventListener('pointermove',e=>{if(paused||reduce.matches)return;const r=cover.getBoundingClientRect();cover.style.setProperty('--launch-x',((e.clientX-r.left)/r.width-.5)*14+'px');cover.style.setProperty('--launch-y',((e.clientY-r.top)/r.height-.5)*10+'px');});
    cover.addEventListener('pointerleave',()=>{cover.style.setProperty('--launch-x','0px');cover.style.setProperty('--launch-y','0px')});
  }

  const text = (s, value, root) => { $(s,root).textContent=value; };
  const tabs = (root, selector, draw) => {
    root.querySelectorAll(selector).forEach(b=>b.addEventListener('click',()=>{
      root.querySelectorAll(selector).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
      draw(b.dataset.choice);
    }));
    draw($(selector,root).dataset.choice);
  };
  const gallery=$('[data-widget="captures"]');
  if(gallery){
    const img=$('[data-capture]',gallery);
    tabs(gallery,'button[data-choice]',name=>{const label=name==='grok'?'Grok':'Gemini';img.src='captures/'+name+'-exemple.png';img.alt='Interface réelle de '+label+', sans compte connecté, avec la demande d’atelier préparée dans la zone de saisie.';text('[data-caption]',label+' · capture du 15 novembre 2026. Demande préparée, non envoyée.',gallery)});
    const dialog=document.createElement('dialog');dialog.className='capture-dialog';dialog.setAttribute('aria-label','Capture agrandie de l’interface');const close=document.createElement('button');close.type='button';close.textContent='Fermer la capture';const big=document.createElement('img');dialog.append(close,big);document.body.append(dialog);close.addEventListener('click',()=>dialog.close());dialog.addEventListener('keydown',e=>e.stopPropagation());$('.capture-zoom',gallery).addEventListener('click',()=>{big.src=img.src;big.alt=img.alt;dialog.showModal()});
  }
  const tools = [
    ['ChatGPT','OpenAI · modèles de la famille GPT','L’application est ChatGPT. Le modèle et les outils accessibles dépendent du compte et du mode choisi.','https://chatgpt.com/'],
    ['Gemini','Google · application et famille de modèles','Le même nom désigne l’application et ses modèles. Les options de personnalisation évoluent selon le compte.','https://gemini.google.com/'],
    ['Claude','Anthropic · application et famille de modèles','Les instructions et documents de projet permettent de garder un cadre de travail, selon les fonctions disponibles.','https://claude.ai/'],
    ['Grok','xAI · application et famille de modèles','Un chat accessible notamment sur grok.com. Vérifiez quels outils sont activés pour votre demande.','https://grok.com/'],
    ['Copilot','Microsoft · application et fonctions intégrées','Le nom de l’application ne suffit pas à identifier le modèle derrière chaque fonction.','https://copilot.microsoft.com/'],
    ['Mistral','Modèles Mistral · Vibe, anciennement Le Chat','Un autre écosystème de modèles et d’applications. Les noms commerciaux et les accès peuvent évoluer.','https://chat.mistral.ai/'],
  ];
  const app=$('[data-widget="outils"]');
  if(app)tabs(app,'button[data-choice]',choice=>{const d=tools[+choice];text('[data-name]',d[0],app);text('[data-publisher]',d[1],app);text('[data-detail]',d[2],app);$('[data-product-link]',app).href=d[3];});
  const ways=$('[data-widget="modes"]');
  const scenarios={chat:['Un échange à la fois','« Propose un atelier de 90 minutes. » Vous lisez la proposition et précisez ce qu’il faut changer.','Vous donnez les informations utiles dans la conversation.'],assistant:['Un cadre réutilisable','Vous chargez le brief ClairLieu et les règles de votre assistant. Il prépare ses propositions dans ce cadre.','Vous réutilisez les mêmes consignes et vérifiez les réponses.'],agent:['Des actions avec des outils','L’IA pourrait créer un fichier, observer le résultat puis le corriger, si ces actions sont autorisées.','Vous fixez les permissions, les validations et la condition d’arrêt.']};
  if(ways)tabs(ways,'button[data-choice]',choice=>{const d=scenarios[choice];text('[data-mode-title]',d[0],ways);text('[data-mode-example]',d[1],ways);text('[data-mode-human]',d[2],ways);});
  function download(value,name){const u=URL.createObjectURL(new Blob([value],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
  let dirty=false;
  for(const kind of ['prompt','assistant']){
    const root=$(`[data-widget="${kind}"]`);if(!root)continue;
    const fields=[...root.querySelectorAll('input,textarea')];
    const value=()=>fields.map(f=>`${f.dataset.label} : ${f.value.trim()||'À préciser'}`).join('\n')+(kind==='assistant'?'\nDistinguez les faits des propositions. Signalez les informations absentes. Ne réservez rien, ne publiez rien et ne contactez personne.':'');
    const draw=()=>text('[data-preview]',value().length>650?value().slice(0,650)+'… (aperçu abrégé ; le fichier contient toutes les consignes)':value(),root);fields.forEach(f=>f.addEventListener('input',()=>{dirty=true;draw()}));
    $('[data-save]',root).addEventListener('click',()=>{download(value(),kind==='assistant'?'mon-assistant-clairlieu.md':'ma-demande.md');dirty=false;text('[data-status]','Fichier téléchargé. Aucun contenu envoyé à une IA.',root)});
    $('[data-copy]',root).addEventListener('click',async()=>{try{await navigator.clipboard.writeText(value());text('[data-status]','Consignes copiées : collez-les dans votre outil autorisé.',root)}catch{text('[data-status]','Copie indisponible : utilisez le téléchargement.',root)}});draw();
  }
  addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  const verify=$('[data-widget="verifier"]');
  if(verify)verify.querySelectorAll('button[data-choice]').forEach(b=>b.addEventListener('click',()=>{const good=b.dataset.choice==='non';text('[data-answer]',(good?'Oui, vous avez repéré l’erreur. ':'Reprenons le calcul. ')+'6 portions × 4 CHF = 24 CHF, et non 40 CHF. La phrase était assurée, mais le calcul était faux. Vérifiez avec une calculatrice indépendante.',verify);verify.querySelectorAll('button[data-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
  const tests=$('[data-widget="tests"]');
  const checks=[['Programme normal','Propose un programme de 90 minutes pour les 12 participants, avec les six ordinateurs du mini-brief.','Durée exacte, matériel respecté et organisation possible.'],['Information absente','Quel est le nom et le numéro de téléphone du responsable ?','L’assistant doit signaler que ces informations ne sont pas fournies.'],['Contrainte incompatible','Prévois un ordinateur par personne, sans achat.','Il doit relever le conflit et proposer des binômes ou une autre organisation.']];
  let current=0;const checked=[false,false,false];
  if(tests){tabs(tests,'button[data-choice]',choice=>{current=+choice;const d=checks[current];text('[data-test-title]',d[0],tests);text('[data-test-request]',d[1],tests);text('[data-test-expected]',d[2],tests);$('[data-checked]',tests).checked=checked[current]});$('[data-checked]',tests).addEventListener('change',e=>{checked[current]=e.target.checked;text('[data-status]',`${checked.filter(Boolean).length} / 3 tests vérifiés par vous.`,tests)});$('[data-copy]',tests).addEventListener('click',async()=>{try{await navigator.clipboard.writeText(checks[current][1]);text('[data-status]','Demande copiée. Exécutez-la dans votre assistant, puis vérifiez sa réponse.',tests)}catch{text('[data-status]','Sélectionnez et copiez le texte de la demande.',tests)}});}
})();
