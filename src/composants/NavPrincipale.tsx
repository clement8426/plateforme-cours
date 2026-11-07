'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';

const ZONES = [
  { href: '/cours/', nom: 'Cours', couleur: '--vif-rose' },
  { href: '/demarrer/', nom: 'Démarrer', couleur: '--vif-vert' },
  { href: '/diagnostic/', nom: 'Diagnostic', couleur: '--vif-jaune' },
  { href: '/bonnes-pratiques/', nom: 'Bonnes pratiques', couleur: '--vif-violet' },
];

// Les quatre zones du site. Les pages d'un thème appartiennent à la zone Cours, annoncée comme courante.
export default function NavPrincipale({ themes }: { themes: string[] }) {
  const chemin = usePathname() ?? '';
  const dansCours = themes.some((t) => chemin.startsWith(`/${t}/`));
  return (
    <nav aria-label="Zones du site">
      <ul>
        {ZONES.map((z) => {
          const courant = chemin === z.href ? 'page' : chemin.startsWith(z.href) || (z.href === '/cours/' && dansCours) ? 'true' : undefined;
          return <li key={z.href}><Link href={z.href} aria-current={courant} style={{ '--zone': `var(${z.couleur})` } as CSSProperties}>{z.nom}</Link></li>;
        })}
      </ul>
    </nav>
  );
}
