import type { CSSProperties } from 'react';
import Link from 'next/link';
import CopieAgent from '@/composants/CopieAgent';
import DonneesStructurees from '@/composants/DonneesStructurees';
import FilAriane from '@/composants/FilAriane';
import FioleAccueil from '@/composants/FioleAccueil';
import { CHEMIN_GUIDE, messageGuide } from '@/contenu/parcours/agent';
import { ANGLES, famille, TAXONOMIE } from '@/contenu/parcours/moteur';
import { DATE_VERIFICATION, GROUPES, PRATIQUES } from '@/contenu/parcours/pratiques';
import { AUTEUR, metadonnees, urlAbsolue } from '@/contenu/site';

const DESCRIPTION = 'Des pages courtes sur l’IA, les tests, le légal et la sécurité : le risque, un exemple, trois vérifications et des sources datées. Lisibles par ton agent IA.';

export const metadata = metadonnees({ titre: 'Bonnes pratiques', description: DESCRIPTION, chemin: '/bonnes-pratiques/', markdown: CHEMIN_GUIDE });

const COULEURS: Record<(typeof GROUPES)[number], string> = { Principe: '--vif-rose', Tester: '--vif-vert', 'Légal et éthique': '--vif-jaune', Technique: '--vif-bleu' };

export default function Page() {
  return (
    <div className="page zone-pratiques">
      <DonneesStructurees valeur={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Bonnes pratiques', description: DESCRIPTION, url: urlAbsolue('/bonnes-pratiques/'), inLanguage: 'fr-CH', dateModified: DATE_VERIFICATION, author: AUTEUR, mainEntity: { '@type': 'ItemList', itemListElement: PRATIQUES.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titre, url: urlAbsolue(`/bonnes-pratiques/${p.id}/`) })) } }} />
      <FilAriane etapes={[{ nom: 'Bonnes pratiques' }]} />
      <header className="tete">
        <h1>Bonnes pratiques</h1>
        <p className="chapeau">Comprendre le risque en quelques minutes, puis vérifier son travail, seul ou avec son agent IA.</p>
      </header>

      <section className="agent-bloc" aria-labelledby="titre-agent">
        <div>
          <h2 id="titre-agent">Fais vérifier ton projet par ton agent IA</h2>
          <p>Copie ce message dans Claude Code, Codex ou ton agent. Il lit toutes les pages du Labo et passe ton projet en revue, point par point.</p>
          <CopieAgent texte={messageGuide()} classeBouton="hero-bouton" />
          <p><a href={CHEMIN_GUIDE}>Ouvrir le guide pour agents</a></p>
        </div>
        <FioleAccueil />
      </section>

      {GROUPES.map((g) => (
        <section className="rayon" key={g} aria-labelledby={`groupe-${g}`} style={{ '--zone': `var(${COULEURS[g]})` } as CSSProperties}>
          <h2 id={`groupe-${g}`}>{g}</h2>
          <ul>
            {PRATIQUES.filter((p) => p.groupe === g).map((p) => (
              <li key={p.id}>
                <h3><Link href={`/bonnes-pratiques/${p.id}/`}>{p.titre}</Link></h3>
                <p>{p.resume}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="section" aria-labelledby="titre-angles">
        <h2 id="titre-angles" className="titre-section">Les {ANGLES.length} angles morts</h2>
        <p className="intro-section">Ce que ni l’élève ni l’IA n’anticipent. Le <Link href="/diagnostic/">diagnostic</Link> les trie pour ton projet.</p>
        <div className="familles">
          {TAXONOMIE.familles.map((f: { id: string }) => (
            <div key={f.id}>
              <h3>{famille(f.id)}</h3>
              <ul>{ANGLES.filter((a) => a.family === f.id).map((a) => <li key={a.id}><Link href={`/bonnes-pratiques/angles-morts/${a.id}/`}>{a.title}</Link></li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
