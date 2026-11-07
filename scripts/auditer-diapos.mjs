import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
const require=createRequire(resolve(process.env.UX_OUTILS??'../ux-outils','package.json'));
const {chromium}=require('playwright'),{AxeBuilder}=require('@axe-core/playwright');
const base=process.env.SITE_URL??'http://127.0.0.1:4187';
const sortie=process.env.AUDIT_SORTIE??'.audit-site/diapos';mkdirSync(sortie,{recursive:true});
const browser=await chromium.launch();
let defautsNonIntentionnels=0;
try{
 for(const deck of ['types-ia','ux-ia','ia-donnees','harnais']){
  const ctx=await browser.newContext({viewport:{width:1280,height:720},reducedMotion:'reduce',serviceWorkers:'block'});
  const page=await ctx.newPage(),results=[];
  await page.goto(`${base}/diapos/${deck}/`);await page.evaluate(()=>document.fonts.ready);
  const slides=await page.locator('.slide').evaluateAll(ss=>ss.map(s=>s.dataset.key));
  for(const theme of ['light','dark']){
   await page.evaluate(t=>document.documentElement.dataset.deck=t,theme);
   for(let i=0;i<slides.length;i++){
    await page.evaluate(n=>location.hash=String(n),i+1);await page.waitForFunction(k=>document.querySelector('.slide.active')?.dataset.key===k,slides[i]);
    const invisibles=await page.locator('.slide.active').evaluate(s=>[...s.querySelectorAll('[data-step]:not(.on) a[href],[data-step]:not(.on) button')].filter(e=>!e.closest('[inert]')&&e.tabIndex>=0).map(e=>e.textContent.trim()));
    // Examiner aussi le contenu révélé, sans masquer les erreurs par un effet d’opacité.
    await page.locator('.slide.active [data-step]').evaluateAll(es=>es.forEach(e=>{e.classList.add('on');e.inert=false;}));
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    const violations=[];
    for(const v of axe.violations){
      const nodes=[];
      for(const n of v.nodes){
        const exempleVolontaire=v.id==='color-contrast'&&await page.evaluate(sel=>!!document.querySelector(sel)?.closest('[data-contrast-skip="true"]'),n.target[0]);
        nodes.push({cible:n.target,raison:n.failureSummary,html:n.html,exempleVolontaire});
      }
      violations.push({id:v.id,aide:v.help,nodes});
    }
    results.push({diapo:i+1,cle:slides[i],theme,invisibles,violations});
   }
  }
  writeFileSync(resolve(sortie,deck+'.json'),JSON.stringify(results,null,2));
  defautsNonIntentionnels+=results.filter(r=>r.invisibles.length||r.violations.some(v=>v.nodes.some(n=>!n.exempleVolontaire))).length;
  console.log(`${deck}: ${slides.length} diapos × 2 thèmes, ${results.filter(r=>r.violations.length||r.invisibles.length).length} états à examiner.`);
  await ctx.close();
 }
}finally{await browser.close();}
process.exitCode=defautsNonIntentionnels?1:0;
