import type { Metadata } from 'next';
import Redirection from '@/composants/Redirection';
import { tousLesCours } from '@/contenu/parametres';

// Ancienne page des exercices : les exercices sont devenus des démonstrations.
export const dynamicParams = false;
export const generateStaticParams = tousLesCours;
export const metadata: Metadata = { title: 'Démonstrations', robots: { index: false } };

export default async function AnciensExercices({ params }: { params: Promise<{ categorie: string; cours: string }> }) {
  const { categorie, cours } = await params;
  return <Redirection vers={`/${categorie}/${cours}/#demos`} texte="voir les démonstrations" />;
}
