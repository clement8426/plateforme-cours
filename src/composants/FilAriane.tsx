import Link from 'next/link';
import DonneesStructurees from './DonneesStructurees';
import { urlAbsolue } from '@/contenu/site';

export type Etape = { nom: string; href?: string };

export default function FilAriane({ etapes }: { etapes: Etape[] }) {
  return (
    <nav className="fil" aria-label="Fil d’Ariane">
      <DonneesStructurees valeur={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ nom: 'Accueil', href: '/' }, ...etapes].map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.nom, ...(e.href ? { item: urlAbsolue(e.href) } : {}) })) }} />
      <ol>
        <li><Link href="/">Accueil</Link></li>
        {etapes.map((e) => (
          <li key={e.nom}>{e.href ? <Link href={e.href}>{e.nom}</Link> : <span aria-current="page">{e.nom}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}
