'use client';

import { useEffect, useState } from 'react';

// Mémoire de progression. Elle reste dans le navigateur de la personne (localStorage) :
// pas de compte, rien n'est envoyé nulle part. Si le stockage est bloqué (navigation privée), le site marche sans.
const cle = (cours: string) => `vu:${cours}`;

export function lireVu(cours: string): string[] {
  try {
    const valeur = JSON.parse(localStorage.getItem(cle(cours)) ?? '[]');
    return Array.isArray(valeur) ? valeur.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function marquerVu(cours: string, etape: string) {
  try {
    localStorage.setItem(cle(cours), JSON.stringify([...new Set([...lireVu(cours), etape])]));
    window.dispatchEvent(new Event('progression'));
  } catch {
    /* stockage indisponible : on ne mémorise pas */
  }
}

// Étapes déjà consultées. Vide au premier rendu (identique côté serveur), puis lu une fois la page affichée.
export function useVu(cours: string) {
  const [vu, setVu] = useState<string[]>([]);
  useEffect(() => {
    const lire = () => setVu(lireVu(cours));
    lire();
    window.addEventListener('progression', lire);
    window.addEventListener('storage', lire);
    return () => {
      window.removeEventListener('progression', lire);
      window.removeEventListener('storage', lire);
    };
  }, [cours]);
  return vu;
}
