// Collecte les candidats du catalogue. Rien n'est publié : le script écrit data/candidates.json,
// et un outil n'entre dans tools.json qu'après la relecture de Clément.
// Sources : registre MCP officiel (v0.1), marketplace Claude Code, API GitHub.
// Les avertissements sur les outils déjà publiés vont dans data/alerts.json.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const racine = new URL('../data/', import.meta.url);
const lire = (nom, defaut) => { try { return JSON.parse(readFileSync(new URL(nom, racine), 'utf8')); } catch { return defaut; } };
const config = lire('collecte.config.json', {});
const { etoilesMin = 100, moisMax = 12, pagesRegistre = 5, enrichirMax = 50 } = config;
const jeton = process.env.GITHUB_TOKEN;
const entetes = { 'User-Agent': 'le-labo-catalogue', Accept: 'application/vnd.github+json', ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}) };
const date = new Date().toISOString().slice(0, 10);

async function json(url, options) {
  const reponse = await fetch(url, options);
  if (!reponse.ok) throw new Error(`${reponse.status} ${url}`);
  return reponse.json();
}

const depot = (url) => url?.match(/github\.com[/:]([^/]+\/[^/.#?]+)/i)?.[1]?.toLowerCase();

async function registreMcp() {
  const entrees = [];
  let curseur;
  for (let page = 0; page < pagesRegistre; page += 1) {
    const params = new URLSearchParams({ limit: '100', version: 'latest', ...(curseur ? { cursor: curseur } : {}) });
    const d = await json(`https://registry.modelcontextprotocol.io/v0.1/servers?${params}`);
    for (const e of d.servers ?? []) {
      const s = e.server ?? e;
      entrees.push({ name: s.title ?? s.name, kind: 'mcp', repo: depot(s.repository?.url), description: s.description ?? '', source: 'registre-mcp' });
    }
    curseur = d.metadata?.nextCursor ?? d.metadata?.next_cursor;
    if (!curseur) break;
  }
  return entrees;
}

async function marketplace() {
  const d = await json('https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json');
  return (d.plugins ?? []).map((p) => {
    const source = typeof p.source === 'object' ? p.source.url ?? p.source.repo : undefined;
    return { name: p.name, kind: 'plugin', repo: depot(source) ?? (p.source?.repo ? p.source.repo.toLowerCase() : 'anthropics/claude-plugins-official'), description: p.description ?? '', source: 'marketplace-claude' };
  });
}

const github = (repo) => json(`https://api.github.com/repos/${repo}`, { headers: entetes });

const brut = [];
const erreurs = [];
for (const [nom, source] of [['registre MCP', registreMcp], ['marketplace', marketplace]]) {
  try { brut.push(...await source()); } catch (e) { erreurs.push(`${nom} : ${e.message}`); }
}

mkdirSync(new URL('raw/', racine), { recursive: true });
writeFileSync(new URL(`raw/${date}.json`, racine), JSON.stringify(brut));

// Dédoublonnage par dépôt : une fiche, plusieurs sources.
const parDepot = new Map();
for (const e of brut.filter((x) => x.repo)) {
  const cle = e.kind === 'plugin' ? `${e.repo}#${e.name}` : e.repo;
  const present = parDepot.get(cle);
  if (present) present.sources = [...new Set([...present.sources, e.source])];
  else parDepot.set(cle, { ...e, sources: [e.source] });
}

const outils = lire('tools.json', []);
const connus = new Set(outils.map((o) => o.repo.toLowerCase()));
const candidats = [];
const limite = new Date();
limite.setMonth(limite.getMonth() - moisMax);
let enrichis = 0;
for (const e of parDepot.values()) {
  if (connus.has(e.repo) || enrichis >= enrichirMax) continue;
  enrichis += 1;
  try {
    const g = await github(e.repo);
    const ecarte = g.archived ? 'archivé' : !g.license ? 'sans licence' : new Date(g.pushed_at) < limite ? 'inactif' : g.stargazers_count < etoilesMin ? 'trop peu d’étoiles' : null;
    if (!ecarte) candidats.push({ ...e, repo: g.full_name, stars: g.stargazers_count, last_push: g.pushed_at.slice(0, 10), license: g.license.spdx_id });
  } catch (err) { erreurs.push(`${e.repo} : ${err.message}`); }
}

// Changements notables sur les outils déjà listés : un dépôt archivé ou une licence modifiée.
const alertes = [];
for (const o of outils) {
  try {
    const g = await github(o.repo);
    if (g.archived) alertes.push({ id: o.id, warning: 'Ce dépôt est archivé : il n’est plus maintenu.' });
    else if (o.license && g.license?.spdx_id !== o.license) alertes.push({ id: o.id, warning: `La licence a changé : ${o.license} devient ${g.license?.spdx_id ?? 'inconnue'}.` });
  } catch (err) { erreurs.push(`${o.repo} : ${err.message}`); }
}

writeFileSync(new URL('candidates.json', racine), `${JSON.stringify({ date, candidats, erreurs }, null, 1)}\n`);
writeFileSync(new URL('alerts.json', racine), `${JSON.stringify(alertes, null, 1)}\n`);

const resume = [`# Catalogue : collecte du ${date}`, '', `${candidats.length} candidats, ${alertes.length} alertes, ${erreurs.length} erreurs.`, '', '| Nom | Nature | Dépôt | Étoiles | Sources |', '|---|---|---|---|---|', ...candidats.map((c) => `| ${c.name} | ${c.kind} | https://github.com/${c.repo} | ${c.stars} | ${c.sources.join(', ')} |`), '', ...alertes.map((a) => `- **${a.id}** : ${a.warning}`), ...erreurs.map((x) => `- Erreur : ${x}`), ''].join('\n');
writeFileSync(new URL('candidates.md', racine), resume);
console.log(resume.split('\n').slice(0, 3).join('\n'));
