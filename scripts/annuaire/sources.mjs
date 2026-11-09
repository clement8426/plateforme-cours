// Les sources de l'annuaire. Chaque fonction lit un répertoire public et remplit la base.
// Un répertoire reconnu donne une « référence » : elle s'écrit sur la fiche et justifie la publication.
import { empreinte } from './base.mjs';
import { adresseValable, chercher, hoteDe, identifiantSur, journal, json, nettoyer, parLots, pause, repoDe, texte } from './outils.mjs';

const champ = (md, nom) => md?.match(new RegExp(`^${nom}:\\s*(.+)$`, 'm'))?.[1].replace(/^["'>|-]+\s*|["']\s*$/g, '').trim();
const premierParagraphe = (md) => (md ?? '').replace(/<[^>]+>/g, ' ').split(/\n\s*\n/).map((b) => b.trim()).find((b) => b && !/^(#|!\[|\[!\[|\||```|-{3,}|<)/.test(b));

// Serveurs MCP en ligne d'un fichier .mcp.json : la clé du serveur donne son nom, l'adresse son accès.
export function serveursDe(contenu) {
  try {
    const c = JSON.parse(contenu);
    return Object.entries(c.mcpServers ?? c).map(([cle, v]) => ({ cle, url: adresseValable(v?.url) })).filter((x) => x.url);
  } catch { return []; }
}
const majuscule = (t) => (/^[a-z][a-z0-9-]*$/.test(t) ? t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ') : t);

// ---------- Registres MCP (officiel et GitHub) : même format ----------
const COMMANDES = {
  npm: (p) => `npx -y ${identifiantSur(p.identifier)}${p.version ? `@${identifiantSur(p.version)}` : ''}`,
  pypi: (p) => `uvx ${identifiantSur(p.identifier)}${p.version ? `==${identifiantSur(p.version)}` : ''}`,
  oci: (p) => `docker run -i --rm ${identifiantSur(p.identifier)}`,
};

export function depuisRegistre(s, base, domaineDe, ref) {
  const espace = String(s.name ?? '').split('/')[0].toLowerCase();
  const compteGithub = espace.match(/^(?:io|com)\.github\.(.+)$/)?.[1];
  const repo = repoDe(s.repository?.url);
  const proprietaire = repo?.split('/')[0].toLowerCase();
  let repoOk = false;
  let dom = null;
  if (compteGithub) {
    // io.github.alice ne peut publier que le dépôt d'alice : le reste est une usurpation.
    if (repo && proprietaire !== compteGithub) return null;
    repoOk = !!repo;
  } else if (espace.includes('.')) {
    dom = domaineDe(espace.split('.').reverse().join('.'));
    const marque = dom?.split('.')[0]?.replace(/[-_]/g, '');
    repoOk = !!repo && !!marque && proprietaire.replace(/[-_]/g, '') === marque;
  }
  const paquets = (s.packages ?? []).filter((p) => identifiantSur(p.identifier));
  const premier = paquets.find((p) => COMMANDES[p.registryType]);
  // Un paquet npm dont la portée est celle du dépôt prouve aussi la propriété.
  const portee = premier?.registryType === 'npm' ? premier.identifier.match(/^@([^/]+)\//)?.[1]?.toLowerCase() : null;
  if (!repoOk && repo && portee && portee === proprietaire) repoOk = true;
  const url = adresseValable((s.remotes ?? []).map((r) => r.url).find(adresseValable));
  return base.ajouterMcp({
    n: nettoyer(s.title ?? s.name), nomPropre: !!s.title, d: nettoyer(s.description),
    repo, sousDossier: s.repository?.subfolder ?? null, repoOk, prouve: repoOk && (!!compteGithub || !!dom || !!portee),
    cmd: premier ? COMMANDES[premier.registryType](premier) : null,
    paquet: premier ? { type: premier.registryType, id: premier.identifier } : null,
    local: paquets.length > 0, url, dom: dom ?? null,
    domVerifie: !!(dom && url && domaineDe(hoteDe(url)) === dom),
    refs: ref ? [ref] : [],
  });
}

export async function registre(base, domaineDe, { adresse, ref, pagesMax, version = true }) {
  let curseur;
  let pages = 0;
  let n = 0;
  do {
    const u = new URL(adresse);
    u.searchParams.set('limit', '100');
    if (version) u.searchParams.set('version', 'latest');
    if (curseur) u.searchParams.set('cursor', curseur);
    const page = await json(u);
    if (!page) throw new Error(`registre illisible : ${adresse}`);
    for (const e of page.servers ?? []) {
      const s = e.server ?? e;
      const statut = e._meta?.['io.modelcontextprotocol.registry/official']?.status;
      if (statut && statut !== 'active') continue;
      if (depuisRegistre(s, base, domaineDe, ref)) n += 1;
    }
    curseur = page.metadata?.nextCursor ?? page.metadata?.next_cursor;
    pages += 1;
  } while (curseur && pages < pagesMax);
  if (!n) throw new Error(`registre vide : ${adresse}`);
  return n;
}

// ---------- Places de marché de plugins : un fichier JSON qui liste les plugins ----------
export async function marketplace(base, gh, { repo, chemin, ref, manifeste }) {
  const m = await json(`https://raw.githubusercontent.com/${repo}/HEAD/${chemin}`, { delai: 30_000 });
  if (!m?.plugins?.length) throw new Error(`marketplace vide : ${repo}`);
  const erreurs = await parLots(m.plugins, 12, async (p) => {
    if (!p?.name) return;
    const externe = typeof p.source === 'object' ? (repoDe(p.source.url) ?? (p.source.repo ? repoDe(`github.com/${p.source.repo}`) : null)) : null;
    const dossier = typeof p.source === 'string' ? p.source.replace(/^\.\//, '').replace(/\/$/, '') : '';
    const racine = externe ?? repo;
    const prefixe = externe ? '' : dossier ? `${dossier}/` : '';
    let nom = p.displayName ?? p.name;
    let d = p.description;
    if (manifeste) {
      try { const f = JSON.parse(await gh.brut(racine, `${prefixe}${manifeste}`) ?? '{}'); nom = f.interface?.displayName ?? f.displayName ?? nom; d = d ?? f.description ?? f.interface?.shortDescription; } catch { /* fiche absente */ }
    }
    base.ajouter('plugins', { n: nettoyer(p.name), repo: racine, d: nettoyer(d), refs: [ref], partage: !externe, nomPropre: false, affichage: nettoyer(nom) });
    // Les serveurs MCP déclarés par le plugin, chez celui qui le publie.
    for (const f of ['.mcp.json', 'mcp.json']) {
      const contenu = await gh.brut(racine, `${prefixe}${f}`);
      if (!contenu) continue;
      const serveurs = serveursDe(contenu);
      // Le nom d'un serveur est la clé de son fichier ; celui du plugin ne dit rien d'un serveur qui l'accompagne.
      for (const { cle, url } of serveurs) {
        const nomServeur = serveurs.length === 1 && cle.toLowerCase() === String(p.name).toLowerCase() ? nom : majuscule(cle);
        base.ajouterMcp({ n: nettoyer(nomServeur), nomPropre: true, d: `Serveur MCP en ligne de ${nettoyer(nomServeur)}.`, url, refs: [ref] });
      }
      break;
    }
  });
  return { n: m.plugins.length, erreurs };
}

// ---------- Dépôts de skills d'éditeurs : chaque SKILL.md compte ----------
export async function depotSkills(base, gh, { repo, ref, dossier = '' }) {
  const arbre = await gh.api(`/repos/${repo}/git/trees/HEAD?recursive=1`);
  if (!arbre?.tree) throw new Error(`dépôt illisible : ${repo}`);
  const fichiers = arbre.tree.filter((x) => x.type === 'blob' && /(^|\/)SKILL\.md$/.test(x.path) && (!dossier || x.path.startsWith(`${dossier}/`)));
  const erreurs = await parLots(fichiers, 16, async (x) => {
    const contenu = await gh.brut(repo, x.path);
    const parties = x.path.split('/');
    const nom = champ(contenu, 'name') ?? parties[parties.length - 2] ?? repo.split('/')[1];
    base.ajouter('skills', { n: nettoyer(nom), repo, d: nettoyer(champ(contenu, 'description')), h: empreinte(contenu), refs: [ref], partage: true });
  });
  return { n: fichiers.length, erreurs };
}

// ---------- Docker : catalogue officiel de serveurs MCP ----------
export async function docker(base, gh) {
  const dossiers = await gh.api('/repos/docker/mcp-registry/contents/servers');
  if (!dossiers?.length) throw new Error('catalogue Docker illisible');
  const erreurs = await parLots(dossiers.filter((x) => x.type === 'dir'), 16, async (x) => {
    const y = await gh.brut('docker/mcp-registry', `servers/${x.name}/server.yaml`);
    if (!y) return;
    const titre = y.match(/^\s+title:\s*(.+)$/m)?.[1]?.replace(/["']/g, '');
    const d = nettoyer(y.match(/^\s+description:\s*(.+)$/m)?.[1]?.replace(/^["'>|-]+\s*|["']$/g, ''));
    const image = identifiantSur(y.match(/^image:\s*(\S+)/m)?.[1]);
    const distant = adresseValable(y.match(/^remote:[^\n]*\n(?:[ \t]+[^\n]*\n)*?[ \t]+url:[ \t]*(\S+)/m)?.[1]);
    base.ajouterMcp({
      n: nettoyer(titre ?? x.name), nomPropre: !!titre, d, repo: repoDe(y.match(/^\s+project:\s*(\S+)/m)?.[1]), repoOk: true,
      cmd: image ? `docker run -i --rm ${image}` : null, paquet: image ? { type: 'oci', id: image } : null, local: !!image, url: distant, refs: ['docker'],
    });
  });
  return { n: dossiers.length, erreurs };
}

// ---------- Dossiers d'un dépôt qui contient plusieurs serveurs MCP (projet MCP, AWS) ----------
export async function serveursDeDepot(base, gh, { repo, dossier, ref, pyproject }) {
  const liste = await gh.api(`/repos/${repo}/contents/${dossier}`);
  if (!liste?.length) throw new Error(`dépôt illisible : ${repo}`);
  const dossiers = liste.filter((x) => x.type === 'dir');
  const erreurs = await parLots(dossiers, 12, async (x) => {
    let d = '';
    let cmd = null;
    let paquet = null;
    if (pyproject) {
      const t = await gh.brut(repo, `${dossier}/${x.name}/pyproject.toml`);
      const nom = t?.match(/^name\s*=\s*"([^"]+)"/m)?.[1];
      const version = t?.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
      d = nettoyer(t?.match(/^description\s*=\s*"([^"]+)"/m)?.[1]);
      if (identifiantSur(nom)) { cmd = `uvx ${nom}${identifiantSur(version) ? `==${version}` : ''}`; paquet = { type: 'pypi', id: nom }; }
    } else d = nettoyer(premierParagraphe(await gh.brut(repo, `${dossier}/${x.name}/README.md`)));
    base.ajouterMcp({ n: nettoyer(x.name), d, repo, sousDossier: `${dossier}/${x.name}`, repoOk: true, prouve: true, cmd, paquet, local: true, refs: [ref] });
  });
  return { n: dossiers.length, erreurs };
}

// ---------- Google Cloud : la liste officielle des serveurs MCP hébergés ----------
export async function googleCloud(base) {
  const md = await texte('https://docs.cloud.google.com/mcp/supported-products.md.txt');
  if (!md) throw new Error('liste Google illisible');
  let n = 0;
  for (const ligne of md.split('\n').filter((l) => l.startsWith('|'))) {
    const cases = ligne.split('|').map((c) => c.trim());
    const nom = cases[1];
    const url = cases[2]?.match(/https:\/\/[^\s`)]+/g)?.find((u) => !/REGION|\.rep\./i.test(u));
    if (!nom || !adresseValable(url) || /^-+$/.test(nom) || /^Product$/i.test(nom)) continue;
    const sansLiens = nom.replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    const propre = nettoyer(sansLiens.replace(/\s*\((?:Preview|Pre-GA|GA)\)\s*/gi, ''));
    base.ajouterMcp({ n: propre, nomPropre: true, d: `Serveur MCP hébergé par Google pour ${propre}.`, url, cloud: true, refs: ['google'] });
    n += 1;
  }
  if (!n) throw new Error('liste Google vide');
  return { n, erreurs: [] };
}

// ---------- Répertoire public des connecteurs Claude : lecture limitée ----------
// Anthropic n'interdit ni n'autorise expressément la lecture de ces pages (ses conditions générales visent ses « Services »).
// On s'en tient donc à : une fois par semaine, une fiche toutes les 1,5 seconde, un client qui se présente, robots.txt respecté,
// et seulement le nom et l'adresse du serveur, deux faits. Les descriptions sont les nôtres.
export async function connecteursClaude(base, etat, { pauseMs = 1500, jours = 6, force = false }) {
  const memoire = etat.claude ?? { date: null, entrees: [] };
  const recent = memoire.date && Date.now() - Date.parse(memoire.date) < jours * 86_400_000;
  if (recent && !force) {
    for (const e of memoire.entrees) base.ajouterMcp({ n: e.n, nomPropre: true, d: `Serveur MCP en ligne de ${e.n}.`, url: e.url, refs: ['claude'] });
    return { n: memoire.entrees.length, erreurs: [], note: 'liste de la semaine reprise' };
  }
  const robots = await texte('https://claude.com/robots.txt');
  if (!robots || /^\s*Disallow:\s*\/(marketplace)?\s*$/im.test(robots.split(/User-agent:/i).find((b) => /^\s*\*/.test(b)) ?? '')) throw new Error('robots.txt ne permet pas la lecture');
  const plan = await texte('https://claude.com/sitemap.xml');
  const fiches = [...(plan ?? '').matchAll(/<loc>(https:\/\/claude\.com\/marketplace\/connectors\/([^<\/]+))<\/loc>/g)].map((m) => ({ url: m[1], slug: m[2] }));
  if (fiches.length < 100) throw new Error('liste des fiches Claude illisible');
  const entrees = [];
  const erreurs = [];
  let refus = 0;
  for (const f of fiches) {
    try {
      const r = await chercher(f.url, { essais: 1, delai: 20_000, headers: { 'User-Agent': 'le-labo-annuaire (+https://www.labonumerique.ch)' } });
      if (!r) continue;
      refus = 0;
      const h = await r.text();
      const nom = nettoyer(h.match(/<title>([^<|]+?)(?: connector| plugin)?\s*\|/)?.[1], 80);
      const url = adresseValable(h.match(/Copy connector URL:\s*(https:\/\/[^"<\s]+)/)?.[1]);
      if (nom && url) entrees.push({ n: nom, url });
    } catch (e) {
      erreurs.push(e.message);
      refus += 1;
      if (refus >= 3) throw new Error(`le site refuse les requêtes : ${e.message}`);
    }
    await pause(pauseMs);
  }
  if (entrees.length < fiches.length * 0.4) throw new Error(`trop peu d'adresses lues : ${entrees.length} sur ${fiches.length}`);
  etat.claude = { date: new Date().toISOString(), entrees };
  for (const e of entrees) base.ajouterMcp({ n: e.n, nomPropre: true, d: `Serveur MCP en ligne de ${e.n}.`, url: e.url, refs: ['claude'] });
  return { n: entrees.length, erreurs };
}

// ---------- skills.sh (Vercel) : installations réelles et éditeurs officiels ----------
// L'API exige un jeton Vercel et robots.txt interdit /api/ : on lit donc les pages publiques, une par seconde au plus,
// une fois par semaine. Le plan du site est trié par installations : on s'arrête sous le seuil.
const installsDe = (t) => { const m = String(t ?? '').replace(/,/g, '').match(/([\d.]+)\s*([KM])?/i); return m ? Math.round(Number(m[1]) * ({ K: 1e3, M: 1e6 }[m[2]?.toUpperCase()] ?? 1)) : 0; };
export async function skillsSh(base, etat, { pauseMs = 1000, jours = 6, installsMin = 1000, installsMinOfficiel = 100, pagesMax = 6000, force = false, sansLecture = false }) {
  const verser = (liste) => {
    for (const e of liste) {
      const refs = [...(e.officiel && e.installs >= installsMinOfficiel ? ['editeur'] : []), ...(e.installs >= installsMin ? ['skillssh'] : [])];
      if (refs.length) base.ajouter('skills', { n: e.n, repo: e.repo, d: e.d, installs: e.installs, auditEchec: e.auditEchec, refs });
    }
  };
  const memoire = etat.skillssh;
  const recent = memoire?.date && Date.now() - Date.parse(memoire.date) < jours * 86_400_000;
  if (memoire?.entrees?.length && !force && (recent || sansLecture)) { verser(memoire.entrees); return { n: memoire.entrees.length, erreurs: [], note: 'liste de la semaine reprise' }; }
  const lecture = async () => {
  const lire = async (chemin) => { const t = await texte(`https://skills.sh${chemin}`, { essais: 2, delai: 20_000, headers: { 'User-Agent': 'le-labo-annuaire (+https://www.labonumerique.ch)' } }); await pause(pauseMs); return t; };
  const robots = await lire('/robots.txt');
  if (!robots || /^\s*Disallow:\s*\/\s*$/im.test(robots)) throw new Error('robots.txt ne permet pas la lecture');
  const entrees = new Map();
  const cle = (repo, n) => `${repo}#${n}`.toLowerCase();
  const proprietaires = [...((await lire('/official')) ?? '').matchAll(/href="\/([\w.-]+)"><div class="min-w-0 flex items-center gap-3">/g)].map((m) => m[1]);
  if (proprietaires.length < 20) throw new Error('liste des éditeurs officiels illisible');
  const erreurs = [];
  for (const o of proprietaires) {
    try {
      const page = (await lire(`/${o}`)) ?? '';
      const depots = [...new Set([...page.matchAll(new RegExp(`href="/${o.replace(/\./g, '\\.')}/([\\w.-]+)"`, 'g'))].map((m) => m[1]))];
      for (const d of depots) {
        const h = (await lire(`/${o}/${d}`)) ?? '';
        for (const m of h.matchAll(/href="\/[\w.-]+\/[\w.-]+\/([^"]+)"[^>]*><div[^>]*><h3[^>]*>([^<]+)<\/h3><\/div><div[^>]*><span[^>]*>([\d.,]+[KM]?)<\/span>/g)) {
          const repo = `${o}/${d}`;
          entrees.set(cle(repo, m[2]), { n: nettoyer(m[2], 120), repo, slug: m[1], installs: installsDe(m[3]), officiel: true });
        }
      }
    } catch (e) { erreurs.push(`${o} : ${e.message}`); }
  }
  let bas = 0;
  let lues = 0;
  for (const carte of ['sitemap-skills-1.xml', 'sitemap-skills-2.xml']) {
    const plan = (await lire(`/${carte}`)) ?? '';
    for (const [, chemin] of plan.matchAll(/<loc>https:\/\/(?:www\.)?skills\.sh\/([^<]+)<\/loc>/g)) {
      if (bas >= 300 || lues >= pagesMax) break;
      const [o, d, ...reste] = chemin.split('/');
      if (!o || !d || !reste.length) continue;
      try {
        const h = await lire(`/${chemin}`);
        if (!h) continue;
        lues += 1;
        const installs = installsDe(h.replace(/<[^>]+>/g, ' ').match(/Installs\s+([\d.,]+\s?[KM]?)/)?.[1]);
        bas = installs < installsMin ? bas + 1 : 0;
        if (installs < installsMin) continue;
        const nom = nettoyer(h.match(/<title>([^<]+?)\s+[—–-]\s+[\w.-]+\/[\w.-]+/)?.[1] ?? reste.join('/'), 120);
        const repo = `${o}/${d}`;
        const present = entrees.get(cle(repo, nom));
        entrees.set(cle(repo, nom), { ...present, n: nom, repo, installs, d: nettoyer(h.match(/<meta name="description" content="([^"]*)"/)?.[1]), auditEchec: />Fail</.test(h) || undefined });
      } catch (e) { erreurs.push(`${chemin} : ${e.message}`); if (erreurs.length > 100) throw new Error(`trop d'erreurs sur skills.sh : ${e.message}`); }
    }
    if (bas >= 300 || lues >= pagesMax) break;
  }
  // Les éditeurs officiels sous le seuil général : leur fiche donne la description et les audits.
  for (const e of entrees.values()) {
    if (lues >= pagesMax) break;
    if (!e.officiel || e.d || e.installs < installsMinOfficiel || !e.slug) continue;
    try {
      const h = await lire(`/${e.repo}/${e.slug}`);
      if (!h) continue;
      lues += 1;
      e.d = nettoyer(h.match(/<meta name="description" content="([^"]*)"/)?.[1]);
      if (/>Fail</.test(h)) e.auditEchec = true;
    } catch (err) { erreurs.push(`${e.repo}/${e.slug} : ${err.message}`); if (erreurs.length > 100) throw new Error(`trop d'erreurs sur skills.sh : ${err.message}`); }
  }
  const liste = [...entrees.values()].filter((e) => e.installs >= installsMinOfficiel).map(({ slug, ...e }) => e);
  if (liste.length < 200) throw new Error(`skills.sh : trop peu de skills lus (${liste.length})`);
  etat.skillssh = { date: new Date().toISOString(), entrees: liste };
  verser(liste);
  journal('skills.sh pages lues', lues, 'éditeurs', proprietaires.length);
  return { n: liste.length, erreurs };
  };
  // Une panne garde la liste de la semaine : un site indisponible ne retire rien de l'annuaire.
  try { return await lecture(); } catch (err) {
    if (!memoire?.entrees?.length) throw err;
    journal('skills.sh indisponible, liste précédente gardée :', err.message);
    verser(memoire.entrees);
    return { n: memoire.entrees.length, erreurs: [] };
  }
}

// ---------- Ajouts manuels : éditeurs officiels absents des répertoires ----------
export function ajoutsManuels(base, ajouts) {
  for (const a of ajouts) base.ajouterMcp({ n: nettoyer(a.nom), nomPropre: true, d: nettoyer(a.description), url: adresseValable(a.adresse), local: !!a.local, dom: a.domaine, domVerifie: !!a.domaine, refs: ['editeur'] });
  return { n: ajouts.length, erreurs: [] };
}

// ---------- Extensions Gemini : seules celles de Google comptent comme référencées ----------
export async function gemini(base) {
  const liste = await json('https://geminicli.com/extensions.json', { delai: 60_000 });
  const e = Array.isArray(liste) ? liste : liste?.extensions;
  if (!e?.length) throw new Error('galerie Gemini illisible');
  const vrai = (v) => v === true || v === 'True' || v === 'true';
  for (const x of e) {
    if (!x.fullName) continue;
    const refs = vrai(x.isGoogleOwned) ? ['google'] : [];
    const d = nettoyer(x.extensionDescription ?? x.repoDescription);
    const nom = nettoyer(x.extensionName ?? x.fullName);
    if (vrai(x.hasMCP) && refs.length) base.ajouterMcp({ n: nom, d, repo: x.fullName, repoOk: true, local: true, refs });
    if (vrai(x.hasSkills)) base.ajouter('skills', { n: nom, repo: x.fullName, d, refs, recherche: !refs.length });
    else base.ajouter('plugins', { n: nom, repo: x.fullName, d, refs, recherche: !refs.length });
  }
  return { n: e.length, erreurs: [] };
}

// ---------- Recherche GitHub : topics et fichiers. Plafond de 1 000 résultats par requête ----------
export async function topics(base, gh, { liste, etoilesMin }) {
  const parleDeMcp = (it) => /\bmcp\b|model context protocol/i.test(`${it.name} ${it.description ?? ''}`.replace(/[-_]/g, ' '));
  for (const [nature, noms] of Object.entries(liste)) {
    for (const t of noms) {
      const q = `topic:${t} fork:false stars:>=${etoilesMin}`;
      for (let page = 1; page <= 10; page += 1) {
        const d = await gh.api(`/search/repositories?q=${encodeURIComponent(q)}&per_page=100&page=${page}`, 2100);
        for (const it of d?.items ?? []) {
          if (nature === 'mcp') { if (parleDeMcp(it)) base.ajouterMcp({ n: nettoyer(it.name), d: nettoyer(it.description), repo: it.full_name, repoOk: true, local: true, recherche: true }); }
          else base.ajouter(nature, { n: nettoyer(it.name), repo: it.full_name, d: nettoyer(it.description), recherche: true });
        }
        if ((d?.items ?? []).length < 100) break;
      }
    }
  }
}

export async function rechercheFichiers(base, gh, { requete, tranche, maxTaille, minutes, traiter }) {
  const fin = Date.now() + minutes * 60_000;
  const pile = [];
  for (let a = 0; a < maxTaille; a += tranche) pile.push([a, a + tranche - 1]);
  for (let i = pile.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [pile[i], pile[j]] = [pile[j], pile[i]]; }
  pile.push([maxTaille, 10_000_000]);
  let vus = 0;
  while (pile.length && Date.now() < fin) {
    const [a, b] = pile.shift();
    const url = (page) => `/search/code?q=${encodeURIComponent(`${requete} size:${a}..${b}`)}&per_page=100&page=${page}`;
    const premier = await gh.api(url(1), 6200);
    if (!premier) continue;
    if (premier.total_count > 1000 && b > a) { const m = Math.floor((a + b) / 2); pile.unshift([a, m], [m + 1, b]); continue; }
    let d = premier;
    for (let page = 1; ; page += 1) {
      await parLots(d.items ?? [], 12, async (it) => { await traiter(it); vus += 1; });
      if ((d.items ?? []).length < 100 || page >= 10 || Date.now() >= fin) break;
      d = await gh.api(url(page + 1), 6200);
      if (!d) break;
    }
  }
  journal(requete, 'résultats', vus, 'tranches restantes', pile.length);
}

export const traiterMarketplace = (base, gh) => async (it) => {
  const repo = it.repository.full_name;
  let m;
  try { m = JSON.parse(await gh.brut(repo, it.path) ?? ''); } catch { return; }
  for (const p of m.plugins ?? []) {
    if (!p?.name) continue;
    const externe = typeof p.source === 'object' ? (repoDe(p.source.url) ?? (p.source.repo ? repoDe(`github.com/${p.source.repo}`) : null)) : null;
    base.ajouter('plugins', { n: nettoyer(p.name), repo: externe ?? repo, d: nettoyer(p.description), recherche: true });
  }
};
export const traiterPlugin = (base, gh) => async (it) => {
  const repo = it.repository.full_name;
  try { const p = JSON.parse(await gh.brut(repo, it.path) ?? ''); if (p.name) base.ajouter('plugins', { n: nettoyer(p.name), repo, d: nettoyer(p.description), recherche: true }); } catch { /* fichier invalide */ }
};
export const traiterSkill = (base, gh) => async (it) => {
  const repo = it.repository.full_name;
  const contenu = await gh.brut(repo, it.path);
  const parties = it.path.split('/');
  base.ajouter('skills', { n: nettoyer(champ(contenu, 'name') ?? parties[parties.length - 2] ?? it.repository.name), repo, d: nettoyer(champ(contenu, 'description')), h: empreinte(contenu), recherche: true });
};

export { pause, chercher };
