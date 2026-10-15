'use client';

import { useEffect, useRef, useState } from 'react';
import { marquerVu } from './memoire';

type Version = 'a' | 'b';
type Phase = 'pret' | 'decompte' | 'montre' | 'cache' | 'revele';

const DUREE = 3000; // le temps d'un coup d'œil
const VERSIONS: { id: Version; texte: string }[] = [
  { id: 'a', texte: 'Affiche A : tout dire' },
  { id: 'b', texte: 'Affiche B : l’essentiel' },
];

// Les trois informations à retenir sont marquées par data-info : elles s'entourent à la révélation.
function AfficheA({ revele }: { revele: boolean }) {
  const m = (info: string) => (revele ? { className: 'marque-info', 'data-info': info } : {});
  return (
    <div className="affiche affiche-a">
      <p className="ruban">8e ÉDITION !!!</p>
      <p className="titre-a">La Grande Soupe d’automne des Marmites de Serrières</p>
      <p>Vingt cuisiniers amateurs et trois restaurants du quartier : une soupe chacun, dont une végétarienne !</p>
      <div className="collage" aria-hidden="true"><i /><i /><i /></div>
      <p {...m('Quoi')}>Dégustation de soupes et vote du public pour le Grand Chaudron d’or</p>
      <p {...m('Quand')}>Le samedi 24 octobre 2026, de 11 h à 20 h</p>
      <p {...m('Où')}>À la Halle du Moulin, chemin du Moulin 6, 2003 Neuchâtel (Serrières)</p>
      <p>Entrée libre – 5 jetons = 10 CHF – Concert à 18 h – Bus 1</p>
      <p className="bandeau">Instagram @marmites.serrieres – #GrandeSoupe2026</p>
    </div>
  );
}

function AfficheB({ revele }: { revele: boolean }) {
  const m = (info: string, classe = '') => (revele ? { className: `${classe} marque-info`.trim(), 'data-info': info } : { className: classe || undefined });
  return (
    <div className="affiche affiche-b">
      <p className="marque-b">Les Marmites de Serrières</p>
      <div {...m('Quoi', 'centre')}>
        <p className="chiffre">Soupe !</p>
        <p className="quoi">La grande dégustation d’automne. Entrée libre.</p>
      </div>
      <div className="bas">
        <p {...m('Quand', 'quand')}>Samedi 24 octobre, <span className="insecable">11 h – 20 h</span></p>
        <p {...m('Où', 'ou')}>Halle du Moulin, Serrières, Neuchâtel</p>
      </div>
    </div>
  );
}

// Le test des 3 secondes : l'affiche apparaît le temps d'un coup d'œil, puis la salle dit ce qu'elle a retenu.
export default function AfficheTest({ cours }: { cours: string }) {
  const [version, setVersion] = useState<Version>('a');
  const [phase, setPhase] = useState<Phase>('pret');
  const [compte, setCompte] = useState(3);
  const barre = useRef<HTMLElement>(null);

  useEffect(() => {
    if (phase === 'decompte') {
      if (compte === 0) { setPhase('montre'); return; }
      const t = window.setTimeout(() => setCompte((c) => c - 1), 700);
      return () => window.clearTimeout(t);
    }
    if (phase === 'montre') {
      const el = barre.current;
      if (el) {
        el.style.transition = 'none';
        el.style.transform = 'scaleX(1)';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          el.style.transition = `transform ${DUREE}ms linear`;
          el.style.transform = 'scaleX(0)';
        }));
      }
      const t = window.setTimeout(() => setPhase('cache'), DUREE);
      return () => window.clearTimeout(t);
    }
  }, [phase, compte]);

  const lancer = () => { setCompte(3); setPhase('decompte'); marquerVu(cours, 'affiche'); };
  const choisir = (v: Version) => { setVersion(v); setPhase('pret'); };

  const consignes: Record<Phase, string> = {
    pret: 'Personne ne regarde l’affiche avant le test. Lancez-le quand vous voulez.',
    decompte: 'Regardez bien…',
    montre: 'Mémorisez ce que vous pouvez.',
    cache: 'Qu’avez-vous retenu ? Quoi, quand, où ?',
    revele: version === 'a' ? 'Tout y était, mais rien ne ressortait.' : 'Une chose en très grand, puis deux. Rien d’autre.',
  };
  const visible = phase === 'montre' || phase === 'revele';

  return (
    <section className="affiche-test" aria-label="Le test des 3 secondes">
      <div className="affiche-commandes">
        <fieldset className="bascule">
          <legend className="visuellement-cache">Affiche à tester</legend>
          {VERSIONS.map((v) => (
            <label key={v.id} className={version === v.id ? 'est-choisi' : undefined}>
              <input type="radio" name="affiche" value={v.id} checked={version === v.id} onChange={() => choisir(v.id)} />
              <span>{v.texte}</span>
            </label>
          ))}
        </fieldset>
        <p className="consigne" role="status">{consignes[phase]}</p>
        {phase === 'decompte' && <p className="compteur" aria-hidden="true">{compte || ''}</p>}
        {phase === 'montre' && <div className="barre-temps" aria-hidden="true"><i ref={barre} /></div>}
        <div className="actions">
          {(phase === 'pret' || phase === 'revele') && <button type="button" className="bouton" onClick={lancer}>{phase === 'pret' ? 'Lancer le test, 3 secondes' : 'Refaire le test'}</button>}
          {phase === 'cache' && <button type="button" className="bouton" onClick={() => setPhase('revele')}>Révéler l’affiche</button>}
          {phase === 'cache' && <button type="button" className="bouton-secondaire" onClick={lancer}>Remontrer 3 secondes</button>}
          {phase === 'revele' && version === 'a' && <button type="button" className="bouton-secondaire" onClick={() => choisir('b')}>Passer à l’affiche B</button>}
        </div>
      </div>
      <div className="affiche-cadre">
        {visible ? (version === 'a' ? <AfficheA revele={phase === 'revele'} /> : <AfficheB revele={phase === 'revele'} />) : (
          <p className="affiche-cache">{phase === 'cache' ? 'Affiche cachée' : 'L’affiche apparaîtra ici pendant 3 secondes.'}</p>
        )}
      </div>
    </section>
  );
}
