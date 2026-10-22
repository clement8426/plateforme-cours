// Une préparation avec Internet, puis un serveur statique sans dépendances npm.
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {demarrerServeur} from './servir.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const args=new Set(process.argv.slice(2));
const connus=['--preparer','--hors-ligne','--sans-ouvrir','--aide'];
if([...args].some(a=>!connus.includes(a))) {
  console.error('Option inconnue. Utilisez : bash lancer.sh --aide');process.exit(1);
}
if(args.has('--aide')) {
  console.log(`Plateforme de cours — Mac, Linux et Windows
  bash lancer.sh                  Prépare au premier lancement, puis ouvre le cours.
  bash lancer.sh --preparer       Reconstruit la dernière version (Internet requis).
  bash lancer.sh --hors-ligne     Lance uniquement la copie déjà préparée.
  bash lancer.sh --sans-ouvrir    Affiche le lien sans ouvrir le navigateur.
  Sur Windows : node scripts/lancer.mjs (mêmes options).
  Arrêt : Ctrl+C. Après un git pull : relancer avec --preparer.`);
  process.exit(0);
}
if(Number(process.versions.node.split('.')[0])<22) {
  console.error('Installez Node.js 22 ou plus récent : https://nodejs.org/');process.exit(1);
}
if(args.has('--preparer')&&args.has('--hors-ligne')) {
  console.error('Choisissez --preparer ou --hors-ligne.');process.exit(1);
}
const pret=existsSync(resolve('out/index.html'))&&existsSync(resolve('out/diapos/ux-ia/index.html'));
if(args.has('--hors-ligne')&&!pret) {
  console.error('La copie hors ligne n’est pas encore prête. Avec Internet, lancez d’abord : bash lancer.sh --preparer');process.exit(1);
}
if(!pret||args.has('--preparer')) {
  console.log('Préparation du cours : gardez Internet pendant cette étape.');
  const commandes=['ci','run build'];
  for(const commande of commandes) {
    const r=process.platform==='win32'
      ?spawnSync(process.env.ComSpec||'cmd.exe',['/d','/s','/c',`npm ${commande}`],{stdio:'inherit',windowsHide:true})
      :spawnSync('npm',commande.split(' '),{stdio:'inherit'});
    if(r.error||r.status!==0) {
      console.error('Préparation interrompue. Vérifiez Internet et Node.js, puis relancez avec --preparer.');process.exit(1);
    }
  }
}
console.log('Copie locale prête : aucun téléchargement npm au démarrage.');
const port=Number(process.env.PORT||4187);
if(!Number.isInteger(port)||port<0||port>65535) {console.error('PORT doit être un nombre entre 0 et 65535.');process.exit(1);}
try {await demarrerServeur({port,autoPort:true,ouvrir:!args.has('--sans-ouvrir')});}
catch(e){console.error(`Impossible de lancer le cours : ${e.message}`);process.exitCode=1;}
