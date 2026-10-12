import { BLOCS, type BlocId } from '@/contenu/blocs';

// Les blocs du cours travaillés par une démonstration : une puce dans la couleur du bloc, puis son nom.
export default function PucesBlocs({ blocs }: { blocs: BlocId[] }) {
  const tous = blocs.length === Object.keys(BLOCS).length;
  return (
    <ul className="puces-blocs" aria-label={tous ? 'Les six blocs du cours' : 'Blocs du cours'}>
      {blocs.map((b) => (
        <li key={b} style={{ '--bloc': BLOCS[b].couleur } as React.CSSProperties}>{BLOCS[b].nom}</li>
      ))}
    </ul>
  );
}
