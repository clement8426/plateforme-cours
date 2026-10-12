'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BLOCS } from '@/contenu/blocs';
import type { Comparateur } from '@/contenu/comparateurs';

type Mode = 'depart' | 'repare' | 'cote';
type Cle = 'depart' | 'repare';

const MODES: { id: Mode; texte: string }[] = [
  { id: 'depart', texte: 'Version de départ' },
  { id: 'repare', texte: 'Version réparée' },
  { id: 'cote', texte: 'Côte à côte' },
];
const STYLE_ID = 'uxo-surlignage';

// Les deux formulaires sont servis par ce site (même origine) : on peut donc surligner leurs éléments depuis la page.
function preparer(doc: Document) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = '.uxo-surligne { outline: 3px solid var(--uxo-couleur, #2B44E8) !important; outline-offset: 4px !important; border-radius: 6px; box-shadow: 0 0 0 9px color-mix(in srgb, var(--uxo-couleur, #2B44E8) 20%, transparent) !important; }';
  doc.head.append(style);
}

function visible(el: Element) {
  return el.getClientRects().length > 0;
}

function surligner(cadre: HTMLIFrameElement | null, selecteurs: string[], couleur: string, defiler: boolean) {
  const doc = cadre?.contentDocument;
  if (!doc || !doc.body) return;
  preparer(doc);
  doc.querySelectorAll('.uxo-surligne').forEach((e) => e.classList.remove('uxo-surligne'));
  const trouves = selecteurs.flatMap((s) => [...doc.querySelectorAll<HTMLElement>(s)]);
  trouves.forEach((e) => {
    e.classList.add('uxo-surligne');
    e.style.setProperty('--uxo-couleur', couleur);
  });
  const premier = trouves.find(visible);
  if (defiler && premier) premier.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function effacer(cadre: HTMLIFrameElement | null) {
  cadre?.contentDocument?.querySelectorAll('.uxo-surligne').forEach((e) => e.classList.remove('uxo-surligne'));
}

export default function ComparateurFormulaire({ comparateur }: { comparateur: Comparateur }) {
  const [mode, setMode] = useState<Mode>('depart');
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [reel, setReel] = useState(false);
  const [chargements, setChargements] = useState(0);
  const [hauteurs, setHauteurs] = useState<Record<Cle, number>>({ depart: 800, repare: 1100 });
  const racine = useRef<HTMLDivElement>(null);
  const cadreDepart = useRef<HTMLIFrameElement>(null);
  const cadreRepare = useRef<HTMLIFrameElement>(null);
  const cadres: Record<Cle, React.RefObject<HTMLIFrameElement | null>> = { depart: cadreDepart, repare: cadreRepare };
  const observateurs = useRef<ResizeObserver[]>([]);

  // Lien direct : ?version=repare ou ?version=cote (utile pour une présentation).
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('version');
    if (v === 'repare' || v === 'cote' || v === 'depart') setMode(v);
  }, []);

  const visibles: Cle[] = mode === 'cote' ? ['depart', 'repare'] : [mode];

  const mesurer = useCallback((cle: Cle) => {
    const doc = cadres[cle].current?.contentDocument;
    if (!doc?.documentElement) return;
    const h = Math.ceil(doc.documentElement.scrollHeight);
    if (h > 200) setHauteurs((x) => (x[cle] === h ? x : { ...x, [cle]: h }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const surChargement = (cle: Cle) => () => {
    const fenetre = cadres[cle].current?.contentWindow as (Window & typeof globalThis) | null | undefined;
    const doc = cadres[cle].current?.contentDocument;
    if (fenetre && doc?.documentElement) {
      const observateur = new fenetre.ResizeObserver(() => mesurer(cle));
      observateur.observe(doc.documentElement);
      observateurs.current.push(observateur);
    }
    mesurer(cle);
    setChargements((n) => n + 1);
  };
  useEffect(() => () => observateurs.current.forEach((o) => o.disconnect()), []);

  // Au changement de version, on remesure (un cadre masqué n'a pas de hauteur) et on remet le surlignage.
  useEffect(() => {
    const minuteur = window.setTimeout(() => visibles.forEach(mesurer), 60);
    return () => window.clearTimeout(minuteur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Le vrai service d'adresses n'est activé qu'avec l'accord explicite de la personne (case à cocher).
  useEffect(() => {
    const fenetre = cadreRepare.current?.contentWindow as (Window & { __suggestionsReelles?: boolean }) | null | undefined;
    if (fenetre) fenetre.__suggestionsReelles = reel;
  }, [reel, chargements]);

  const couleurDe = (bloc: keyof typeof BLOCS) => {
    const nom = BLOCS[bloc].couleur.replace(/^var\(/, '').replace(/\)$/, '');
    return racine.current ? getComputedStyle(racine.current).getPropertyValue(nom).trim() || '#2B44E8' : '#2B44E8';
  };

  const appliquer = useCallback((id: string | null, defiler: boolean) => {
    const defaut = comparateur.defauts.find((d) => d.id === id);
    (['depart', 'repare'] as Cle[]).forEach((cle) => {
      if (!defaut || !visibles.includes(cle)) return effacer(cadres[cle].current);
      surligner(cadres[cle].current, defaut.cibles[cle], couleurDe(defaut.bloc), defiler && cle === visibles[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparateur, mode]);

  useEffect(() => { appliquer(ouvert, false); }, [ouvert, mode, chargements, appliquer]);

  const titres: Record<Cle, string> = { depart: 'Version de départ', repare: 'Version réparée' };

  return (
    <div className="comparateur" ref={racine}>
      <div className="comparateur-scene">
        <fieldset className="bascule">
          <legend className="visuellement-cache">Version affichée</legend>
          {MODES.map((m) => (
            <label key={m.id} className={mode === m.id ? 'est-choisi' : undefined}>
              <input type="radio" name="version" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} />
              <span>{m.texte}</span>
            </label>
          ))}
        </fieldset>
        <p className="visuellement-cache" role="status">
          {mode === 'cote' ? 'Les deux versions sont affichées côte à côte.' : `${titres[mode]} affichée.`}
        </p>

        {mode !== 'depart' && (
          <div className="consentement">
            <label>
              <input type="checkbox" checked={reel} onChange={(e) => setReel(e.target.checked)} />
              <span>Utiliser le vrai service Photon pour les suggestions d’adresse</span>
            </label>
            <p>
              Par défaut, les suggestions sont simulées dans votre navigateur (une cinquantaine de rues de Suisse romande et des grandes villes) et rien n’est envoyé. Pour chercher n’importe quelle adresse, cochez la case : ce que vous tapez dans « Rue et numéro » part alors vers photon.komoot.io, un service extérieur. Utilisez une adresse fictive.
            </p>
          </div>
        )}

        <div className={`vitrines vitrines-${mode}`}>
          {(['depart', 'repare'] as Cle[]).map((cle) => (
            <section key={cle} className={`vitrine vitrine-${cle}`} hidden={!visibles.includes(cle)} aria-label={titres[cle]}>
              <h2 className="vitrine-titre">{titres[cle]}</h2>
              <iframe
                ref={cadres[cle]}
                src={comparateur.versions[cle]}
                title={`${comparateur.titreFormulaire}, ${titres[cle].toLowerCase()}`}
                style={{ height: hauteurs[cle] }}
                onLoad={surChargement(cle)}
              />
            </section>
          ))}
        </div>

      </div>

      <aside className="comparateur-defauts" aria-labelledby="titre-defauts">
        <h2 id="titre-defauts" className="titre-section">Les défauts, un par bloc du cours</h2>
        <ol className="defauts">
          {comparateur.defauts.map((d) => {
            const estOuvert = ouvert === d.id;
            const bloc = BLOCS[d.bloc];
            return (
              <li key={d.id} className={estOuvert ? 'est-ouvert' : undefined} style={{ '--bloc': bloc.couleur } as React.CSSProperties}>
                <h3>
                  <button type="button" aria-expanded={estOuvert} aria-controls={`defaut-${d.id}`} onClick={() => setOuvert(estOuvert ? null : d.id)}>
                    <span className="defaut-bloc">{bloc.nom}</span>
                    <span className="defaut-titre">{d.titre}</span>
                  </button>
                </h3>
                <div id={`defaut-${d.id}`} className="defaut-corps" hidden={!estOuvert}>
                  <dl>
                    <div><dt>Avant</dt><dd>{d.depart}</dd></div>
                    <div><dt>Après</dt><dd>{d.repare}</dd></div>
                    <div><dt>Pourquoi</dt><dd>{d.pourquoi}</dd></div>
                    <div><dt>À essayer</dt><dd>{d.essayer}</dd></div>
                    <div className="defaut-outil"><dt>L’outil d’audit</dt><dd>{d.outil}</dd></div>
                  </dl>
                  <div className="actions">
                    <button type="button" className="bouton-secondaire" onClick={() => appliquer(d.id, true)}>Montrer dans le formulaire</button>
                    {d.lien && <a href={d.lien.url} target="_blank" rel="noreferrer">{d.lien.texte}<span className="visuellement-cache"> (s’ouvre dans un nouvel onglet)</span></a>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
