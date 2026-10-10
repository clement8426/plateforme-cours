// Vérifie le site construit et servi (npm run build, puis npm start) : accessibilité (axe) en clair et en sombre,
// bureau et mobile, structure des titres, clavier, mémoire de progression, liens profonds vers Tilleul.
// Playwright et axe viennent de la boîte à outils ux-outils : UX_OUTILS=../ux-outils npm run verifier
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

if (!process.env.UX_OUTILS) {
  console.error('Indiquez le dossier de ux-outils : UX_OUTILS=../ux-outils npm run verifier');
  process.exit(1);
}
const exiger = createRequire(resolve(process.env.UX_OUTILS, 'package.json'));
const { chromium } = exiger('playwright');
const { AxeBuilder } = exiger('@axe-core/playwright');

const base = process.env.SITE_URL ?? 'http://localhost:3000';
const b = await chromium.launch();
const ok = [];
const verifier = (nom, bon, detail = '') => { ok.push(bon); console.log(bon ? 'OK    ' : 'ÉCHEC ', nom, detail); };

const PAGES = ['/', '/ux/', '/ux/ux-ia/', '/ux/ux-ia/diapos/', '/ux/ux-ia/exercices/', '/ux/ux-ia/comparer/formulaire-adresse/', '/ux/ux-ia/sources/', '/ia-legislation/', '/hors-ligne/', '/page-qui-nexiste-pas/'];

// 1. Accessibilité automatique, deux thèmes, deux tailles
for (const [nom, vp, mobile] of [['bureau', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
  for (const schema of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: vp, colorScheme: schema, isMobile: mobile, hasTouch: mobile });
    const p = await ctx.newPage();
    let violations = [];
    for (const u of PAGES) {
      await p.goto(base + u);
      await p.waitForLoadState('networkidle');
      await p.waitForTimeout(1700);
      const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).exclude('iframe').analyze();
      for (const v of r.violations) violations.push(`${u} ${v.id} (${v.nodes.length}) ${v.nodes[0].target.join(' ')}`);
      const deborde = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (deborde) violations.push(`${u} débordement horizontal`);
    }
    verifier(`axe + débordement, ${nom}, thème ${schema === 'dark' ? 'sombre' : 'clair'}, ${PAGES.length} pages`, violations.length === 0, violations.join(' | '));
    await ctx.close();
  }
}

// 2. Structure : un seul h1, titres sans saut, titre unique, repères
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const titres = new Set();
  let problemes = [];
  for (const u of PAGES.filter((x) => !x.includes('qui-nexiste'))) {
    await p.goto(base + u);
    await p.waitForLoadState('networkidle');
    const info = await p.evaluate(() => {
      const niveaux = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]));
      let saut = false; niveaux.forEach((n, i) => { if (i && n - niveaux[i - 1] > 1) saut = true; });
      return { h1: niveaux.filter((n) => n === 1).length, saut, titre: document.title, main: document.querySelectorAll('main').length, lang: document.documentElement.lang };
    });
    if (info.h1 !== 1) problemes.push(`${u} : ${info.h1} h1`);
    if (info.saut) problemes.push(`${u} : saut de niveau de titre`);
    if (info.main !== 1) problemes.push(`${u} : ${info.main} main`);
    if (info.lang !== 'fr') problemes.push(`${u} : lang ${info.lang}`);
    if (titres.has(info.titre)) problemes.push(`${u} : titre de page en double « ${info.titre} »`);
    titres.add(info.titre);
  }
  verifier('structure : un h1, titres sans saut, un main, lang fr, titres de page uniques', problemes.length === 0, problemes.join(' | '));
  await ctx.close();
}

