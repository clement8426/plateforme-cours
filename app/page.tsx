import Link from 'next/link';
import type { CSSProperties } from 'react';
import FioleAccueil from '@/composants/FioleAccueil';
import { CATEGORIES } from '@/contenu/catalogue';
import { metadonnees, urlAbsolue } from '@/contenu/site';
import DonneesStructurees from '@/composants/DonneesStructurees';

export const metadata = { ...metadonnees({ titre: 'Le Labo, cours de numérique', description: 'Cours gratuits de Clément Bastien, parcours pour démarrer un projet numérique et bonnes pratiques : UX, IA, données et sécurité, sans compte.', chemin: '/' }), title: { absolute: 'Le Labo, cours de numérique' } };

const PORTES = [
  { href: '/cours/', titre: 'Cours', texte: 'Diapos, démonstrations à manipuler et exercices à refaire chez soi.', couleur: '--vif-rose' },
  { href: '/demarrer/', titre: 'Démarrer son projet', texte: 'Un test et deux fiches pour clarifier votre idée et faire le point.', couleur: '--vif-vert' },
  { href: '/entonnoir/', titre: 'Entonnoir', texte: 'Trouvez ce que votre projet a oublié, puis repartez avec un plan et un kit pour votre agent IA.', couleur: '--vif-jaune' },
  { href: '/bonnes-pratiques/', titre: 'Bonnes pratiques', texte: 'Des pages courtes sur le légal et la sécurité, avec des vérifications à faire et des sources datées.', couleur: '--vif-violet' },
];

export default function Accueil() {
  const cours = CATEGORIES.flatMap((c) => c.cours.filter((x) => !x.enPreparation).map((x) => ({ ...x, theme: c })));
  return (
    <div className="page">
      <DonneesStructurees valeur={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: cours.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.titre, url: urlAbsolue(`/${c.theme.slug}/${c.slug}/`) })) }} />
      <section className="hero" aria-labelledby="accueil-titre">
        <div className="hero-texte">
          <h1 id="accueil-titre">Comprendre le numérique en le manipulant.</h1>
          <p>Apprendre, lancer son projet sans rien oublier, vérifier son travail. Libre d’accès, sans compte.</p>
          <div className="actions">
            <Link className="hero-bouton" href="/cours/">Voir les cours</Link>
            <Link className="hero-bouton est-contour" href="/entonnoir/">Analyser mon projet</Link>
          </div>
        </div>
        <FioleAccueil />
      </section>

      <section aria-labelledby="titre-portes">
        <h2 id="titre-portes" className="visuellement-cache">Les quatre espaces du site</h2>
        <ul className="couches">
          {PORTES.map((p) => (
            <li key={p.href} className="couche" style={{ '--couche': `var(${p.couleur})` } as CSSProperties}>
              <h3><Link href={p.href}>{p.titre}</Link></h3>
              <p>{p.texte}</p>
              <svg className="couche-fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
              <span className="bulles" aria-hidden="true"><i /><i /><i /></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="vitrine" aria-labelledby="titre-en-ligne">
        <h2 id="titre-en-ligne">Les cours en ligne</h2>
        <ul>
          {cours.map((c) => (
            <li key={c.slug} className="tirage">
              {c.diapos && <img src={c.diapos.apercu} alt="" width={1440} height={810} loading="lazy" />}
              <h3><Link href={`/${c.theme.slug}/${c.slug}/`}>{c.titre}</Link></h3>
              <p>{c.theme.nom}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
