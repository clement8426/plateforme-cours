'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ZONES = [
  { href: '/cours/', nom: 'Cours' },
  { href: '/demarrer/', nom: 'Démarrer' },
  { href: '/entonnoir/', nom: 'Entonnoir' },
  { href: '/bonnes-pratiques/', nom: 'Bonnes pratiques' },
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
          return <li key={z.href}><Link href={z.href} aria-current={courant}>{z.nom}</Link></li>;
        })}
      </ul>
    </nav>
  );
}
