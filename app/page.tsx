import Link from 'next/link';
import DemarrerCours from '@/composants/DemarrerCours';
import { CATEGORIES, premierCours } from '@/contenu/catalogue';

const Fleche = () => (
  <span className="fleche" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
);

export default function Accueil() {
  const depart = premierCours();
  const base = depart ? `/${depart.categorie.slug}/${depart.cours.slug}` : '/';

  return (
    <div className="page">
      <section className="accueil" aria-labelledby="accueil-titre">
        <h1 id="accueil-titre">Joli ne veut pas dire pratique.</h1>
        <p className="chapeau">Des cours courts pour apprendre à voir ce qui gêne les utilisateurs d’un produit, puis à le corriger, avec et sans IA. Diapos et démonstrations en libre accès, sans compte.</p>
        {depart && (
          <DemarrerCours
            cle={`${depart.categorie.slug}/${depart.cours.slug}`}
            titre={depart.cours.titre}
            base={`${base}/`}
            etapes={[
              { id: 'diapos', court: 'les diapos', href: `${base}/diapos/` },
              ...depart.cours.demos.map((d) => ({ id: d.slug, court: d.titre, href: `${base}/demos/${d.slug}/` })),
              { id: 'sources', court: 'les sources', href: `${base}/sources/` },
            ]}
            demos={`${base}/#demos`}
          />
        )}
      </section>

      <section aria-labelledby="titre-cours">
        <h2 id="titre-cours" className="titre-section">Les cours</h2>
        <ul className="liste-cours">
          {CATEGORIES.flatMap((c) => c.cours.length
            ? c.cours.map((cours) => (
              <li key={cours.slug} className="cours-carte">
                <h3><Link href={`/${c.slug}/${cours.slug}/`}>{cours.titre}</Link></h3>
                <p>{cours.accroche}{cours.demos.length > 0 && ` ${cours.demos.length} démonstrations interactives.`}</p>
                <p className="cours-meta">{cours.duree.replace(/^Environ /, '')}<Fleche /></p>
              </li>
            ))
            : [(
              <li key={c.slug} className="cours-carte est-vide">
                <h3>{c.nom}</h3>
                <p>{c.description}</p>
                <p className="etat-prepa">En préparation</p>
              </li>
            )])}
        </ul>
      </section>
    </div>
  );
}
