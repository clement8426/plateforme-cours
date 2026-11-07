// Vérifie Démarrer et Bonnes pratiques sur le site construit et servi :
// fiches éphémères, exports, entonnoir, lien partagé, absence du corrigé et confidentialité.
// UX_OUTILS=../ux-outils SITE_URL=http://127.0.0.1:3000 npm run verifier:parcours
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

if (!process.env.UX_OUTILS) { console.error('Indiquez UX_OUTILS=../ux-outils'); process.exit(1); }
const exiger = createRequire(resolve(process.env.UX_OUTILS, 'package.json'));
const { chromium } = exiger('playwright');
const { AxeBuilder } = exiger('@axe-core/playwright');

const base = process.env.SITE_URL ?? 'http://127.0.0.1:3000';
const resultats = [];
const verifier = (nom, bon, detail = '') => { resultats.push(bon); console.log(bon ? 'OK    ' : 'ÉCHEC ', nom, bon ? '' : detail); };

const b = await chromium.launch();
const ctx = await b.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();
// Next.js précharge ses pages : seul compte le fait qu'aucune réponse ne parte, dans l'adresse ou dans le corps.
const REPONSES = ['Élodie', 'Elodie', 'Projet fictif', 'panier', 'donnees:o', 'supabase'];
const envois = [];
p.on('request', (r) => { const envoi = `${r.url()} ${r.postData() ?? ''}`; if (r.url().startsWith(base) && !r.url().includes('/_next/') && REPONSES.some((m) => envoi.includes(m))) envois.push(envoi); });
p.on('dialog', (d) => d.accept());

const texte = async (telechargement) => {
  const flux = await telechargement.createReadStream();
  const morceaux = [];
  for await (const m of flux) morceaux.push(m);
  return Buffer.concat(morceaux);
};

// Fiche technique : remplissage, alerte MVP, idée, exports
await p.goto(`${base}/demarrer/technique/`);
await p.waitForLoadState('networkidle');
await p.getByLabel('Ton nom').fill('Élodie Test');
await p.getByLabel('Nom du projet').fill('Projet fictif');
await p.getByRole('group', { name: 'Y a-t-il des données personnelles ou sensibles ?' }).getByLabel('Oui').check();
await p.getByRole('button', { name: 'panier', exact: true }).click();
verifier('une idée remplit la première ligne libre', await p.getByLabel('Fonctionnalité 1', { exact: true }).inputValue() === 'panier');
const mvp = p.locator('.fonction-mvp input');
for (let i = 0; i < 6; i += 1) await mvp.nth(i).check();
verifier('alerte au-delà de 5 lignes MVP', await p.locator('.fiche-alerte').count() === 1);
const lignes = await p.locator('.fonction').count();
await p.getByRole('button', { name: 'Ajouter une ligne' }).click();
verifier('ajout d’une ligne', await p.locator('.fonction').count() === lignes + 1 && lignes === 15);

const [pdf] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: 'Terminer et télécharger en PDF' }).click()]);
const contenuPdf = await texte(pdf);
verifier('PDF téléchargé avec le bon nom', /^fiche-aspect-technique_elodie-test_\d{4}-\d{2}-\d{2}\.pdf$/.test(pdf.suggestedFilename()) && contenuPdf.subarray(0, 4).toString() === '%PDF', pdf.suggestedFilename());
const [md] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: 'Télécharger en Markdown' }).click()]);
const contenuMd = (await texte(md)).toString('utf8');
verifier('Markdown : options cochées, tableau et non renseigné', contenuMd.includes('- [x] Oui') && contenuMd.includes('- [ ] Non') && contenuMd.includes('| 1 | panier |') && contenuMd.includes('Non renseigné'));
verifier('aucune réponse envoyée pendant la fiche', envois.length === 0, envois.join(' '));

// Éphémère : rien ne survit au rechargement, rien dans le stockage
const stockage = await p.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
verifier('aucune réponse dans le stockage du navigateur', !stockage.includes('Projet fictif') && !stockage.includes('Élodie'));
await p.reload();
await p.waitForLoadState('networkidle');
verifier('le rechargement efface les réponses', await p.getByLabel('Nom du projet').inputValue() === '');

