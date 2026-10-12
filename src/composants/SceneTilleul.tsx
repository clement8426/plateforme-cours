'use client';

import { useState } from 'react';
import { marquerVu } from './memoire';

const MODES = [
  { id: 'sans', texte: 'Sans aide', href: '/tilleul/?cours=non' },
  { id: 'cours', texte: 'Mode cours', href: '/tilleul/' },
] as const;

// La boutique Tilleul dans un cadre, avec un interrupteur : sans aide (le parcours du client), ou mode cours (la révélation).
export default function SceneTilleul({ cours }: { cours: string }) {
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('sans');
  const courant = MODES.find((m) => m.id === mode)!;
  return (
    <section aria-label="Tilleul, la boutique">
      <div className="scene-barre">
        <fieldset className="bascule">
          <legend className="visuellement-cache">Affichage de Tilleul</legend>
          {MODES.map((m) => (
            <label key={m.id} className={mode === m.id ? 'est-choisi' : undefined}>
              <input type="radio" name="mode-tilleul" value={m.id} checked={mode === m.id} onChange={() => { setMode(m.id); marquerVu(cours, 'tilleul'); }} />
              <span>{m.texte}</span>
            </label>
          ))}
        </fieldset>
        <a className="lien-fleche" href={courant.href} target="_blank" rel="noreferrer">
          Ouvrir dans un onglet<span className="visuellement-cache"> (nouvel onglet)</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
        </a>
      </div>
      <iframe key={courant.href} className="cadre-site" src={courant.href} title={`Tilleul, ${courant.texte.toLowerCase()}`} />
    </section>
  );
}
