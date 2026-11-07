// Calcule le plan de l'entonnoir à partir des réponses. Tout tourne dans le navigateur, sans serveur.
import anglesBruts from '../../../data/blind_spots.json';
import reglesBrutes from '../../../data/rules.json';
import taxonomieBrute from '../../../data/taxonomy.json';
import outilsBruts from '../../../data/tools.json';
import alertes from '../../../data/alerts.json';
import { typoProfonde } from '../typo';

export type Quand = { toujours?: boolean; contexte?: string[]; types?: string[]; outils?: string[]; signaux?: string[]; intentions?: string[]; verifier?: string };
export type Angle = { id: string; family: string; title: string; question: string; severity: 'bloquant' | 'important' | 'confort'; show_if: string; when: Quand; why: string; warning: string; action: string; practice: string | null; learn_course_url: string | null; swiss_legal_ref: string | null };
export type Regle = { id: string; if: { intentions?: string[]; types?: string[]; contexte?: string[]; outils?: string[] }; then: string[]; priority_boost: number };
export type Outil = {
  id: string; kind: string; name: string; repo: string; description: string; sources: string[]; install: Record<string, string>;
  stars: number; installs: number | null; audit: string | null; license: string | null; last_push: string;
  piliers: string[]; cercles: string[]; project_types: string[]; level: string; blind_spots: string[];
  constraints: string[]; alternatives: string[]; data_location: { pays: string; societe: string } | null;
  tuto_url: string | null; learn_course_url: string | null; validated_by: string | null; validated_at: string | null;
  warning?: string;
};

export const ANGLES = typoProfonde(anglesBruts) as Angle[];
export const REGLES = reglesBrutes as Regle[];
export const TAXONOMIE = typoProfonde(taxonomieBrute);

// Règle du catalogue : sans validation de Clément, un outil n'est pas public. L'aperçu local les montre tous.
const apercu = process.env.NEXT_PUBLIC_CATALOGUE_APERCU === '1';
export const OUTILS = (typoProfonde(outilsBruts) as Outil[]).filter((o) => o.validated_by || apercu).map((o) => ({ ...o, warning: (alertes as { id: string; warning: string }[]).find((a) => a.id === o.id)?.warning }));

export const GRAVITES: Record<Angle['severity'], { nom: string; poids: number }> = {
  bloquant: { nom: 'Bloquant', poids: 300 },
  important: { nom: 'Important', poids: 200 },
  confort: { nom: 'Confort', poids: 100 },
};
export const famille = (id: string) => TAXONOMIE.familles.find((f) => f.id === id)?.label_fr ?? id;
export const trouverAngle = (id: string) => ANGLES.find((a) => a.id === id);
export const trouverOutil = (id: string) => OUTILS.find((o) => o.id === id);
export const outilsDe = (angle: string) => OUTILS.filter((o) => o.blind_spots.includes(angle));
export const KINDS: Record<string, string> = { mcp: 'Serveur MCP', plugin: 'Plugin', skill: 'Skill', audit: 'Outil d’audit', agent: 'Agent', service: 'Service', generateur: 'Générateur de projet' };
export const NIVEAUX: Record<string, string> = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };

export type Reponse = 'oui' | 'non' | 'jnsp';
export type Choix = { intention?: string; type?: string; contexte: Record<string, Reponse>; outil?: string; signaux: string[] };
export type Plan = { actifs: (Angle & { score: number })[]; aVerifier: Angle[]; regles: string[] };

// « Je ne sais pas » compte comme oui, avec le même effet.
const actif = (c: Choix, cle: string) => c.contexte[cle] === 'oui' || c.contexte[cle] === 'jnsp';
const typeInconnu = (c: Choix) => !c.type || c.type === 'jnsp';

function declenche(a: Angle, c: Choix) {
  const q = a.when;
  return !!(q.toujours
    || q.contexte?.some((k) => actif(c, k))
    || q.types?.some((t) => t === c.type) || (q.types && typeInconnu(c))
    || q.outils?.some((o) => o === c.outil)
    || q.signaux?.some((s) => c.signaux.includes(s))
    || q.intentions?.some((i) => i === c.intention));
}

function applique(r: Regle, c: Choix) {
  const si = r.if;
  return (!si.intentions || si.intentions.includes(c.intention ?? ''))
    && (!si.types || si.types.includes(c.type ?? ''))
    && (!si.outils || si.outils.includes(c.outil ?? ''))
    && (!si.contexte || si.contexte.every((k) => actif(c, k)));
}

