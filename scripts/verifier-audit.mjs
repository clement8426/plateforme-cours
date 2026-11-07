// Régressions de référencement, lecture et navigation. Complète axe par des gestes clavier.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
const require=createRequire(resolve(process.env.UX_OUTILS??'../ux-outils','package.json'));
const {chromium}=require('playwright'),{AxeBuilder}=require('@axe-core/playwright');
const base=process.env.SITE_URL??'http://127.0.0.1:4187';
const out='.audit-site/verification';mkdirSync(out,{recursive:true});
const b=await chromium.launch(),preuves=[];
try{
 const ctx=await b.newContext({reducedMotion:'reduce',serviceWorkers:'block'}),p=await ctx.newPage(),erreurs=[];
 p.on('pageerror',e=>erreurs.push(e.message));
 await p.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,body:''}));
 const xml=await(await fetch(base+'/sitemap.xml')).text(),urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert(urls.length>=19);assert(urls.every(u=>u.startsWith('https://www.labonumerique.ch/')));
 assert(!urls.some(u=>/\/exercices\/|\/tilleul\/|\/affiche\/|\/hors-ligne\//.test(u)));
 const titres=new Set(),descriptions=new Set();
 for(const url of urls){
  const chemin=new URL(url).pathname;
  const r=await p.goto(base+chemin);assert.equal(r.status(),200,chemin);
  assert.equal(await p.locator('link[rel="canonical"]').getAttribute('href'),url);
  const titre=await p.title(),description=await p.locator('meta[name="description"]').getAttribute('content');
  assert(!titres.has(titre),'titre unique '+chemin);titres.add(titre);
  assert(description&&!descriptions.has(description),'description unique '+chemin);descriptions.add(description);
  assert.equal(await p.locator('meta[property="og:url"]').getAttribute('content'),url);
  assert.equal(await p.locator('meta[property="og:title"]').getAttribute('content'),titre.replace(/ \| Le Labo$/,''));
  assert(!(await p.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
  assert.equal(await p.locator('main').count(),1);
  const json=await p.locator('script[type="application/ld+json"]').evaluateAll(ss=>ss.map(s=>JSON.parse(s.textContent)));
  assert(json.some(o=>o['@graph']?.some(g=>g['@type']==='WebSite')));
 }
 const robots=await(await fetch(base+'/robots.txt')).text();assert(robots.includes('Sitemap: https://www.labonumerique.ch/sitemap.xml'));
 preuves.push(`${urls.length} pages indexables : canonique, titre, description et Open Graph propres ; sitemap et robots cohérents.`);
 const annexes=readdirSync('public',{recursive:true}).filter(f=>f.endsWith('.html'));
 for(const fichier of annexes){
  const chemin='/'+fichier.replaceAll('\\','/').replace(/index\.html$/,'');
  const r=await fetch(base+chemin);assert.equal(r.status,200,chemin);const html=await r.text();
  const noindex=await p.evaluate(s=>[...new DOMParser().parseFromString(s,'text/html').querySelectorAll('head meta[name="robots"]')].some(m=>m.content.includes('noindex')),html);
  assert(noindex,'noindex dans le document : '+chemin);
 }
 preuves.push(`${annexes.length} annexes HTML : consigne noindex vérifiée dans le document, sans dépendre des en-têtes de l’hébergeur.`);
 for(const chemin of ['/developpement/','/developpement/app-hebergee-suisse/','/ux/ux-ia/demos/affiche/','/hors-ligne/']){
  await p.goto(base+chemin);assert((await p.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
 }
 for(const deck of ['types-ia','ux-ia','ia-donnees','harnais']){
  for(const [width,theme] of [[1440,'light'],[320,'light'],[320,'dark']]){
   await p.setViewportSize({width,height:900});
   const reseau=[];const listener=r=>{if(/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(r.url()))reseau.push(r.url());};p.on('request',listener);
   await p.goto(`${base}/diapos/${deck}/?lecture=1`);
   await p.locator('#lecture').waitFor();await p.evaluate(t=>{document.documentElement.dataset.deck=t;return document.fonts.ready},theme);
   assert.equal(await p.locator('main:visible').count(),1);assert.equal(await p.getByRole('heading',{level:1}).count(),1);
   const original=await p.locator('.slide').count();assert.equal(await p.locator('#lecture > section').count(),original);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'reflow '+deck);
   assert.equal(reseau.length,0,'polices locales '+deck);p.off('request',listener);
   const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
   assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],deck+' lecture '+width+' '+theme);
   if(width===320&&theme==='light')await p.screenshot({path:resolve(out,deck+'-lecture-mobile.png')});
   const texte=await p.locator('#lecture').innerText();assert(texte.length>5000,deck+' texte réellement présent');
   if(deck==='types-ia')assert(texte.includes('Génération vidéo')&&texte.includes('La note vocale devient du texte'));
   await p.getByRole('link',{name:'Revenir à la présentation',exact:true}).focus();await p.keyboard.press('Enter');
   await p.waitForFunction(()=>!location.search.includes('lecture=1'));assert(await p.locator('#viewport').isVisible());
  }
  preuves.push(`${deck} : lecture complète, trois affichages, axe, polices locales et retour au clavier.`);
 }
 // Simuler l’absence d’API plein écran pour exercer le repli mobile, puis vérifier les deux limites du focus.
 await ctx.addInitScript(()=>{Element.prototype.requestFullscreen=undefined;});
 await p.setViewportSize({width:390,height:844});await p.goto(base+'/comprendre-ia/types-ia/diapos/');
 await p.getByRole('button',{name:'Plein écran',exact:true}).click();
 const dialog=p.getByRole('dialog');await dialog.waitFor();assert(await p.locator('.entete').evaluate(e=>e.inert));
 const quitter=p.getByRole('button',{name:/Quitter le plein écran/});await quitter.focus();await p.keyboard.press('Tab');
 assert.equal(await p.evaluate(()=>document.activeElement.tagName),'IFRAME');
 await quitter.focus();await p.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
 assert.equal(await p.getByRole('button',{name:'Plein écran',exact:true}).evaluate(e=>e===document.activeElement),true);
 assert.equal(await p.locator('.entete').evaluate(e=>e.inert),false);
 await p.getByRole('link',{name:/3\. Les LLM/}).click();assert(new URL(p.url()).searchParams.get('diapo')==='18');
 assert((await p.getByRole('link',{name:/Ouvrir dans un onglet/}).getAttribute('href')).endsWith('#18'));
 await p.goto(base+'/');await p.keyboard.press('Tab');await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>document.activeElement.id),'contenu');
 assert.deepEqual(erreurs,[]);
 preuves.push('Mode théâtre : focus contenu, Échap, restauration ; liens de partie partageables ; lien d’évitement fonctionnel.');
 await ctx.close();
 const natif=await b.newContext({serviceWorkers:'block',reducedMotion:'reduce'}),pn=await natif.newPage();
 await pn.goto(base+'/comprendre-ia/types-ia/diapos/');
 await pn.getByRole('button',{name:'Plein écran',exact:true}).click();
 await pn.waitForFunction(()=>!!document.fullscreenElement);
 const frame=pn.frameLocator('iframe.cadre-diapos');await frame.locator('#stage').focus();await pn.keyboard.press('g');
 await frame.locator('#grid').waitFor({state:'visible'});await pn.keyboard.press('Escape');await frame.locator('#grid').waitFor({state:'hidden'});
 assert(await pn.evaluate(()=>!!document.fullscreenElement),'Échap ferme d’abord la grille');
 await pn.keyboard.press('Escape');await pn.waitForFunction(()=>!document.fullscreenElement);
 assert(await pn.getByRole('button',{name:'Plein écran',exact:true}).evaluate(e=>document.activeElement===e));
 await natif.close();preuves.push('Plein écran natif : grille et fermeture à deux niveaux, retour au déclencheur.');
}finally{await b.close();}
writeFileSync(resolve(out,'resultat.json'),JSON.stringify({date:new Date().toISOString(),preuves},null,2));
console.log(preuves.join('\n'));
