'use client';

import { useState } from 'react';
import { marquerVu } from './memoire';

// Bonus « Retrouver la personne en trois indices » : un compte rendu sans nom, un annuaire public fictif.
// Indice après indice, les profils qui ne correspondent plus s'effacent. La version généralisée rend le jeu impossible.
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

type Indice = { nom: string; valeur: string; garde: (p: Profil) => boolean };
const VERSIONS: Record<'brute' | 'generalisee', { texte: string; indices: Indice[] }> = {
  brute: {
    texte: 'La patiente, infirmière de 52 ans domiciliée aux Combes, a été opérée du genou gauche le 12 mars 2026. Elle demande la prise en charge par son assurance.',
    indices: [
      { nom: 'Métier', valeur: 'infirmière', garde: (p) => /^infirmi/i.test(p.metier) },
      { nom: 'Âge', valeur: '52 ans', garde: (p) => p.age === 52 },
      { nom: 'Localité', valeur: 'Les Combes', garde: (p) => p.lieu === 'Les Combes' },
      { nom: 'Date', valeur: '12 mars', garde: (p) => Boolean(p.nouvelle?.includes('12 mars')) },
    ],
  },
  generalisee: {
    texte: 'La patiente, qui travaille dans la santé et a entre 45 et 60 ans, habite la vallée. Elle a été opérée au printemps 2026. Elle demande la prise en charge par son assurance.',
    indices: [
      { nom: 'Métier', valeur: 'dans la santé', garde: (p) => p.sante },
      { nom: 'Âge', valeur: '45 à 60 ans', garde: (p) => p.age >= 45 && p.age <= 60 },
      { nom: 'Localité', valeur: 'la vallée', garde: () => true },
      { nom: 'Date', valeur: 'printemps 2026', garde: () => true },
    ],
  },
};

export default function Reidentification({ cours }: { cours: string }) {
  const [version, setVersion] = useState<'brute' | 'generalisee'>('brute');
  const [nb, setNb] = useState(0); // indices révélés
  const { texte, indices } = VERSIONS[version];
  const actifs = indices.slice(0, nb);
  const restants = PROFILS.filter((p) => actifs.every((i) => i.garde(p)));
  const fin = nb === indices.length;

  const choisir = (v: 'brute' | 'generalisee') => { setVersion(v); setNb(0); };
  const suivant = () => { setNb((n) => Math.min(n + 1, indices.length)); marquerVu(cours, 'reidentification'); };

  let verdict = `${restants.length} personnes possibles.`;
  if (restants.length === 1) verdict = `Une seule personne possible : ${restants[0].nom}.`;
  else if (fin) verdict = `${restants.length} personnes possibles : impossible de savoir qui c’est.`;

  return (
    <section className="reid" aria-label="Retrouver la personne">
      <div className="reid-gauche">
        <fieldset className="bascule">
          <legend className="visuellement-cache">Version du compte rendu</legend>
          {(['brute', 'generalisee'] as const).map((v) => (
            <label key={v} className={version === v ? 'est-choisi' : undefined}>
              <input type="radio" name="reid-version" value={v} checked={version === v} onChange={() => choisir(v)} />
              <span>{v === 'brute' ? 'Nom retiré' : 'Version généralisée'}</span>
            </label>
          ))}
        </fieldset>
        <article className="reid-document">
          <p className="maquette-etiquette">Compte rendu, nom retiré</p>
          <p>{texte}</p>
        </article>
        <ol className="reid-indices">
          {indices.map((i, k) => (
            <li key={i.nom} className={k < nb ? 'est-revele' : undefined}>
              <span>{i.nom}</span>
              <strong>{k < nb ? i.valeur : '?'}</strong>
            </li>
          ))}
        </ol>
        <div className="actions">
          {!fin && <button type="button" className="bouton" onClick={suivant}>Indice suivant ({nb + 1} / {indices.length})</button>}
          {nb > 0 && <button type="button" className="bouton-secondaire" onClick={() => setNb(0)}>Recommencer</button>}
        </div>
        <p className="reid-verdict" role="status">{verdict}</p>
      </div>

      <div className="reid-annuaire">
        <p className="maquette-etiquette">Annuaire public de la vallée (fictif), 20 habitants</p>
        <ul>
          {PROFILS.map((p) => {
            const garde = restants.includes(p);
            const trouve = garde && restants.length === 1;
            return (
              <li key={p.nom} className={(garde ? '' : 'est-ecarte') + (trouve ? ' est-trouve' : '')} aria-hidden={!garde}>
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
