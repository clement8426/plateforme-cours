// Vérifie le lancement réel sans npm, le contenu local et le port occupé.
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {createServer} from 'node:net';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const aide=spawnSync(process.execPath,['scripts/lancer.mjs','--aide'],{encoding:'utf8'});
assert.equal(aide.status,0);assert.match(aide.stdout,/hors-ligne/);
const erreur=spawnSync(process.execPath,['scripts/lancer.mjs','--hors-ligne','--preparer'],{encoding:'utf8'});
assert.equal(erreur.status,1);assert.match(erreur.stderr,/Choisissez/);
const reserve=createServer();reserve.listen(0,'127.0.0.1');await once(reserve,'listening');
const port=reserve.address().port;
const enfant=spawn(process.execPath,['scripts/lancer.mjs','--hors-ligne','--sans-ouvrir'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe'],windowsHide:true});
let sortie='';let erreurs='';enfant.stderr.on('data',x=>erreurs+=x);
try {
 const url=await new Promise((ok,ko)=>{
  const timeout=setTimeout(()=>ko(Error('Démarrage trop long : '+sortie+erreurs)),15000);
  enfant.on('exit',code=>{clearTimeout(timeout);ko(Error(`Arrêt ${code} : ${sortie}${erreurs}`));});
  enfant.stdout.on('data',x=>{sortie+=x;const match=sortie.match(/Plateforme servie sur (http:\/\/127\.0\.0\.1:\d+)/);if(match){clearTimeout(timeout);ok(match[1]);}});
 });
 assert.notEqual(new URL(url).port,String(port));assert.match(sortie,/occupé/);
 for(const path of ['/','/ux/ux-ia/diapos/','/diapos/ux-ia/index.html','/diapos/ux-ia/escale-memo-mobile.pdf','/comparateur/formulaire-adresse/casse/script.js']){
   const r=await fetch(url+path);assert.equal(r.status,200,path);assert.ok((await r.arrayBuffer()).byteLength>0,path);
 }
 assert.equal(erreurs,'');
 console.log('OK : démarrage hors ligne sans npm, port occupé contourné, cours/diapos/PDF/formulaire accessibles.');
} finally {
 const termine=once(enfant,'exit');enfant.kill();await termine;
 await new Promise(r=>reserve.close(r));
}
