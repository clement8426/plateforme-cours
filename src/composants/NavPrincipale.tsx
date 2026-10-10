'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Lien = { slug: string; court: string };

// Navigation par thème. Le thème où l'on se trouve est souligné, et annoncé comme tel aux lecteurs d'écran.
export default function NavPrincipale({ liens }: { liens: Lien[] }) {
  const chemin = usePathname() ?? '';
  return (
    <nav aria-label="Thèmes">
      <ul>
        {liens.map((l) => {
          const racine = `/${l.slug}/`;
          const courant = chemin === racine ? 'page' : chemin.startsWith(racine) ? 'true' : undefined;
          return (
            <li key={l.slug}>
              <Link href={racine} aria-current={courant}>{l.court}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
