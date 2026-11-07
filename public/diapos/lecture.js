/* Lecture continue, à partir du contenu réel des diapos. Aucun service externe. */
(() => {
  'use strict';
  if (new URLSearchParams(location.search).get('lecture') !== '1') return;
  const config = typeof CONFIG === 'object' ? CONFIG : {};
  const slides = [...document.querySelectorAll('.slide')];
  if (!slides.length) return;
  document.body.classList.add('mode-lecture');
  document.title = 'Lecture texte : ' + document.title;
  // Les raccourcis de présentation ne doivent pas détourner Espace ou les flèches pendant la lecture.
  document.addEventListener('keydown', e => e.stopImmediatePropagation(), true);
  const h = (tag, texte) => { const el=document.createElement(tag); if(texte)el.textContent=texte; return el; };
  const link = (texte, url) => { const el=h('a',texte); el.href=url; return el; };
  const principal=h('main'); principal.id='lecture';
  const retour=document.querySelector('#retour-cours')?.href || document.currentScript?.dataset.retour || '/';
  const normal=new URL(location.href);normal.searchParams.delete('lecture');normal.hash='1';
  const nav=h('nav');nav.setAttribute('aria-label','Navigation de la lecture');
  nav.append(link('← Retour au cours',retour),link('Revenir à la présentation',normal.href));
  principal.append(nav,h('h1',document.querySelector('title').textContent.replace(/^Lecture texte : /,'')),h('p','Les diapos en lecture continue : texte redimensionnable, liens et tableaux. Les réponses des quiz sont affichées. Pour manipuler les autres activités, revenez à la présentation.'));
  const sommaire=h('ol');sommaire.className='lecture-sommaire';
  slides.forEach((s,i)=>{const li=h('li');li.append(link(s.querySelector('.title')?.textContent.trim()||'Diapo '+(i+1),'#lecture-diapo-'+(i+1)));sommaire.append(li);});
  const navigation=h('details');navigation.append(h('summary','Sommaire : '+slides.length+' diapos'),sommaire);
  principal.append(navigation);

  function activite(type, node) {
    const f=document.createDocumentFragment();
    if(type==='question' && typeof config.question==='string') { f.append(h('p',config.question));return f; }
    if(type==='quiz' || type==='vraifaux') {
      const qs=config[type==='quiz'?'quiz':'vraiFaux'];if(!Array.isArray(qs))return null;
      const dl=h('dl');qs.forEach(q=>{dl.append(h('dt',q.txt),h('dd',(type==='quiz'?q.rep:(q.vrai?'Vrai':'Faux'))+' : '+q.why));});f.append(dl);return f;
    }
    if(type==='lexique' && Array.isArray(config.lexique)) {
      const dl=h('dl');config.lexique.forEach(t=>dl.append(h('dt',t.nom||t.terme),h('dd',t.def)));f.append(dl);return f;
    }
    if(type==='refs' && Array.isArray(config.references)) {
      const ul=h('ul');config.references.forEach(r=>{const li=h('li');li.append(link(r.titre,r.url),document.createTextNode(' — '+r.source));ul.append(li);});f.append(ul);return f;
    }
    if(type==='steps' && Array.isArray(config[node.dataset.src])) {
      const ol=h('ol');config[node.dataset.src].forEach(t=>{const li=h('li');li.append(h('h3',t.titre||t.nom),h('p',t.txt||''));if(t.note)li.append(h('p',t.note));ol.append(li);});f.append(ol);return f;
    }
    return null;
  }
  const permis=new Set('p ul ol li h3 h4 h5 h6 table caption thead tbody tfoot tr th td strong b em i dl dt dd a figure figcaption br code pre blockquote sub sup kbd details summary'.split(' '));
  function copier(node) {
    if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent);
    if(node.nodeType!==Node.ELEMENT_NODE)return document.createDocumentFragment();
    if(node.getAttribute('aria-hidden')==='true')return document.createDocumentFragment();
    if(node.getAttribute('role')==='img' && node.getAttribute('aria-label'))return h('p',node.getAttribute('aria-label'));
    const type=node.getAttribute('data-comp'), rendu=type&&activite(type,node);if(rendu)return rendu;
    const nom=node.tagName.toLowerCase();
    if(['script','style','button','input','textarea','select','svg','canvas'].includes(nom))return document.createDocumentFragment();
    if(node.hidden)return document.createDocumentFragment();
    if(nom==='img') {
      if(!node.alt)return document.createDocumentFragment();
      const img=h('img');img.src=node.src;img.alt=node.alt;img.loading='lazy';if(node.width)img.width=node.width;if(node.height)img.height=node.height;return img;
    }
    const el=permis.has(nom)?h(nom):document.createDocumentFragment();
    if(nom==='a' && node.getAttribute('href')) {
      const href=node.getAttribute('href');el.href=/^#\d+$/.test(href)?'#lecture-diapo-'+href.slice(1):node.href;
    }
    if(nom==='th')el.setAttribute('scope',node.getAttribute('scope')||'col');
    if(nom==='table') { el.tabIndex=0;el.setAttribute('aria-label',node.querySelector('caption')?.textContent||'Tableau : '+(node.closest('.slide')?.querySelector('.title')?.textContent||'contenu du cours')); }
    if(nom==='details')el.open=true;
    for(const attr of ['colspan','rowspan'])if(node.hasAttribute(attr)&&el.nodeType===1)el.setAttribute(attr,node.getAttribute(attr));
    for(const enfant of node.childNodes)el.append(copier(enfant));return el;
  }
  slides.forEach((s,i)=>{
    const section=h('section');section.id='lecture-diapo-'+(i+1);
    section.append(h('h2',(i+1)+'. '+(s.querySelector('.title')?.textContent.trim()||'Diapo')));
    const corps=s.querySelector('.body')||s;
    for(const enfant of corps.childNodes)section.append(copier(enfant));
    const sources=s.querySelector('.s-sources');if(sources)section.append(copier(sources));
    principal.append(section);
  });
  document.querySelector('#viewport').hidden=true;
  for(const id of ['pv','retour-cours','live']){const el=document.getElementById(id);if(el)el.hidden=true;}
  document.body.append(principal);
})();
