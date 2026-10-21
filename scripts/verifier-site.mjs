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

const PAGES = ['/', '/ux/', '/comprendre-ia/', '/comprendre-ia/types-ia/', '/comprendre-ia/types-ia/diapos/', '/comprendre-ia/types-ia/tuto/', '/comprendre-ia/types-ia/sources/', '/ux/ux-ia/', '/ux/ux-ia/diapos/', '/ux/ux-ia/demos/affiche/', '/ux/ux-ia/demos/labo-ux-demo/', '/ux/ux-ia/demos/formulaire-adresse/', '/ux/ux-ia/sources/', '/ia-legislation/', '/ia-legislation/ia-donnees/', '/ia-legislation/ia-donnees/diapos/', '/ia-legislation/ia-donnees/sources/', '/ia-legislation/ia-donnees/demos/dossier-exemple/', '/ia-legislation/ia-donnees/demos/reidentification/', '/ia-legislation/ia-donnees/demos/puis-je-l-envoyer/', '/ia-legislation/ia-souveraine/', '/developpement/', '/developpement/app-hebergee-suisse/', '/developpement/wordpress-e-commerce/', '/hors-ligne/', '/page-qui-nexiste-pas/'];

// 1. Accessibilité automatique, deux thèmes, deux tailles
for (const [nom, vp, mobile] of [['bureau', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
  for (const schema of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: vp, colorScheme: schema, isMobile: mobile, hasTouch: mobile });
    if (schema === 'dark') await ctx.addInitScript(() => localStorage.setItem('theme', 'sombre'));
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
    const el = document.querySelector('.demo-carte h4 a'); el.focus();
    const carte = el.closest('.demo-carte'); const s = getComputedStyle(carte);
    return { carte: s.outlineStyle, lien: getComputedStyle(el).outlineStyle };
  });
  verifier('focus d’une démonstration : le contour entoure toute la carte', contour.carte === 'solid', JSON.stringify(contour));
  await p.goto(base + '/ux/ux-ia/');
  const cibles = await p.evaluate(() => [...document.querySelectorAll('header a, .demo-carte h4 a, .bouton, .bouton-secondaire, .fil a')].map((e) => ({ t: e.textContent.trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height), w: Math.round(e.getBoundingClientRect().width) })).filter((e) => e.h < 44 && e.w > 0));
  console.log('      cibles < 44 px de haut :', JSON.stringify(cibles));
  await ctx.close();
}

// 4. Accueil de la plateforme et mémoire de progression
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + '/');
  await p.waitForLoadState('networkidle');
  verifier('accueil : le nom « Le Labo », trois cours en ligne et trois en préparation', (await p.locator('.marque').innerText()).includes('Le Labo') && (await p.locator('.cours-carte:not(.est-prepa)').count()) === 3 && (await p.locator('.cours-carte.est-prepa').count()) === 3);
  await p.goto(base + '/ux/ux-ia/demos/affiche/');
  await p.getByRole('button', { name: /Lancer le test/ }).click();
  await p.goto(base + '/ux/ux-ia/demos/labo-ux-demo/');
  await p.waitForTimeout(300);
  await p.goto(base + '/ux/ux-ia/');
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(300);
  verifier('page du cours : les démos de l’affiche et de Traverse sont marquées « Vue »', (await p.locator('.demo-carte .vu').count()) === 2);
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

