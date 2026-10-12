'use client';

import Link from 'next/link';
import { useVu } from './memoire';

type Etape = { id: string; court: string; href: string };
type Props = { cle: string; titre: string; base: string; etapes: Etape[]; demos: string };

// Le bouton principal de l'accueil. Au premier passage : « Commencer ». Ensuite : « Reprendre » à la première étape pas encore vue.
export default function DemarrerCours({ cle, titre, base, etapes, demos }: Props) {
  const vu = useVu(cle);
  const suivante = etapes.find((e) => !vu.includes(e.id));
  const commence = vu.length > 0;

  let texte = `Commencer le cours ${titre}`;
  let href = base;
  if (commence && suivante) {
    texte = `Reprendre : ${suivante.court}`;
    href = suivante.href;
  } else if (commence) {
    texte = `Revoir le cours ${titre}`;
  }

  return (
    <div className="actions">
      <Link className="bouton" href={href}>{texte}</Link>
      <Link className="bouton-secondaire" href={demos}>Voir les démonstrations</Link>
    </div>
  );
}
