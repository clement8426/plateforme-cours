import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Annuaire, { type Ligne, type Nature } from '@/composants/Annuaire';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

const dossier = join(process.cwd(), 'public', 'annuaire');
const index = JSON.parse(readFileSync(join(dossier, 'index.json'), 'utf8')) as { date: string; comptes: Record<Nature, number>; usages: { id: string; label_fr: string }[]; types: { id: string; label_fr: string }[]; references: [string, string][]; sources?: { nom: string; n: number; ok: boolean }[] };
const total = Object.values(index.comptes).reduce((a, b) => a + b, 0);
const milliers = new Intl.NumberFormat('fr-CH').format(total);

export const metadata = metadonnees({ titre: 'Annuaire MCP, skills et plugins', description: `${milliers} serveurs MCP, plugins et skills référencés par Claude, OpenAI, Google, GitHub ou Docker, ou suivis par au moins 1 000 étoiles GitHub. Serveurs en ligne et en local, classés par besoin.`, chemin: '/diagnostic/catalogue/' });

export default function Page() {
  // Les premières lignes sont dans la page : un robot les lit sans exécuter de script.
  const apercu = (JSON.parse(readFileSync(join(dossier, 'mcp.json'), 'utf8')) as Ligne[]).slice(0, 60);
  return (
    <div className="page zone-diagnostic">
      <FilAriane etapes={[{ nom: 'Diagnostic', href: '/diagnostic/' }, { nom: 'Annuaire' }]} />
      <header className="tete tete-compacte">
        <h1>Annuaire MCP, skills et plugins</h1>
        <p className="chapeau">{milliers} outils reconnus, collectés automatiquement le {index.date} : référencés par un répertoire (Claude, OpenAI, Google, GitHub, Docker, Cursor, AWS, skills.sh) ou suivis par au moins 1 000 étoiles GitHub. Référencé veut dire reconnu, pas vérifié : personne ne relit ces outils, lis leur code avant de les installer. Un outil mal classé ou dangereux ? <a href="https://github.com/clement8426/plateforme-cours/issues">Signale-le sur GitHub</a>.</p>
      </header>
      <p className="fiche-ephemere" role="note"><strong>Pas encore vérifié à 100 %.</strong> Cet annuaire est nouveau et se construit encore : des outils peuvent manquer, être mal classés ou avoir une adresse qui ne répond plus. Rien n’est testé à la main.</p>
      <Annuaire comptes={index.comptes} usages={index.usages} types={index.types} references={index.references} apercu={apercu} />
      <details className="annuaire-sources">
        <summary>D’où viennent ces listes</summary>
        <p>Un robot les reconstruit chaque jour. Un outil y entre dans l’un de ces cas :</p>
        <ul>
          <li>un répertoire reconnu le cite : {index.references.map(([, nom]) => nom).join(', ')} ;</li>
          <li>il compte au moins 1 000 étoiles GitHub sur un dépôt qui appartient à son auteur ;</li>
          <li>son éditeur est prouvé par le registre officiel MCP et son paquet npm dépasse 10 000 téléchargements par semaine ;</li>
          <li>nous l’ajoutons à la main, parce qu’il vient directement de l’éditeur.</li>
        </ul>
        <p>Les étoiles d’un dépôt qui contient de nombreux outils ne sont pas comptées pour chacun. Les copies identiques d’un skill sont regroupées. Les adresses et commandes viennent des répertoires eux-mêmes ; elles ne sont pas testées. Les fiches des connecteurs de Claude sont lues une fois par semaine, lentement, pour leur nom et leur adresse seulement.</p>
        <p>« Référencé » veut dire reconnu par un répertoire. Aucun répertoire ne garantit la sécurité d’un outil, et Anthropic le précise pour le sien. Copie une commande seulement après avoir lu le code de l’outil.</p>
      </details>
      <details className="annuaire-sources">
        <summary>Avertissement</summary>
        <p>Cet annuaire est fourni à titre d’information, sans garantie d’exactitude, de disponibilité ni de sécurité. Le Labo ne développe, n’héberge et n’opère aucun de ces outils, et ne les recommande pas. Tu les installes et les connectes sous ta propre responsabilité : un outil peut lire tes fichiers, utiliser tes comptes ou exécuter des commandes.</p>
        <p>Les noms et marques appartiennent à leurs titulaires ; leur présence ici n’indique ni partenariat ni approbation. Noms et descriptions viennent de sources publiques. Pour corriger ou retirer une fiche, <a href="https://github.com/clement8426/plateforme-cours/issues">écris-nous sur GitHub</a>.</p>
      </details>
    </div>
  );
}
