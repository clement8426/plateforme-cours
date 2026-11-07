import Link from 'next/link';
import FilAriane from '@/composants/FilAriane';
import { ANGLES, famille, TAXONOMIE } from '@/contenu/parcours/moteur';
import { PRATIQUES } from '@/contenu/parcours/pratiques';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Bonnes pratiques', description: 'Des pages courtes sur l’IA, le légal et la sécurité : le risque, un exemple, trois vérifications et des sources datées.', chemin: '/bonnes-pratiques/' });

const GROUPES = ['Principe', 'Légal et éthique', 'Technique'] as const;

export default function Page() {
  return (
    <div className="page zone-pratiques">
      <FilAriane etapes={[{ nom: 'Bonnes pratiques' }]} />
      <header className="tete">
        <h1>Bonnes pratiques</h1>
        <p className="chapeau">Comprendre le risque en quelques minutes, puis vérifier son travail, seul ou avec son agent IA.</p>
      </header>
      {GROUPES.map((g) => (
        <section className="section-theme" key={g} aria-labelledby={`groupe-${g}`}>
          <h2 id={`groupe-${g}`} className="titre-section">{g}</h2>
          <ul className="outils-liste etapes-parcours">
            {PRATIQUES.filter((p) => p.groupe === g).map((p) => <li key={p.id} className="outil-carte"><h3><Link href={`/bonnes-pratiques/${p.id}/`}>{p.titre}</Link></h3><p>{p.resume}</p></li>)}
          </ul>
        </section>
      ))}
      <section className="section" aria-labelledby="titre-angles">
        <h2 id="titre-angles" className="titre-section">Les {ANGLES.length} angles morts</h2>
        <p className="intro-section">Ce que ni l’élève ni l’IA n’anticipent. Le <Link href="/diagnostic/">diagnostic</Link> les trie pour ton projet.</p>
        {TAXONOMIE.familles.map((f) => (
          <details className="plan-plus" key={f.id}>
            <summary>{famille(f.id)}</summary>
            <ul>{ANGLES.filter((a) => a.family === f.id).map((a) => <li key={a.id}><Link href={`/bonnes-pratiques/angles-morts/${a.id}/`}>{a.title}</Link></li>)}</ul>
          </details>
        ))}
      </section>
    </div>
  );
}
