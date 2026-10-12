'use client';

import { useEffect, useState } from 'react';

// Contraste élevé : texte noir, gris foncés, bordures nettes, texte un peu plus grand.
// Pensé pour la projection en salle. Le choix reste sur l'appareil ; il est appliqué avant l'affichage (voir app/layout.tsx).
export default function BoutonContraste() {
  const [eleve, setEleve] = useState(false);
  useEffect(() => { setEleve(document.documentElement.dataset.contraste === 'eleve'); }, []);

  const basculer = () => {
    const suivant = !eleve;
    setEleve(suivant);
    document.documentElement.dataset.contraste = suivant ? 'eleve' : 'normal';
    try { localStorage.setItem('contraste', suivant ? 'eleve' : 'normal'); } catch { /* stockage indisponible */ }
  };

  return (
    <button type="button" className="bouton-contraste" aria-pressed={eleve} onClick={basculer}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" /></svg>
      Contraste élevé
    </button>
  );
}
