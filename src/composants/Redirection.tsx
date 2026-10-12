'use client';

import Link from 'next/link';
import { useEffect } from 'react';

// Ancienne adresse : on renvoie vers la nouvelle (le site est statique, sans redirection côté serveur).
export default function Redirection({ vers, texte }: { vers: string; texte: string }) {
  useEffect(() => { window.location.replace(vers); }, [vers]);
  return (
    <div className="page">
      <meta httpEquiv="refresh" content={`0; url=${vers}`} />
      <header className="tete">
        <h1>Cette page a déménagé</h1>
        <p className="chapeau">Vous allez être redirigé. Sinon : <Link href={vers}>{texte}</Link>.</p>
      </header>
    </div>
  );
}
