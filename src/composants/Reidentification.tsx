'use client';

import { useState } from 'react';
import { marquerVu } from './memoire';

// Bonus « Retrouver la personne en trois indices », en deux temps.
// 1. Retrouver : on clique sur les indices du compte rendu ; les habitants qui ne correspondent plus s'effacent.
// 2. Protéger : on généralise chaque indice jusqu'à ce qu'au moins cinq personnes correspondent.
// Les localités du canton de Neuchâtel sont réelles ; les personnes et les messages sont fictifs.

type Profil = { nom: string; femme: boolean; age: number; metier: string; sante: boolean; lieu: string; region: string; nouvelle?: string };

const PROFILS: Profil[] = [
  { nom: 'Sandrine Jeanneret', femme: true, age: 52, metier: 'Infirmière', sante: true, lieu: 'Fleurier', region: 'Val-de-Travers', nouvelle: 'Société de gym de Fleurier : bon rétablissement à Sandrine, opérée le 12 mars !' },
  { nom: 'Nathalie Perret', femme: true, age: 52, metier: 'Infirmière', sante: true, lieu: 'La Chaux-de-Fonds', region: 'Montagnes' },
  { nom: 'Laura Matthey', femme: true, age: 34, metier: 'Infirmière', sante: true, lieu: 'Fleurier', region: 'Val-de-Travers' },
  { nom: 'Olivier Huguenin', femme: false, age: 47, metier: 'Infirmier', sante: true, lieu: 'Couvet', region: 'Val-de-Travers' },
  { nom: 'Monique Robert', femme: true, age: 61, metier: 'Infirmière', sante: true, lieu: 'Le Locle', region: 'Montagnes' },
  { nom: 'Pierre-Alain Vuille', femme: false, age: 55, metier: 'Pharmacien', sante: true, lieu: 'Fleurier', region: 'Val-de-Travers' },
  { nom: 'Céline Ducommun', femme: true, age: 50, metier: 'Physiothérapeute', sante: true, lieu: 'Neuchâtel', region: 'Littoral' },
  { nom: 'Jean-Marc Calame', femme: false, age: 58, metier: 'Médecin', sante: true, lieu: 'La Chaux-de-Fonds', region: 'Montagnes' },
  { nom: 'Isabelle Borel', femme: true, age: 52, metier: 'Enseignante', sante: false, lieu: 'Fleurier', region: 'Val-de-Travers', nouvelle: 'Marché de Fleurier : le stand d’Isabelle et ses confitures maison.' },
  { nom: 'Thierry Gerber', femme: false, age: 49, metier: 'Garagiste', sante: false, lieu: 'Couvet', region: 'Val-de-Travers' },
  { nom: 'Chloé Favre', femme: true, age: 27, metier: 'Boulangère', sante: false, lieu: 'Le Locle', region: 'Montagnes' },
  { nom: 'Claude-Alain Jacot', femme: false, age: 63, metier: 'Agriculteur', sante: false, lieu: 'La Brévine', region: 'Montagnes' },
  { nom: 'Valérie Sandoz', femme: true, age: 52, metier: 'Comptable', sante: false, lieu: 'Neuchâtel', region: 'Littoral' },
  { nom: 'Kevin Girard', femme: false, age: 38, metier: 'Électricien', sante: false, lieu: 'Fleurier', region: 'Val-de-Travers' },
  { nom: 'Françoise Maire', femme: true, age: 44, metier: 'Secrétaire', sante: false, lieu: 'La Chaux-de-Fonds', region: 'Montagnes', nouvelle: 'Chorale : Françoise reprend la direction en avril.' },
  { nom: 'Roger Dubois', femme: false, age: 71, metier: 'Retraité', sante: false, lieu: 'Môtiers', region: 'Val-de-Travers' },
  { nom: 'Mélanie Rochat', femme: true, age: 31, metier: 'Graphiste', sante: false, lieu: 'Neuchâtel', region: 'Littoral' },
  { nom: 'Luca Rossi', femme: false, age: 56, metier: 'Menuisier', sante: false, lieu: 'Le Locle', region: 'Montagnes' },
  { nom: 'Léa Monnier', femme: true, age: 19, metier: 'Apprentie', sante: false, lieu: 'Fleurier', region: 'Val-de-Travers' },
  { nom: 'Bernard Steiner', femme: false, age: 66, metier: 'Retraité', sante: false, lieu: 'Boudry', region: 'Littoral' },
];

