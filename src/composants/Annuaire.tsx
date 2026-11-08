'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';

export type Ligne = [
  nom: string, depot: string, description: string, etoiles: number, dernierPush: string, archive: number, licence: string,
  usages: number[], types: number[], commande: string, adresse: string, domaine: string, references: number[],
  telechargements: number, acces: number, depotPartage: number, copies: number,
];
export type Nature = 'mcp' | 'plugins' | 'skills';
type Libelle = { id: string; label_fr: string };

const NATURES: { id: Nature; nom: string }[] = [{ id: 'mcp', nom: 'Serveurs MCP' }, { id: 'plugins', nom: 'Plugins' }, { id: 'skills', nom: 'Skills' }];
const PAR_PAGE = 60;
const ETOILES = [0, 1000, 5000, 10000, 50000];
const nombre = new Intl.NumberFormat('fr-CH');

function lien(l: Ligne) {
  if (l[1]) return `https://github.com/${l[1]}`;
  return l[11] ? `https://${l[11]}` : null;
}

function Copie({ etiquette, texte }: { etiquette: string; texte: string }) {
  const [copie, setCopie] = useState(false);
  async function copier() {
    try { await navigator.clipboard.writeText(texte); setCopie(true); } catch { setCopie(false); }
  }
  return (
    <p className="annuaire-commande">
      <span>{etiquette}</span>
      <code>{texte}</code>
      <button type="button" className="bouton-secondaire" onClick={() => void copier()}>{copie ? 'Copié' : 'Copier'}<span className="visuellement-cache"> {etiquette}</span></button>
    </p>
  );
}

