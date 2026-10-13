import CarteCours from '@/composants/CarteCours';
import { CATEGORIES } from '@/contenu/catalogue';

export default function Accueil() {
  return (
    <div className="page accueil-grille">
      <section className="accueil" aria-labelledby="accueil-titre">
        <h1 id="accueil-titre">Comprendre le numérique en le manipulant.</h1>
        <p className="chapeau">Des cours courts et concrets : l’expérience utilisateur, l’IA, les données et la responsabilité, et bientôt le développement. Des diapos, des démonstrations à manipuler, des exercices à refaire chez soi. Libre d’accès, sans compte.</p>
        <div className="actions accueil-actions">
          <a className="bouton" href="#cours">Voir les cours</a>
        </div>
      </section>

      <section id="cours" className="accueil-cours" aria-labelledby="titre-cours">
        <h2 id="titre-cours" className="titre-section">Les cours</h2>
        <ul className="liste-cours">
          {CATEGORIES.flatMap((c) => c.cours.map((cours) => <CarteCours key={cours.slug} categorie={c.slug} cours={cours} />))}
        </ul>
      </section>
    </div>
  );
}
