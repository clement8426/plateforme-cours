import Link from 'next/link';
import CarteCours from '@/composants/CarteCours';
import FilAriane from '@/composants/FilAriane';
import { CATEGORIES } from '@/contenu/catalogue';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Tous les cours', description: 'Tous les cours du Labo par thème : UX et design, comprendre l’IA, obligations et législation, développement et hébergement.', chemin: '/cours/' });

export default function PageCours() {
  return (
    <div className="page">
      <FilAriane etapes={[{ nom: 'Cours' }]} />
      <header className="tete">
        <h1>Tous les cours</h1>
        <p className="chapeau">Des cours courts et concrets, avec des diapos, des démonstrations à manipuler et des exercices à refaire chez soi.</p>
      </header>
      {CATEGORIES.map((c) => (
        <section className="section-theme" key={c.slug} aria-labelledby={`theme-${c.slug}`}>
          <h2 id={`theme-${c.slug}`} className="titre-section"><Link href={`/${c.slug}/`}>{c.nom}</Link></h2>
          <p className="intro-section">{c.description}</p>
          <ul className="liste-cours">
            {c.cours.map((cours) => <CarteCours key={cours.slug} categorie={c.slug} cours={cours} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