// Le fichier d'une nature n'est chargé que lorsqu'on l'ouvre. La recherche reste dans la page.
export default function Annuaire({ comptes, usages, types, references, apercu }: { comptes: Record<Nature, number>; usages: Libelle[]; types: Libelle[]; references: [string, string][]; apercu: Ligne[] }) {
  const [nature, setNature] = useState<Nature>('mcp');
  const [donnees, setDonnees] = useState<Partial<Record<Nature, Ligne[]>>>({});
  const [erreur, setErreur] = useState(false);
  const [texte, setTexte] = useState('');
  const [usage, setUsage] = useState('');
  const [type, setType] = useState('');
  const [reference, setReference] = useState('');
  const [acces, setAcces] = useState('');
  const [tri, setTri] = useState('reconnaissance');
  const [etoiles, setEtoiles] = useState(0);
  const [limite, setLimite] = useState(PAR_PAGE);
  const recherche = useDeferredValue(texte.trim().toLowerCase());

  useEffect(() => {
    if (donnees[nature]) return;
    setErreur(false);
    fetch(`/annuaire/${nature}.json`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<Ligne[]>; })
      .then((l) => setDonnees((d) => ({ ...d, [nature]: l })))
      .catch(() => setErreur(true));
  }, [nature, donnees]);

  useEffect(() => { setLimite(PAR_PAGE); }, [nature, recherche, usage, type, reference, acces, tri, etoiles]);

  const charge = donnees[nature];
  const liste = useMemo(() => {
    const source = charge ?? (nature === 'mcp' ? apercu : []);
    const iu = usages.findIndex((u) => u.id === usage);
    const it = types.findIndex((t) => t.id === type);
    const ir = references.findIndex(([id]) => id === reference);
    const masque = acces === 'local' ? 1 : acces === 'enligne' ? 2 : 0;
    const filtre = source.filter((l) => l[3] >= etoiles
      && (!masque || (l[14] & masque) !== 0)
      && (ir < 0 || l[12].includes(ir))
      && (iu < 0 || l[7].includes(iu))
      && (it < 0 || l[8].includes(it))
      && (!recherche || `${l[0]} ${l[1]} ${l[2]}`.toLowerCase().includes(recherche)));
    if (tri === 'etoiles') return [...filtre].sort((a, b) => b[3] - a[3]);
    if (tri === 'recent') return [...filtre].sort((a, b) => b[4].localeCompare(a[4]));
    if (tri === 'nom') return [...filtre].sort((a, b) => a[0].localeCompare(b[0], 'fr'));
    return filtre;
  }, [charge, nature, apercu, usages, types, references, usage, type, reference, acces, recherche, tri, etoiles]);

  return (
    <>
      <div className="annuaire-onglets" role="group" aria-label="Nature des outils">
        {NATURES.map((n) => <button key={n.id} type="button" aria-pressed={nature === n.id} onClick={() => setNature(n.id)}>{n.nom}<span>{nombre.format(comptes[n.id])}</span></button>)}
      </div>
      <form className="filtres" onSubmit={(e) => e.preventDefault()}>
        <label>Rechercher<input type="search" value={texte} onChange={(e) => setTexte(e.target.value)} /></label>
        {nature === 'mcp' && <label>Accès<select value={acces} onChange={(e) => setAcces(e.target.value)}><option value="">Tous</option><option value="enligne">En ligne (cloud)</option><option value="local">En local</option></select></label>}
        <label>Référencé par<select value={reference} onChange={(e) => setReference(e.target.value)}><option value="">Tous</option>{references.map(([id, nom]) => <option key={id} value={id}>{nom}</option>)}</select></label>
        <label>Besoin<select value={usage} onChange={(e) => setUsage(e.target.value)}><option value="">Tous</option>{usages.map((u) => <option key={u.id} value={u.id}>{u.label_fr}</option>)}</select></label>
        <label>Type de projet<select value={type} onChange={(e) => setType(e.target.value)}><option value="">Tous</option>{types.map((t) => <option key={t.id} value={t.id}>{t.label_fr}</option>)}</select></label>
        <label>Étoiles GitHub<select value={etoiles} onChange={(e) => setEtoiles(Number(e.target.value))}>{ETOILES.map((n) => <option key={n} value={n}>{n ? `Au moins ${nombre.format(n)}` : 'Toutes'}</option>)}</select></label>
        <label>Trier par<select value={tri} onChange={(e) => setTri(e.target.value)}><option value="reconnaissance">Reconnaissance</option><option value="etoiles">Étoiles</option><option value="recent">Activité récente</option><option value="nom">Nom</option></select></label>
      </form>
      <p role="status" aria-live="polite">{erreur ? 'Chargement impossible : recharge la page.' : charge ? `${nombre.format(liste.length)} résultat${liste.length > 1 ? 's' : ''}` : 'Chargement de la liste complète…'}</p>
      <h2 className="visuellement-cache">Résultats</h2>
      <ul className="annuaire-liste">
        {liste.slice(0, limite).map((l) => {
          const adresse = lien(l);
          return (
            <li key={`${l[1]}#${l[0]}#${l[10]}`}>
              <h3>{adresse ? <a href={adresse} target="_blank" rel="noreferrer nofollow">{l[0]}<span className="visuellement-cache"> (nouvel onglet)</span></a> : l[0]}</h3>
              {l[2] && <p>{l[2]}</p>}
              <p className="annuaire-meta">
                {nature === 'mcp' && (l[14] & 2) !== 0 && <span className="annuaire-badge">En ligne</span>}
                {nature === 'mcp' && (l[14] & 1) !== 0 && <span className="annuaire-badge">En local</span>}
                {l[12].length > 0 && <strong>{`Référencé par ${l[12].map((i) => references[i]?.[1]).filter(Boolean).join(', ')}`}</strong>}
                {l[3] > 0 && <span>{nombre.format(l[3])} étoiles</span>}
                {l[15] === 1 && l[1] && <span>Dépôt partagé</span>}
                {l[1] && <span>{l[1]}</span>}
                {l[11] && <span>Domaine vérifié : {l[11]}</span>}
                {l[6] && l[6] !== 'NOASSERTION' && <span>{l[6]}</span>}
                {l[4] && <span>Actif le {l[4]}</span>}
                {l[16] > 1 && <span>{l[16]} copies regroupées</span>}
              </p>
              {l[10] && <Copie etiquette="Adresse en ligne" texte={l[10]} />}
              {l[9] && <Copie etiquette="Commande locale" texte={l[9]} />}
            </li>
          );
        })}
      </ul>
      {liste.length > limite && <button type="button" className="bouton-secondaire annuaire-plus" onClick={() => setLimite((n) => n + PAR_PAGE)}>Afficher {PAR_PAGE} de plus</button>}
    </>
  );
}
