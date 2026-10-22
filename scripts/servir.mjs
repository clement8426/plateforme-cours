// Sert le dossier out/ comme le ferait un hébergeur statique, pour tester la version finale en local.
// Usage : npm run build, puis npm start (port 3000, ou PORT=xxxx)
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';

const racine = resolve(fileURLToPath(import.meta.url), '..', '..', 'out');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

export async function demarrerServeur({port=3000,autoPort=false,ouvrir=false}={}) {
 if (!existsSync(join(racine,'index.html'))) throw Error('Le dossier out/ est absent : lancez d’abord npm run build.');
 const serveur=createServer((req, res) => {
  let chemin;
  try {chemin=decodeURIComponent(new URL(req.url, 'http://local').pathname);}
  catch {res.writeHead(400).end();return;}
  let fichier = normalize(join(racine, chemin));
  if (fichier!==racine&&!fichier.startsWith(racine+'/')&&!fichier.startsWith(racine+'\\')) { res.writeHead(403).end(); return; }
  if (existsSync(fichier) && statSync(fichier).isDirectory()) fichier = join(fichier, 'index.html');
  if (!existsSync(fichier)) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    createReadStream(join(racine, '404.html')).pipe(res);
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(fichier)] ?? 'application/octet-stream' });
  createReadStream(fichier).pipe(res);
 });
 await new Promise((ok,ko)=>{
   let tentatives=0;
   const ecouter=()=>serveur.listen(port,'127.0.0.1');
   serveur.on('error',e=>{
     if(e.code==='EADDRINUSE'&&autoPort&&tentatives++<20&&port<65535){console.log(`Le port ${port} est occupé, essai du suivant…`);port++;ecouter();}
     else ko(e);
   });
   serveur.once('listening',ok);ecouter();
 });
 const url=`http://localhost:${serveur.address().port}`;
 console.log(`\nPlateforme servie sur ${url}`);
 console.log(`Diapos UX × IA : ${url}/ux/ux-ia/diapos/`);
 console.log('Laissez ce terminal ouvert. Pour arrêter : Ctrl+C.');
 if(ouvrir){
   const commande=process.platform==='darwin'?'open':process.platform==='win32'?'rundll32.exe':'xdg-open';
   const args=process.platform==='win32'?['url.dll,FileProtocolHandler',url]:[url];
   execFile(commande,args,{windowsHide:true},e=>{if(e)console.log(`Ouvrez ce lien dans votre navigateur : ${url}`);});
 }
 return serveur;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 demarrerServeur({port:Number(process.env.PORT??3000)}).catch(e=>{console.error(e.message);process.exitCode=1;});
}
