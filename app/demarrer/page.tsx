import Link from 'next/link';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Démarrer son projet', description: 'Un test de positionnement et deux fiches pour clarifier ton idée et ton projet. Sans compte et sans sauvegarde.', chemin: '/demarrer/' });

const ETAPES = [
  { href: '/demarrer/test/', titre: 'Test de positionnement', texte: 'Sache d’où tu pars, sans IA, et mesure tes progrès.', duree: '24 questions' },
  { href: '/demarrer/idee/', titre: 'Fiche 1 : clarifier son idée', texte: 'L’idée, le problème, la cible, la marque et le parcours client.', duree: '7 parties' },
  { href: '/demarrer/technique/', titre: 'Fiche 2 : aspect technique', texte: 'Le type de produit, les données, les fonctionnalités et le MVP.', duree: '8 parties' },
];

export default function PageDemarrer() {
  return (
    <div className="page zone-demarrer">
      <FilAriane etapes={[{ nom: 'Démarrer' }]} />
      <header className="tete">
        <h1>Démarrer son projet</h1>
        <p className="chapeau">Du test à une idée claire. Chaque étape marche seule : commence où tu veux.</p>
      </header>
      <p className="fiche-ephemere"><strong>Rien n’est enregistré.</strong> Pas de compte, pas de sauvegarde : tes réponses restent dans la page et tu repars avec ton fichier.</p>

      <section className="section" aria-labelledby="titre-etapes">
        <h2 id="titre-etapes" className="titre-section">Le parcours</h2>
        <ol className="liste-cours etapes-parcours">
          {ETAPES.map((e) => (
            <li key={e.href} className="cours-carte">
              <h3><Link href={e.href}>{e.titre}</Link></h3>
              <p>{e.texte}</p>
              <p className="cours-meta">{e.duree}<span className="fleche" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span></p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section lien-ligne" aria-labelledby="titre-suite">
        <div>
          <h2 id="titre-suite">Et ensuite ?</h2>
          <p>Le diagnostic trouve ce que ton projet a oublié, et tes fiches peuvent le pré-remplir.</p>
        </div>
        <Link className="bouton" href="/diagnostic/">Analyser mon projet</Link>
      </section>
    </div>
  );
}
