import type { Metadata } from 'next';
import Redirection from '@/composants/Redirection';
import { tousLesCoursPublies } from '@/contenu/parametres';
import { trouverCours } from '@/contenu/catalogue';

// Ancienne page des exercices : les exercices sont devenus des démonstrations.
export const dynamicParams = false;
export const generateStaticParams = tousLesCoursPublies;
export const metadata: Metadata = { title: 'Démonstrations', robots: { index: false } };

export default async function AnciensExercices({ params }: { params: Promise<{ categorie: string; cours: string }> }) {
  const { categorie, cours } = await params;
  const destination = trouverCours(categorie, cours)?.demos.length ? '#demos' : '#pratique';
  return <Redirection vers={`/${categorie}/${cours}/${destination}`} texte="voir les exercices" />;
}
