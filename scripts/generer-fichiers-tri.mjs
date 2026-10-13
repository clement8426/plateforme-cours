// Fabrique les douze fichiers fictifs de l'exercice « Puis-je l'envoyer à une IA ? ».
// Usage : PLAYWRIGHT_DEPUIS=<chemin vers playwright> node scripts/generer-fichiers-tri.mjs
// Écrit dans public/fichiers/tri/ (aperçus et téléchargements du site) et, s'il existe, dans le dépôt le-labo.
// Tout est inventé : l'étude, les personnes, les adresses (domaines en .example), les montants.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const racine = resolve(import.meta.dirname, '..');
const site = join(racine, 'public', 'fichiers', 'tri');
const depot = resolve(racine, '..', 'le-labo', 'ia-legislation', 'ia-donnees', '03-puis-je-l-envoyer', 'fichiers');
mkdirSync(site, { recursive: true });

// Les tableurs avec une marque d'ordre (BOM) : sinon Excel affiche les accents de travers.
const ecrire = (nom, contenu) => writeFileSync(join(site, nom), (nom.endsWith('.csv') ? '﻿' : '') + contenu, 'utf8');

// ---------- Les fichiers texte ----------
ecrire('conditions-generales.txt', `CONDITIONS GÉNÉRALES DE MANDAT
Étude Fictive Avocats, Neuchâtel
Publiées sur www.etude-fictive.example

1. Honoraires
Les honoraires sont calculés au temps consacré, au tarif horaire de 320 CHF, TVA en sus.

2. Provision
L'étude peut demander une provision au début du mandat.

3. Secret professionnel
L'avocat est tenu au secret professionnel pour tout ce qui lui est confié dans l'exercice de sa profession.

4. Fin du mandat
Le mandat peut être révoqué en tout temps par le client.

Document fictif, créé pour un exercice. Aucune donnée réelle.
`);

ecrire('annonce-emploi.txt', `OFFRE D'EMPLOI
Assistante ou assistant juridique, 80 à 100 %
Étude Fictive Avocats, Rue de l'Exemple 12, 2000 Neuchâtel

Publiée le 1er octobre 2026 sur www.etude-fictive.example et sur une plateforme d'emploi.

Vos tâches
- Suivre les délais de procédure et tenir l'agenda des avocats.
- Rédiger les courriers courants et mettre en forme les mémoires.
- Accueillir les clients, au téléphone et à la réception, en français et en allemand.

Votre profil
- CFC d'employé·e de commerce, ou formation équivalente.
- Deux ans d'expérience dans une étude ou une fiduciaire.
- Allemand courant, à l'oral comme à l'écrit.

Ce que nous offrons
- Une équipe de dix personnes, à deux minutes de la gare.
- Cinq semaines de vacances et une formation continue payée par l'étude.

Entrée en fonction : 1er janvier 2027.
Dossier complet à envoyer à emploi@etude-fictive.example avant le 31 octobre 2026.

Annonce fictive, créée pour un exercice.
`);

ecrire('budget-2027.csv', `Poste;Budget 2026 (CHF);Budget 2027 (CHF);Commentaire
Salaires;1 240 000;1 310 000;Engagement d'une assistante juridique
Loyer;96 000;96 000;Bail renégocié, voir contrat
Informatique;38 000;52 000;IA hébergée en Suisse
Formation;9 000;14 000;Formation IA de toute l'équipe
Marketing;12 000;8 000;
Total;1 395 000;1 480 000;Objectif de chiffre d'affaires 2027 : 2,1 M CHF
;;;Document interne, réservé à la direction. Fictif.
`);

ecrire('planning-absences-octobre.csv', `Prénom;Du;Au;Motif
Léa;06.10.2026;10.10.2026;Vacances
Marc;13.10.2026;24.10.2026;Maladie
Sophie;14.10.2026;14.10.2026;Formation
Nadia;20.10.2026;31.10.2026;Accident (hors travail)
Thomas;27.10.2026;31.10.2026;Vacances
;;;Fictif, créé pour un exercice.
`);

