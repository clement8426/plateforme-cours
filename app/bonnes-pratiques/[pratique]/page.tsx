import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopieAgent from '@/composants/CopieAgent';
import DonneesStructurees from '@/composants/DonneesStructurees';
import FilAriane from '@/composants/FilAriane';
import { cheminMarkdown, messagePratique } from '@/contenu/parcours/agent';
import { outilsDe, trouverAngle } from '@/contenu/parcours/moteur';
import { DATE_VERIFICATION, PRATIQUES, trouverPratique } from '@/contenu/parcours/pratiques';
import { formaterDate } from '@/contenu/date';
import { AUTEUR, metadonnees, urlAbsolue } from '@/contenu/site';

type Props = { params: Promise<{ pratique: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PRATIQUES.map((p) => ({ pratique: p.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = trouverPratique((await params).pratique);
  return p ? metadonnees({ titre: p.titre, description: p.risque, chemin: `/bonnes-pratiques/${p.id}/`, markdown: cheminMarkdown(p.id) }) : {};
}

// `code` dans un texte de données devient une balise code.
const avecCode = (texte: string) => texte.split('`').map((t, i) => (i % 2 ? <code key={t}>{t}</code> : t));

export default async function Page({ params }: Props) {
  const p = trouverPratique((await params).pratique);
  if (!p) notFound();
  const outils = [...new Map(p.angles.flatMap(outilsDe).map((o) => [o.id, o])).values()];
  return (
    <div className="page zone-pratiques">
      <DonneesStructurees valeur={{ '@context': 'https://schema.org', '@type': 'TechArticle', headline: p.titre, description: p.risque, url: urlAbsolue(`/bonnes-pratiques/${p.id}/`), inLanguage: 'fr-CH', dateModified: DATE_VERIFICATION, author: AUTEUR, citation: p.sources.map((x) => x.url) }} />
      <FilAriane etapes={[{ nom: 'Bonnes pratiques', href: '/bonnes-pratiques/' }, { nom: p.titre }]} />
      <header className="tete tete-compacte"><h1>{p.titre}</h1></header>
      <div className="pratique-page">
      <article className="pratique">
        <p className="pratique-risque">{p.risque}</p>
        <section className="pratique-exemple"><h2>Un exemple</h2><p>{p.exemple}</p></section>
        <section><h2>Trois vérifications</h2><ol className="verifications">{p.verifications.map((v) => <li key={v}>{v}</li>)}</ol></section>
        {p.blocs?.map((b) => (
          <section key={b.titre}>
            <h2>{b.titre}</h2>
            <dl className="pratique-blocs">{b.lignes.map((l) => <div key={l.nom}><dt>{l.nom}</dt><dd>{avecCode(l.texte)}</dd></div>)}</dl>
          </section>
        ))}
        {outils.length > 0 && <section><h2>Outils qui aident</h2><ul>{outils.map((o) => <li key={o.id}><Link href={`/diagnostic/catalogue/${o.id}/`}>{o.name}</Link></li>)}</ul></section>}
        <section>
          <h2>Pour aller plus loin</h2>
          <ul>
            {p.angles.map((id) => <li key={id}><Link href={`/bonnes-pratiques/angles-morts/${id}/`}>{trouverAngle(id)?.title}</Link></li>)}
            {p.cours && <li>Cours : <Link href={p.cours.href}>{p.cours.nom}</Link></li>}
          </ul>
        </section>
        <section>
          <h2>Sources</h2>
          <ul>{p.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.titre}</a></li>)}</ul>
          <p>Vérifié le {formaterDate(DATE_VERIFICATION)}. Cette page informe et ne remplace pas un conseil juridique.</p>
        </section>
      </article>
      <aside className="pratique-agent" aria-labelledby="titre-agent">
        <h2 id="titre-agent">Vérifie ce point avec ton agent IA</h2>
        <CopieAgent texte={messagePratique(p)} />
        <p><a href={cheminMarkdown(p.id)}>Version pour agents</a></p>
      </aside>
      </div>
    </div>
  );
}
