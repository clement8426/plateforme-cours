// Outils communs du robot de l'annuaire : réseau tolérant aux pannes, nettoyage des textes, domaines.
import { readFileSync } from 'node:fs';

export const pause = (ms) => new Promise((r) => { setTimeout(r, ms); });
export const journal = (...m) => console.log(new Date().toISOString().slice(11, 19), ...m);

// Les textes viennent d'inconnus : on retire les caractères invisibles et les entités, on tronque.
const INVISIBLES = new RegExp('[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF]', 'g');
const ENTITES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': '’', '&#x27;': '’', '&apos;': '’' };
export function nettoyer(texte, max = 160) {
  const t = String(texte ?? '').replace(/&(?:amp|lt|gt|quot|apos|#39|#x27);/g, (m) => ENTITES[m]).replace(INVISIBLES, ' ').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

// owner/nom d'un dépôt GitHub, sans .git, sans chemin, sans coupure au premier point.
export function repoDe(url) {
  const m = String(url ?? '').match(/github\.com[/:]([\w.-]+)\/([\w.-]+)/i);
  if (!m) return null;
  const nom = m[2].replace(/\.git$/i, '');
  return nom ? `${m[1]}/${nom}` : null;
}

// Le réseau échoue : délai maximal, nouvelles tentatives, attente quand GitHub limite le débit.
// Renvoie null pour une page absente (404, 410, 422, 451), lève une erreur sinon.
export async function chercher(url, { essais = 4, delai = 30_000, ...init } = {}) {
  let derniere;
  for (let i = 0; i < essais; i += 1) {
    try {
      const r = await fetch(url, { ...init, signal: AbortSignal.timeout(delai) });
      if (r.ok) return r;
      if ([404, 410, 422, 451].includes(r.status)) return null;
      derniere = new Error(`${r.status} ${String(url).slice(0, 120)}`);
      if (r.status === 403 || r.status === 429) {
        const reset = Number(r.headers.get('x-ratelimit-reset'));
        const restant = r.headers.get('x-ratelimit-remaining');
        const attente = Number(r.headers.get('retry-after')) || (restant === '0' && reset ? reset - Date.now() / 1000 + 2 : 60);
        await pause(Math.min(Math.max(attente, 5), 900) * 1000);
        continue;
      }
    } catch (e) { derniere = e; }
    await pause(2000 * 2 ** i);
  }
  throw derniere ?? new Error(`échec ${url}`);
}
export const json = async (url, opts) => (await chercher(url, opts))?.json() ?? null;
export const texte = async (url, opts) => (await chercher(url, opts))?.text() ?? null;

export function clientGithub(jeton) {
  const entetes = { 'User-Agent': 'le-labo-annuaire', Accept: 'application/vnd.github+json', Authorization: `Bearer ${jeton}` };
  const api = (chemin, attente = 0) => (attente ? pause(attente) : Promise.resolve()).then(() => json(`https://api.github.com${chemin}`, { headers: entetes }));
  // Fichier brut d'un dépôt. Absent ou illisible : null, sans bloquer le passage.
  const brut = async (repo, chemin) => {
    try { return await texte(`https://raw.githubusercontent.com/${repo}/HEAD/${chemin.split('/').map(encodeURIComponent).join('/')}`, { essais: 2, delai: 20_000 }); } catch { return null; }
  };
  const graphql = (requete) => json('https://api.github.com/graphql', { method: 'POST', headers: entetes, body: JSON.stringify({ query: requete }), delai: 60_000 });
  return { entetes, api, brut, graphql };
}

export async function parLots(liste, taille, travail) {
  const erreurs = [];
  for (let i = 0; i < liste.length; i += taille) {
    const r = await Promise.allSettled(liste.slice(i, i + taille).map(travail));
    for (const x of r) if (x.status === 'rejected') erreurs.push(x.reason?.message ?? String(x.reason));
  }
  return erreurs;
}

// Public Suffix List : domaine enregistrable d'un nom d'hôte (figma.com pour mcp.figma.com, bbc.co.uk pour www.bbc.co.uk).
export async function chargerSuffixes() {
  const brut = await texte('https://publicsuffix.org/list/public_suffix_list.dat');
  const normales = new Set();
  const jokers = new Set();
  const exceptions = new Set();
  for (const l of (brut ?? '').split('\n').map((x) => x.trim().toLowerCase())) {
    if (!l || l.startsWith('//')) continue;
    if (l.startsWith('!')) exceptions.add(l.slice(1));
    else if (l.startsWith('*.')) jokers.add(l.slice(2));
    else normales.add(l);
  }
  if (normales.size < 1000) throw new Error('Public Suffix List illisible');
  return (hote) => {
    const etiquettes = String(hote ?? '').toLowerCase().replace(/\.$/, '').split('.').filter(Boolean);
    if (etiquettes.length < 2) return null;
    let suffixe = 1;
    for (let i = 0; i < etiquettes.length; i += 1) {
      const candidat = etiquettes.slice(i).join('.');
      const parent = etiquettes.slice(i + 1).join('.');
      if (exceptions.has(candidat)) { suffixe = etiquettes.length - i - 1; break; }
      if (normales.has(candidat) || (parent && jokers.has(parent))) { suffixe = etiquettes.length - i; break; }
    }
    return etiquettes.slice(Math.max(0, etiquettes.length - suffixe - 1)).join('.');
  };
}

export const hoteDe = (url) => { try { return new URL(url).hostname.toLowerCase(); } catch { return null; } };

// Une adresse MCP valable : https, un vrai nom d'hôte, sans modèle à remplir.
export function adresseValable(url) {
  if (typeof url !== 'string' || /[\s{}<>]/.test(url) || !/^https:\/\//i.test(url)) return null;
  const hote = hoteDe(url);
  return hote && hote.includes('.') && !/^(localhost|127\.|0\.0\.0\.0)/.test(hote) ? url : null;
}
// mcp.exemple.com/sse et mcp.exemple.com/v2/mcp désignent le même serveur.
export function cheminHeberge(url) {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname.toLowerCase().replace(/\/(mcp|sse|v\d+|api|public|stream|streamable-http)(?=\/|$)/g, '').replace(/\/+$/, '')}`;
  } catch { return url; }
}
// Une commande copiée dans un terminal : on refuse tout ce qui n'est pas un nom de paquet simple.
export const identifiantSur = (v) => (typeof v === 'string' && /^[@\w][\w@./:=+-]*$/.test(v) && v.length <= 120 ? v : null);

export function lireConfig(racine) {
  return {
    config: JSON.parse(readFileSync(new URL('data/classement.config.json', racine), 'utf8')),
    taxonomie: JSON.parse(readFileSync(new URL('data/taxonomy.json', racine), 'utf8')),
  };
}
