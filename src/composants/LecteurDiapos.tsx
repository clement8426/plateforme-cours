'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = { href: string; titre: string; parties?: { titre: string; diapo: number }[] };

// Lecteur de diapos. Le plein écran s'applique à toute la scène (diapos + bouton « Quitter »), pas à l'iframe seule :
// le bouton reste donc visible. Sur les navigateurs sans plein écran (iPhone), un mode « théâtre » plein cadre prend le relais.
export default function LecteurDiapos({ href, titre, parties = [] }: Props) {
  const scene = useRef<HTMLDivElement>(null);
  const cadre = useRef<HTMLIFrameElement>(null);
  const declencheur = useRef<HTMLButtonElement>(null);
  const [plein, setPlein] = useState(false); // plein écran natif
  const [theatre, setTheatre] = useState(false); // repli sans API plein écran
  const actif = plein || theatre;
  const [source, setSource] = useState(href);

  // Lien direct vers une diapo : ?diapo=22 ouvre la présentation à la diapo 22.
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get('diapo'));
    if (Number.isInteger(n) && n > 1) setSource(`${href}#${n}`);
  }, [href]);
  const allerA = (n: number) => {
    setSource(`${href}#${n}`);
    const url = new URL(window.location.href);
    url.searchParams.set('diapo', String(n));
    window.history.replaceState(null, '', url);
    cadre.current?.focus();
  };

  const entrer = useCallback(async () => {
    const el = scene.current;
    if (!el) return;
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        cadre.current?.contentWindow?.focus();
        return;
      } catch {
        /* refusé par le navigateur : on bascule sur le mode théâtre */
      }
    }
    setTheatre(true);
    cadre.current?.contentWindow?.focus();
  }, []);

  const sortir = useCallback(async () => {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch { /* déjà sorti */ }
    }
    setTheatre(false);
  }, []);

  // En plein cadre, les commandes et les liens de la page derrière restent hors du parcours clavier.
  const etaitActif = useRef(false);
  useEffect(() => {
    if (!actif || !scene.current) {
      if (etaitActif.current) declencheur.current?.focus();
      etaitActif.current = false;
      return;
    }
    etaitActif.current = true;
    const modifies: { element: HTMLElement; inert: boolean }[] = [];
    let element: HTMLElement = scene.current;
    while (element.parentElement) {
      for (const voisin of element.parentElement.children) {
        if (voisin !== element && voisin instanceof HTMLElement) {
          modifies.push({ element: voisin, inert: voisin.inert }); voisin.inert = true;
        }
      }
      element = element.parentElement;
      if (element === document.body) break;
    }
    const ciblesDuCadre = () => {
      const doc = cadre.current?.contentDocument;
      return doc ? [...doc.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')].filter(el => el.tabIndex >= 0 && !el.matches(':disabled') && !el.closest('[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden') : [];
    };
    const surTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || document.activeElement !== scene.current?.querySelector('.quitter-plein')) return;
      const cibles = ciblesDuCadre();
      e.preventDefault();
      if (cibles.length) cibles[e.shiftKey ? cibles.length - 1 : 0].focus();
      else cadre.current?.focus();
    };
    document.addEventListener('keydown', surTab);
    const doc = cadre.current?.contentDocument;
    const surTabCadre = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !doc) return;
      const cibles = ciblesDuCadre();
      if ((!e.shiftKey && doc.activeElement === cibles.at(-1)) || (e.shiftKey && doc.activeElement === cibles[0])) {
        e.preventDefault(); scene.current?.querySelector<HTMLButtonElement>('.quitter-plein')?.focus();
      }
    };
    doc?.addEventListener('keydown', surTabCadre, true);
    return () => { modifies.forEach(v => { v.element.inert = v.inert; }); document.removeEventListener('keydown', surTab); doc?.removeEventListener('keydown', surTabCadre, true); };
  }, [actif]);

  const basculer = useCallback(() => (actif ? sortir() : entrer()), [actif, entrer, sortir]);

  useEffect(() => {
    const surChangement = () => setPlein(document.fullscreenElement === scene.current);
    document.addEventListener('fullscreenchange', surChangement);
    return () => document.removeEventListener('fullscreenchange', surChangement);
  }, []);

  // Échap sort du mode théâtre (le plein écran natif est déjà géré par le navigateur).
  useEffect(() => {
    if (!theatre) return;
    const surTouche = (e: KeyboardEvent) => { if (e.key === 'Escape') sortir(); };
    window.addEventListener('keydown', surTouche);
    document.documentElement.classList.add('theatre');
    return () => {
      window.removeEventListener('keydown', surTouche);
      document.documentElement.classList.remove('theatre');
    };
  }, [theatre, sortir]);

  // Messages venant des diapos : F (plein écran) et Échap (quitter), voir scripts/integrer-diapos.mjs.
  useEffect(() => {
    const surMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== cadre.current?.contentWindow) return;
      if (e.data?.type === 'diapos:plein-ecran') basculer();
      else if (e.data?.type === 'diapos:quitter' && actif) sortir();
    };
    window.addEventListener('message', surMessage);
    return () => window.removeEventListener('message', surMessage);
  }, [actif, basculer, sortir]);

  return (
    <>
      <div className="scene-barre">
        {parties.length > 0 && (
          <nav className="saut-diapos" aria-label="Aller à une partie">
            <ul>
              {parties.map((p, i) => (
                <li key={p.titre}><a href={`?diapo=${p.diapo}`} onClick={(e) => { e.preventDefault(); allerA(p.diapo); }}>{i + 1}. {p.titre}</a></li>
              ))}
            </ul>
          </nav>
        )}
      <div className="actions">
        <button ref={declencheur} type="button" className="bouton" onClick={basculer} aria-pressed={actif}>
          Plein écran
        </button>
        <a className="bouton-secondaire" href={`${href}?lecture=1`}>Lire la version texte</a>
        <a className="bouton-secondaire" href={source} target="_blank" rel="noreferrer">Ouvrir dans un onglet<span className="visuellement-cache"> (nouvel onglet)</span></a>
      </div>
      </div>
      <div ref={scene} className={`lecteur${theatre ? ' est-theatre' : ''}`} role={actif ? 'dialog' : undefined} aria-modal={actif || undefined} aria-label={actif ? `Présentation : ${titre}` : undefined}>
        <iframe ref={cadre} className="cadre-diapos" src={source} title={`Diapos du cours ${titre}`} />
        {actif && (
          <button type="button" className="quitter-plein" onClick={sortir}>
            Quitter le plein écran <kbd>Échap</kbd>
          </button>
        )}
      </div>
      <p className="astuce">Cliquez dans les diapos, puis avancez avec les flèches. La touche F met en plein écran, Échap en sort.</p>
    </>
  );
}
