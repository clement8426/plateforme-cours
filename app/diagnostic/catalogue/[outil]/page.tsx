import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import { KINDS, NIVEAUX, OUTILS, trouverAngle, trouverOutil } from '@/contenu/parcours/moteur';
import { metadonnees } from '@/contenu/site';

type Props = { params: Promise<{ outil: string }> };

export const dynamicParams = false;
// Un export statique exige au moins une page : sans outil validé, une page témoin non indexée est produite.
export const generateStaticParams = () => (OUTILS.length ? OUTILS.map((o) => ({ outil: o.id })) : [{ outil: 'en-validation' }]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { outil } = await params;
  const o = trouverOutil(outil);
  if (!o) return metadonnees({ titre: 'Catalogue en cours de validation', description: 'Chaque outil est relu à la main avant d’être publié.', chemin: '/diagnostic/catalogue/', indexable: false });
  return metadonnees({ titre: o.name, description: o.description, chemin: `/diagnostic/catalogue/${o.id}/` });
}

const AGENTS: Record<string, string> = { claude: 'Claude Code', codex: 'Codex', opencode: 'OpenCode', terminal: 'Terminal' };

export default async function Page({ params }: Props) {
  const { outil } = await params;
  const o = trouverOutil(outil);
  if (!o && outil !== 'en-validation') notFound();
  if (!o) return <div className="page"><header className="tete"><h1>Catalogue en cours de validation</h1></header><Link href="/diagnostic/catalogue/">Retour au catalogue</Link></div>;

  return (
    <div className="page">
      <FilAriane etapes={[{ nom: 'Diagnostic', href: '/diagnostic/' }, { nom: 'Catalogue', href: '/diagnostic/catalogue/' }, { nom: o.name }]} />
      <header className="tete tete-compacte">
        <h1>{o.name}</h1>
        <p className="chapeau">{o.description}</p>
      </header>
      <div className="pratique">
        {o.warning && <p className="fiche-alerte">{o.warning}</p>}
        <section>
          <h2>Repères</h2>
          <ul>
            <li>Nature : {KINDS[o.kind]}</li>
            <li>Niveau : {NIVEAUX[o.level]}</li>
            <li>Licence : {o.license ?? 'à vérifier dans le dépôt'}</li>
            <li>Dernière activité du dépôt : {o.last_push}</li>
            <li>Dépôt : <a href={`https://github.com/${o.repo}`} target="_blank" rel="noreferrer">{o.repo}</a></li>
          </ul>
        </section>
        <section>
          <h2>Installation</h2>
          {Object.keys(o.install).length ? <ul>{Object.entries(o.install).map(([agent, commande]) => <li key={agent}>{AGENTS[agent] ?? agent} : <code>{commande}</code></li>)}</ul> : <p>Suis la documentation du dépôt.</p>}
        </section>
        {o.constraints.length > 0 && <section><h2>Contraintes</h2><ul>{o.constraints.map((c) => <li key={c}>{c}</li>)}</ul></section>}
        {o.alternatives.length > 0 && <section><h2>Alternatives</h2><ul>{o.alternatives.map((c) => <li key={c}>{c}</li>)}</ul></section>}
        {o.data_location && <section><h2>Où vont les données</h2><p>Société : {o.data_location.societe}. Pays : {o.data_location.pays}.</p></section>}
        <section>
          <h2>Angles morts traités</h2>
          <ul>{o.blind_spots.map((id) => <li key={id}><Link href={`/bonnes-pratiques/angles-morts/${id}/`}>{trouverAngle(id)?.title}</Link></li>)}</ul>
        </section>
      </div>
    </div>
  );
}
