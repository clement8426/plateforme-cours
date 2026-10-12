import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import { CATEGORIES, trouverCategorie } from '@/contenu/catalogue';

type Props = { params: Promise<{ categorie: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ categorie: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categorie = trouverCategorie((await params).categorie);
  return { title: categorie?.nom, description: categorie?.description };
}

export default async function PageCategorie({ params }: Props) {
  const categorie = trouverCategorie((await params).categorie);
  if (!categorie) notFound();

  return (
    <div className="page">
      <FilAriane etapes={[{ nom: categorie.nom }]} />
      <header className="tete">
        <h1>{categorie.nom}</h1>
        <p className="chapeau">{categorie.description}</p>
      </header>

      <section aria-labelledby="titre-cours">
        <h2 id="titre-cours" className="visuellement-cache">Les cours de ce thème</h2>
        <ul className="liste-cours">
          {categorie.cours.length ? categorie.cours.map((c) => (
            <li key={c.slug} className="cours-carte">
              <h3><Link href={`/${categorie.slug}/${c.slug}/`}>{c.titre}</Link></h3>
              <p>{c.accroche}{c.demos.length > 0 && ` ${c.demos.length} démonstrations interactives.`}</p>
              <p className="cours-meta">
                {c.duree.replace(/^Environ /, '')}
                <span className="fleche" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </p>
            </li>
          )) : (
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
