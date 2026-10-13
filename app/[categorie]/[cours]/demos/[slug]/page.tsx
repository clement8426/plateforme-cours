import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AfficheTest from '@/composants/AfficheTest';
import ComparateurFormulaire from '@/composants/ComparateurFormulaire';
import DossierAvantApres from '@/composants/DossierAvantApres';
import Reidentification from '@/composants/Reidentification';
import FilAriane from '@/composants/FilAriane';
import MarqueVu from '@/composants/MarqueVu';
import PucesBlocs from '@/composants/PucesBlocs';
import SceneTilleul from '@/composants/SceneTilleul';
import { CATEGORIES, trouverCategorie, trouverCours, trouverDemo } from '@/contenu/catalogue';
import { trouverComparateur } from '@/contenu/comparateurs';

type Props = { params: Promise<{ categorie: string; cours: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  CATEGORIES.flatMap((c) => c.cours.flatMap((cours) => cours.demos.map((d) => ({ categorie: c.slug, cours: cours.slug, slug: d.slug }))));

async function lire({ params }: Props) {
  const { categorie: cat, cours: cr, slug } = await params;
  const categorie = trouverCategorie(cat);
  const cours = trouverCours(cat, cr);
  const demo = cours && trouverDemo(cours, slug);
  return { categorie, cours, demo };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { demo } = await lire(props);
  return { title: demo?.titre, description: demo?.resume };
}

export default async function PageDemo(props: Props) {
  const { categorie, cours, demo } = await lire(props);
  if (!categorie || !cours || !demo) notFound();
  const base = `/${categorie.slug}/${cours.slug}`;
  const cle = `${categorie.slug}/${cours.slug}`;
  const comparateur = demo.comparateur ? trouverComparateur(demo.comparateur) : undefined;

  return (
    <div className={`page${['comparateur', 'dossier', 'reidentification'].includes(demo.scene) ? ' page-large' : ''}`}>
      <FilAriane etapes={[
        { nom: categorie.nom, href: `/${categorie.slug}/` },
        { nom: cours.titre, href: `${base}/` },
        { nom: 'Démonstrations', href: `${base}/#demos` },
        { nom: demo.titre },
      ]} />
      <header className="demo-tete">
        <h1>{demo.titre}</h1>
        <p className="chapeau">{demo.resume}</p>
        <div className="demo-meta">
          <p className="duree">{demo.duree}{demo.bonus ? ', en bonus' : ''}</p>
          <PucesBlocs blocs={demo.blocs} />
        </div>
      </header>

      <section className="mode-emploi" aria-labelledby="titre-mode-emploi">
        <h2 id="titre-mode-emploi">Comment ça marche</h2>
        <ol>
          {demo.modeEmploi.map((e) => <li key={e}>{e}</li>)}
        </ol>
      </section>

      <div className="scene">
        {demo.scene === 'affiche' && <AfficheTest cours={cle} />}
        {demo.scene === 'tilleul' && <SceneTilleul cours={cle} />}
        {demo.scene === 'comparateur' && comparateur && <ComparateurFormulaire comparateur={comparateur} />}
        {demo.scene === 'dossier' && <DossierAvantApres cours={cle} />}
        {demo.scene === 'reidentification' && <Reidentification cours={cle} />}
      </div>


      <div className="demo-bas">
        <section className="encart" aria-labelledby="titre-retenir">
          <h2 id="titre-retenir">À retenir</h2>
          <ul>
            {demo.aRetenir.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>
        {cours.depot && (
          <section className="encart" aria-labelledby="titre-exercice">
            <h2 id="titre-exercice">Refaire l’exercice chez vous</h2>
            <p>Les consignes, le matériel et les prompts sont dans le dossier <code>{demo.exercice}/</code> du dépôt du cours.</p>
            <div className="actions">
              <a className="bouton-secondaire" href={`${cours.depot}/tree/main/${demo.exercice}`} target="_blank" rel="noreferrer">
                Ouvrir l’exercice sur GitHub<span className="visuellement-cache"> (nouvel onglet)</span>
              </a>
            </div>
          </section>
        )}
      </div>
      {demo.scene === 'comparateur' && <MarqueVu cours={cle} etape={demo.slug} />}
    </div>
  );
}
