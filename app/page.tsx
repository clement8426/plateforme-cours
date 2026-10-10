import Link from 'next/link';
import DemarrerCours from '@/composants/DemarrerCours';
import { CATEGORIES, premierCours } from '@/contenu/catalogue';
import { BLOCS, type BlocId } from '@/contenu/blocs';

type PropsPastille = { rang: number; numero: number; bloc: BlocId; defaut: number; position: 'haut' | 'droite' | 'souple' };

// Une pastille comme celles du mode cours de Tilleul, dans la couleur du même bloc. Un clic ouvre Tilleul sur ce défaut.
// Elle est un raccourci pour la souris et le doigt : le clavier et les lecteurs d'écran passent par « Voir Tilleul tout de suite ».
function Pastille({ rang, numero, bloc, defaut, position }: PropsPastille) {
  const { nom, couleur } = BLOCS[bloc];
  return (
    <a
      className={`pastille ${position}`}
      href={`/tilleul/?defaut=${defaut}`}
      style={{ '--c': couleur, '--rang': rang } as React.CSSProperties}
      aria-hidden="true"
      tabIndex={-1}
      title={`Voir ce défaut dans Tilleul : ${nom}`}
    >
      <i>{numero}</i>
      <b>{nom}</b>
    </a>
  );
}

export default function Accueil() {
  const depart = premierCours();
  const base = depart ? `/${depart.categorie.slug}/${depart.cours.slug}` : '/';

  return (
    <div className="page">
      <section className="lecon" aria-labelledby="lecon-titre">
        <h1 id="lecon-titre">
          <span className="annote">Joli<Pastille rang={0} numero={1} bloc="design-system" defaut={1} position="haut" /></span>
          {' '}ne veut pas{' '}
          <span className="annote">dire<Pastille rang={1} numero={2} bloc="microcopie" defaut={9} position="souple" /></span>
          {' '}
          <span className="annote">pratique.<Pastille rang={2} numero={3} bloc="friction" defaut={4} position="droite" /></span>
        </h1>
        <div className="lecon-suite">
          <p>
            Des cours courts pour apprendre à <strong>voir ce qui gêne</strong> les utilisateurs d’un produit, puis à le corriger, avec et sans IA.
          </p>
          <p>Diapos, démonstrations et exercices, en libre accès et sans compte.</p>
          {depart && (
            <DemarrerCours
              cle={`${depart.categorie.slug}/${depart.cours.slug}`}
              titre={depart.cours.titre}
              base={`${base}/`}
              etapes={[
                { id: 'diapos', court: 'les diapos', href: `${base}/diapos/`, interne: true },
                { id: 'demo', court: 'Tilleul', href: '/tilleul/', interne: false },
                { id: 'exercices', court: 'les exercices', href: `${base}/exercices/`, interne: true },
                { id: 'sources', court: 'les sources', href: `${base}/sources/`, interne: true },
              ]}
            />
          )}
        </div>
      </section>

      <section aria-labelledby="titre-themes">
        <h2 id="titre-themes" className="visuellement-cache">Les thèmes</h2>
        <ul className="themes">
          {CATEGORIES.map((c) => {
            const ouvert = c.cours.length > 0;
            return (
              <li key={c.slug} className={`theme-carte${ouvert ? ' est-ouverte' : ' est-vide'}`}>
                <h3 className="theme-titre"><Link href={`/${c.slug}/`}>{c.nom}</Link></h3>
                <p className="theme-description">{c.description}</p>
                <p className="theme-etat">
                  {ouvert ? `${c.cours.length} cours` : 'En préparation'}
                  {ouvert && (
                    <span className="fleche" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </span>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