// Chaque indice, du plus précis au plus général.
type Niveau = { texte: string; garde: (p: Profil) => boolean };
type Indice = { id: string; nom: string; niveaux: Niveau[] };
const INDICES: Indice[] = [
  { id: 'genre', nom: 'Genre', niveaux: [
    { texte: 'La patiente', garde: (p) => p.femme },
    { texte: 'La personne', garde: () => true },
  ] },
  { id: 'metier', nom: 'Métier', niveaux: [
    { texte: 'infirmière', garde: (p) => p.metier === 'Infirmière' },
    { texte: 'qui travaille dans la santé', garde: (p) => p.sante },
  ] },
  { id: 'age', nom: 'Âge', niveaux: [
    { texte: 'de 52 ans', garde: (p) => p.age === 52 },
    { texte: 'de 50 à 54 ans', garde: (p) => p.age >= 50 && p.age <= 54 },
    { texte: 'de 45 à 60 ans', garde: (p) => p.age >= 45 && p.age <= 60 },
  ] },
  { id: 'lieu', nom: 'Localité', niveaux: [
    { texte: 'domiciliée à Fleurier', garde: (p) => p.lieu === 'Fleurier' },
    { texte: 'domiciliée au Val-de-Travers', garde: (p) => p.region === 'Val-de-Travers' },
    { texte: 'domiciliée dans le canton de Neuchâtel', garde: () => true },
  ] },
  { id: 'date', nom: 'Date', niveaux: [
    { texte: 'le 12 mars 2026', garde: (p) => Boolean(p.nouvelle?.includes('12 mars')) },
    { texte: 'au printemps 2026', garde: () => true },
  ] },
];
const SEUIL = 5; // Objectif du jeu dans cet annuaire fictif, sans garantie d’anonymat réel.

