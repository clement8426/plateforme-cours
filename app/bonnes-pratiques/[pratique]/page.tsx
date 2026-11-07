import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import { outilsDe, trouverAngle } from '@/contenu/parcours/moteur';
import { DATE_VERIFICATION, PRATIQUES, trouverPratique } from '@/contenu/parcours/pratiques';
import { formaterDate } from '@/contenu/date';
import { metadonnees } from '@/contenu/site';

type Props = { params: Promise<{ pratique: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => PRATIQUES.map((p) => ({ pratique: p.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = trouverPratique((await params).pratique);
  return p ? metadonnees({ titre: p.titre, description: p.risque, chemin: `/bonnes-pratiques/${p.id}/` }) : {};
}

export default async function Page({ params }: Props) {
  const p = trouverPratique((await params).pratique);
  if (!p) notFound();
  const outils = [...new Map(p.angles.flatMap(outilsDe).map((o) => [o.id, o])).values()];
  return (
    <div className="page">
      <FilAriane etapes={[{ nom: 'Bonnes pratiques', href: '/bonnes-pratiques/' }, { nom: p.titre }]} />
      <header className="tete tete-compacte"><h1>{p.titre}</h1></header>
      <article className="pratique">
        <p className="pratique-risque">{p.risque}</p>
        <section><h2>Un exemple</h2><p>{p.exemple}</p></section>
        <section><h2>Trois vérifications</h2><ol>{p.verifications.map((v) => <li key={v}>{v}</li>)}</ol></section>
        {outils.length > 0 && <section><h2>Outils qui aident</h2><ul>{outils.map((o) => <li key={o.id}><Link href={`/demarrer/catalogue/${o.id}/`}>{o.name}</Link></li>)}</ul></section>}
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
    </div>
  );
}
