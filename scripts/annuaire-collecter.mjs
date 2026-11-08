// Construit l'annuaire public des serveurs MCP, plugins et skills, sans relecture humaine.
// GITHUB_TOKEN=... npm run annuaire:collecter
//
// Règle de publication : un outil est publié s'il est référencé par un répertoire reconnu (Claude, OpenAI, Google,
// GitHub, Docker, Cursor, AWS, projet MCP, dépôt d'éditeur), ou s'il compte au moins 1 000 étoiles sur un dépôt qui
// lui appartient, ou si son éditeur est prouvé et que son paquet npm dépasse 10 000 téléchargements par semaine.
// « Référencé » signifie reconnu, jamais vérifié : la page le dit.
//
// Sûreté : si une source échoue, rien n'est publié (code 2). Si une liste perd plus de 15 % de ses entrées, rien
// n'est publié non plus (code 3), sauf ANNUAIRE_FORCER=1. La publication ne se fait qu'une fois tout calculé.
// Variables : ANNUAIRE_SORTIE (dossier de sortie), ANNUAIRE_BUDGETS (minutes, JSON), ANNUAIRE_PAGES_REGISTRE,
// ANNUAIRE_TOLERER=1 (publier malgré une source en échec, pour les essais).
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { creerBase } from './annuaire/base.mjs';
import { chargerSuffixes, clientGithub, journal, json, lireConfig, nettoyer, parLots, pause } from './annuaire/outils.mjs';
import * as S from './annuaire/sources.mjs';

const racine = new URL('../', import.meta.url);
const { config, taxonomie } = lireConfig(racine);
const sortie = process.env.ANNUAIRE_SORTIE ? pathToFileURL(`${resolve(process.env.ANNUAIRE_SORTIE)}/`) : new URL('public/annuaire/', racine);
const brut = new URL('data/raw/', racine);
mkdirSync(sortie, { recursive: true });
mkdirSync(brut, { recursive: true });
const jeton = process.env.GITHUB_TOKEN;
if (!jeton) { console.error('Indiquez GITHUB_TOKEN : la recherche GitHub l’exige.'); process.exit(1); }
const budgets = { ...config.budgets, ...(process.env.ANNUAIRE_BUDGETS ? JSON.parse(process.env.ANNUAIRE_BUDGETS) : {}) };
const pagesMax = Number(process.env.ANNUAIRE_PAGES_REGISTRE ?? 100_000);
const { etoilesMin, maxParDepot, telechargementsMin } = config.publication;

const gh = clientGithub(jeton);
const domaineDe = await chargerSuffixes();
const base = creerBase(domaineDe);
const sources = [];

// ---------- État conservé entre deux passages : ce que la recherche GitHub a trouvé ----------
const fichierEtat = new URL('etat.json', brut);
const etat = existsSync(fichierEtat) ? JSON.parse(readFileSync(fichierEtat, 'utf8')) : { plugins: [], skills: [], npm: {} };
for (const nature of ['plugins', 'skills']) for (const e of etat[nature] ?? []) base.ajouter(nature, { ...e, recherche: true });
journal('état repris', JSON.stringify(base.compte()));

async function source(nom, travail, { critique = true } = {}) {
  try {
    const r = await travail();
    const erreurs = r?.erreurs ?? [];
    const trop = r?.n ? erreurs.length / r.n > 0.2 : false;
    sources.push({ nom, n: r?.n ?? 0, ok: !trop, erreurs: erreurs.length });
    journal(nom, r?.n ?? '', erreurs.length ? `(${erreurs.length} erreurs : ${erreurs[0]})` : '', JSON.stringify(base.compte()));
  } catch (err) {
    sources.push({ nom, n: 0, ok: !critique, erreur: err.message });
    journal(nom, critique ? 'ÉCHEC' : 'incomplet', err.message);
  }
}

