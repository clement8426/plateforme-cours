import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import { KINDS, NIVEAUX, OUTILS, TAXONOMIE, trouverAngle, trouverOutil } from '@/contenu/parcours/moteur';
import { metadonnees } from '@/contenu/site';

type Props = { params: Promise<{ outil: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => OUTILS.map((o) => ({ outil: o.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { outil } = await params;
  const o = trouverOutil(outil);
  if (!o) return {};
  return metadonnees({ titre: o.name, description: o.description, chemin: `/diagnostic/catalogue/${o.id}/` });
}

const libelles = (liste: { id: string; label_fr: string }[], ids: string[]) => liste.filter((x) => ids.includes(x.id)).map((x) => x.label_fr).join(', ');

const AGENTS: Record<string, string> = { claude: 'Claude Code', codex: 'Codex', opencode: 'OpenCode', terminal: 'Terminal' };

export default async function Page({ params }: Props) {
  const { outil } = await params;
  const o = trouverOutil(outil);
  if (!o) notFound();

  return (
    <div className="page zone-diagnostic">
      <FilAriane etapes={[{ nom: 'Diagnostic', href: '/diagnostic/' }, { nom: 'Annuaire', href: '/diagnostic/catalogue/' }, { nom: o.name }]} />
      <header className="tete tete-compacte">
        <h1>{o.name}</h1>
        <p className="chapeau">{o.description}</p>
      </header>
      <div className="pratique">
        <section>
          <h2>Repères</h2>
          <ul>
            <li>Nature : {KINDS[o.kind]}</li>
            <li>Sert à : {libelles(TAXONOMIE.usages, o.usages)}</li>
            <li>Pour : {libelles(TAXONOMIE.types, o.project_types)}</li>
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
