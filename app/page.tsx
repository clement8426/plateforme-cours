import Link from 'next/link';
import { CATEGORIES } from '@/contenu/catalogue';
import { metadonnees, urlAbsolue } from '@/contenu/site';
import DonneesStructurees from '@/composants/DonneesStructurees';

export const metadata = { ...metadonnees({ titre: 'Le Labo, cours de numérique', description: 'Cours gratuits de Clément Bastien, parcours pour démarrer un projet numérique et bonnes pratiques : UX, IA, données et sécurité, sans compte.', chemin: '/' }), title: { absolute: 'Le Labo, cours de numérique' } };

const PORTES = [
  { href: '/cours/', titre: 'Cours', texte: 'Diapos, démonstrations à manipuler et exercices à refaire chez soi.', action: 'Voir tous les cours' },
  { href: '/demarrer/', titre: 'Démarrer son projet', texte: 'Un test, deux fiches, puis le plan des angles morts de votre projet et un kit pour votre agent IA.', action: 'Lancer le parcours' },
  { href: '/bonnes-pratiques/', titre: 'Bonnes pratiques', texte: 'Des pages courtes sur le légal et la sécurité, avec des vérifications à faire et des sources datées.', action: 'Lire les bonnes pratiques' },
];

export default function Accueil() {
  return (
    <div className="page">
      <DonneesStructurees valeur={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: CATEGORIES.flatMap(c => c.cours.filter(cours => !cours.enPreparation).map(cours => ({ name: cours.titre, url: urlAbsolue(`/${c.slug}/${cours.slug}/`) }))).map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })) }} />
      <section className="accueil accueil-compact" aria-labelledby="accueil-titre">
        <h1 id="accueil-titre">Comprendre le numérique en le manipulant.</h1>
        <p className="chapeau">Apprendre, lancer son projet sans rien oublier, vérifier son travail. Libre d’accès, sans compte.</p>
      </section>

      <section aria-labelledby="titre-portes">
        <h2 id="titre-portes" className="visuellement-cache">Les trois espaces du site</h2>
        <ul className="portes">
          {PORTES.map((p) => (
            <li key={p.href} className="porte">
              <h3><Link href={p.href}>{p.titre}</Link></h3>
              <p>{p.texte}</p>
              <p className="porte-action" aria-hidden="true">{p.action}<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
