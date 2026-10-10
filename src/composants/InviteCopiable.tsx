'use client';

import { useRef, useState } from 'react';

type Etat = 'repos' | 'copie' | 'selectionne';

// Une invite à donner à l'assistant IA. Un bouton la copie ; si le navigateur refuse la copie,
// le texte est sélectionné pour qu'on puisse le copier à la main (Ctrl + C).
export default function InviteCopiable({ titre, texte }: { titre: string; texte: string }) {
  const [etat, setEtat] = useState<Etat>('repos');
  const zone = useRef<HTMLParagraphElement>(null);

  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setEtat('copie');
    } catch {
      const selection = window.getSelection();
      if (zone.current && selection) {
        const plage = document.createRange();
        plage.selectNodeContents(zone.current);
        selection.removeAllRanges();
        selection.addRange(plage);
      }
      setEtat('selectionne');
    }
    window.setTimeout(() => setEtat('repos'), 3000);
  }

  return (
    <figure className="invite">
      <figcaption>{titre}</figcaption>
      <blockquote><p ref={zone}>{texte}</p></blockquote>
      <button type="button" className="bouton-secondaire" onClick={copier}>
        {etat === 'copie' ? 'Invite copiée' : 'Copier l’invite'}
      </button>
      <p className="visuellement-cache" role="status">
        {etat === 'copie' ? 'Invite copiée dans le presse-papiers.' : etat === 'selectionne' ? 'Texte sélectionné : copiez-le avec Ctrl + C.' : ''}
      </p>
      {etat === 'selectionne' && <p className="invite-aide" aria-hidden="true">Texte sélectionné : copiez-le avec Ctrl + C.</p>}
    </figure>
  );
}
