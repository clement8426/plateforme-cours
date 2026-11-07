import Link from 'next/link';
import Entonnoir from '@/composants/Entonnoir';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Entonnoir : ce que ton projet a oublié', description: 'Quatre écrans pour obtenir les angles morts de ton projet, triés par gravité, et un kit à donner à ton agent IA. Tout se calcule dans ton navigateur.', chemin: '/entonnoir/' });

export default function Page() {
  return (
    <div className="page page-formulaire">
      <FilAriane etapes={[{ nom: 'Entonnoir' }]} />
      <header className="tete">
        <h1>Trouve ce que ton projet a oublié</h1>
        <p className="chapeau">Réponds à quelques questions : tu obtiens les oublis de ton projet, triés par gravité, et un kit pour ton agent IA. Rien n’est envoyé ni enregistré.</p>
      </header>
      <Entonnoir />
      <section className="section lien-ligne" aria-labelledby="titre-catalogue">
        <div>
          <h2 id="titre-catalogue">Catalogue d’outils</h2>
          <p>Des skills, plugins et serveurs MCP triés à la main, avec leurs contraintes et leurs alternatives.</p>
        </div>
        <Link className="bouton-secondaire" prefetch={false} href="/entonnoir/catalogue/">Voir le catalogue</Link>
      </section>
    </div>
  );
}
