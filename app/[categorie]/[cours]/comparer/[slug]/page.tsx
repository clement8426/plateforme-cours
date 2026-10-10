import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ComparateurFormulaire from '@/composants/ComparateurFormulaire';
import FilAriane from '@/composants/FilAriane';
import { trouverComparateur } from '@/contenu/comparateurs';
import { CATEGORIES } from '@/contenu/catalogue';
import { trouverCours } from '@/contenu/catalogue';

type Props = { params: Promise<{ categorie: string; cours: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  CATEGORIES.flatMap((c) => c.cours.flatMap((cours) => (cours.comparateurs ?? []).map((slug) => ({ categorie: c.slug, cours: cours.slug, slug }))));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparateur = trouverComparateur(slug);
  return { title: comparateur?.titre, description: comparateur?.accroche };
}

export default async function PageComparer({ params }: Props) {
  const { categorie: cat, cours: cr, slug } = await params;
  const cours = trouverCours(cat, cr);
  const categorie = CATEGORIES.find((c) => c.slug === cat);
  const comparateur = trouverComparateur(slug);
  if (!categorie || !cours || !comparateur || !cours.comparateurs?.includes(slug)) notFound();
  const base = `/${categorie.slug}/${cours.slug}`;

  return (
    <div className="page page-large">
      <FilAriane etapes={[
        { nom: categorie.nom, href: `/${categorie.slug}/` },
        { nom: cours.titre, href: `${base}/` },
        { nom: 'Exercices', href: `${base}/exercices/#${slug}` },
        { nom: 'Avant et après' },
      ]} />
      <header className="tete tete-compacte">
        <h1>{comparateur.titre}</h1>
        <p className="chapeau">{comparateur.accroche}</p>
        <p className="intro-section">
          Cette page montre la solution de l’exercice : <Link href={`${base}/exercices/#${slug}`}>faites d’abord l’exercice</Link>, puis comparez avec ce que vous aviez trouvé.
        </p>
      </header>

      <ol className="etapes-courtes">
        {comparateur.etapes.map((e) => <li key={e}>{e}</li>)}
      </ol>

      <ComparateurFormulaire comparateur={comparateur} />
    </div>
  );
}
