import type { Metadata } from 'next';
import Redirection from '@/composants/Redirection';

// Ancienne adresse de la démo du dossier, devenue « Le dossier Exemple » (même cas que les scans de l'exercice 01).
export const dynamicParams = false;
export const generateStaticParams = () => [{ categorie: 'ia-legislation', cours: 'ia-donnees' }];
export const metadata: Metadata = { title: 'Le dossier Exemple', robots: { index: false } };

export default function AncienDossier() {
  return <Redirection vers="/ia-legislation/ia-donnees/demos/dossier-exemple/" texte="ouvrir « Le dossier Exemple »" />;
}