// ---------- Répertoires de référence et registres ----------
await source('registre officiel MCP', () => S.registre(base, domaineDe, { adresse: 'https://registry.modelcontextprotocol.io/v0.1/servers', ref: null, pagesMax }));
await source('registre GitHub', () => S.registre(base, domaineDe, { adresse: 'https://api.mcp.github.com/v0.1/servers', ref: 'github', pagesMax, version: false }));
for (const m of config.marketplaces) await source(`marketplace ${m.repo}`, () => S.marketplace(base, gh, m));
for (const d of config.depotsSkills) await source(`skills ${d.repo}`, () => S.depotSkills(base, gh, d));
await source('catalogue Docker', () => S.docker(base, gh));
for (const d of config.depotsServeurs) await source(`serveurs ${d.repo}`, () => S.serveursDeDepot(base, gh, d));
await source('Google Cloud', () => S.googleCloud(base));
if (config.claudeConnecteurs?.actif && process.env.ANNUAIRE_CLAUDE !== '0') await source('connecteurs Claude', () => S.connecteursClaude(base, etat, { ...config.claudeConnecteurs, force: process.env.ANNUAIRE_CLAUDE === 'force' }), { critique: false });
await source('extensions Gemini', () => S.gemini(base));

// ---------- Recherche GitHub : complète, sans jamais bloquer ----------
await source('topics GitHub', () => S.topics(base, gh, { liste: config.topics, etoilesMin }), { critique: false });
const fichiers = [
  ['filename:marketplace.json path:.claude-plugin', 500, 20_000, budgets.marketplaces, S.traiterMarketplace],
  ['filename:plugin.json path:.claude-plugin', 100, 3_000, budgets.pluginsJson, S.traiterPlugin],
  ['filename:SKILL.md', 1000, 40_000, budgets.skills, S.traiterSkill],
];
for (const [requete, tranche, maxTaille, minutes, traiter] of fichiers) {
  if (!minutes) continue;
  await source(`recherche ${requete}`, () => S.rechercheFichiers(base, gh, { requete, tranche, maxTaille, minutes, traiter: traiter(base, gh) }), { critique: false });
}

// ---------- Enrichissement : étoiles, activité, licence. Cinquante dépôts par requête ----------
const infos = new Map();
const entreesSimples = (nature) => [...base.simples[nature].values()];
const depotsAEnrichir = [...new Set([
  ...base.mcp.map((e) => e.repo), ...entreesSimples('plugins').map((e) => e.repo), ...entreesSimples('skills').map((e) => e.repo),
].filter((r) => r && /^[\w.-]+\/[\w.-]+$/.test(r)))];
journal('dépôts à enrichir', depotsAEnrichir.length);
const CHAMPS = 'nameWithOwner stargazerCount isArchived pushedAt description licenseInfo { spdxId } repositoryTopics(first: 10) { nodes { topic { name } } }';
let lotsEnEchec = 0;
async function enrichir(paquet, essai = 0) {
  const q = paquet.map((r, j) => { const [o, n] = r.split('/'); return `d${j}: repository(owner: ${JSON.stringify(o)}, name: ${JSON.stringify(n)}) { ${CHAMPS} }`; }).join(' ');
  try {
    const d = await gh.graphql(`{ ${q} }`);
    if (!d?.data) throw new Error(JSON.stringify(d?.errors?.[0] ?? 'réponse vide').slice(0, 120));
    // Un dépôt supprimé est une erreur NOT_FOUND normale. Toute autre erreur dit que le lot est douteux.
    const autre = (d.errors ?? []).find((x) => x.type !== 'NOT_FOUND');
    if (autre) throw new Error(autre.message);
    paquet.forEach((nom, j) => { const v = d.data[`d${j}`]; if (v) infos.set(nom.toLowerCase(), v); });
  } catch (err) {
    // Un lot trop lourd se coupe en deux ; un lot minuscule se réessaie plus tard.
    if (paquet.length > 10) {
      const m = Math.ceil(paquet.length / 2);
      await enrichir(paquet.slice(0, m));
      await enrichir(paquet.slice(m));
      return;
    }
    if (essai >= 3) { lotsEnEchec += 1; journal('lot GraphQL abandonné', err.message); return; }
    await pause(30_000 * (essai + 1));
    await enrichir(paquet, essai + 1);
  }
}
const lots = [];
for (let i = 0; i < depotsAEnrichir.length; i += 50) lots.push(depotsAEnrichir.slice(i, i + 50));
for (let i = 0; i < lots.length; i += 4) {
  await Promise.all(lots.slice(i, i + 4).map((x) => enrichir(x)));
  if (i % 80 === 0) journal('enrichis', Math.min(i * 50, depotsAEnrichir.length));
}
if (lots.length && lotsEnEchec / lots.length > 0.03) sources.push({ nom: 'enrichissement GitHub', n: lots.length, ok: false, erreur: `${lotsEnEchec} lots abandonnés` });
else sources.push({ nom: 'enrichissement GitHub', n: depotsAEnrichir.length, ok: true });

