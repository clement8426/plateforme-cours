// Transforme les réponses d'une fiche en blocs communs, puis en Markdown. Le PDF lit les mêmes blocs (voir pdf.ts).
// Tout se passe dans le navigateur : rien n'est envoyé.
import type { Champ, Fiche } from './fiches';
import { calculerScore } from './score';

export type LigneFonction = { fonction: string; pourquoi: string; mvp: boolean; priorite: string };
export type Reponses = Record<string, string | string[] | LigneFonction[]>;

export const NON_RENSEIGNE = 'Non renseigné';

export type Bloc =
  | { type: 'section'; titre: string; intro?: string }
  | { type: 'texte'; texte: string }
  | { type: 'question'; question: string; reponse: string }
  | { type: 'choix'; question: string; options: { nom: string; coche: boolean }[]; autre?: string }
  | { type: 'table'; question: string; colonnes: string[]; lignes: string[][] };

const texte = (r: Reponses, id: string) => { const v = r[id]; return typeof v === 'string' ? v.trim() : ''; };
const liste = (r: Reponses, id: string) => { const v = r[id]; return Array.isArray(v) ? v as string[] : []; };
export type Couleur = { hex: string; nom: string };
export const nombreLignes = (r: Reponses, id: string, depart: number, max = 50) => Math.min(max, Math.max(depart, Number(texte(r, `${id}.n`)) || 0));
export const couleurs = (r: Reponses, id: string): Couleur[] => Array.from({ length: Math.min(Number(texte(r, `${id}.n`)) || 0, 5) }, (_, i) => ({ hex: texte(r, `${id}.${i}`) || '#000000', nom: texte(r, `${id}.${i}.nom`) }));
// Une question conditionnelle est masquée quand la réponse choisie ailleurs fait partie de ses valeurs. Sans réponse, elle reste visible.
export const visible = (c: Champ, r: Reponses) => { const si = c.masquerSi; if (!si) return true; const v = r[si.id]; return !(Array.isArray(v) && (v as string[]).some((x) => si.valeurs.includes(x))); };
export const fonctions = (r: Reponses) => { const v = r.fonctionnalites; return Array.isArray(v) ? (v as LigneFonction[]) : []; };

function bloc(champ: Champ, r: Reponses): Bloc | null {
  switch (champ.type) {
    case 'texte': return { type: 'texte', texte: champ.texte };
    case 'ligne':
    case 'zone': return { type: 'question', question: champ.label, reponse: texte(r, champ.id) || NON_RENSEIGNE };
    case 'mots': {
      const mots = Array.from({ length: champ.nombre }, (_, i) => texte(r, `${champ.id}.${i}`)).filter(Boolean);
      return { type: 'question', question: champ.label, reponse: mots.join(' / ') || NON_RENSEIGNE };
    }
    case 'choix': {
      const choisis = liste(r, champ.id);
      return { type: 'choix', question: champ.label, options: champ.options.map((nom) => ({ nom, coche: choisis.includes(nom) })), autre: champ.autre && choisis.includes(champ.autre) ? texte(r, `${champ.id}.autre`) : undefined };
    }
    case 'grille':
      return { type: 'table', question: champ.label, colonnes: ['Notion', 'Niveau'], lignes: champ.notions.map((n, i) => [n, texte(r, `${champ.id}.${i}`) || NON_RENSEIGNE]) };
    case 'tableau':
      return { type: 'table', question: champ.label, colonnes: champ.colonnes, lignes: Array.from({ length: champ.lignes }, (_, l) => champ.colonnes.map((__, c) => texte(r, `${champ.id}.${l}.${c}`) || NON_RENSEIGNE)) };
    case 'couleurs': {
      const choisies = couleurs(r, champ.id);
      return { type: 'table', question: champ.label, colonnes: ['Priorité', 'Couleur', 'Nom'], lignes: choisies.length ? choisies.map((c, i) => [String(i + 1), c.hex.toUpperCase(), c.nom || NON_RENSEIGNE]) : [['', NON_RENSEIGNE, '']] };
    }
    case 'references': {
      const lignes = Array.from({ length: nombreLignes(r, champ.id, champ.lignes) }, (_, l) => [texte(r, `${champ.id}.${l}.0`), texte(r, `${champ.id}.${l}.1`)]).filter(([a, b]) => a || b);
      return { type: 'table', question: champ.label, colonnes: ['Référence', 'Lien'], lignes: lignes.length ? lignes.map(([a, b]) => [a || NON_RENSEIGNE, b || NON_RENSEIGNE]) : [[NON_RENSEIGNE, '']] };
    }
    case 'fonctionnalites': {
      const remplies = fonctions(r).filter((f) => f.fonction.trim() || f.pourquoi.trim());
      return { type: 'table', question: champ.label, colonnes: ['N°', 'Fonctionnalité', 'Pourquoi l’utilisateur en a besoin', 'MVP', 'Priorité'], lignes: remplies.length ? remplies.map((f, i) => [String(i + 1), f.fonction.trim() || NON_RENSEIGNE, f.pourquoi.trim() || NON_RENSEIGNE, f.mvp ? 'Oui' : 'Non', f.priorite || NON_RENSEIGNE]) : [['', NON_RENSEIGNE, '', '', '']] };
    }
  }
}

