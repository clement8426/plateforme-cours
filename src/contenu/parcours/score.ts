// Score du test de positionnement, calculé dans le navigateur.
// Les bonnes réponses ne sont pas écrites ici : seules leurs empreintes le sont.
// Elles évitent une lecture directe, sans protéger contre quelqu'un qui les recalculerait.
import type { Champ, Fiche } from './fiches';
import type { Reponses } from './exports';

const SEL = 'le-labo-2026';
const EMPREINTES: Record<string, string> = { q1: 'obe5xakj84', q2: '1rw6d1pxcm8', q3: '1i9gu4manpu', q4: '1kr7rr528ij', q5: '1xu103184qr', q6: '1e53ptn9xbm', q7: '16hyntrmdm5', q9: 'l81biqj7xw', q10: '26c2urqw8fj', q11: 'l5eiv0wg8m', q12: 'as83p6o0o8', q13: 'uthd899dnn', q15: '169dywthida', q16: '1ubwvb4z2pe', q17: 'u6wh5mxxok', q18: 'tv0f9hrxb5', q20: '1l6qu0wafu5', q21: '6up98jak06', q22: '1b34m26u5ks' };

function empreinte(s: string) {
  let a = 0xdeadbeef;
  let b = 0x41c6ce57;
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    a = Math.imul(a ^ c, 2654435761);
    b = Math.imul(b ^ c, 1597334677);
  }
  a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
  b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
  return (4294967296 * (2097151 & b) + (a >>> 0)).toString(36);
}

export type Score = { questions: number; questionsMax: number; niveau: number; niveauMax: number; lignes: string[] };

export function calculerScore(fiche: Fiche, r: Reponses): Score | null {
  if (fiche.slug !== 'test') return null;
  const champs = fiche.sections.flatMap((s) => s.champs);
  const choix = champs.filter((c): c is Extract<Champ, { type: 'choix' }> => c.type === 'choix' && c.id in EMPREINTES);
  const questions = choix.filter((c) => {
    const pris = Array.isArray(r[c.id]) ? r[c.id] as string[] : [];
    const indices = pris.map((o) => c.options.indexOf(o)).sort((x, y) => x - y).join(',');
    return pris.length > 0 && empreinte(`${SEL}:${c.id}:${indices}`) === EMPREINTES[c.id];
  }).length;
  const grille = champs.find((c): c is Extract<Champ, { type: 'grille' }> => c.type === 'grille');
  const notes = grille ? grille.notions.map((_, i) => Number(r[`${grille.id}.${i}`] ?? 0)) : [];
  const niveau = notes.reduce((n, v) => n + v, 0);
  const niveauMax = notes.length * 5;
  return {
    questions, questionsMax: choix.length, niveau, niveauMax,
    lignes: [`Bonnes réponses : ${questions} sur ${choix.length}`, `Auto-évaluation : ${niveau} sur ${niveauMax}`, 'Refais le test dans un mois et compare tes deux fichiers.'],
  };
}