// ---------- Taille réelle des dépôts de skills : la recherche n'en voit qu'une partie ----------
// Un dépôt qui contient des centaines de skills est un recueil : ses étoiles ne disent rien de chacun.
const tailleDepot = new Map();
const aCompter = [...new Set(entreesSimples('skills').filter((e) => !e.refs.size && !e.partage && (infos.get(e.repo?.toLowerCase())?.stargazerCount ?? 0) >= etoilesMin).map((e) => e.repo))];
journal('dépôts de skills à mesurer', aCompter.length);
await parLots(aCompter, 6, async (repo) => {
  const arbre = await gh.api(`/repos/${repo}/git/trees/HEAD?recursive=1`);
  if (!arbre?.tree) return;
  tailleDepot.set(repo.toLowerCase(), arbre.truncated ? 9999 : arbre.tree.filter((x) => x.type === 'blob' && /(^|\/)SKILL\.md$/.test(x.path)).length);
});

// ---------- Dépôts partagés : leurs étoiles appartiennent au dépôt, pas à l'outil ----------
const compteParDepot = { mcp: new Map(), plugins: new Map(), skills: new Map() };
const incrementer = (nature, repo) => repo && compteParDepot[nature].set(repo.toLowerCase(), (compteParDepot[nature].get(repo.toLowerCase()) ?? 0) + 1);
base.mcp.forEach((e) => incrementer('mcp', e.repo));
['plugins', 'skills'].forEach((n) => entreesSimples(n).forEach((e) => incrementer(n, e.repo)));
const infoDe = (repo) => (repo ? infos.get(repo.toLowerCase()) : null);
const estPartage = (nature, e) => !!(e.partage || e.sousDossier || (e.repo && Math.max(compteParDepot[nature].get(e.repo.toLowerCase()) ?? 0, nature === 'skills' ? tailleDepot.get(e.repo.toLowerCase()) ?? 0 : 0) > maxParDepot));
const etoilesDe = (nature, e) => (estPartage(nature, e) ? 0 : infoDe(e.repo)?.stargazerCount ?? 0);

// ---------- Téléchargements npm : seulement pour les éditeurs prouvés qui n'ont pas déjà de quoi être publiés ----------
const aMesurer = base.mcp.filter((e) => e.prouve && e.paquet?.type === 'npm' && !e.refs.size && etoilesDe('mcp', e) < etoilesMin && !infoDe(e.repo)?.isArchived);
const finNpm = Date.now() + (budgets.npm ?? 10) * 60_000;
etat.npm ??= {};
const maintenant = Date.now();
await Promise.all(Array.from({ length: 6 }, async () => {
  while (aMesurer.length && Date.now() < finNpm) {
    const e = aMesurer.pop();
    const cle = e.paquet.id.toLowerCase().replace(/@[\w.+-]+$/, '');
    const connu = etat.npm[cle];
    if (connu && maintenant - connu.t < 14 * 86_400_000) { e.dl = connu.dl; continue; }
    try {
      const r = await json(`https://api.npmjs.org/downloads/point/last-week/${cle}`, { essais: 2, delai: 15_000 });
      e.dl = r?.downloads ?? 0;
      etat.npm[cle] = { dl: e.dl, t: maintenant };
    } catch { /* mesure manquante : l'outil attend le prochain passage */ }
  }
}));