ecrire('liste-clients.csv', `Nom;Prénom;Adresse;NPA;Localité;Type de dossier
Exemple;Jean;Grande-Rue 5;25500;Morteau (France);Accident de travail
Beispiel;Anna;Musterweg 3;79539;Lörrach (Allemagne);Accident, assurance suisse
Témoin;Sophie;Rue du Modèle 8;2000;Neuchâtel;Divorce
Maquette;Paul;Chemin des Essais 2;2400;Le Locle;Licenciement
Esquisse;Yves;Rue Fictive 14;2300;La Chaux-de-Fonds;Responsabilité médicale
;;;;;Fictif, créé pour un exercice.
`);

ecrire('email-devis-imprimante.eml', `From: Marc Témoin <m.temoin@imprimantes-fictives.example>
To: secretariat@etude-fictive.example
Subject: Votre devis imprimante multifonction : remise spéciale
Date: Tue, 6 Oct 2026 09:12:00 +0200
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8

Bonjour Madame,

Suite à notre rendez-vous, voici notre meilleure offre pour l'imprimante multifonction FX-4200 :

- Prix catalogue : 4 800 CHF
- Prix accordé à votre étude : 3 360 CHF (remise de 30 %)
- Contrat de maintenance de 3 ans offert

Cette remise est exceptionnelle et confidentielle : merci de ne pas la diffuser.

Meilleures salutations,
Marc Témoin
Conseiller commercial, Imprimantes Fictives SA
079 000 00 00

Courriel fictif, créé pour un exercice.
`);

// ---------- Les PDF et les images, dessinés dans un navigateur ----------
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_DEPUIS ?? 'playwright');
const navigateur = await chromium.launch();
const page = await navigateur.newPage();

const feuille = (corps) => `<!doctype html><meta charset="utf-8"><style>
  @page { size: A4; margin: 22mm 20mm; }
  body { font: 11pt/1.45 Georgia, serif; color: #1d1d1f; }
  h1 { font-size: 20pt; margin: 0 0 4pt; } h2 { font-size: 13pt; margin: 18pt 0 6pt; }
  .petit { font-size: 9pt; color: #555; } .pied { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font: 8pt Arial, sans-serif; color: #777; letter-spacing: .05em; }
  table { border-collapse: collapse; width: 100%; } td { padding: 3pt 0; vertical-align: top; } td:first-child { width: 38%; font-weight: bold; }
</style><body>${corps}<p class="pied">DOCUMENT FICTIF · LE LABO · AUCUNE DONNÉE RÉELLE</p></body>`;

const pdf = async (nom, corps) => {
  await page.setContent(feuille(corps), { waitUntil: 'load' });
  await page.pdf({ path: join(site, nom), format: 'A4', printBackground: true });
};

await pdf('brochure-etude.pdf', `
  <h1>Étude Fictive Avocats</h1>
  <p class="petit">Rue de l'Exemple 12 · 2000 Neuchâtel · www.etude-fictive.example</p>
  <h2>Ce que nous faisons</h2>
  <p>Depuis vingt ans, notre étude accompagne les salariés, les indépendants et les entreprises de l'Arc jurassien, en Suisse et de l'autre côté de la frontière.</p>
  <ul><li>Droit du travail : licenciements, accidents, salaires impayés.</li><li>Assurances sociales : invalidité, accidents, indemnités journalières.</li><li>Droit médical : responsabilité des soignants et des établissements.</li></ul>
  <h2>Notre équipe</h2>
  <p>Six avocats et quatre assistantes juridiques, en français et en allemand.</p>
  <h2>Premier rendez-vous</h2>
  <p>Une première consultation de trente minutes, au tarif de 120 CHF, pour faire le point sur votre situation.</p>`);