export function calculerPlan(c: Choix): Plan {
  const regles = REGLES.filter((r) => applique(r, c));
  const ordre: string[] = TAXONOMIE.intentions.find((i) => i.id === c.intention)?.ordre ?? [];
  const parRegle = new Set(regles.flatMap((r) => r.then));
  const actifs = ANGLES.filter((a) => declenche(a, c) || parRegle.has(a.id)).map((a, i) => {
    const bonus = regles.filter((r) => r.then.includes(a.id)).reduce((n, r) => n + r.priority_boost, 0);
    const rang = ordre.indexOf(a.family);
    return { ...a, score: GRAVITES[a.severity].poids + bonus + (rang === -1 ? 0 : (3 - rang) * 5) - i / 100 };
  }).sort((x, y) => y.score - x.score);
  const ids = new Set(actifs.map((a) => a.id));
  return { actifs, aVerifier: ANGLES.filter((a) => a.when.verifier && !ids.has(a.id)), regles: regles.map((r) => r.id) };
}

// Le lien partageable : les choix sont dans le fragment (#), qui ne part ni vers le serveur ni vers les statistiques.
const LETTRES: Record<Reponse, string> = { oui: 'o', non: 'n', jnsp: 's' };
export function versFragment(c: Choix) {
  const contexte = Object.entries(c.contexte).map(([k, v]) => `${k}:${LETTRES[v]}`).join(',');
  return new URLSearchParams(Object.entries({ i: c.intention, t: c.type, c: contexte, o: c.outil }).filter(([, v]) => v) as [string, string][]).toString().replace(/%3A/g, ':').replace(/%2C/g, ',');
}
export function depuisFragment(fragment: string): Choix {
  const p = new URLSearchParams(fragment.replace(/^#/, ''));
  const valide = (v: string | null, liste: { id: string }[]) => (v && [...liste, { id: 'jnsp' }].some((x) => x.id === v) ? v : undefined);
  const contexte: Record<string, Reponse> = {};
  for (const morceau of (p.get('c') ?? '').split(',')) {
    const [k, v] = morceau.split(':');
    const reponse = (Object.keys(LETTRES) as Reponse[]).find((r) => LETTRES[r] === v);
    if (reponse && TAXONOMIE.contexte.some((q) => q.id === k)) contexte[k] = reponse;
  }
  return { intention: valide(p.get('i'), TAXONOMIE.intentions), type: valide(p.get('t'), TAXONOMIE.types), contexte, outil: valide(p.get('o'), TAXONOMIE.outils), signaux: [] };
}

// Lecture d'un fichier Markdown exporté par une fiche : le fichier reste dans le navigateur.
export function lireFiche(contenu: string): { fiche: string; reponses: Record<string, unknown> } | null {
  const m = contenu.match(/<!-- le-labo-fiche (\{[\s\S]*?\}) -->/);
  if (!m) return null;
  try {
    const d = JSON.parse(m[1]);
    return typeof d?.fiche === 'string' && d.reponses && typeof d.reponses === 'object' ? d : null;
  } catch { return null; }
}

const premier = (v: unknown) => (Array.isArray(v) ? String(v[0] ?? '') : String(v ?? ''));
const versReponse = (v: unknown): Reponse | undefined => {
  const r = premier(v);
  return r === 'Oui' || r === 'Plus tard' ? 'oui' : r === 'Non' ? 'non' : r.startsWith('Je ne sais pas') ? 'jnsp' : undefined;
};

const TYPES_FICHE: [RegExp, string][] = [[/^Site vitrine/, 'vitrine'], [/^Site e-commerce/, 'boutique'], [/^Application web/, 'app-web'], [/^Application mobile/, 'mobile'], [/^Campagne/, 'campagne'], [/^Automatisation/, 'automatisation']];

// Reprend ce que les fiches disent déjà, pour ne pas reposer les questions.
export function preremplir(c: Choix, fiche: string, r: Record<string, unknown>): Choix {
  const suite: Choix = { ...c, contexte: { ...c.contexte }, signaux: [...c.signaux] };
  const signal = (s: string) => { if (!suite.signaux.includes(s)) suite.signaux.push(s); };
  if (fiche === 'technique') {
    const pose = (cle: string, source: string) => { const v = versReponse(r[source]); if (v) suite.contexte[cle] = v; };
    pose('donnees', 'sensibles'); pose('comptes', 'compte'); pose('paiement', 'paiement');
    const langues = premier(r.langues).split(/[,/]| et /).filter((x) => x.trim());
    if (langues.length) suite.contexte.langues = langues.length > 1 ? 'oui' : 'non';
    const type = Array.isArray(r.type) ? TYPES_FICHE.find(([motif]) => (r.type as string[]).some((t) => motif.test(t)))?.[1] : undefined;
    if (type && !suite.type) suite.type = type;
    const outil = premier(r.outil).toLowerCase();
    if (!suite.outil && /supabase|postgres/.test(outil)) suite.outil = 'supabase';
    if (!suite.outil && /wordpress/.test(outil)) suite.outil = 'wordpress';
    if (versReponse(r.ia) === 'oui') signal('ia');
    if (versReponse(r.emails) === 'oui') signal('emails');
    if (premier(r.roles).trim()) signal('roles');
  }
  if (fiche === 'idee' && /B2B|Les deux/.test(premier(r.b2))) signal('b2b');
  return suite;
}
