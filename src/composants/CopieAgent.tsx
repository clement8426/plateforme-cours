'use client';

import { useRef, useState } from 'react';

// Un message à coller dans son agent IA. Si la copie échoue, le texte est sélectionné.
export default function CopieAgent({ texte, classeBouton = 'bouton' }: { texte: string; classeBouton?: string }) {
  const zone = useRef<HTMLPreElement>(null);
  const [statut, setStatut] = useState('');

  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setStatut('Message copié. Colle-le dans ton agent IA.');
    } catch {
      if (zone.current) window.getSelection()?.selectAllChildren(zone.current);
      setStatut('Copie impossible : le texte est sélectionné, copie-le au clavier.');
    }
  }

  return (
    <div className="copie-agent">
      <pre ref={zone}>{texte}</pre>
      <button type="button" className={classeBouton} onClick={() => void copier()}>Copier le message</button>
      <p role="status">{statut}</p>
    </div>
  );
}
