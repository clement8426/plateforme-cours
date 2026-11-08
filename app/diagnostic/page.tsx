import Link from 'next/link';
import Diagnostic from '@/composants/Diagnostic';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Diagnostic : ce que ton projet a oublié', description: 'Quatre écrans pour obtenir les angles morts de ton projet, triés par gravité, et un kit à donner à ton agent IA. Tout se calcule dans ton navigateur.', chemin: '/diagnostic/' });

export default function Page() {
  return (
    <div className="page zone-diagnostic page-formulaire">
      <FilAriane etapes={[{ nom: 'Diagnostic' }]} />
      <header className="tete">
        <h1>Trouve ce que ton projet a oublié</h1>
        <p className="chapeau">Réponds à quelques questions : tu obtiens les oublis de ton projet, triés par gravité, et un kit pour ton agent IA. Rien n’est envoyé ni enregistré.</p>
      </header>
      <Diagnostic />
      <section className="section lien-ligne" aria-labelledby="titre-catalogue">
        <div>
          <h2 id="titre-catalogue">Annuaire des outils</h2>
          <p>Tous les serveurs MCP, plugins et skills que nous avons trouvés, classés par besoin et par type de projet.</p>
        </div>
        <Link className="bouton-secondaire" prefetch={false} href="/diagnostic/catalogue/">Ouvrir l’annuaire</Link>
      </section>
    </div>
  );
}
