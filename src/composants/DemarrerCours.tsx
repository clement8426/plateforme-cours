'use client';

import Link from 'next/link';
import { useVu } from './memoire';

type Etape = { id: string; court: string; href: string; interne: boolean };
type Props = { cle: string; titre: string; base: string; etapes: Etape[] };

// Le bouton principal de l'accueil. Au premier passage : « Commencer ». Ensuite : « Reprendre » à la première étape pas encore vue.
export default function DemarrerCours({ cle, titre, base, etapes }: Props) {
  const vu = useVu(cle);
  const suivante = etapes.find((e) => !vu.includes(e.id));
  const commence = vu.length > 0;

  let texte = `Commencer le cours ${titre}`;
  let href = base;
  let interne = true;
  if (commence && suivante) {
    texte = `Reprendre : ${suivante.court}`;
    href = suivante.href;
    interne = suivante.interne;
  } else if (commence) {
    texte = `Revoir le cours ${titre}`;
  }

  return (
    <div className="demarrer">
      {interne ? <Link className="bouton" href={href}>{texte}</Link> : <a className="bouton" href={href}>{texte}</a>}
      <a className="bouton-secondaire" href="/tilleul/">Voir Tilleul tout de suite</a>
    </div>
  );
}