// 3. Clavier : lien d'évitement, ordre, repère de focus, page courante
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + '/ux/ux-ia/');
  await p.waitForLoadState('networkidle');
  await p.keyboard.press('Tab');
  verifier('Tab : le premier arrêt est le lien « Aller au contenu »', (await p.evaluate(() => document.activeElement?.textContent)) === 'Aller au contenu');
  const vu = await p.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return r.top >= 0 && r.width > 0; });
  verifier('… et il devient visible au focus', vu);
  const arrets = [];
  for (let i = 0; i < 14; i += 1) { await p.keyboard.press('Tab'); arrets.push(await p.evaluate(() => document.activeElement?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 28))); }
  console.log('      ordre des arrêts :', JSON.stringify(arrets));
  const courant = await p.evaluate(() => [...document.querySelectorAll('nav[aria-label="Thèmes"] a')].map((a) => `${a.textContent}:${a.getAttribute('aria-current')}`));
  verifier('navigation : le thème courant est annoncé', courant.some((c) => c === 'UX et design:true'), JSON.stringify(courant));
  const contour = await p.evaluate(() => {
    const el = document.querySelector('.etape h3 a'); el.focus();
    const carte = el.closest('.etape'); const s = getComputedStyle(carte);
    return { carte: s.outlineStyle, lien: getComputedStyle(el).outlineStyle };
  });
  verifier('focus d’une étape : le contour entoure toute la carte', contour.carte === 'solid', JSON.stringify(contour));
  await p.goto(base + '/ux/ux-ia/');
  const cibles = await p.evaluate(() => [...document.querySelectorAll('header a, .etape h3 a, .bouton, .bouton-secondaire, .fil a')].map((e) => ({ t: e.textContent.trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width) })).filter((e) => e.h < 44 && e.w > 0));
  console.log('      cibles < 44 px de haut :', JSON.stringify(cibles));
  await ctx.close();
}

// 4. Mémoire de progression
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + '/');
  await p.waitForLoadState('networkidle');
  verifier('accueil : « Commencer le cours UX × IA » au premier passage', await p.getByRole('link', { name: 'Commencer le cours UX × IA' }).isVisible());
  await p.goto(base + '/ux/ux-ia/diapos/');
  await p.waitForLoadState('networkidle');
  await p.goto(base + '/');
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(300);
  const reprendre = p.getByRole('link', { name: /Reprendre : Tilleul/ });
  verifier('après les diapos : « Reprendre : Tilleul »', await reprendre.isVisible(), (await p.locator('.demarrer').innerText()).replace(/\n/g, ' | '));
  await p.goto(base + '/ux/ux-ia/');
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(300);
  verifier('page du cours : l’étape 1 est marquée « Vue »', (await p.locator('.etape').nth(0).locator('.vu').count()) === 1 && (await p.locator('.etape .vu').count()) === 1);
  await p.getByRole('link', { name: 'Tilleul, la boutique piégée' }).click();
  await p.waitForTimeout(800);
  await p.goBack();
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(400);
  verifier('un clic sur Tilleul marque l’étape 2 comme « Vue »', (await p.locator('.etape .vu').count()) === 2);
  for (const u of ['/ux/ux-ia/exercices/', '/ux/ux-ia/sources/']) { await p.goto(base + u); await p.waitForLoadState('networkidle'); }
  await p.goto(base + '/');
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(300);
  verifier('tout vu : « Revoir le cours UX × IA »', await p.getByRole('link', { name: 'Revoir le cours UX × IA' }).isVisible());
  await ctx.close();
}
{
  // stockage bloqué : le site fonctionne quand même
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('bloqué'); } }); });
  const p = await ctx.newPage();
  const erreurs = [];
  p.on('pageerror', (e) => erreurs.push(e.message));
  await p.goto(base + '/ux/ux-ia/');
  await p.waitForLoadState('networkidle');
  verifier('localStorage bloqué : la page s’affiche, sans erreur', (await p.locator('h1').innerText()) === 'UX × IA' && erreurs.length === 0, erreurs.join(' '));
  await ctx.close();
}

// 5. Lien profond vers Tilleul depuis les pastilles
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + '/');
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(1500);
  await p.locator('a.pastille').first().click();
  await p.waitForURL('**/tilleul/**');
  await p.waitForTimeout(1500);
  verifier('pastille 1 : Tilleul s’ouvre sur le défaut 1', (await p.locator('.cours-corps h2').innerText()).includes('bouton principal'), await p.locator('.cours-corps h2').innerText());
  await p.goto(base + '/');
  await p.waitForTimeout(1500);
  await p.locator('a.pastille').nth(2).click();
  await p.waitForURL('**/tilleul/**');
  await p.waitForTimeout(2500);
  verifier('pastille 3 : Tilleul s’ouvre sur le défaut 4, à la fiche produit', (await p.locator('.cours-corps h2').innerText()).includes('petit et loin') && new URL(p.url()).pathname.includes('/produit/'), `${await p.locator('.cours-corps h2').innerText()} @ ${new URL(p.url()).pathname}`);
  // ?cours=non reste respecté
  await p.goto(base + '/tilleul/?cours=non&defaut=1');
  await p.waitForTimeout(1500);
  verifier('?cours=non : pas de panneau, même avec ?defaut', (await p.locator('.cours-panneau').count()) === 0);
  await ctx.close();
}