await pdf('cv-candidate.pdf', `
  <h1>Léa Modèle</h1>
  <p class="petit">Rue des Essais 3 · 2034 Peseux · lea.modele@courriel.example · 079 000 00 01 · née le 14.05.1997</p>
  <h2>Candidature : assistante juridique</h2>
  <h2>Expérience</h2>
  <table><tr><td>2021 à 2026</td><td>Assistante juridique, Étude Exemple, La Chaux-de-Fonds. Gestion des dossiers d'assurances sociales, rédaction de courriers, suivi des délais.</td></tr>
  <tr><td>2018 à 2021</td><td>Employée de commerce, Fiduciaire Croquis SA, Neuchâtel.</td></tr></table>
  <h2>Formation</h2>
  <table><tr><td>2018</td><td>CFC d'employée de commerce</td></tr><tr><td>2023</td><td>Brevet fédéral d'assistante en gestion du personnel</td></tr></table>
  <h2>Langues</h2>
  <p>Français (langue maternelle), allemand (B2), anglais (B1).</p>`);

await pdf('contrat-bail-bureaux.pdf', `
  <h1>Contrat de bail à loyer</h1>
  <p class="petit">Locaux commerciaux · Rue de l'Exemple 12, 2000 Neuchâtel</p>
  <table>
    <tr><td>Bailleur</td><td>SI Exemple SA, représentée par M. Hugo Ébauche, administrateur</td></tr>
    <tr><td>Locataire</td><td>Étude Fictive Avocats, représentée par Me Claire Exemple, associée</td></tr>
    <tr><td>Surface</td><td>180 m², 2ᵉ étage, deux places de parc</td></tr>
    <tr><td>Loyer mensuel</td><td>8 000 CHF, charges comprises</td></tr>
    <tr><td>Durée</td><td>Du 1er janvier 2027 au 31 décembre 2031, renouvelable</td></tr>
    <tr><td>Conditions particulières</td><td>Loyer réduit de 10 % les deux premières années, en échange de travaux faits par le locataire.</td></tr>
  </table>
  <h2>Confidentialité</h2>
  <p>Les parties s'engagent à ne pas communiquer à des tiers les conditions du présent bail.</p>
  <p style="margin-top:40pt">Neuchâtel, le 15 septembre 2026 · Signatures des parties</p>`);

const image = async (nom, html, largeur, hauteur) => {
  await page.setViewportSize({ width: largeur, height: hauteur });
  await page.setContent(`<!doctype html><meta charset="utf-8"><body style="margin:0">${html}</body>`, { waitUntil: 'load' });
  await page.screenshot({ path: join(site, nom), type: 'png' });
};

await image('photo-tableau-blanc.png', `
  <div style="width:1200px;height:800px;background:radial-gradient(circle at 30% 20%,#6f6a60,#3f3b35);display:grid;place-items:center;overflow:hidden">
    <div style="width:1000px;height:640px;background:linear-gradient(160deg,#fbfbf8,#e9e8e2);transform:rotate(-2.5deg) skewX(-2deg);box-shadow:0 20px 50px rgba(0,0,0,.5);border:14px solid #b9bcc0;border-radius:6px;padding:40px 56px;box-sizing:border-box;font:34px/1.5 'Segoe Print','Comic Sans MS',cursive;color:#1f3c88">
      <div style="font-size:44px;color:#b3261e;text-decoration:underline">Point dossiers : lundi</div>
      <div>• Exemple c/ Assurance Nord : opposition avant 24.10 !</div>
      <div>• Beispiel : rapport allemand à traduire</div>
      <div>• Témoin (divorce) : audience 3.11, garde des enfants</div>
      <div style="color:#2e7d32">• Esquisse : expertise médicale reçue</div>
      <div style="position:absolute;right:60px;bottom:30px;font:14px Arial;color:#888">Fictif · Le Labo</div>
    </div>
  </div>`, 1200, 800);