// 5. Les démonstrations : déroulé, scènes, liens vers le dépôt, anciennes adresses
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + '/ux/ux-ia/');
  await p.waitForLoadState('networkidle');
  verifier('page du cours : 3 parties et 3 démonstrations', (await p.locator('.partie').count()) === 3 && (await p.locator('.demo-carte').count()) === 3);
  verifier('page du cours : lien vers le dépôt GitHub des exercices', (await p.getByRole('link', { name: /Ouvrir le dépôt GitHub/ }).getAttribute('href')) === 'https://github.com/clement8426/le-labo/tree/main/ux/ux-ia');
  await p.getByRole('link', { name: /Diapo 22/ }).click();
  await p.waitForURL('**/diapos/?diapo=22');
  await p.waitForTimeout(800);
  verifier('« Diapo 22 » ouvre les diapos à la diapo 22', (await p.locator('iframe.cadre-diapos').getAttribute('src')).endsWith('#22'));

  // « Puis-je l'envoyer à une IA ? » : le CV (Non, Oui, Oui) est orange ; répondre Oui d'emblée dit quelle question est ratée, et pourquoi
  await p.goto(base + '/ia-legislation/ia-donnees/demos/puis-je-l-envoyer/');
  const tri = p.locator('.tri');
  await tri.getByRole('button', { name: /Le CV d’une candidate/ }).click();
  await tri.getByRole('button', { name: 'Oui', exact: true }).click();
  const faux = await p.locator('.tri-verdict').innerText();
  verifier('tri des fichiers : un « Oui » de trop dit la question ratée, la couleur et le pourquoi', /question 1/.test(faux) && /orange/i.test(faux) && /Pourquoi « Non »/.test(faux) && !/vous avez dit/i.test(faux));
  await tri.getByRole('button', { name: 'Refaire ce fichier' }).click();
  for (const r of ['Non', 'Oui', 'Oui']) await tri.getByRole('button', { name: r, exact: true }).click();
  verifier('tri des fichiers : le CV bien trié est orange, à anonymiser d’abord', /Juste/.test(await p.locator('.tri-verdict').innerText()) && /orange : anonymiser/i.test(await p.locator('.tri-feu').innerText()));

  // Une simulation ne doit pas promettre un risque nul, même après tous les choix attendus.
  await p.goto(base + '/ia-legislation/ia-donnees/demos/dossier-exemple/');
  const dossier = p.locator('.dossier');
  await dossier.locator('fieldset').nth(0).getByRole('radio').nth(1).check();
  verifier('dossier : un choix prudent ne termine pas les quatre étapes', /1 étapes sur 4/.test(await dossier.locator('.dossier-compteur').innerText()));
  await dossier.locator('fieldset').nth(1).getByRole('radio').nth(1).check();
  await dossier.locator('fieldset').nth(2).getByRole('radio').nth(2).check();
  await dossier.locator('fieldset').nth(3).getByRole('radio').nth(1).check();
  verifier('dossier : les précautions réduisent les risques sans garantie de risque nul', /Risques réduits/.test(await dossier.locator('.dossier-compteur').innerText()) && !/Aucun risque|Tous les choix sûrs/.test(await dossier.innerText()));
  await dossier.getByRole('button', { name: 'Comparer le parcours sans précautions' }).click();
  verifier('dossier : les sept points de vigilance restent présents', /7 points de vigilance sur 7/.test(await dossier.locator('.dossier-compteur').innerText()));

  await p.goto(base + '/ia-legislation/ia-donnees/demos/reidentification/');
  const reid = p.locator('.reid');
  await reid.getByRole('radio', { name: /Protéger/ }).check();
  for (const groupe of await reid.locator('.reid-reglage').all()) await groupe.getByRole('button').last().click();
  verifier('réidentification : atteindre le seuil du jeu ne garantit pas l’anonymat', /Objectif du jeu atteint/.test(await reid.locator('.reid-verdict').innerText()) && /ne garantit pas l’anonymat/.test(await reid.locator('.reid-verdict').innerText()));

  await p.goto(base + '/diapos/ia-donnees/#30');
  const routageSuisse = p.locator('.route-cards .route-card').nth(1);
  verifier('routage sensible : la Suisse ne donne pas une validation automatique', /À valider\s*:/.test(await routageSuisse.innerText()) && await routageSuisse.locator('.verdict.ko').count() === 1);

  await p.goto(base + '/ux/ux-ia/demos/affiche/');
  verifier('démo de l’affiche : aucune note du formateur en ligne', (await p.locator('.deroule-demo, .deroule-formateur').count()) === 0 && !(await p.content()).includes('Pour présenter en direct'));
  await p.getByRole('button', { name: /Lancer le test/ }).click();
  await p.waitForTimeout(2300);
  verifier('test des 3 secondes : l’affiche s’affiche', await p.locator('.affiche-a').isVisible());
  await p.getByRole('button', { name: 'Révéler l’affiche' }).click({ timeout: 6000 });
  verifier('… puis se cache et se révèle avec quoi, quand, où entourés', (await p.locator('.marque-info').count()) === 3);
  verifier('lien vers l’exercice sur GitHub', (await p.getByRole('link', { name: /Ouvrir l’exercice sur GitHub/ }).getAttribute('href')) === 'https://github.com/clement8426/le-labo/tree/main/ux/ux-ia/bonus-affiche');

  await p.goto(base + '/ux/ux-ia/demos/tilleul/');
  await p.waitForURL('**/demos/labo-ux-demo/');
  verifier('ancienne démo Tilleul : redirige vers Traverse', p.url().endsWith('/demos/labo-ux-demo/'));
  verifier('Traverse : le lien GitHub utilise le dépôt distinct', (await p.getByRole('link', { name: /Ouvrir l’exercice sur GitHub/ }).getAttribute('href')) === 'https://github.com/clement8426/labo-ux-demos/tree/main/exercices/traverse');
  const consigne = await (await ctx.request.get(base + '/diapos/ux-ia/exercice-traverse.md')).text();
  verifier('Traverse : installation, cadrage et mode Audit dans le fichier apprenant', consigne.includes('node scripts/setup.mjs') && consigne.includes('permissions.codeModification = false') && consigne.includes('Contexte prioritaire') && consigne.includes('double'));

  await p.goto(base + '/ux/ux-ia/exercices/');
  await p.waitForURL('**/ux/ux-ia/', { timeout: 5000 }).catch(() => {});
  verifier('ancienne page des exercices : redirige vers le cours', new URL(p.url()).pathname === '/ux/ux-ia/', p.url());
  await p.goto(base + '/ux/ux-ia/comparer/formulaire-adresse/');
  await p.waitForURL('**/demos/formulaire-adresse/', { timeout: 5000 }).catch(() => {});
  verifier('ancienne comparaison : redirige vers la démo du formulaire', p.url().endsWith('/ux/ux-ia/demos/formulaire-adresse/'), p.url());
  await ctx.close();
}

