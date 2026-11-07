import Link from 'next/link';
import type { CSSProperties } from 'react';
import FioleAccueil from '@/composants/FioleAccueil';
import { CATEGORIES } from '@/contenu/catalogue';
import { metadonnees, urlAbsolue } from '@/contenu/site';
import DonneesStructurees from '@/composants/DonneesStructurees';

export const metadata = { ...metadonnees({ titre: 'Le Labo, cours de numérique', description: 'Cours gratuits de Clément Bastien, parcours pour démarrer un projet numérique et bonnes pratiques : UX, IA, données et sécurité, sans compte.', chemin: '/' }), title: { absolute: 'Le Labo, cours de numérique' } };

const PORTES = [
  { href: '/cours/', titre: 'Cours', texte: 'Diapos, démonstrations à manipuler et exercices à refaire chez soi.', action: 'Voir tous les cours', teinte: '--b-access', icone: 'M4 6.5C6.5 5 9.5 5 12 6.5V20C9.5 18.5 6.5 18.5 4 20ZM12 6.5C14.5 5 17.5 5 20 6.5V20C17.5 18.5 14.5 18.5 12 20Z' },
  { href: '/demarrer/', titre: 'Démarrer son projet', texte: 'Un test et deux fiches pour clarifier votre idée et faire le point.', action: 'Lancer le parcours', teinte: '--b-friction', icone: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 15h9' },
  { href: '/entonnoir/', titre: 'Entonnoir', texte: 'Trouvez ce que votre projet a oublié, puis repartez avec un plan et un kit pour votre agent IA.', action: 'Analyser mon projet', teinte: '--b-design', icone: 'M3 5h18l-7 8v6l-4 2v-8z' },
  { href: '/bonnes-pratiques/', titre: 'Bonnes pratiques', texte: 'Des pages courtes sur le légal et la sécurité, avec des vérifications à faire et des sources datées.', action: 'Lire les bonnes pratiques', teinte: '--b-micro', icone: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5' },
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
        <ul className="portes">
          {PORTES.map((p) => (
            <li key={p.href} className="porte" style={{ '--teinte': `var(${p.teinte})` } as CSSProperties}>
              <span className="porte-icone" aria-hidden="true"><svg viewBox="0 0 24 24"><path d={p.icone} /></svg></span>
              <h3><Link href={p.href}>{p.titre}</Link></h3>
              <p>{p.texte}</p>
              <p className="porte-action" aria-hidden="true">{p.action}<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></p>
            </li>
          ))}
        </ul>
      </section>

      <section className="accueil-suite" aria-labelledby="titre-en-ligne">
        <h2 id="titre-en-ligne" className="titre-section">Les cours en ligne</h2>
        <ul className="outils-liste">
          {cours.map((c) => (
            <li key={c.slug} className="outil-carte">
              <h3><Link href={`/${c.theme.slug}/${c.slug}/`}>{c.titre}</Link></h3>
              <p>{c.theme.nom}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