// ---------- Classement par besoin et par type de projet ----------
const expressions = (groupe) => Object.entries(groupe).map(([id, mots]) => [id, new RegExp(`(?<![\\wÀ-ÿ-])(?:${mots.join('|')})(?![\\wÀ-ÿ-])`, 'gi')]);
const USAGES = expressions(config.usages);
const TYPES = expressions(config.types);
const idsUsages = taxonomie.usages.map((u) => u.id);
const idsTypes = taxonomie.types.map((t) => t.id);
function classer(t) {
  const notes = USAGES.map(([id, re]) => [id, t.match(re)?.length ?? 0]).filter(([, n]) => n).sort((a, b) => b[1] - a[1]);
  const usages = notes.filter(([, n]) => n * 2 >= notes[0][1]).slice(0, config.usagesMax).map(([id]) => id);
  const types = new Set(TYPES.filter(([, re]) => { re.lastIndex = 0; return re.test(t); }).map(([id]) => id));
  for (const id of config.typesParUsage[usages[0]] ?? []) types.add(id);
  return [usages.map((u) => idsUsages.indexOf(u)), [...types].map((x) => idsTypes.indexOf(x))];
}
const idsRefs = config.references.map(([id]) => id);

// Un nom de registre comme com.notion/mcp se lit mal : on garde le produit.
function nomLisible(e) {
  if (/^[a-z]{4,}$/.test(e.n)) return e.n.charAt(0).toUpperCase() + e.n.slice(1);
  if (e.nomPropre || !/^[a-z0-9.-]+\/[\w.-]+$/i.test(e.n)) return e.n;
  const fin = e.n.split('/')[1];
  if (e.dom && /^(mcp|mcp-server|server)$/i.test(fin)) { const b = e.dom.split('.')[0]; return b.charAt(0).toUpperCase() + b.slice(1); }
  return fin;
}

// Colonnes : voir `colonnes` dans index.json.
function ligne(nature, e) {
  const g = infoDe(e.repo);
  const sujets = (g?.repositoryTopics?.nodes ?? []).map((t) => t.topic.name.replace(/-/g, ' ')).join(' ');
  const nom = nettoyer(nature === 'plugins' && e.affichage ? e.affichage : nomLisible(e), 120);
  const d = e.d || nettoyer(g?.description);
  const [u, t] = classer(`${nom} ${d} ${sujets}`);
  const acces = (e.cmd || e.local ? 1 : 0) | (e.url ? 2 : 0);
  return [nom, g?.nameWithOwner ?? e.repo ?? '', d, etoilesDe(nature, e), g?.pushedAt?.slice(0, 10) ?? '', g?.isArchived ? 1 : 0, g?.licenseInfo?.spdxId ?? '', u, t,
    e.cmd ?? '', e.url ?? '', e.domVerifie ? e.dom : '', [...e.refs].map((r) => idsRefs.indexOf(r)).filter((i) => i >= 0), e.dl ?? 0, acces, estPartage(nature, e) ? 1 : 0, e.copies ?? 1];
}
const publie = (nature, e) => {
  if (infoDe(e.repo)?.isArchived) return false;
  if (e.refs.size) return true;
  if (e.repoOk && !estPartage(nature, e) && etoilesDe(nature, e) >= etoilesMin) return true;
  return !!(e.prouve && (e.dl ?? 0) >= telechargementsMin);
};
const tri = (a, b) => b[12].length - a[12].length || b[3] - a[3] || a[0].localeCompare(b[0]);

// Un dépôt supprimé n'a plus de lien : ses entrées de recherche disparaissent, celles d'un répertoire restent sans lien.
for (const e of base.mcp) if (e.repo && !infoDe(e.repo) && depotsAEnrichir.includes(e.repo)) { e.repo = null; e.repoOk = false; e.prouve = false; }

