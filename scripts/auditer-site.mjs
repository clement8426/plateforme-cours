// Inventaire issu du build, audit axe des pages et métadonnées, liens internes.
// UX_OUTILS=../ux-outils SITE_URL=http://127.0.0.1:4187 node scripts/auditer-site.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
const require = createRequire(resolve(process.env.UX_OUTILS ?? '../ux-outils', 'package.json'));
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const base = process.env.SITE_URL ?? 'http://127.0.0.1:4187';
const destination = process.env.AUDIT_SORTIE ?? '.audit-site';
await fetch(base,{signal:AbortSignal.timeout(5000)}).catch(()=>{throw Error('Serveur indisponible : construire puis servir le site avant cet audit.');});
mkdirSync(destination,{recursive:true});
const routes=Object.keys(JSON.parse(readFileSync('.next/prerender-manifest.json','utf8')).routes)
  .filter(p=>!p.startsWith('/_') && !p.includes('.')).map(p=>p==='/'?'/':p+'/');
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(d,e.name)):[resolve(d,e.name)]);
const annexes=walk('public').filter(p=>p.endsWith('.html')).map(p=>'/'+relative('public',p).replaceAll('\\','/').replace(/index\.html$/,''));
const browser=await chromium.launch();
const rapport={date:new Date().toISOString(),base,routes,annexes,pages:[],liens:[],erreurs:[]};
const liens=new Set();
let defautsNonIntentionnels=0;
try {
  const context=await browser.newContext({reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await context.newPage();
  for(const route of [...routes,...annexes,'/page-qui-nexiste-pas/']) {
    try {
      const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
      const info=await page.evaluate(()=>({titre:document.title,lang:document.documentElement.lang,
        h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),
        description:document.querySelector('meta[name="description"]')?.content??'',
        canonical:document.querySelector('link[rel="canonical"]')?.href??'',
        robots:[...document.querySelectorAll('meta[name="robots"]')].map(x=>x.content).join(','),
        ogTitre:document.querySelector('meta[property="og:title"]')?.content,
        ogUrl:document.querySelector('meta[property="og:url"]')?.content,
        texte:document.querySelector('main')?.innerText.length??document.body.innerText.length,
        jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>{try{return JSON.parse(s.textContent)}catch{return 'INVALIDE'}}),
        liens:[...document.querySelectorAll('a[href],img[src],iframe[src]')].map(e=>e.href||e.src).filter(u=>u.startsWith(location.origin)),
        alternatives:[...document.querySelectorAll('img')].filter(e=>!e.hasAttribute('alt')).map(e=>e.src),
      }));
      info.liens.forEach(l=>liens.add(l));delete info.liens;
      rapport.pages.push({route,status:response.status(),finale:page.url().replace(base,''),...info});
    }catch(e){rapport.erreurs.push({route,erreur:e.message});}
  }
  await context.close();
  console.log(`Inventaire : ${routes.length} pages générées, ${annexes.length} annexes HTML.`);
  writeFileSync(resolve(destination,'inventaire.json'),JSON.stringify(rapport,null,2));
  if (process.env.AUDIT_ANNEXES === '1') {
    const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
    const p=await ctx.newPage(),resultats=[];
    for(const route of annexes){
      try{
        await p.goto(base+route,{waitUntil:'networkidle'});
        const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        resultats.push({route,pedagogique:/^\/(tilleul|formulaires)\//.test(route)||route.includes('/casse/'),rapportArchive:route.includes('/preuves/'),violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({cible:n.target,raison:n.failureSummary}))}))});
      }catch(e){resultats.push({route,erreur:e.message});}
    }
    writeFileSync(resolve(destination,'annexes.json'),JSON.stringify(resultats,null,2));await ctx.close();
    defautsNonIntentionnels+=resultats.filter(r=>r.erreur||(!r.pedagogique&&r.violations?.length)).length;
  }
  // Contextes indépendants, pour ne pas confondre les préférences mémorisées.
  const modes=[{nom:'bureau-clair',w:1440,h:900},{nom:'bureau-sombre',w:1440,h:900,sombre:true},
    {nom:'mobile-clair',w:390,h:844},{nom:'mobile-sombre',w:390,h:844,sombre:true},
    {nom:'reflow-320',w:320,h:800},{nom:'contraste-eleve',w:1440,h:900,contraste:true}];
  for(let groupe=0;groupe<modes.length;groupe+=2){
    await Promise.all(modes.slice(groupe,groupe+2).map(async mode=>{
      const ctx=await browser.newContext({viewport:{width:mode.w,height:mode.h},reducedMotion:'reduce',serviceWorkers:'block'});
      await ctx.addInitScript(({sombre,contraste})=>{if(sombre)localStorage.setItem('theme','sombre');if(contraste)localStorage.setItem('contraste','eleve');},mode);
      const p=await ctx.newPage();const results=[];
      for(const route of [...routes,'/page-qui-nexiste-pas/']){
        try{
          await p.goto(base+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
          const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).exclude('iframe').analyze();
          const info=await p.evaluate(()=>{
            const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
            const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(e=>e.getClientRects().length).map(e=>+e.tagName[1]);
            return {debordement:document.documentElement.scrollWidth>innerWidth+1,
              titresSaut:hs.some((n,i)=>i>0&&n>hs[i-1]+1),
              idsDupliques:[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))],
              cibles:[...document.querySelectorAll('button,a,input,select,summary')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]')).map(e=>{const r=e.getBoundingClientRect();return {nom:e.textContent.trim().slice(0,60),w:r.width,h:r.height}}).filter(r=>r.w>0&&r.h>0&&(r.w<24||r.h<24)),
            };
          });
          results.push({route,finale:p.url().replace(base,''),...info,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,aide:v.help,nodes:v.nodes.map(n=>({cible:n.target,html:n.html,raison:n.failureSummary}))}))});
        }catch(e){results.push({route,erreur:e.message});}
      }
      writeFileSync(resolve(destination,mode.nom+'.json'),JSON.stringify(results,null,2));
      defautsNonIntentionnels+=results.filter(r=>r.erreur||r.debordement||r.titresSaut||r.idsDupliques?.length||r.violations?.length).length;
      console.log(mode.nom+': '+results.length+' pages, '+results.filter(r=>r.erreur||r.debordement||r.violations?.length).length+' à examiner.');
      await ctx.close();
    }));
  }
  const jobs=[...liens].map(u=>new URL(u)).filter(u=>u.pathname!=='/page-qui-nexiste-pas/');
  await Promise.all(Array.from({length:6},async()=>{
    while(jobs.length){const u=jobs.shift();try{const r=await fetch(u,{signal:AbortSignal.timeout(15000)});rapport.liens.push({url:u.href.replace(base,''),status:r.status});await r.body?.cancel();}catch(e){rapport.liens.push({url:u.href.replace(base,''),erreur:e.message});}}
  }));
}finally{await browser.close();}
writeFileSync(resolve(destination,'inventaire.json'),JSON.stringify(rapport,null,2));
console.log('Liens internes : '+rapport.liens.length+', '+rapport.liens.filter(r=>r.erreur||r.status>=400).length+' erreurs.');
process.exitCode=defautsNonIntentionnels||rapport.erreurs.length||rapport.liens.some(r=>r.erreur||r.status>=400)?1:0;
