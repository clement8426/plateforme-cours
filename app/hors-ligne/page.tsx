import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Hors connexion' };

// Affichée par le service worker quand une page n'a jamais été visitée et que la connexion manque.
export default function HorsLigne() {
  return (
    <div className="page">
      <header className="tete">
        <h1>Vous êtes hors connexion</h1>
        <p className="chapeau">Cette page n’a pas encore été enregistrée sur votre appareil. Les pages que vous avez déjà ouvertes restent disponibles.</p>
        <div className="actions"><Link className="bouton" href="/">Revenir à l’accueil</Link></div>
      </header>
    </div>
  );
}
