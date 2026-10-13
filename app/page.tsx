import Link from 'next/link';
import { CATEGORIES } from '@/contenu/catalogue';

const Fleche = () => (
  <span className="fleche" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
);

export default function Accueil() {
  return (
    <div className="page">
      <section className="accueil" aria-labelledby="accueil-titre">
        <h1 id="accueil-titre">Comprendre le numérique en le manipulant.</h1>
        <p className="chapeau">Des cours courts et concrets : l’expérience utilisateur, l’IA, les données et la responsabilité, et bientôt le développement. Des diapos, des démonstrations à manipuler, des exercices à refaire chez soi. Libre d’accès, sans compte.</p>
        <div className="actions">
          <a className="bouton" href="#cours">Voir les cours</a>
        </div>
      </section>

      <section id="cours" aria-labelledby="titre-cours">
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
