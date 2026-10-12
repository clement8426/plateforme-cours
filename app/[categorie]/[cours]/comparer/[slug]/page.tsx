import type { Metadata } from 'next';
import Redirection from '@/composants/Redirection';
import { CATEGORIES } from '@/contenu/catalogue';

// Ancienne adresse de la comparaison : elle fait désormais partie de la démonstration.
type Props = { params: Promise<{ categorie: string; cours: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  CATEGORIES.flatMap((c) => c.cours.flatMap((cours) => cours.demos.filter((d) => d.comparateur).map((d) => ({ categorie: c.slug, cours: cours.slug, slug: d.slug }))));
export const metadata: Metadata = { title: 'Démonstration', robots: { index: false } };

export default async function AncienneComparaison({ params }: Props) {
  const { categorie, cours, slug } = await params;
  return <Redirection vers={`/${categorie}/${cours}/demos/${slug}/`} texte="ouvrir la démonstration" />;
}