// 6. Le nouvel exercice : formulaire publié, archive apprenants, invite copiable, et rien du formateur en ligne
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
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

  // La présentation : nouvel exercice et formulaire conservé en bonus
  const diapos = await (await ctx.request.get(base + '/diapos/ux-ia/')).text();
  verifier('diapos : Traverse remplace Tilleul et le formulaire reste en bonus', diapos.includes("FORM_URL: '/formulaires/adresse/'") && diapos.includes("SITE_URL: '/ux/ux-ia/demos/labo-ux-demo/'") && !/Tilleul|tilleul/.test(diapos));

  const exercice = await ctx.newPage();
  await exercice.goto(base + '/ux/ux-ia/demos/labo-ux-demo/');
  await exercice.getByRole('button', { name: 'Copier la consigne complète' }).click();
  await exercice.getByRole('status').filter({ hasText: 'Consigne copiée' }).waitFor();
  const copie = await exercice.evaluate(() => navigator.clipboard.readText());
  verifier('Traverse : la consigne complète se copie, installation et audit sans réécriture', copie.includes('Contexte prioritaire') && copie.includes('permissions.codeModification = false'));
  await exercice.close();

  const presentation = await ctx.newPage();
  const erreursDiapos = [];
  presentation.on('pageerror', (e) => erreursDiapos.push(e.message));
  await presentation.goto(base + '/diapos/ux-ia/#30');
  await presentation.waitForTimeout(500);
  verifier('diapos : 43 slides et initialisation sans erreur JavaScript', (await presentation.locator('.slide').count()) === 43 && erreursDiapos.length === 0, erreursDiapos.join(' | '));
  verifier('diapos : lien de pratique vers le nouvel exercice', new URL(await presentation.locator('[data-case="SITE_URL"] a').getAttribute('href'), base).pathname === '/ux/ux-ia/demos/labo-ux-demo/');
  await presentation.close();

  // Page « avant / après »
  {
    const pc = await ctx.newPage();
    const demandes = [];
    await pc.route('**/*', (route) => { const u = route.request().url(); if (!u.startsWith(base)) { demandes.push(u); return route.abort(); } return route.continue(); });
    await pc.goto(base + '/ux/ux-ia/demos/formulaire-adresse/');
    await pc.waitForLoadState('networkidle');
    await pc.waitForTimeout(800);
    const cadres = pc.locator('iframe');
    verifier('comparer : deux cadres, un seul visible au départ', (await cadres.count()) === 2 && (await cadres.nth(0).isVisible()) && !(await cadres.nth(1).isVisible()));
    const rep = pc.frameLocator('iframe').nth(0).locator('input').first();
    await rep.fill('Valeur tapée');
    await pc.getByRole('radio', { name: 'Après', exact: true }).check();
    verifier('comparer : la bascule affiche la version réparée', (await cadres.nth(1).isVisible()) && !(await cadres.nth(0).isVisible()));
    await pc.getByRole('radio', { name: 'Avant', exact: true }).check();
    verifier('comparer : la saisie survit à la bascule', (await rep.inputValue()) === 'Valeur tapée');
    await pc.getByRole('radio', { name: 'Les deux' }).check();
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
    await pc.getByLabel(/toutes les adresses de Suisse/).check();
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

// 7. Contraste élevé : le bouton bascule, le choix tient au rechargement, et axe passe dans les deux thèmes
for (const schema of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: schema });
  if (schema === 'dark') await ctx.addInitScript(() => localStorage.setItem('theme', 'sombre'));
  const p = await ctx.newPage();
  await p.goto(base + '/ux/ux-ia/');
  await p.getByRole('button', { name: 'Contraste élevé' }).click();
  await p.reload();
  await p.waitForLoadState('networkidle');
  const etat = await p.evaluate(() => [document.documentElement.dataset.contraste, [...document.querySelectorAll('.bouton-contraste')].find((x) => x.textContent.includes('Contraste')).getAttribute('aria-pressed')]);
  verifier(`contraste élevé (${schema === 'dark' ? 'sombre' : 'clair'}) : activé et mémorisé`, etat[0] === 'eleve' && etat[1] === 'true', etat.join(','));
  const violations = [];
  for (const u of ['/', '/ux/ux-ia/', '/ux/ux-ia/demos/affiche/', '/ux/ux-ia/demos/formulaire-adresse/', '/ux/ux-ia/sources/']) {
    await p.goto(base + u);
    await p.waitForLoadState('networkidle');
    await p.waitForTimeout(800);
    const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).exclude('iframe').analyze();
    for (const v of r.violations) violations.push(`${u} ${v.id} ${v.nodes[0].target.join(' ')}`);
  }
  verifier(`contraste élevé (${schema === 'dark' ? 'sombre' : 'clair'}) : axe sans erreur sur 5 pages`, violations.length === 0, violations.join(' | '));
  await ctx.close();
}

await b.close();
console.log(ok.every(Boolean) ? '\nTOUT PASSE' : `\nÉCHECS : ${ok.filter((x) => !x).length}`);

process.exitCode = ok.every(Boolean) ? 0 : 1;