// 6. Le nouvel exercice : formulaire publié, archive apprenants, invite copiable, et rien du formateur en ligne
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  await p.goto(base + '/ux/ux-ia/exercices/');
  await p.waitForLoadState('networkidle');
  const titres = await p.locator('.exercice h2').allInnerTexts();
  verifier('page des exercices : 3 exercices dont « Réparer un formulaire d’adresse »', titres.length === 3 && titres.some((t) => t.includes('formulaire d’adresse')), JSON.stringify(titres));
  const duree = await p.locator('#formulaire-adresse .duree').innerText();
  verifier('l’exercice est annoncé comme optionnel', duree.includes('en option'), duree);
  await p.locator('.invite button').click();
  await p.waitForTimeout(300);
  const copie = await p.evaluate(() => navigator.clipboard.readText());
  verifier('le bouton copie l’invite Photon dans le presse-papiers', copie.includes('API Photon') && copie.includes('300 ms') && copie.includes('contributeurs OpenStreetMap'), copie.slice(0, 60));
  verifier('le bouton confirme « Invite copiée »', await p.getByRole('button', { name: 'Invite copiée' }).isVisible());

  const formulaire = await ctx.request.get(base + '/formulaires/adresse/');
  const html = await formulaire.text();
  verifier('le formulaire est en ligne (version de départ, bouton « Soumettre »)', formulaire.ok() && html.includes('Soumettre') && !html.includes('combobox'));
  const script = await (await ctx.request.get(base + '/formulaires/adresse/script.js')).text();
  verifier('le formulaire publié n’envoie aucune donnée (aucun appel réseau)', !/fetch\(|XMLHttpRequest|sendBeacon|WebSocket/.test(script));

  const zip = await ctx.request.get(base + '/telechargements/formulaire-adresse.zip');
  const octets = await zip.body();
  const noms = octets.toString('latin1');
  verifier('l’archive à télécharger est un zip valide, avec les 4 fichiers', zip.ok() && octets.subarray(0, 2).toString() === 'PK' && ['index.html', 'script.js', 'style.css', 'README.md'].every((f) => noms.includes(f)), `${octets.length} octets`);
  verifier('… et sans aucun fichier de solutions', !/SOLUTIONS|corrige|formateur/i.test(noms));

  for (const interdit of ['/formulaires/adresse/SOLUTIONS.md', '/formulaires/adresse/corrige/index.html', '/formulaires/adresse/casse/index.html', '/telechargements/formulaire-adresse-formateur.zip', '/formulaires/SOLUTIONS.md']) {
    const r = await ctx.request.get(base + interdit);
    verifier(`pas de fuite : ${interdit} n’existe pas`, r.status() === 404, `HTTP ${r.status()}`);
  }

  // Le fichier de la présentation : numéro de diapo, liens vers Tilleul et le formulaire
  const diapos = await (await ctx.request.get(base + '/diapos/ux-ia.html')).text();
  verifier('diapos : liens vers /tilleul/ et /formulaires/adresse/ (plus de localhost)', diapos.includes("FORM_URL: '/formulaires/adresse/'") && diapos.includes("SITE_URL: '/tilleul/?cours=non'") && !/localhost:5173/.test(diapos.match(/urls:\s*\{[\s\S]*?\}/)?.[0] ?? ''));

  // Page « avant / après »
  {
    const pc = await ctx.newPage();
    const demandes = [];
    await pc.route('**/*', (route) => { const u = route.request().url(); if (!u.startsWith(base)) { demandes.push(u); return route.abort(); } return route.continue(); });
    await pc.goto(base + '/ux/ux-ia/comparer/formulaire-adresse/');
    await pc.waitForLoadState('networkidle');
    await pc.waitForTimeout(800);
    const cadres = pc.locator('iframe');
    verifier('comparer : deux cadres, un seul visible au départ', (await cadres.count()) === 2 && (await cadres.nth(0).isVisible()) && !(await cadres.nth(1).isVisible()));
    const rep = pc.frameLocator('iframe').nth(0).locator('input').first();
    await rep.fill('Valeur tapée');
    await pc.getByRole('radio', { name: 'Version réparée' }).check();
    verifier('comparer : la bascule affiche la version réparée', (await cadres.nth(1).isVisible()) && !(await cadres.nth(0).isVisible()));
    await pc.getByRole('radio', { name: 'Version de départ' }).check();
    verifier('comparer : la saisie survit à la bascule', (await rep.inputValue()) === 'Valeur tapée');
    await pc.getByRole('radio', { name: 'Côte à côte' }).check();
    verifier('comparer : côte à côte affiche les deux', (await cadres.nth(0).isVisible()) && (await cadres.nth(1).isVisible()));
    await pc.getByRole('button', { name: /Ordre|champ|Aspect|autocompl|Autocompl/i }).first().click();
    await pc.getByRole('button', { name: 'Montrer dans le formulaire' }).first().click();
    await pc.waitForTimeout(400);
    const surlignes = await pc.evaluate(() => [...document.querySelectorAll('iframe')].map((f) => f.contentDocument.querySelectorAll('.uxo-surligne').length));
    verifier('comparer : « Montrer » surligne des éléments dans les deux versions', surlignes.every((n) => n > 0), surlignes.join(','));
    const hauteur = await cadres.nth(1).evaluate((f) => [f.clientHeight, f.contentDocument.documentElement.scrollHeight]);
    verifier('comparer : la hauteur du cadre suit le contenu', Math.abs(hauteur[0] - hauteur[1]) < 8, hauteur.join(' / '));
    const frR = pc.frameLocator('iframe').nth(1);
    await frR.locator('#rue').fill('Rue du Seyon 10');
    await pc.waitForTimeout(1200);
    const sugg = await frR.locator('#suggestions').innerText().catch(() => '');
    verifier('comparer : suggestions simulées affichées', /Seyon/.test(sugg), sugg.slice(0, 50));
    verifier('comparer : aucune requête externe par défaut', demandes.length === 0, demandes.join(', '));
    await pc.getByLabel(/vrai service Photon/).check();
    await frR.locator('#rue').fill('');
    await frR.locator('#rue').fill('Rue du Seyon 12');
    await pc.waitForTimeout(1500);
    verifier('comparer : la case d’accord déclenche la requête réelle (bloquée ici)', demandes.some((u) => u.includes('photon.komoot.io')), String(demandes.length));
    for (const r of ['/comparateur/formulaire-adresse/SOLUTIONS.md', '/comparateur/formulaire-adresse/README.md', '/comparateur/SOLUTIONS.md']) {
      const x = await ctx.request.get(base + r);
      verifier(`pas de fuite : ${r} n’existe pas`, x.status() === 404, `HTTP ${x.status()}`);
    }
    await pc.close();
  }
  await ctx.close();

  // Contrôle sur les fichiers construits : aucun fichier de solutions dans out/
  const { existsSync, readdirSync, statSync } = await import('node:fs');
  const out = resolve(import.meta.dirname, '..', 'out');
  if (existsSync(out)) {
    const trouves = [];
    (function parcourir(d) {
      for (const nom of readdirSync(d)) {
        const chemin = resolve(d, nom);
        if (/solutions|formateur/i.test(nom) || (/^(casse|corrige)$/i.test(nom) && !chemin.includes('tilleul') && !chemin.includes('comparateur'))) trouves.push(chemin.slice(out.length));
        if (statSync(chemin).isDirectory() && nom !== '_next') parcourir(chemin);
      }
    })(out);
    verifier('dossier out/ : aucun fichier de solutions ou de formateur', trouves.length === 0, trouves.join(', '));
  }
}

await b.close();
console.log(ok.every(Boolean) ? '\nTOUT PASSE' : `\nÉCHECS : ${ok.filter((x) => !x).length}`);

process.exitCode = ok.every(Boolean) ? 0 : 1;
