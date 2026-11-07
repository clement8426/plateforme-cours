import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CarteCours from '@/composants/CarteCours';
import FilAriane from '@/composants/FilAriane';
import { CATEGORIES, trouverCategorie } from '@/contenu/catalogue';
import { metadonnees } from '@/contenu/site';

type Props = { params: Promise<{ categorie: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ categorie: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categorie = trouverCategorie((await params).categorie);
  if (!categorie) return {};
  return metadonnees({ titre: categorie.nom, description: categorie.description, chemin: `/${categorie.slug}/`, indexable: categorie.cours.some(c => !c.enPreparation) });
}

export default async function PageCategorie({ params }: Props) {
  const categorie = trouverCategorie((await params).categorie);
  if (!categorie) notFound();

  return (
    <div className="page zone-cours">
      <FilAriane etapes={[{ nom: 'Cours', href: '/cours/' }, { nom: categorie.nom }]} />
      <header className="tete">
        <h1>{categorie.nom}</h1>
        <p className="chapeau">{categorie.description}</p>
      </header>

      <section aria-labelledby="titre-cours">
        <h2 id="titre-cours" className="visuellement-cache">Les cours de ce thème</h2>
        <ul className="liste-cours">
          {categorie.cours.length ? categorie.cours.map((c) => <CarteCours key={c.slug} categorie={categorie.slug} cours={c} />) : (
            <li className="cours-carte est-vide">
              <h3>Premier cours en préparation</h3>
              <p>Les diapos et les démonstrations de ce thème arrivent bientôt. En attendant, le cours <Link href="/ux/ux-ia/">UX × IA</Link> est disponible.</p>
              <p className="etat-prepa">Bientôt</p>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
