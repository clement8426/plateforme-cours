'use client';

import Link from 'next/link';
import { marquerVu, useVu } from './memoire';

export type EtapeParcours = {
  id: string;
  titre: string;
  description: string;
  href: string;
  interne: boolean;
  apercu?: string;
  bandeau?: boolean; // l'unique étape sur fond sombre : celle qu'on veut mettre en avant
  details?: (string | { texte: string; href: string })[];
};

// Le parcours conseillé d'un cours : une vraie séquence, donc numérotée. Les étapes déjà ouvertes sont marquées « Vue ».
export default function ParcoursCours({ cle, etapes }: { cle: string; etapes: EtapeParcours[] }) {
  const vu = useVu(cle);
  return (
    <ol className="parcours">
      {etapes.map((e) => {
        const fait = vu.includes(e.id);
        return (
          <li key={e.id} className={`etape${e.bandeau ? ' est-bandeau' : ''}${e.apercu ? '' : ' est-compacte'}`}>
            {e.apercu && (
              <div className="etape-image">
                <img src={e.apercu} alt="" width={1440} height={810} loading="lazy" />
              </div>
            )}
            <div className="etape-texte">
              <h3>
                {e.interne ? (
                  <Link href={e.href}>{e.titre}</Link>
                ) : (
                  <a href={e.href} onClick={() => marquerVu(cle, e.id)} onAuxClick={() => marquerVu(cle, e.id)}>{e.titre}</a>
                )}
              </h3>
              {fait && <p className="vu"><span className="visuellement-cache">Étape </span>Vue</p>}
              <p className="etape-description">{e.description}</p>
              {e.details && (
                <ul className="etape-details">
                  {e.details.map((d) => (typeof d === 'string' ? <li key={d}>{d}</li> : <li key={d.href}><Link href={d.href} className="lien-detail">{d.texte}</Link></li>))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
