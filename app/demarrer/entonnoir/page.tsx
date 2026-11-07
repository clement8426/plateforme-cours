import Entonnoir from '@/composants/Entonnoir';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Entonnoir : ce que ton projet a oublié', description: 'Quatre écrans pour obtenir les angles morts de ton projet, triés par gravité, et un kit à donner à ton agent IA. Tout se calcule dans ton navigateur.', chemin: '/demarrer/entonnoir/' });

export default function Page() {
  return (
    <div className="page page-formulaire">
      <FilAriane etapes={[{ nom: 'Démarrer', href: '/demarrer/' }, { nom: 'Entonnoir' }]} />
      <header className="tete tete-compacte">
        <h1>Trouve ce que ton projet a oublié</h1>
        <p className="chapeau">Tout se calcule dans ton navigateur. Rien n’est envoyé ni enregistré.</p>
      </header>
      <Entonnoir />
    </div>
  );
}
