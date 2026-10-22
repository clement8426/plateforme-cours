// Service worker de la plateforme : garde une copie des pages et fichiers déjà consultés,
// pour pouvoir relire un cours sans connexion. Aucune donnée n'est envoyée nulle part.
// Changer VERSION à chaque mise en ligne importante vide les anciennes copies.
const VERSION = 'v25';
const CACHE = `cours-${VERSION}`;
const ESSENTIEL = ['/', '/hors-ligne/', '/manifest.webmanifest', '/icones/icone-192.png'];

self.addEventListener('install', (evenement) => {
  evenement.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ESSENTIEL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

async function reseauDabord(requete) {
  const cache = await caches.open(CACHE);
  try {
    const reponse = await fetch(requete);
    if (reponse.ok) cache.put(requete, reponse.clone());
    return reponse;
  } catch {
    return (await cache.match(requete)) || (await cache.match('/hors-ligne/'));
  }
}

async function cacheDabord(requete) {
  const cache = await caches.open(CACHE);
  const copie = await cache.match(requete);
  const frais = fetch(requete)
    .then((reponse) => {
      if (reponse.ok) cache.put(requete, reponse.clone());
      return reponse;
    })
    .catch(() => copie);
  return copie || frais;
}

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET' || new URL(requete.url).origin !== self.location.origin) return;
  // Pages : toujours la version en ligne si possible, la copie sinon.
  // Fichiers (scripts, styles, images, polices) : la copie tout de suite, mise à jour en arrière-plan.
  evenement.respondWith(requete.mode === 'navigate' ? reseauDabord(requete) : cacheDabord(requete));
});
