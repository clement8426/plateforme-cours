import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import LecteurDiapos from '@/composants/LecteurDiapos';
import AvisDate from '@/composants/AvisDate';
import MarqueVu from '@/composants/MarqueVu';
import { trouverCours } from '@/contenu/catalogue';
import { type ParamsCours, lireCours, tousLesCours } from '@/contenu/parametres';

export const dynamicParams = false;
export const generateStaticParams = () => tousLesCours().filter((p) => trouverCours(p.categorie, p.cours)?.diapos);

export async function generateMetadata(props: ParamsCours): Promise<Metadata> {
  const { cours } = await lireCours(props);
  return { title: cours ? `Diapos, ${cours.titre}` : undefined };
}

export default async function PageDiapos(props: ParamsCours) {
  const { categorie, cours } = await lireCours(props);
  if (!categorie || !cours?.diapos) notFound();

  return (
    <div className="page">
      <FilAriane etapes={[
        { nom: categorie.nom, href: `/${categorie.slug}/` },
        { nom: cours.titre, href: `/${categorie.slug}/${cours.slug}/` },
        { nom: 'Diapos' },
      ]} />
      <header className="tete tete-compacte">
        <h1>Les diapos</h1>
      </header>
      <AvisDate date={cours.misAJour} />
      <LecteurDiapos href={cours.diapos.href} titre={cours.titre} parties={cours.parties.map((p) => ({ titre: p.titre, diapo: p.diapos[0] }))} />
      <MarqueVu cours={`${categorie.slug}/${cours.slug}`} etape="diapos" />
    </div>
  );
}
