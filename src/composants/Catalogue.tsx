'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { KINDS, NIVEAUX, OUTILS, TAXONOMIE } from '@/contenu/parcours/moteur';

// Filtres du catalogue. Ils restent dans la page : aucune recherche ne part vers un serveur.
export default function Catalogue() {
  const [nature, setNature] = useState('');
  const [type, setType] = useState('');
  const [niveau, setNiveau] = useState('');
  const [texte, setTexte] = useState('');
  const liste = useMemo(() => OUTILS.filter((o) => (!nature || o.kind === nature) && (!type || o.project_types.includes(type)) && (!niveau || o.level === niveau) && (!texte || `${o.name} ${o.description}`.toLowerCase().includes(texte.toLowerCase()))), [nature, type, niveau, texte]);

  if (!OUTILS.length) return <p className="fiche-ephemere">Le catalogue est en cours de validation : chaque outil est relu à la main avant d’être publié.</p>;
  return (
    <>
      <form className="filtres" onSubmit={(e) => e.preventDefault()}>
        <label>Rechercher<input type="search" value={texte} onChange={(e) => setTexte(e.target.value)} /></label>
        <label>Nature<select value={nature} onChange={(e) => setNature(e.target.value)}><option value="">Toutes</option>{Object.entries(KINDS).map(([id, nom]) => <option key={id} value={id}>{nom}</option>)}</select></label>
        <label>Type de projet<select value={type} onChange={(e) => setType(e.target.value)}><option value="">Tous</option>{TAXONOMIE.types.map((t) => <option key={t.id} value={t.id}>{t.label_fr}</option>)}</select></label>
        <label>Niveau<select value={niveau} onChange={(e) => setNiveau(e.target.value)}><option value="">Tous</option>{Object.entries(NIVEAUX).map(([id, nom]) => <option key={id} value={id}>{nom}</option>)}</select></label>
      </form>
      <p role="status" aria-live="polite">{liste.length} outil{liste.length > 1 ? 's' : ''}</p>
      <ul className="outils-liste">
        {liste.map((o) => <li key={o.id} className="outil-carte"><h3><Link href={`/diagnostic/catalogue/${o.id}/`}>{o.name}</Link></h3><p>{KINDS[o.kind]} · {NIVEAUX[o.level]}</p><p>{o.description}</p></li>)}
      </ul>
    </>
  );
}