export const blocs = (fiche: Fiche, r: Reponses): Bloc[] => fiche.sections.flatMap((s) => [
  { type: 'section', titre: s.titre, intro: s.intro } as Bloc,
  ...s.champs.filter((c) => visible(c, r)).map((c) => bloc(c, r)).filter((b): b is Bloc => b !== null),
]);

export const identite = (fiche: Fiche, r: Reponses) => [
  ...(fiche.identite.projet ? [[fiche.identite.projet, texte(r, 'identite.projet') || NON_RENSEIGNE]] : []),
  [fiche.identite.nom, texte(r, 'identite.nom') || NON_RENSEIGNE],
  ['Date', texte(r, 'identite.date') || NON_RENSEIGNE],
] as [string, string][];

const nettoyer = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function nomFichier(fiche: Fiche, r: Reponses, extension: 'pdf' | 'md' | 'docx') {
  const date = texte(r, 'identite.date') || new Date().toISOString().slice(0, 10);
  return `${fiche.fichier}_${nettoyer(texte(r, 'identite.nom')) || 'eleve'}_${date}.${extension}`;
}

const cellule = (v: string) => v.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

// Le commentaire de tête permet de recharger la fiche dans le diagnostic. Il reste dans le fichier de l'élève.
export const MARQUE = 'le-labo-fiche';
export function versMarkdown(fiche: Fiche, r: Reponses) {
  const donnees = JSON.stringify({ fiche: fiche.slug, reponses: r }).replace(/--/g, '-\\u002d');
  const sortie = [`<!-- ${MARQUE} ${donnees} -->`, '', `# ${fiche.titre}`, ''];
  for (const [nom, valeur] of identite(fiche, r)) sortie.push(`**${nom} :** ${valeur}  `);
  sortie.push('');
  const score = calculerScore(fiche, r);
  if (score) sortie.push('## Ton score', '', ...score.lignes.map((l) => `${l}  `), '');
  for (const b of blocs(fiche, r)) {
    if (b.type === 'section') sortie.push(`## ${b.titre}`, '', ...(b.intro ? [b.intro, ''] : []));
    if (b.type === 'texte') sortie.push(b.texte, '');
    if (b.type === 'question') sortie.push(`**${b.question}**`, '', b.reponse, '');
    if (b.type === 'choix') sortie.push(`**${b.question}**`, '', ...b.options.map((o) => `- [${o.coche ? 'x' : ' '}] ${o.nom}`), ...(b.autre ? ['', `Autre : ${b.autre}`] : []), '');
    if (b.type === 'table') sortie.push(`**${b.question}**`, '', `| ${b.colonnes.join(' | ')} |`, `|${b.colonnes.map(() => ' --- ').join('|')}|`, ...b.lignes.map((l) => `| ${l.map(cellule).join(' | ')} |`), '');
  }
  return sortie.join('\n');
}

export function telecharger(contenu: BlobPart, nom: string, type: string) {
  const adresse = URL.createObjectURL(new Blob([contenu], { type }));
  const lien = document.createElement('a');
  lien.href = adresse;
  lien.download = nom;
  document.body.append(lien);
  lien.click();
  lien.remove();
  setTimeout(() => URL.revokeObjectURL(adresse), 1000);
}
