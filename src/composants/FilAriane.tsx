import Link from 'next/link';

export type Etape = { nom: string; href?: string };

export default function FilAriane({ etapes }: { etapes: Etape[] }) {
  return (
    <nav className="fil" aria-label="Fil d’Ariane">
      <ol>
        <li><Link href="/">Accueil</Link></li>
        {etapes.map((e) => (
          <li key={e.nom}>{e.href ? <Link href={e.href}>{e.nom}</Link> : <span aria-current="page">{e.nom}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}
