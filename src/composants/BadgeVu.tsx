'use client';

import { useVu } from './memoire';

// « Vue » quand la ressource a déjà été ouverte sur cet appareil.
export default function BadgeVu({ cours, etape, nom }: { cours: string; etape: string; nom: string }) {
  const vu = useVu(cours);
  if (!vu.includes(etape)) return null;
  return <p className="vu"><span className="visuellement-cache">{nom} : </span>Vue</p>;
}
