'use client';

import { useEffect } from 'react';

// Installe le service worker, qui garde les pages visitées pour les consulter hors connexion.
// Désactivé en développement, pour ne pas servir d'anciennes versions pendant qu'on modifie le site.
export default function EnregistrementPwa() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* sans service worker, le site fonctionne normalement en ligne */
    });
  }, []);
  return null;
}