// Test et fiche 1 : la page affiche toutes les parties
await p.goto(`${base}/demarrer/test/`);
verifier('test : 6 parties', await p.locator('.fiche-section h2').count() === 6);
await p.waitForLoadState('networkidle');
await p.getByRole('group', { name: /Q1\. Qu.est-ce qu.un terminal/ }).getByText(/Une fenêtre où/).click();
await p.getByRole('group', { name: /Q2\. Le front-end/ }).getByText('Le serveur qui stocke').click();
await p.getByRole('group', { name: 'API', exact: true }).getByRole('radio', { name: '4' }).check();
const [testMd] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: 'Télécharger en Markdown' }).click()]);
const contenuTest = (await texte(testMd)).toString('utf8');
verifier('test : le score est dans le fichier', contenuTest.includes('Bonnes réponses : 1 sur 19') && contenuTest.includes('Auto-évaluation : 4 sur 50'), contenuTest.slice(0, 400));
verifier('test : le score s’affiche à la fin', (await p.locator('.score').innerText()).includes('1'));
const [testWord] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: 'Télécharger en Word' }).click()]);
verifier('Word téléchargé', testWord.suggestedFilename().endsWith('.docx') && (await texte(testWord)).subarray(0, 2).toString() === 'PK', testWord.suggestedFilename());
for (const [nom, extension] of [['Word', 'docx'], ['Markdown', 'md']]) {
  const r = await p.request.get(`${base}/telechargements/parcours/test-positionnement-modele.${extension}`);
  verifier(`modèle ${nom} disponible`, r.ok());
}
const [modele] = await Promise.all([p.waitForEvent('download'), p.locator('.fiche-modele').getByRole('button', { name: 'PDF' }).click()]);
verifier('modèle PDF téléchargé', modele.suggestedFilename() === 'test-positionnement-modele.pdf' && (await texte(modele)).subarray(0, 4).toString() === '%PDF');
await p.goto(`${base}/demarrer/idee/`);
await p.waitForLoadState('networkidle');
await p.getByLabel('Décris ton idée en 5 lignes maximum.').fill('1\n2\n3\n4\n5\n6\n7');
verifier('fiche 1 : limite de 5 lignes', (await p.getByLabel('Décris ton idée en 5 lignes maximum.').inputValue()).split('\n').length === 5);

// Entonnoir : parcours complet avec import de la fiche
await p.goto(`${base}/demarrer/entonnoir/`);
await p.waitForLoadState('networkidle');
await p.getByRole('button', { name: /Reprendre un projet existant/ }).click();
await p.getByRole('button', { name: /Application web ou SaaS/ }).click();
await p.locator('#fiche-import').setInputFiles({ name: 'fiche.md', mimeType: 'text/markdown', buffer: Buffer.from(contenuMd) });
await p.getByText('Fiche chargée').waitFor();
verifier('import : la fiche pré-remplit les données', await p.getByRole('group', { name: /données personnelles/ }).getByLabel('Oui').isChecked());
await p.getByRole('group', { name: 'As-tu déjà choisi un outil ?' }).getByLabel('Supabase ou Postgres').check();
await p.getByRole('button', { name: 'Voir mon plan' }).click();
const plan = await p.locator('.plan-carte h4').allInnerTexts();
verifier('Supabase et reprise : RLS en tête de plan', plan.slice(0, 3).includes('RLS sur les tables'), plan.slice(0, 5).join(' | '));
verifier('le focus suit l’étape', await p.evaluate(() => document.activeElement?.tagName === 'H2'));
verifier('le kit attend l’avertissement sur les données', await p.getByRole('button', { name: 'Télécharger le kit' }).isDisabled());
await p.getByLabel('J’ai compris').check();
const [kit] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: 'Télécharger le kit' }).click()]);
const contenuKit = (await texte(kit)).toString('utf8');
verifier('kit : plan, mémoire et bilan', contenuKit.includes('RLS sur les tables') && contenuKit.includes('CLAUDE.md') && contenuKit.includes('installed, working, unavailable, blocked'));

