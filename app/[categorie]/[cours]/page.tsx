import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import ParcoursCours, { type EtapeParcours } from '@/composants/ParcoursCours';
import { compterReferences } from '@/contenu/catalogue';
import { type ParamsCours, lireCours, tousLesCours } from '@/contenu/parametres';

export const dynamicParams = false;
export const generateStaticParams = tousLesCours;

export async function generateMetadata(props: ParamsCours): Promise<Metadata> {
  const { cours } = await lireCours(props);
  return { title: cours?.titre, description: cours?.accroche };
}

export default async function PageCours(props: ParamsCours) {
  const { categorie, cours } = await lireCours(props);
  if (!categorie || !cours) notFound();
  const base = `/${categorie.slug}/${cours.slug}`;

  // Le parcours conseillé : dans cet ordre, du plus passif au plus actif.
  const etapes: EtapeParcours[] = [];
  if (cours.diapos) {
    etapes.push({ id: 'diapos', titre: 'Les diapos', description: 'Toute la présentation du cours, à parcourir avec les flèches du clavier.', href: `${base}/diapos/`, interne: true, apercu: cours.diapos.apercu });
  }
  if (cours.demo) {
    etapes.push({ id: 'demo', titre: cours.demo.titre, description: cours.demo.description, href: cours.demo.href, interne: false, apercu: cours.demo.apercu, bandeau: true });
  }
  if (cours.exercices.length) {
    etapes.push({
      id: 'exercices',
      titre: 'Les exercices',
      description: 'Mettez le cours en pratique, seul ou en groupe.',
      href: `${base}/exercices/`,
      interne: true,
      details: [
        ...cours.exercices.map((e) => `${e.titre}, ${e.duree}${e.optionnel ? ', en option' : ''}`),
        ...cours.exercices.filter((e) => e.revelation).map((e) => ({ texte: 'Comparer le formulaire avant et après', href: e.revelation!.href })),
      ],
    });
  }
  etapes.push({
    id: 'sources',
    titre: 'Sources et lexique',
    description: `${compterReferences(cours)} références pour aller plus loin, et les ${cours.lexique.length} mots du cours expliqués en une phrase.`,
    href: `${base}/sources/`,
    interne: true,
  });

  return (
    <div className="page">
      <FilAriane etapes={[{ nom: categorie.nom, href: `/${categorie.slug}/` }, { nom: cours.titre }]} />
      <header className="tete">
        <h1>{cours.titre}</h1>
        <p className="chapeau">{cours.accroche}</p>
        <dl className="reperes">
          <div><dt>Durée</dt><dd>{cours.duree}</dd></div>
          <div><dt>Pour qui</dt><dd>{cours.public}</dd></div>
        </dl>
      </header>

      <section aria-labelledby="titre-parcours">
        <h2 id="titre-parcours" className="titre-section">Votre parcours</h2>
        <p className="intro-section">Dans cet ordre, c’est le plus simple. Chaque étape ouverte est marquée sur cet appareil.</p>
        <ParcoursCours cle={`${categorie.slug}/${cours.slug}`} etapes={etapes} />
      </section>

      <section className="objectifs" aria-labelledby="titre-objectifs">
        <h2 id="titre-objectifs" className="titre-section">À la fin du cours, vous saurez</h2>
        <ul>
          {cours.objectifs.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </section>
    </div>
  );
}
