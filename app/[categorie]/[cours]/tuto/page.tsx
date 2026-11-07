import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import LecteurDiapos from '@/composants/LecteurDiapos';
import AvisDate from '@/composants/AvisDate';
import MarqueVu from '@/composants/MarqueVu';
import { trouverCours } from '@/contenu/catalogue';
import { type ParamsCours, lireCours, tousLesCours } from '@/contenu/parametres';
import { metadonnees } from '@/contenu/site';

export const dynamicParams = false;
export const generateStaticParams = () => tousLesCours().filter((p) => trouverCours(p.categorie, p.cours)?.exercice?.tuto);

export async function generateMetadata(props: ParamsCours): Promise<Metadata> {
  const { categorie, cours } = await lireCours(props);
  if (!categorie || !cours?.exercice) return {};
  return metadonnees({ titre: `${cours.exercice.titre} : le tuto`, description: 'Le tutoriel du Harnais, prototype pédagogique : installation, missions, outils de l’assistant et aide en cas de difficulté, étape par étape.', chemin: `/${categorie.slug}/${cours.slug}/tuto/` });
}

export default async function PageTuto(props: ParamsCours) {
  const { categorie, cours } = await lireCours(props);
  const tuto = cours?.exercice?.tuto;
  if (!categorie || !cours || !cours.exercice || !tuto) notFound();

  return (
    <div className="page zone-cours">
      <FilAriane etapes={[
        { nom: categorie.nom, href: `/${categorie.slug}/` },
        { nom: cours.titre, href: `/${categorie.slug}/${cours.slug}/` },
        { nom: 'Le tuto du Harnais' },
      ]} />
      <header className="tete tete-compacte">
        <h1>Le tuto du Harnais</h1>
        <p className="chapeau">{cours.exercice.prototype}</p>
      </header>
      <AvisDate date={cours.misAJour} />
      <LecteurDiapos href={tuto.href} titre={cours.exercice.titre} parties={tuto.parties} />
      <MarqueVu cours={`${categorie.slug}/${cours.slug}`} etape="tuto" />
    </div>
  );
}
