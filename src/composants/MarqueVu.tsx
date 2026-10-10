'use client';

import { useEffect } from 'react';
import { marquerVu } from './memoire';

// À poser dans une page de ressource : elle est notée « vue » dès qu'on l'ouvre.
export default function MarqueVu({ cours, etape }: { cours: string; etape: string }) {
  useEffect(() => marquerVu(cours, etape), [cours, etape]);
  return null;
}
