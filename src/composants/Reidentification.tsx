'use client';

import { useState } from 'react';
import { marquerVu } from './memoire';

// Bonus « Retrouver la personne en trois indices », en deux temps.
// 1. Retrouver : on clique sur les indices du compte rendu ; les habitants qui ne correspondent plus s'effacent.
// 2. Protéger : on généralise chaque indice jusqu'à ce qu'au moins cinq personnes correspondent.
// Tout est fictif : la vallée, les localités, les personnes.

type Profil = { nom: string; age: number; metier: string; sante: boolean; lieu: string; nouvelle?: string };

const PROFILS: Profil[] = [
  { nom: 'Martine Exemple', age: 52, metier: 'Infirmière', sante: true, lieu: 'Les Combes', nouvelle: 'Club de gym : bon rétablissement à Martine, opérée le 12 mars !' },
  { nom: 'Sophie Témoin', age: 52, metier: 'Infirmière', sante: true, lieu: 'Val-Fictif' },
  { nom: 'Claire Modèle', age: 34, metier: 'Infirmière', sante: true, lieu: 'Les Combes' },
  { nom: 'Luc Dupré', age: 47, metier: 'Infirmier', sante: true, lieu: 'Saint-Exemple' },
  { nom: 'Anne Fictive', age: 61, metier: 'Infirmière', sante: true, lieu: 'Val-Fictif' },
  { nom: 'Paul Essai', age: 55, metier: 'Pharmacien', sante: true, lieu: 'Les Combes' },
  { nom: 'Nora Brouillon', age: 50, metier: 'Physiothérapeute', sante: true, lieu: 'Saint-Exemple' },
  { nom: 'Yves Esquisse', age: 58, metier: 'Médecin', sante: true, lieu: 'Val-Fictif' },
  { nom: 'Julie Maquette', age: 52, metier: 'Enseignante', sante: false, lieu: 'Les Combes', nouvelle: 'Marché du samedi : stand de Julie, confitures maison.' },
  { nom: 'Marc Prototype', age: 49, metier: 'Garagiste', sante: false, lieu: 'Les Combes' },
  { nom: 'Lina Croquis', age: 27, metier: 'Boulangère', sante: false, lieu: 'Val-Fictif' },
  { nom: 'Hugo Ébauche', age: 63, metier: 'Agriculteur', sante: false, lieu: 'Saint-Exemple' },
  { nom: 'Eva Gabarit', age: 52, metier: 'Comptable', sante: false, lieu: 'Saint-Exemple' },
  { nom: 'Tom Patron', age: 38, metier: 'Électricien', sante: false, lieu: 'Les Combes' },
  { nom: 'Rita Spécimen', age: 44, metier: 'Secrétaire', sante: false, lieu: 'Val-Fictif', nouvelle: 'Chorale : Rita reprend la direction en avril.' },
  { nom: 'Jean Calque', age: 71, metier: 'Retraité', sante: false, lieu: 'Les Combes' },
  { nom: 'Inès Trame', age: 31, metier: 'Graphiste', sante: false, lieu: 'Saint-Exemple' },
  { nom: 'Omar Canevas', age: 56, metier: 'Menuisier', sante: false, lieu: 'Val-Fictif' },
  { nom: 'Léa Pochoir', age: 19, metier: 'Apprentie', sante: false, lieu: 'Les Combes' },
  { nom: 'Bruno Moule', age: 66, metier: 'Retraité', sante: false, lieu: 'Saint-Exemple' },
];

// Chaque indice, du plus précis au plus général.
type Niveau = { texte: string; garde: (p: Profil) => boolean };
type Indice = { id: string; nom: string; niveaux: Niveau[] };
const INDICES: Indice[] = [
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
    { texte: 'domiciliée aux Combes', garde: (p) => p.lieu === 'Les Combes' },
    { texte: 'domiciliée dans la vallée', garde: () => true },
  ] },
  { id: 'date', nom: 'Date', niveaux: [
    { texte: 'le 12 mars 2026', garde: (p) => Boolean(p.nouvelle?.includes('12 mars')) },
    { texte: 'au printemps 2026', garde: () => true },
  ] },
];
const SEUIL = 5; // au moins cinq personnes possibles : on ne peut plus savoir qui c'est

export default function Reidentification({ cours }: { cours: string }) {
  const [temps, setTemps] = useState<'retrouver' | 'proteger'>('retrouver');
  const [utilises, setUtilises] = useState<string[]>([]); // indices cliqués (temps 1)
  const [niveaux, setNiveaux] = useState<Record<string, number>>({ metier: 0, age: 0, lieu: 0, date: 0 }); // temps 2

  const niveau = (i: Indice) => i.niveaux[temps === 'proteger' ? niveaux[i.id] : 0];
  const actifs = temps === 'proteger' ? INDICES : INDICES.filter((i) => utilises.includes(i.id));
  const restants = PROFILS.filter((p) => actifs.every((i) => niveau(i).garde(p)));
  const trouvee = temps === 'retrouver' && restants.length === 1;
  const protegee = temps === 'proteger' && restants.length >= SEUIL;

  const utiliser = (id: string) => { if (!utilises.includes(id)) setUtilises([...utilises, id]); marquerVu(cours, 'reidentification'); };
  const passer = (t: 'retrouver' | 'proteger') => { setTemps(t); setUtilises([]); setNiveaux({ metier: 0, age: 0, lieu: 0, date: 0 }); };

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
  const [metier, age, lieu, date] = INDICES;

  let verdict = '';
  if (temps === 'retrouver') {
    verdict = utilises.length === 0 ? 'Cliquez sur un indice du texte.' : trouvee ? `Retrouvée : ${restants[0].nom}, avec ${utilises.length} indice${utilises.length > 1 ? 's' : ''}.` : `${restants.length} personnes possibles.`;
  } else {
    verdict = protegee ? `Protégée : ${restants.length} personnes correspondent, impossible de savoir qui c’est.` : restants.length === 1 ? `Encore reconnaissable : une seule personne, ${restants[0].nom}.` : `${restants.length} personnes possibles. Visez au moins ${SEUIL}.`;
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
            La patiente, {fragment(metier)} {fragment(age)}, {fragment(lieu)}, a été opérée du genou gauche {fragment(date)}. Elle demande la prise en charge par son assurance.
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
        {trouvee && <button type="button" className="bouton" onClick={() => passer('proteger')}>Maintenant, protégez-la</button>}
        {temps === 'retrouver' && utilises.length > 0 && !trouvee && <button type="button" className="bouton-secondaire" onClick={() => setUtilises([])}>Recommencer</button>}
      </div>

      <div className="reid-annuaire">
        <p className="maquette-etiquette">Annuaire public de la vallée (fictif) : {restants.length} sur {PROFILS.length} possibles</p>
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
