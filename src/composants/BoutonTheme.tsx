'use client';

import { useEffect, useState } from 'react';

// Le site s'affiche en clair. Le mode sombre est un choix, gardé sur l'appareil ; il est appliqué avant l'affichage (voir app/layout.tsx).
export default function BoutonTheme() {
  const [sombre, setSombre] = useState(false);
  useEffect(() => { setSombre(document.documentElement.dataset.theme === 'sombre'); }, []);

  const basculer = () => {
    const suivant = !sombre;
    setSombre(suivant);
    if (suivant) document.documentElement.dataset.theme = 'sombre';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('theme', suivant ? 'sombre' : 'clair'); } catch { /* stockage indisponible */ }
  };

  return (
    <button type="button" className="bouton-contraste" aria-pressed={sombre} onClick={basculer}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path className="lune" d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
      Mode sombre
    </button>
  );
}