export default function Reidentification({ cours }: { cours: string }) {
  const [temps, setTemps] = useState<'retrouver' | 'proteger'>('retrouver');
  const [utilises, setUtilises] = useState<string[]>([]); // indices cliqués (temps 1)
  const [niveaux, setNiveaux] = useState<Record<string, number>>({ genre: 0, metier: 0, age: 0, lieu: 0, date: 0 }); // temps 2

  const niveau = (i: Indice) => i.niveaux[temps === 'proteger' ? niveaux[i.id] : 0];
  const actifs = temps === 'proteger' ? INDICES : INDICES.filter((i) => utilises.includes(i.id));
  const restants = PROFILS.filter((p) => actifs.every((i) => niveau(i).garde(p)));
  const trouvee = temps === 'retrouver' && restants.length === 1;
  const protegee = temps === 'proteger' && restants.length >= SEUIL;

  const utiliser = (id: string) => { if (!utilises.includes(id)) setUtilises([...utilises, id]); marquerVu(cours, 'reidentification'); };
  const passer = (t: 'retrouver' | 'proteger') => { setTemps(t); setUtilises([]); setNiveaux({ genre: 0, metier: 0, age: 0, lieu: 0, date: 0 }); };

  // Le compte rendu : chaque indice est un fragment cliquable (temps 1) ou réglable (temps 2).
  const fragment = (i: Indice) => {
    const texte = niveau(i).texte;
    if (temps === 'proteger') return <mark className="reid-fragment est-reglable">{texte}</mark>;
    const deja = utilises.includes(i.id);
    return (
      <button type="button" className={'reid-fragment' + (deja ? ' est-utilise' : '')} onClick={() => utiliser(i.id)} aria-pressed={deja} aria-label={`Indice ${i.nom.toLowerCase()} : ${texte}`}>
        {texte}
      </button>
    );
  };
  const [genre, metier, age, lieu, date] = INDICES;

  let verdict = '';
  if (temps === 'retrouver') {
    verdict = utilises.length === 0 ? 'Cliquez sur un indice du texte.' : trouvee ? `Retrouvée : ${restants[0].nom}, avec ${utilises.length} indice${utilises.length > 1 ? 's' : ''}.` : `${restants.length} personnes possibles.`;
  } else {
    verdict = protegee ? `Objectif du jeu atteint : ${restants.length} profils correspondent avec ces indices. Cela ne garantit pas l’anonymat hors de cet annuaire.` : restants.length === 1 ? `Encore reconnaissable : une seule personne, ${restants[0].nom}.` : `${restants.length} personnes possibles dans ce jeu. Visez au moins ${SEUIL}.`;
  }

  return (
    <section className="reid" aria-label="Retrouver la personne">
      <div className="reid-gauche">
        <fieldset className="bascule">
          <legend className="visuellement-cache">Étape du jeu</legend>
          <label className={temps === 'retrouver' ? 'est-choisi' : undefined}>
            <input type="radio" name="reid-temps" checked={temps === 'retrouver'} onChange={() => passer('retrouver')} />
            <span>1. Retrouver</span>
          </label>
          <label className={temps === 'proteger' ? 'est-choisi' : undefined}>
            <input type="radio" name="reid-temps" checked={temps === 'proteger'} onChange={() => passer('proteger')} />
            <span>2. Protéger</span>
          </label>
        </fieldset>

        <article className="reid-document">
          <p className="maquette-etiquette">Compte rendu, nom retiré</p>
          <p>
            {fragment(genre)}, {fragment(metier)} {fragment(age)}, {fragment(lieu)}, a été opérée du genou gauche {fragment(date)}. Elle demande la prise en charge par son assurance.
          </p>
        </article>

        {temps === 'proteger' && (
          <div className="reid-reglages">
            <p>Rendez chaque indice moins précis :</p>
            {INDICES.map((i) => (
              <div key={i.id} className="reid-reglage" role="group" aria-label={i.nom}>
                <span>{i.nom}</span>
                <div className="reid-niveaux">
                  {i.niveaux.map((n, k) => (
                    <button key={n.texte} type="button" aria-pressed={niveaux[i.id] === k} onClick={() => { setNiveaux({ ...niveaux, [i.id]: k }); marquerVu(cours, 'reidentification'); }}>{n.texte}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className={'reid-verdict' + (trouvee ? ' est-alerte' : '') + (protegee ? ' est-ok' : '')} role="status">{verdict}</p>
        <p className="note-fictif">Le seuil de cinq profils illustre une réduction de l’individualisation. D’autres données peuvent permettre des recoupements ou des déductions.</p>
        {trouvee && <button type="button" className="bouton" onClick={() => passer('proteger')}>Maintenant, protégez-la</button>}
        {temps === 'retrouver' && utilises.length > 0 && !trouvee && <button type="button" className="bouton-secondaire" onClick={() => setUtilises([])}>Recommencer</button>}
      </div>

      <div className="reid-annuaire">
        <p className="maquette-etiquette">Annuaire public, canton de Neuchâtel (personnes fictives) : {restants.length} sur {PROFILS.length} possibles</p>
        <ul>
          {PROFILS.map((p) => {
            const garde = restants.includes(p);
            return (
              <li key={p.nom} className={(garde ? '' : 'est-ecarte') + (garde && restants.length === 1 ? ' est-trouve' : '')} aria-hidden={!garde}>
                <strong>{p.nom}</strong>
                <span>{p.age} ans, {p.metier.toLowerCase()}</span>
                <span>{p.lieu}</span>
                {p.nouvelle && <em>{p.nouvelle}</em>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
