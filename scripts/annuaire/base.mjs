// Base des entrées de l'annuaire. Une entrée MCP regroupe tout ce qu'on sait d'un même serveur :
// son dépôt, son paquet local, son adresse en ligne, les répertoires qui le citent.
import { createHash } from 'node:crypto';
import { cheminHeberge, hoteDe } from './outils.mjs';

export function creerBase(domaineDe = () => null) {
  const mcp = [];
  const parId = new Map();
  const simples = { plugins: new Map(), skills: new Map() };

  const ids = (e) => [
    e.repo && `repo:${e.repo.toLowerCase()}${e.sousDossier ? `/${e.sousDossier.toLowerCase()}` : ''}`,
    e.paquet && `pkg:${e.paquet.type}:${e.paquet.id.toLowerCase().replace(/@[\w.+-]+$/, '')}`,
    e.url && `url:${cheminHeberge(e.url)}`,
    // Une même marque garde parfois plusieurs adresses (mcp.hubspot.com, app.hubspot.com) : domaine et nom les réunissent.
    e.url && e.n && domaineDe(hoteDe(e.url)) && `marque:${domaineDe(hoteDe(e.url))}:${e.n.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
  ].filter(Boolean);

  // Fusion de deux descriptions du même serveur : les champs vides se remplissent, les références s'additionnent.
  function fusionner(a, b) {
    for (const r of b.refs ?? []) a.refs.add(r);
    if (b.nomPropre && !a.nomPropre) { a.n = b.n; a.nomPropre = true; }
    if (!a.d && b.d) a.d = b.d;
    for (const c of ['repo', 'sousDossier', 'cmd', 'url', 'paquet', 'dom']) if (!a[c] && b[c]) a[c] = b[c];
    a.repoOk ||= b.repoOk;
    a.prouve ||= b.prouve;
    a.domVerifie ||= b.domVerifie;
    a.recherche = a.recherche && b.recherche;
  }

  // Une référence mal placée est une fausse étoile : sans preuve de propriété, le dépôt n'est pas retenu.
  function ajouterMcp(e) {
    const entree = { ...e, refs: new Set(e.refs ?? []), repoOk: !!(e.repoOk && e.repo), prouve: !!(e.prouve && e.repo), domVerifie: !!e.domVerifie };
    if (!entree.repoOk) { entree.repo = null; entree.sousDossier = null; }
    const connus = ids(entree);
    const cible = connus.map((i) => parId.get(i)).find(Boolean);
    if (cible) { fusionner(cible, entree); for (const i of ids(cible)) parId.set(i, cible); return cible; }
    mcp.push(entree);
    for (const i of connus) parId.set(i, entree);
    return entree;
  }

  function ajouter(nature, e) {
    const cle = `${e.repo}#${e.n}`.toLowerCase();
    const carte = simples[nature];
    const present = carte.get(cle);
    const entree = { repoOk: true, ...e, refs: new Set(e.refs ?? []) };
    if (!present) { carte.set(cle, entree); return entree; }
    for (const r of entree.refs) present.refs.add(r);
    if (entree.nomPropre && !present.nomPropre) { present.n = entree.n; present.nomPropre = true; }
    if (!present.d && entree.d) present.d = entree.d;
    if (!present.h && entree.h) present.h = entree.h;
    if (entree.installs) present.installs = entree.installs;
    if (entree.auditEchec) present.auditEchec = true;
    present.recherche = present.recherche && entree.recherche;
    return present;
  }

  return { mcp, simples, ajouterMcp, ajouter, compte: () => ({ mcp: mcp.length, plugins: simples.plugins.size, skills: simples.skills.size }) };
}

// Empreinte du contenu d'un skill : deux copies identiques ont la même.
export const empreinte = (texte) => (texte ? createHash('sha1').update(texte.toLowerCase().replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 16) : null);
