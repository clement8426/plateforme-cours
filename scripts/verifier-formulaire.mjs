// Parcours de comparaison et recherche d'adresse : service, exemples, erreurs et clavier.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const require=createRequire(resolve(process.env.UX_OUTILS ?? '../atelier-ia-donnees/labo-ux','package.json'));
const {chromium}=require('playwright'),{AxeBuilder}=require('@axe-core/playwright');
const base=process.env.SITE_URL??'http://localhost:4187';
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
let requests=0,fail=false,slow=false;const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/_vercel/insights/script.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
await page.route('https://photon.komoot.io/**',async route=>{requests++;if(slow)await new Promise(r=>setTimeout(r,250));await route.fulfill({status:fail?503:200,contentType:'application/json',body:JSON.stringify({features:[{properties:{street:'Rue du Seyon',housenumber:'10',postcode:'2000',city:'Ville du service (test)'}}]})}).catch(()=>{});});
try{
 await page.goto(base+'/ux/ux-ia/demos/formulaire-adresse/');
 const before=page.frameLocator('.vitrine-depart iframe'),after=page.frameLocator('.vitrine-repare iframe');
 await before.locator('input').first().fill('Alex');assert.equal(requests,0);
 await before.locator('input[name="rue"]').fill('Rue Exemple 12');
 await before.getByRole('button',{name:'Soumettre'}).click();
 assert.equal(await before.locator('input[name="prenom"]').inputValue(),'');
 assert.equal(await before.locator('input[name="rue"]').inputValue(),'');
 assert(await before.locator('#erreur').isVisible());
 await before.locator('input[name="prenom"]').fill('Alex');
 assert.equal(await page.getByRole('heading',{name:'7 corrections du formulaire',exact:true}).count(),1);
 assert.equal(await page.locator('.comparateur-groupe').first().locator('.defauts > li').count(),7);
 assert.equal(await page.locator('.comparateur-groupe').last().locator('.defauts > li').count(),1);
 await page.getByRole('radio',{name:'Après',exact:true}).check();const toggle=page.getByLabel('Rechercher avec Photon',{exact:true});assert(await toggle.isChecked());
 const top=await page.locator('.photon-option').boundingBox(),form=await page.locator('.vitrine-repare').boundingBox();const modes=await page.locator('.bascule').boundingBox();assert(top.x>=modes.x+modes.width,'Photon à droite des versions');assert(Math.abs(top.y-modes.y)<6,'Photon sur la même ligne');assert(top.y+top.height<form.y,'réglage avant le formulaire');
 await page.locator('.photon-aide > summary').click();
 await page.getByRole('button',{name:'Essayer « Rue du Seyon 10 »',exact:true}).click();await after.getByRole('option').first().waitFor();assert.equal(requests,1);assert((await after.getByRole('option').first().innerText()).includes('Ville du service'));
 // Même saisie dans les deux modes : les résultats doivent changer, sans réutiliser le cache.
 await toggle.uncheck();await after.getByRole('option').first().waitFor();await page.waitForTimeout(600);assert.equal(requests,1);assert((await after.getByRole('option').first().innerText()).includes('Neuchâtel'));
 await after.locator('#rue').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert.equal(await after.locator('#npa').inputValue(),'2000');assert.equal(await after.locator('#localite').inputValue(),'Neuchâtel');
 await after.locator('#localite').fill('');await toggle.check();await page.waitForTimeout(600);assert.equal(requests,2);
 // Indisponibilité : la saisie manuelle reste possible, puis le mode exemple permet de continuer.
 fail=true;await after.locator('#rue').fill('Rue du Seyon 11');await after.locator('#statut').filter({hasText:'Suggestions indisponibles'}).waitFor();assert(await after.locator('#rue').isEditable());
 await toggle.uncheck();await page.waitForTimeout(600);assert((await after.getByRole('option').first().innerText()).includes('Seyon'));
 // Une réponse tardive ne rouvre pas une liste après effacement du champ.
 fail=false;slow=true;await after.locator('#rue').fill('');await toggle.check();const count=requests;await after.locator('#rue').fill('Rue du Seyon 12');await page.waitForFunction(()=>document.querySelector('.vitrine-repare iframe').contentDocument.getElementById('statut').textContent==='Recherche…');
 await after.locator('#rue').fill('');await page.waitForTimeout(450);assert(requests>count);assert(await after.locator('#suggestions').isHidden());assert.equal(await after.locator('#statut').innerText(),'');
 slow=false;await toggle.uncheck();
 // Saisie conservée en changeant de version ; repères visibles dans les deux cadres.
 await page.getByRole('radio',{name:'Avant',exact:true}).check();assert.equal(await before.locator('input').first().inputValue(),'Alex');
 await page.getByRole('radio',{name:'Les deux',exact:true}).check();await page.getByRole('button',{name:/Quatre styles de champs/}).click();await page.getByRole('button',{name:'Montrer dans le formulaire',exact:true}).click();assert(await before.locator('.uxo-surligne').count());assert(await after.locator('.uxo-surligne').count());
 await page.getByRole('radio',{name:'Après',exact:true}).check();
 for(const id of ['prenom','nom','rue','npa','localite','telephone','email'])await after.locator('#'+id).fill('');
 await after.locator('#envoyer').click();await after.locator('#resume').waitFor();assert.equal(await after.locator('#resume-liste li').count(),7);
 assert.equal(await after.locator('#resume-titre').innerText(),'Vérifiez 7 champs');
 assert.equal(await after.locator('#email-erreur').innerText(),'Indiquez votre adresse e-mail.');
 assert.equal(await after.locator('#resume-liste a').first().innerText(),'Prénom');
 assert(await after.locator('#resume').evaluate(e=>e===document.activeElement),'focus sur le résumé');
 await after.locator('#resume-liste a').first().focus();await page.keyboard.press('Enter');assert(await after.locator('#prenom').evaluate(e=>e===document.activeElement),'lien vers le champ au clavier');
 await after.locator('#prenom').fill('Alex');assert.equal(await after.locator('#resume-liste li').count(),6);
 assert.equal(await after.locator('#resume-titre').innerText(),'Vérifiez 6 champs');
 const frame=page.frames().find(f=>f.url().includes('/formulaire-adresse/corrige/'));
 await frame.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const a11y=await frame.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(a11y.violations.map(v=>v.id),[],'accessibilité du formulaire avec erreurs');

 await after.locator('#email').fill('x');await after.locator('#telephone').focus();assert.equal(await after.locator('#email').getAttribute('aria-invalid'),'true');
 for(const [id,value]of Object.entries({prenom:'Alex',nom:'Exemple',rue:'Rue du Seyon 10',npa:'2000',localite:'Neuchâtel',telephone:'079 123 45 67'}))await after.locator('#'+id).fill(value);
 await after.locator('#envoyer').click();
 assert.equal(await after.locator('#prenom').inputValue(),'Alex');
 assert.equal(await after.locator('#rue').inputValue(),'Rue du Seyon 10');
 assert.equal(await after.locator('#resume-titre').innerText(),'Vérifiez 1 champ');
 await after.locator('#email').fill('alex@example.ch');assert(await after.locator('#resume').isHidden());
 await after.locator('#envoyer').click();assert.equal(await after.locator('#envoyer').getAttribute('aria-busy'),'true');await after.locator('#merci').waitFor();
 // Le cadre intentionnellement défectueux ne fait pas partie du contrôle du conteneur.
 for(const width of [320,390,1440])for(const theme of ['clair','sombre']){
  await page.setViewportSize({width,height:1000});await page.evaluate(t=>{document.documentElement.dataset.theme=t;localStorage.setItem('theme',t);},theme);
  const modeBox=await page.locator('.bascule').boundingBox(),photonBox=await page.locator('.photon-option').boundingBox();assert(photonBox.x>=modeBox.x+modeBox.width,'Photon à droite '+width);assert(Math.abs(photonBox.y-modeBox.y)<6,'même ligne '+width);
  const result=await new AxeBuilder({page}).exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(result.violations.map(v=>v.id),[],'axe '+width+' '+theme);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'débordement '+width);
 }
 await page.goto(base+'/ux/ux-ia/demos/formulaire-adresse/?version=repare');await page.locator('.vitrine-repare').waitFor();assert(await page.getByLabel('Rechercher avec Photon',{exact:true}).isChecked());
 assert.deepEqual(errors,[]);
 console.log('OK : sept corrections et un ajout, perte des saisies avant, Photon actif, commande visible, cache séparé, repli local, réponse tardive, clavier, conservation après, surlignage, résumé dynamique, liens clavier, validation et axe sur six configurations.');
}finally{await browser.close();}
