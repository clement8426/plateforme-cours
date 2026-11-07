import Catalogue from '@/composants/Catalogue';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Catalogue d’outils IA', description: 'Skills, plugins, serveurs MCP et outils d’audit, validés à la main, avec leurs contraintes et leurs alternatives.', chemin: '/diagnostic/catalogue/' });

export default function Page() {
  return (
    <div className="page zone-diagnostic">
      <FilAriane etapes={[{ nom: 'Diagnostic', href: '/diagnostic/' }, { nom: 'Catalogue' }]} />
      <header className="tete tete-compacte">
        <h1>Catalogue d’outils</h1>
        <p className="chapeau">Chaque outil est relu à la main. Une popularité élevée ne garantit pas sa sécurité : lis ses contraintes avant de l’installer.</p>
      </header>
      <Catalogue />
    </div>
  );
}
