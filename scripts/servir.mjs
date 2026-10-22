// Sert le dossier out/ comme le ferait un hébergeur statique, pour tester la version finale en local.
// Usage : npm run build, puis npm start (port 3000, ou PORT=xxxx)
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = resolve(fileURLToPath(import.meta.url), '..', '..', 'out');
const port = Number(process.env.PORT ?? 3000);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

if (!existsSync(racine)) {
  console.error('Le dossier out/ est absent : lancez d’abord npm run build.');
  process.exit(1);
}

createServer((req, res) => {
  const chemin = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  let fichier = normalize(join(racine, chemin));
  if (!fichier.startsWith(racine)) { res.writeHead(403).end(); return; }
  if (existsSync(fichier) && statSync(fichier).isDirectory()) fichier = join(fichier, 'index.html');
  if (!existsSync(fichier)) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    createReadStream(join(racine, '404.html')).pipe(res);
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(fichier)] ?? 'application/octet-stream' });
  createReadStream(fichier).pipe(res);
}).listen(port, () => console.log(`Plateforme servie sur http://localhost:${port}`));
