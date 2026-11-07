import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import MarqueVu from '@/composants/MarqueVu';
import { BLOCS } from '@/contenu/blocs';
import { compterReferences } from '@/contenu/catalogue';
import { type ParamsCours, lireCours, tousLesCoursPublies } from '@/contenu/parametres';
import { metadonnees } from '@/contenu/site';

export const dynamicParams = false;
export const generateStaticParams = tousLesCoursPublies;

export async function generateMetadata(props: ParamsCours): Promise<Metadata> {
  const { categorie, cours } = await lireCours(props);
  if (!categorie || !cours) return {};
  return metadonnees({ titre: `Sources et lexique, ${cours.titre}`, description: `Les ${compterReferences(cours)} références et les ${cours.lexique.length} termes du cours « ${cours.titre} » : sources citées et définitions pour approfondir.`, chemin: `/${categorie.slug}/${cours.slug}/sources/` });
}

export default async function PageSources(props: ParamsCours) {
  const { categorie, cours } = await lireCours(props);
  if (!categorie || !cours) notFound();

  return (
    <div className="page">
      <FilAriane etapes={[
        { nom: categorie.nom, href: `/${categorie.slug}/` },
        { nom: cours.titre, href: `/${categorie.slug}/${cours.slug}/` },
        { nom: 'Sources et lexique' },
      ]} />
      <header className="tete">
        <h1>Sources et lexique : {cours.titre}</h1>
        <p className="chapeau">Les références citées dans le cours, et les mots du cours expliqués en une phrase.</p>
      </header>

      <section className="bloc-sources" aria-labelledby="titre-references">
        <h2 id="titre-references" className="titre-section">Pour aller plus loin</h2>
        <p className="intro-section">{compterReferences(cours)} références, rangées par sujet. Quand un sujet correspond à un bloc du cours, il en prend la couleur.</p>
        <div className="groupes-refs">
          {cours.references.map((g) => (
            <section key={g.nom} className="groupe-refs" style={g.bloc ? { '--bloc': BLOCS[g.bloc].couleur } as React.CSSProperties : undefined}>
              <h3>{g.nom}</h3>
              <ul className="references">
                {g.references.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noreferrer">{r.titre}<span className="visuellement-cache"> (s’ouvre dans un nouvel onglet)</span></a>
                    <span>{r.source}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="bloc-sources lexique-panneau" aria-labelledby="titre-lexique">
        <h2 id="titre-lexique" className="titre-section">Lexique</h2>
        <dl className="lexique">
          {cours.lexique.map((t) => (
            <div key={t.terme}>
              <dt>{t.nom ?? t.terme}</dt>
              <dd>{t.def}</dd>
            </div>
          ))}
        </dl>
      </section>
      <MarqueVu cours={`${categorie.slug}/${cours.slug}`} etape="sources" />
    </div>
  );
}
