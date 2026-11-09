import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FilAriane from '@/composants/FilAriane';
import { formaterDate } from '@/contenu/date';
import { ANGLES, famille, GRAVITES, outilsDe, trouverAngle } from '@/contenu/parcours/moteur';
import { DATE_VERIFICATION, trouverPratique } from '@/contenu/parcours/pratiques';
import { couperDescription, metadonnees } from '@/contenu/site';

type Props = { params: Promise<{ angle: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => ANGLES.map((a) => ({ angle: a.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = trouverAngle((await params).angle);
  return a ? metadonnees({ titre: `${a.title} : angle mort`, description: couperDescription(`${a.question} ${a.why}`), chemin: `/bonnes-pratiques/angles-morts/${a.id}/` }) : {};
}

export default async function Page({ params }: Props) {
  const a = trouverAngle((await params).angle);
  if (!a) notFound();
  const pratique = a.practice ? trouverPratique(a.practice) : undefined;
  const outils = outilsDe(a.id);
  return (
    <div className="page zone-pratiques">
      <FilAriane etapes={[{ nom: 'Bonnes pratiques', href: '/bonnes-pratiques/' }, { nom: a.title }]} />
      <header className="tete tete-compacte">
        <p className="diagnostic-etape">{famille(a.family)} · {GRAVITES[a.severity].nom}</p>
        <h1>{a.title}</h1>
      </header>
      <article className="pratique">
        <p className="pratique-risque">{a.question}</p>
        {pratique && <p>La fiche complète : <Link href={`/bonnes-pratiques/${pratique.id}/`}>{pratique.titre}</Link>.</p>}
        <section><h2>Pourquoi ça compte</h2><p>{a.why}</p>{a.swiss_legal_ref && <p>Référence : {a.swiss_legal_ref}.</p>}</section>
        <section><h2>Signe d’alerte</h2><p>{a.warning}</p></section>
        <section><h2>Quoi faire</h2><p>{a.action}</p></section>
        {outils.length > 0 && <section><h2>Outils qui aident</h2><ul>{outils.map((o) => <li key={o.id}><Link href={`/diagnostic/catalogue/${o.id}/`}>{o.name}</Link></li>)}</ul></section>}
        {(pratique || a.learn_course_url) && <section>
          <h2>Pour aller plus loin</h2>
          <ul>
            {pratique && <li><Link href={`/bonnes-pratiques/${pratique.id}/`}>{pratique.titre}</Link></li>}
            {a.learn_course_url && <li><Link href={a.learn_course_url}>Le cours lié</Link></li>}
          </ul>
        </section>}
        <section>
          {a.sources && a.sources.length > 0 && <>
            <h2>Sources</h2>
            <ul>{a.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.titre}</a></li>)}</ul>
          </>}
          <p>Vérifié le {formaterDate(DATE_VERIFICATION)}. Cette page informe et ne remplace pas un conseil juridique.</p>
        </section>
      </article>
    </div>
  );
}
