import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BadgeVu from '@/composants/BadgeVu';
import FilAriane from '@/composants/FilAriane';
import AvisDate from '@/composants/AvisDate';
import PucesBlocs from '@/composants/PucesBlocs';
import { compterReferences } from '@/contenu/catalogue';
import { type ParamsCours, lireCours, tousLesCours } from '@/contenu/parametres';

export const dynamicParams = false;
export const generateStaticParams = tousLesCours;

export async function generateMetadata(props: ParamsCours): Promise<Metadata> {
  const { cours } = await lireCours(props);
  return { title: cours?.titre, description: cours?.accroche };
}

const Externe = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
const Fleche = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

export default async function PageCours(props: ParamsCours) {
  const { categorie, cours } = await lireCours(props);
  if (!categorie || !cours) notFound();
  const base = `/${categorie.slug}/${cours.slug}`;
  const cle = `${categorie.slug}/${cours.slug}`;

  if (cours.enPreparation) {
    return (
      <div className="page">
        <FilAriane etapes={[{ nom: categorie.nom, href: `/${categorie.slug}/` }, { nom: cours.titre }]} />
        <header className="tete">
          <p className="etat-prepa">En préparation</p>
          <h1>{cours.titre}</h1>
          <p className="chapeau">{cours.accroche}</p>
          <dl className="reperes">
            <div><dt>Pour qui</dt><dd>{cours.public}</dd></div>
          </dl>
        </header>
        <section className="section objectifs" aria-labelledby="titre-objectifs">
          <h2 id="titre-objectifs" className="titre-section">Ce que vous apprendrez</h2>
          <ul>
            {cours.objectifs.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </section>
        <section className="section lien-ligne" aria-labelledby="titre-attente">
          <div>
            <h2 id="titre-attente">Les diapos et les démonstrations arrivent bientôt</h2>
            <p>En attendant, les autres cours sont en ligne.</p>
          </div>
          <Link className="bouton-secondaire" href="/#cours">Voir les cours<Fleche /></Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <FilAriane etapes={[{ nom: categorie.nom, href: `/${categorie.slug}/` }, { nom: cours.titre }]} />
      <div className="cours-tete">
        <header className="tete">
          <h1>{cours.titre}</h1>
          <p className="chapeau">{cours.accroche}</p>
          <dl className="reperes">
            <div><dt>Durée</dt><dd>{cours.duree}</dd></div>
            <div><dt>Pour qui</dt><dd>{cours.public}</dd></div>
          </dl>
          <AvisDate date={cours.misAJour} />
          <div className="actions">
            {cours.diapos && <Link className="bouton" href={`${base}/diapos/`}>Ouvrir les diapos</Link>}
            {cours.demos.length > 0 && <Link className="bouton-secondaire" href="#demos">Voir les démonstrations</Link>}
          </div>
        </header>
        {cours.diapos && (
          <Link className="apercu-diapos" href={`${base}/diapos/`} tabIndex={-1} aria-hidden="true">
            <img src={cours.diapos.apercu} alt="" width={1440} height={810} />
          </Link>
        )}
      </div>

      <section className="section" aria-labelledby="titre-deroule">
        <h2 id="titre-deroule" className="titre-section">Le déroulé</h2>
        <p className="intro-section">{['Deux', 'Trois', 'Quatre', 'Cinq'][cours.parties.length - 2] ?? cours.parties.length} parties, dans l’ordre des diapos.</p>
        <ol className="deroule">
          {cours.parties.map((p, i) => (
            <li key={p.titre} className="partie" id={p.demos ? 'demos' : undefined}>
              <span className="partie-num" aria-hidden="true">{i + 1}</span>
              <div className="partie-texte">
                <h3><span className="visuellement-cache">Partie {i + 1} : </span>{p.titre}</h3>
                <p className="partie-infos"><span>{p.duree}</span><span>Diapos {p.diapos[0]} à {p.diapos[1]}</span></p>
                <p>{p.resume}</p>
              </div>
              {cours.diapos && (
                <div className="actions">
                  <Link className="bouton-secondaire" href={`${base}/diapos/?diapo=${p.diapos[0]}`}>
                    Diapo {p.diapos[0]}<span className="visuellement-cache">, début de la partie {p.titre}</span><Fleche />
                  </Link>
                </div>
              )}
              {p.demos && (
                <div className="partie-demos">
                  <ul className="demos-grille">
                    {cours.demos.map((d) => (
                      <li key={d.slug} className={`demo-carte${d.indisponible ? ' est-indisponible' : ''}`} aria-disabled={d.indisponible || undefined}>
                        <img src={d.apercu} alt="" width={1440} height={900} loading="lazy" />
                        <div className="demo-carte-texte">
                          <h4>{d.indisponible ? d.titre : <Link href={`${base}/demos/${d.slug}/`}>{d.titre}</Link>}</h4>
                          {d.indisponible && <p className="demo-indisponible">Indisponible pour le moment</p>}
                          <p>{d.bonus ? <strong>Bonus, si le temps le permet. </strong> : null}{d.resume}</p>
                          <PucesBlocs blocs={d.blocs} />
                          {!d.indisponible && <BadgeVu cours={cle} etape={d.slug} nom={d.titre} />}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {cours.depot && (
        <section className="section depot" aria-labelledby="titre-depot">
          <div>
            <h2 id="titre-depot">Refaire les exercices chez vous</h2>
            <p>Le dépôt GitHub du cours contient les exercices à faire vous-même, seul ou à plusieurs, avec les consignes et le matériel.</p>
          </div>
          <a className="bouton" href={cours.depot} target="_blank" rel="noreferrer">
            Ouvrir le dépôt GitHub<span className="visuellement-cache"> (nouvel onglet)</span><Externe />
          </a>
          <ul>
            {cours.demos.map((d) => (
              <li key={d.slug}><strong>{d.titre}</strong>{d.exerciceUrl ? <a href={d.exerciceUrl} target="_blank" rel="noreferrer">Dépôt Labo UX Démo<span className="visuellement-cache"> (nouvel onglet)</span></a> : <code>{d.exercice}/</code>}</li>
            ))}
          </ul>
        </section>
      )}

      {cours.exercice && (
        <section className="section exercice-hors" aria-labelledby="titre-exercice">
          <h2 id="titre-exercice">L’exercice : {cours.exercice.titre}</h2>
          <p className="intro-section">{cours.exercice.resume}</p>
          <div className="avis-prototype" role="note">
            <p className="avis-titre">Prototype</p>
            <p>{cours.exercice.prototype}</p>
            <ul>
              {cours.exercice.conditions.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <div className="actions">
            {cours.exercice.tuto && <Link className="bouton" href={`${base}/tuto/`}>{cours.exercice.tuto.titre}</Link>}
            {cours.exercice.lien && (
              <a className="bouton-secondaire" href={cours.exercice.lien} target="_blank" rel="noreferrer">
                Le dépôt GitHub, pour télécharger<span className="visuellement-cache"> (nouvel onglet)</span><Externe />
              </a>
            )}
          </div>
        </section>
      )}

      <section className="section lien-ligne" aria-labelledby="titre-sources">
        <div>
          <h2 id="titre-sources">Sources et lexique</h2>
          <p>{compterReferences(cours)} références pour aller plus loin, et les {cours.lexique.length} mots du cours en une phrase.</p>
        </div>
        <Link className="bouton-secondaire" href={`${base}/sources/`}>Ouvrir<span className="visuellement-cache"> les sources et le lexique</span><Fleche /></Link>
      </section>

      <section className="section objectifs" aria-labelledby="titre-objectifs">
        <h2 id="titre-objectifs" className="titre-section">À la fin du cours, vous saurez</h2>
        <ul>
          {cours.objectifs.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </section>
    </div>
  );
}