// Lien partagé : tout est dans le fragment, jamais dans la requête
await p.goto(`${base}/demarrer/entonnoir/#i=reprendre&t=app-web&c=donnees:o&o=supabase`);
await p.locator('.plan-carte').first().waitFor();
verifier('le lien partagé rouvre le plan', (await p.locator('.plan-carte h4').allInnerTexts()).includes('RLS sur les tables'));
verifier('aucune réponse envoyée dans tout le parcours', envois.length === 0, envois.join(' '));

// Statistiques : on charge le vrai script de Vercel et on lit ce qu'il enverrait.
{
  const script = await (await fetch('https://va.vercel-scripts.com/v1/script.js')).text();
  const c = await b.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36' });
  await c.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  const q = await c.newPage();
  const vues = [];
  await q.route('**/_vercel/insights/script.js', (r) => r.fulfill({ contentType: 'text/javascript', body: script }));
  await q.route('**/_vercel/insights/view', (r) => { vues.push(r.request().postData() ?? ''); r.fulfill({ status: 200, body: '{}' }); });
  await q.goto(`${base}/demarrer/entonnoir/?secret=1#i=reprendre&t=app-web&c=donnees:o&o=supabase`);
  await q.waitForTimeout(2000);
  verifier('Vercel ne reçoit ni paramètre ni fragment', vues.length > 0 && vues.every((v) => !/secret|donnees|supabase|#/.test(v)), vues.join(' ') || 'aucun envoi observé');
  await c.close();
}

// Données publiques
for (const chemin of ['/llms.txt', '/api/catalog.json', '/api/rules.json']) verifier(`${chemin} répond`, (await p.request.get(base + chemin)).ok());
const regles = await (await p.request.get(`${base}/api/rules.json`)).json();
verifier('40 angles morts publics', regles.blind_spots.length === 40);

// Accessibilité, clair, sombre et mobile
const PAGES = ['/', '/cours/', '/demarrer/', '/demarrer/test/', '/demarrer/idee/', '/demarrer/technique/', '/demarrer/entonnoir/', '/demarrer/catalogue/', '/bonnes-pratiques/', '/bonnes-pratiques/cloud-act/', '/bonnes-pratiques/angles-morts/rls/', '/demarrer/entonnoir/#i=reprendre&t=app-web&c=donnees:o&o=supabase'];
for (const [nom, vp, mobile, sombre] of [['bureau clair', { width: 1440, height: 900 }, false, false], ['bureau sombre', { width: 1440, height: 900 }, false, true], ['mobile clair', { width: 390, height: 844 }, true, false], ['mobile sombre', { width: 390, height: 844 }, true, true]]) {
  const c = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  if (sombre) await c.addInitScript(() => localStorage.setItem('theme', 'sombre'));
  const q = await c.newPage();
  const problemes = [];
  for (const u of PAGES) {
    await q.goto(base + u);
    await q.waitForLoadState('networkidle');
    await q.waitForTimeout(300);
    const r = await new AxeBuilder({ page: q }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    for (const v of r.violations) problemes.push(`${u} ${v.id} ${v.nodes[0].target.join(' ')}`);
    if (await q.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) problemes.push(`${u} débordement`);
  }
  verifier(`axe et débordement, ${nom}`, problemes.length === 0, problemes.join(' | '));
  await c.close();
}
await b.close();

// Le corrigé n'est dans aucun fichier produit
const sortie = resolve('out');
const fichiers = (d) => readdirSync(d).flatMap((n) => { const c = join(d, n); return statSync(c).isDirectory() ? fichiers(c) : [c]; });
const interdits = ['Réponse attendue', 'Corrigé du test', 'Document réservé au formateur'];
const fuites = fichiers(sortie).filter((f) => /\.(html|js|txt|json)$/.test(f)).filter((f) => { const t = readFileSync(f, 'utf8'); return interdits.some((m) => t.includes(m)); });
verifier('le corrigé est absent de out/', fuites.length === 0, fuites.join(' '));

console.log(resultats.every(Boolean) ? 'TOUT PASSE' : `${resultats.filter((x) => !x).length} échec(s)`);
process.exit(resultats.every(Boolean) ? 0 : 1);
