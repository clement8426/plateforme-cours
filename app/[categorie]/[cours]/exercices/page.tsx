import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import InviteCopiable from '@/composants/InviteCopiable';
import MarqueVu from '@/composants/MarqueVu';
import { trouverCours } from '@/contenu/catalogue';
import { type ParamsCours, lireCours, tousLesCours } from '@/contenu/parametres';

export const dynamicParams = false;
export const generateStaticParams = () => tousLesCours().filter((p) => trouverCours(p.categorie, p.cours)?.exercices.length);

export async function generateMetadata(props: ParamsCours): Promise<Metadata> {
  const { cours } = await lireCours(props);
  return { title: cours ? `Exercices, ${cours.titre}` : undefined };
}

export default async function PageExercices(props: ParamsCours) {
  const { categorie, cours } = await lireCours(props);
  if (!categorie || !cours) notFound();

  return (
    <div className="page">
      <FilAriane etapes={[
        { nom: categorie.nom, href: `/${categorie.slug}/` },
        { nom: cours.titre, href: `/${categorie.slug}/${cours.slug}/` },
        { nom: 'Exercices' },
      ]} />
      <header className="tete">
        <h1>Les exercices</h1>
        <p className="chapeau">Mettez le cours en pratique, seul ou en groupe. Ce site n’envoie aucune donnée vous concernant.</p>
      </header>

      <div className="exercices">
        {cours.exercices.map((e) => (
          <section key={e.slug} id={e.slug} className="exercice" aria-labelledby={`titre-${e.slug}`}>
            <div className="exercice-tete">
              <h2 id={`titre-${e.slug}`}>{e.titre}</h2>
              <p className="duree">{e.duree}{e.optionnel ? ', en option' : ''}</p>
              <p>{e.resume}</p>
            </div>
            <div className="exercice-corps">
              <ol className="etapes">
                {e.consignes.map((c) => <li key={c}><span>{c}</span></li>)}
              </ol>
              {e.invite && <InviteCopiable titre={e.invite.titre} texte={e.invite.texte} />}
              {e.aSavoir && (
                <div className="a-savoir">
                  <h3>À savoir</h3>
                  <ul>
                    {e.aSavoir.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              )}
              {(e.lien || e.suite || e.telechargement || e.revelation) && (
                <div className="actions">
                  {e.lien && <a className="bouton" href={e.lien.href}>{e.lien.texte}</a>}
                  {e.suite && <a className="bouton-secondaire" href={e.suite.href}>{e.suite.texte}</a>}
                  {e.telechargement && <a className="bouton-secondaire" href={e.telechargement.href} download={e.telechargement.nom}>{e.telechargement.texte}</a>}
                  {e.revelation && <Link className="bouton-secondaire" href={e.revelation.href}>{e.revelation.texte}</Link>}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
      <MarqueVu cours={`${categorie.slug}/${cours.slug}`} etape="exercices" />
    </div>
  );
}