// Copies : un skill identique dans plusieurs dépôts ne compte que pour la version la plus reconnue.
function sansCopies(entrees) {
  const groupes = new Map();
  for (const e of entrees) {
    const cle = e.h ?? `${e.n}|${e.d}`.toLowerCase();
    groupes.set(cle, [...(groupes.get(cle) ?? []), e]);
  }
  return [...groupes.values()].map((g) => {
    const meilleur = g.sort((a, b) => b.refs.size - a.refs.size || etoilesDe('skills', b) - etoilesDe('skills', a))[0];
    meilleur.copies = g.length;
    return meilleur;
  });
}

const trouves = {};
const listes = {};
const vivantes = { plugins: entreesSimples('plugins').filter((e) => infoDe(e.repo)), skills: sansCopies(entreesSimples('skills').filter((e) => infoDe(e.repo))) };
for (const [nature, entrees] of Object.entries({ mcp: base.mcp, ...vivantes })) {
  trouves[nature] = entrees.length;
  listes[nature] = entrees.filter((e) => publie(nature, e)).map((e) => ligne(nature, e)).sort(tri);
}
const comptes = Object.fromEntries(Object.entries(listes).map(([k, v]) => [k, v.length]));
journal('trouvés', JSON.stringify(trouves), 'publiés', JSON.stringify(comptes));

// ---------- État du prochain passage : écrit avant les contrôles, un long passage n'est jamais perdu ----------
const memoire = (nature) => entreesSimples(nature).filter((e) => e.recherche && infoDe(e.repo)).map(({ n, repo, d, h }) => ({ n, repo, d, h }));
writeFileSync(fichierEtat, JSON.stringify({ date: new Date().toISOString().slice(0, 10), plugins: memoire('plugins'), skills: memoire('skills'), npm: etat.npm, claude: etat.claude }));

// ---------- Contrôles avant publication ----------
const problemes = sources.filter((s) => !s.ok).map((s) => `${s.nom} : ${s.erreur ?? `${s.erreurs} erreurs`}`);
if (problemes.length && !process.env.ANNUAIRE_TOLERER) {
  console.error(`Rien n’est publié : ${problemes.length} source(s) en échec.\n- ${problemes.join('\n- ')}`);
  process.exit(2);
}
const precedent = existsSync(new URL('index.json', sortie)) ? JSON.parse(readFileSync(new URL('index.json', sortie), 'utf8')).comptes ?? {} : {};
const chutes = Object.entries(comptes).filter(([k, n]) => precedent[k] && n < precedent[k] * 0.85).map(([k, n]) => `${k} : ${precedent[k]} devient ${n}`);
if (chutes.length && !process.env.ANNUAIRE_FORCER) {
  console.error(`Rien n’est publié : une liste perd plus de 15 % de ses entrées.\n- ${chutes.join('\n- ')}\nANNUAIRE_FORCER=1 pour publier malgré tout.`);
  process.exit(3);
}

// ---------- Publication ----------
for (const [nature, lignes] of Object.entries(listes)) writeFileSync(new URL(`${nature}.json`, sortie), JSON.stringify(lignes));
rmSync(new URL('heberges.json', sortie), { force: true });
const date = new Date().toISOString().slice(0, 10);
const COLONNES = ['nom', 'depot', 'description', 'etoiles', 'dernier_push', 'archive', 'licence', 'usages', 'types', 'commande_locale', 'adresse_mcp_en_ligne', 'domaine_verifie', 'references', 'telechargements_npm_semaine', 'acces_1_local_2_en_ligne', 'depot_partage', 'copies'];
writeFileSync(new URL('index.json', sortie), `${JSON.stringify({
  date, comptes, trouves, sources: sources.map(({ nom, n, ok }) => ({ nom, n, ok })),
  criteres: { references: 'référencé par un répertoire reconnu', etoiles: etoilesMin, telechargementsNpmParSemaine: telechargementsMin, maxParDepot },
  references: config.references, usages: taxonomie.usages, types: taxonomie.types.map(({ id, label_fr }) => ({ id, label_fr })), colonnes: COLONNES,
}, null, 1)}\n`);

journal('terminé', JSON.stringify({ comptes, trouves }));