await image('capture-erreur-logiciel.png', `
  <div style="width:1280px;height:760px;background:#2b5f8a;font:14px 'Segoe UI',Arial,sans-serif;position:relative">
    <div style="position:absolute;left:60px;top:40px;width:1160px;height:660px;background:#fff;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,.4);overflow:hidden">
      <div style="background:#e8ecf1;padding:10px 16px;font-weight:600">Fictiva Compta : Facturation · Étude Fictive Avocats</div>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr style="background:#f5f7fa;text-align:left"><th style="padding:10px 16px">N°</th><th>Client</th><th>Objet</th><th>Montant CHF</th><th>État</th></tr>
        <tr><td style="padding:10px 16px">2026-112</td><td>Maquette Paul</td><td>Licenciement</td><td>2 150.00</td><td>Payée</td></tr>
        <tr style="background:#fbfcfd"><td style="padding:10px 16px">2026-113</td><td>Témoin Sophie</td><td>Divorce, garde des enfants</td><td>3 400.00</td><td>Envoyée</td></tr>
        <tr style="background:#e3eefb"><td style="padding:10px 16px">2026-114</td><td>Exemple Jean</td><td>Accident de travail, fracture</td><td>1 840.00</td><td>Erreur</td></tr>
        <tr><td style="padding:10px 16px">2026-115</td><td>Esquisse Yves</td><td>Responsabilité médicale</td><td>5 120.00</td><td>Brouillon</td></tr>
      </table>
    </div>
    <div style="position:absolute;left:430px;top:300px;width:420px;background:#fff;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.45);padding:22px 24px">
      <div style="font-weight:700;font-size:16px;margin-bottom:10px">⚠ Erreur 0x80070005</div>
      <div>Impossible d'exporter la facture 2026-114 en PDF. Accès refusé au dossier de destination.</div>
      <div style="text-align:right;margin-top:18px"><span style="border:1px solid #888;border-radius:4px;padding:6px 18px">OK</span></div>
    </div>
    <div style="position:absolute;right:16px;bottom:10px;color:#cfe0ef;font-size:12px">Capture fictive · Le Labo</div>
  </div>`, 1280, 760);

await navigateur.close();

// ---------- La note vocale : voix de synthèse française de Windows ----------
const texteNote = 'Note pour le dossier Exemple. Jean Exemple, frontalier de Morteau, s\'est fracturé le poignet gauche le douze août deux mille vingt-six, chez Horlogerie Fictive au Locle. L\'assurance refuse l\'indemnité journalière. Il faut demander le témoignage de Paul Fictif, et former opposition avant le vingt-quatre octobre.';
const wav = join(site, 'note-vocale-associe.wav');
if (process.platform === 'win32') {
  const ps = join(tmpdir(), 'note-vocale.ps1');
  // Avec une marque d'ordre (BOM) : sinon Windows PowerShell 5.1 lit les accents de travers.
  writeFileSync(ps, '﻿' + `Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$v = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -eq 'fr-FR' } | Select-Object -First 1
if ($v) { $s.SelectVoice($v.VoiceInfo.Name) }
$f = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
$s.SetOutputToWaveFile('${wav.replace(/'/g, "''")}', $f)
$s.Rate = -1
$s.Speak('${texteNote.replace(/'/g, "''")}')
$s.Dispose()
`, 'utf8');
  execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ps]);
} else if (!existsSync(wav)) {
  console.warn('Note vocale non générée : voix de synthèse Windows introuvable.');
}

// ---------- Copie dans le dépôt des exercices ----------
const noms = ['brochure-etude.pdf', 'conditions-generales.txt', 'annonce-emploi.txt', 'cv-candidate.pdf', 'budget-2027.csv', 'contrat-bail-bureaux.pdf', 'email-devis-imprimante.eml', 'planning-absences-octobre.csv', 'photo-tableau-blanc.png', 'note-vocale-associe.wav', 'liste-clients.csv', 'capture-erreur-logiciel.png'];
if (existsSync(resolve(depot, '..', '..'))) {
  mkdirSync(depot, { recursive: true });
  for (const n of noms) copyFileSync(join(site, n), join(depot, n));
  console.log(`Copiés dans ${depot}`);
}
console.log(`${noms.length} fichiers dans public/fichiers/tri/`);
