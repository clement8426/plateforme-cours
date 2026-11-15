'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PratiqueGuideeIa.module.css';

const base = '/diapos/premiers-pas-ia/captures/guide/';
const titres = ['Ouvrir l’outil', 'Envoyer une demande', 'Lire la réponse', 'Préciser la demande', 'Préparer l’assistant', 'Utiliser ses consignes', 'Tester l’assistant', 'Garder son travail'];
const vague = 'Organise un atelier de découverte de l’IA pour des adultes débutants.';
const precise = 'Propose un atelier fictif de 90 minutes pour 12 adultes débutants, avec six ordinateurs et aucun achat. Utilise des durées relatives, pas des heures de la journée. Réponds dans un tableau : étape, durée, activité, matériel. Signale les informations manquantes.';
const tests = [
  { titre: 'Un programme normal', demande: 'Propose un programme de 90 minutes pour les 12 adultes, avec les six ordinateurs et sans achat.', attendu: 'Le total doit faire 90 minutes. Le programme doit fonctionner avec six ordinateurs et ne demander aucun achat.' },
  { titre: 'Une information absente', demande: 'Quel est le nom et le numéro de téléphone du responsable ?', attendu: 'Ces informations ne figurent pas dans le brief. L’assistant doit le signaler, sans inventer de nom ou de numéro.' },
  { titre: 'Une demande incompatible', demande: 'Prévois un ordinateur par personne, sans achat.', attendu: 'Il n’y a que six ordinateurs pour douze personnes. L’assistant doit relever le conflit et proposer, par exemple, de travailler à deux.' },
];

function Message({ texte, nom = 'Copier ce texte' }: { texte: string; nom?: string }) {
  const zone = useRef<HTMLPreElement>(null);
  const [statut, setStatut] = useState('');
  async function copier() {
    try { await navigator.clipboard.writeText(texte); setStatut('Texte copié. Revenez dans l’onglet de l’IA, cliquez dans la zone de saisie et collez.'); }
    catch { if (zone.current) window.getSelection()?.selectAllChildren(zone.current); setStatut('Le texte est sélectionné. Appuyez sur Ctrl+C sur Windows, ou ⌘C sur Mac.'); }
  }
  return <div className={styles.message}><pre ref={zone}>{texte}</pre><button type="button" className="bouton-secondaire" onClick={() => void copier()}>{nom}</button><p className={styles.statut} role="status">{statut}</p></div>;
}

function Capture({ fichier, alt, texte, reperes = [] }: { fichier: string; alt: string; texte: string; reperes?: { n: number; x: number; y: number }[] }) {
  return <figure className={styles.capture}><div className={styles.image}><img src={base + fichier} alt={alt} width={1280} height={850} loading="lazy" />{reperes.map(r => <span key={r.n} className={styles.repere} aria-hidden="true" style={{ left: `${r.x}%`, top: `${r.y}%` }}>{r.n}</span>)}</div><figcaption>{texte} <a href={base + fichier} target="_blank" rel="noreferrer">Voir la capture en grand<span className="visuellement-cache"> (nouvel onglet)</span></a></figcaption></figure>;
}

export default function PratiqueGuideeIa() {
  const [etape, setEtape] = useState(0);
  const [fait, setFait] = useState<boolean[]>(Array(8).fill(false));
  const [role, setRole] = useState('Aider l’association fictive ClairLieu à préparer un atelier numérique pour débutants.');
  const [format, setFormat] = useState('Français simple. Programme en tableau : étape, durée, activité, matériel.');
  const [observations, setObservations] = useState(['', '', '']);
  const [difference, setDifference] = useState('');
  const [statut, setStatut] = useState('');
  const [modifie, setModifie] = useState(false);
  const titre = useRef<HTMLHeadingElement>(null);
  const premier = useRef(true);
  const consignes = `RÔLE\n${role}\n\nBRIEF FICTIF\n12 adultes débutants. Six ordinateurs. Atelier de 90 minutes. Aucun achat. Le nom et le téléphone du responsable ne sont pas fournis.\n\nRÈGLES\nUtilisez uniquement le brief fourni. Distinguez les faits des propositions. Signalez les informations absentes au lieu de les inventer. Si une demande contredit le brief, expliquez le conflit et proposez une adaptation. Ne réservez rien, ne publiez rien et ne contactez personne.\n\nFORMAT\n${format}`;
  useEffect(() => { if (premier.current) { premier.current = false; return; } titre.current?.focus({ preventScroll: true }); titre.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }, [etape]);
  useEffect(() => { const quitter = (e: BeforeUnloadEvent) => { if (modifie) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', quitter); return () => window.removeEventListener('beforeunload', quitter); }, [modifie]);
  function telecharger(type: 'consignes' | 'bilan') {
    const texte = type === 'consignes' ? consignes : `# Mon bilan — premier assistant\n\n## Différence entre les deux demandes\n${difference || 'À compléter'}\n\n${tests.map((t, i) => `## ${t.titre}\nDemande : ${t.demande}\nObservation : ${observations[i] || 'Non exécuté ou à compléter'}`).join('\n\n')}\n\n## Mes consignes\n${consignes}`;
    const url = URL.createObjectURL(new Blob([texte], { type: 'text/plain;charset=utf-8' }));
    const lien = document.createElement('a'); lien.href = url; lien.download = type === 'consignes' ? 'mon-assistant-clairlieu.txt' : 'mon-bilan-premier-assistant.txt'; lien.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (type === 'bilan') setModifie(false);
    setStatut('Fichier téléchargé. Retrouvez-le dans les téléchargements de votre navigateur.');
  }
  return <div className={styles.guide}>
    <p className={styles.intro}>Avancez une étape à la fois. Gardez cette page dans un onglet et l’outil IA dans un autre. Un onglet est une page ouverte en haut de votre navigateur : cliquez sur son nom pour passer de l’un à l’autre.</p>
    <p className={styles.intro}>Le parcours illustré utilise Gemini, testé le 15 novembre 2026. Ses écrans et ses accès peuvent changer. Utilisez uniquement un outil autorisé ; si un compte est demandé, utilisez un compte déjà autorisé ou demandez de l’aide. Aucun achat ni création de compte personnel n’est nécessaire pour préparer les consignes ici.</p>
    <ol className={styles.parcours} aria-label="Étapes de la pratique guidée">{titres.map((t, i) => <li key={t}><button type="button" aria-label={`Étape ${i + 1} : ${t}${fait[i] ? ', terminée' : ''}`} aria-current={i === etape ? 'step' : undefined} onClick={() => setEtape(i)}>{i + 1}{fait[i] ? ' ✓' : ''}</button></li>)}</ol>
    <div className={styles.etape}>
      <p className={styles.numero}>Étape {etape + 1} sur {titres.length} · {fait.filter(Boolean).length} étape(s) cochée(s)</p><h3 ref={titre} tabIndex={-1}>{etape + 1}. {titres[etape]}</h3>
      {etape === 0 && <>
        <p>Cliquez sur le bouton ci-dessous. Gemini s’ouvre dans un nouvel onglet. Vous pouvez ensuite revenir ici en cliquant sur l’onglet « Le Labo ».</p>
        <div className="actions"><a className="bouton" href="https://gemini.google.com/app" target="_blank" rel="noreferrer">Ouvrir Gemini<span className="visuellement-cache"> (nouvel onglet)</span></a></div>
        <Capture fichier="01-ouvrir-gemini.png" alt="Page d’accueil réelle de Gemini, avec une zone de saisie au centre et un bouton de connexion en haut à droite." texte="Capture réelle de Gemini, non connecté, le 15 novembre 2026." reperes={[{ n: 1, x: 36, y: 46 }, { n: 2, x: 94, y: 4 }]} />
        <ol className={styles.legende}><li>Repérez la grande zone blanche : c’est là que vous écrirez.</li><li>« Se connecter » indique que cette capture a été réalisée sans compte connecté. Ce bouton n’est pas forcément nécessaire pour votre essai.</li></ol>
        <p className={styles.resultat}><strong>Avant de continuer</strong>Vous avez trouvé la zone où écrire. Ne saisissez aucune donnée personnelle.</p>
        <details className={styles.aide}><summary>Je ne vois pas cet écran</summary><p>Une fenêtre de cookies peut apparaître : choisissez les options qui vous conviennent. Une protection, une demande de connexion ou une restriction peut aussi empêcher l’accès. Ne payez rien : demandez au formateur quel outil utiliser. Les consignes de la suite restent valables dans un autre chat.</p></details>
      </>}
      {etape === 1 && <>
        <p>Cliquez sur « Copier ce texte ». Dans l’onglet Gemini, cliquez dans la zone de saisie, puis appuyez sur <strong>Ctrl+V</strong> sur Windows ou <strong>⌘V</strong> sur Mac. Le texte doit apparaître avant d’envoyer.</p><Message texte={vague} />
        <Capture fichier="02-ecrire-demande.png" alt="Demande de découverte de l’IA écrite dans la zone de saisie de Gemini, avant l’envoi." texte="Capture réelle : la demande est préparée, pas encore envoyée." reperes={[{ n: 1, x: 40, y: 45 }, { n: 2, x: 85, y: 56 }]} />
        <ol className={styles.legende}><li>Vérifiez que votre texte est bien dans la zone blanche.</li><li>Cliquez sur la flèche d’envoi à droite de cette zone. Attendez que l’IA ait terminé de répondre.</li></ol>
        <p className={styles.resultat}><strong>Ce que vous devez obtenir</strong>Une première proposition d’atelier. Votre réponse peut être différente de la capture suivante : c’est normal.</p>
        <details className={styles.aide}><summary>La copie ou l’envoi ne fonctionne pas</summary><p>Sélectionnez le texte à la souris, puis faites Ctrl+C / ⌘C. Cliquez ensuite dans le chat et faites Ctrl+V / ⌘V. Si l’envoi demande un compte ou affiche un quota, utilisez l’outil autorisé proposé par le formateur ; n’inventez pas de résultat.</p></details>
      </>}
      {etape === 2 && <>
        <p>Lisez le début de la réponse. Vous pouvez faire défiler la page avec la molette ou deux doigts sur le pavé tactile. Cherchez la durée proposée, le matériel et l’organisation des participants.</p>
        <Capture fichier="03-lire-reponse.png" alt="Réponse réellement produite par Gemini à la demande vague. Le début de la réponse est au centre ; Nouvelle discussion se trouve en haut à gauche." texte="Exemple réellement généré le 15 novembre 2026. Ce n’est ni un corrigé ni une réponse à reproduire." reperes={[{ n: 1, x: 34, y: 35 }, { n: 2, x: 8, y: 9 }]} />
        <ol className={styles.legende}><li>Le texte au centre est la réponse à lire et à vérifier.</li><li>« Nouvelle discussion » servira à commencer la comparaison à l’étape suivante.</li></ol>
        <p className={styles.resultat}><strong>À remarquer</strong>La première demande ne précisait ni durée, ni nombre de personnes, ni nombre d’ordinateurs. L’IA a dû proposer ou supposer ces éléments. Une proposition n’est pas un fait confirmé.</p>
        <p>Gardez cette conversation ouverte pour pouvoir la comparer. Vous allez maintenant préciser la demande.</p>
      </>}
      {etape === 3 && <>
        <p>Dans Gemini, cliquez sur <strong>Nouvelle discussion</strong> dans le menu de gauche. Si le menu est fermé, ouvrez-le avec l’icône de menu. Dans un autre outil, cherchez « Nouveau chat » ou un signe « + ».</p><p>Copiez cette demande plus précise, collez-la dans la nouvelle conversation, puis envoyez-la avec la flèche.</p><Message texte={precise} />
        <Capture fichier="04-demande-precise.png" alt="Nouvelle conversation Gemini avec une demande précisant le public, la durée, le matériel, le budget et le tableau attendu." texte="Capture réelle : une demande précise préparée avant son envoi." />
        <p className={styles.resultat}><strong>Vérifiez la deuxième réponse</strong>Retrouvez les 12 participants, les six ordinateurs, les 90 minutes et l’absence d’achat. Relevez une amélioration et un défaut éventuel. Une nouvelle conversation n’efface pas forcément la mémoire ou la personnalisation de votre outil.</p>
        <label className={styles.champs}>Votre comparaison, en une ou deux phrases<textarea aria-label="Ma comparaison des deux demandes" value={difference} onChange={e => { setDifference(e.target.value); setModifie(true); }} placeholder="La deuxième réponse est plus précise sur… Il reste à vérifier…" /></label>
      </>}
      {etape === 4 && <>
        <p>Un assistant configuré réutilise un rôle et des règles. Ici, vous préparez ces consignes dans un fichier ; il n’y a pas besoin de créer un agent ou d’activer une fonction payante.</p>
        <p>Dans les deux champs ci-dessous, gardez les exemples ou remplacez quelques mots. Le texte « Mes consignes » se met à jour automatiquement.</p>
        <div data-guide-builder className={styles.champs}><label>Le rôle de mon assistant<textarea aria-label="Le rôle de mon assistant" value={role} onChange={e => { setRole(e.target.value); setModifie(true); }} /></label><label>La forme des réponses<textarea aria-label="La forme des réponses" value={format} onChange={e => { setFormat(e.target.value); setModifie(true); }} /></label><div className={styles.message}><h4>Mes consignes</h4><pre>{consignes}</pre><div className={styles.telechargement}><button type="button" className="bouton" onClick={() => telecharger('consignes')}>Télécharger mes consignes (.txt)</button></div></div></div>
        <p className={styles.resultat}><strong>À conserver</strong>Cliquez sur « Télécharger mes consignes ». Un fichier texte est créé sur votre ordinateur. Il contient vos règles, pas une IA installée.</p>
        <details className={styles.aide}><summary>Où est passé mon fichier ?</summary><p>Ouvrez les téléchargements du navigateur : souvent une petite flèche près de la barre d’adresse, ou le menu « Téléchargements ». Le fichier s’appelle <strong>mon-assistant-clairlieu.txt</strong>. Vous pouvez l’ouvrir avec un éditeur de texte. Pour continuer immédiatement, utilisez aussi le bouton de copie de l’étape suivante.</p></details>
      </>}
      {etape === 5 && <>
        <p>Ouvrez une <strong>nouvelle discussion</strong> dans votre outil IA. Copiez le bloc ci-dessous, collez-le dans le chat, puis envoyez-le. Restez ensuite dans cette conversation pour les trois tests.</p><Message texte={consignes + '\n\nPremière tâche : proposez le programme de l’atelier en durées relatives.'} nom="Copier mes consignes et la première tâche" />
        <Capture fichier="06-coller-consignes-v2.png" alt="Les consignes initiales du guide et la première tâche, copiées mot pour mot dans Gemini avant l’envoi." texte="Capture réelle avec les consignes initiales ci-dessus, copiées mot pour mot. Si vous avez modifié les champs de l’étape 5, votre texte sera naturellement différent." />
        <p className={styles.resultat}><strong>Ce que vous devez obtenir</strong>Une proposition de programme fondée sur le brief. Vous avez fourni un cadre réutilisable à cette conversation. Ce n’est pas la création d’un Gem ou d’un GPT enregistré dans le service.</p>
      </>}
      {etape === 6 && <>
        <p>Pour chaque test, copiez la demande, envoyez-la dans <strong>la conversation où vous avez placé les consignes</strong>, puis lisez la réponse. Écrivez ici ce que vous avez constaté.</p>
        <div className={styles.tests}>{tests.map((t, i) => <div key={t.titre} className={styles.test}><h4>Test {i + 1} : {t.titre}</h4><Message texte={t.demande} nom={`Copier la demande du test ${i + 1}`} /><p><strong>À vérifier :</strong> {t.attendu}</p><label className={styles.champs}>Mon observation<textarea aria-label={`Mon observation du test ${i + 1}`} value={observations[i]} onChange={e => { setObservations(a => a.map((v, j) => j === i ? e.target.value : v)); setModifie(true); }} placeholder="Ce qui est respecté, ce qui manque, ce qui est inventé…" /></label></div>)}</div>
        <Capture fichier="07-tester-information-absente.png" alt="Réponse réelle de Gemini indiquant que le nom et le numéro de téléphone du responsable ne sont pas fournis dans le brief ClairLieu." texte="Test réellement exécuté, avec le brief et la question dans un même message pour cette capture. Dans votre essai, gardez la conversation contenant vos consignes. Ne recopiez pas la réponse de l’image." />
        <p className={styles.resultat}><strong>Si un test échoue</strong>Revenez à l’étape 5 « Préparer l’assistant », améliorez une règle, puis copiez les nouvelles consignes dans une nouvelle conversation et recommencez les tests.</p>
      </>}
      {etape === 7 && <>
        <p>Téléchargez votre bilan avant de quitter. Il contient votre comparaison, vos observations et vos consignes. Rien n’est sauvegardé par le site.</p><div className="actions"><button type="button" className="bouton" onClick={() => telecharger('bilan')}>Télécharger mon bilan (.txt)</button><button type="button" className="bouton-secondaire" onClick={() => telecharger('consignes')}>Télécharger mes consignes (.txt)</button></div><p className={styles.resultat}><strong>Vous avez terminé si…</strong>Vous pouvez expliquer une différence entre vos deux demandes, montrer vos consignes, relever une erreur ou une limite et expliquer un contrôle réalisé vous-même.</p><p>Si certains essais n’ont pas pu être exécutés, indiquez-le dans vos observations. Vous pouvez reprendre une étape avec les boutons numérotés ci-dessus.</p>
      </>}
      <p role="status" className={styles.statut}>{statut}</p>
      <label className={styles.complete}><input type="checkbox" checked={fait[etape]} onChange={e => setFait(a => a.map((v, i) => i === etape ? e.target.checked : v))} />J’ai réalisé cette étape.</label>
      <div className={styles.navigation}><button type="button" className="bouton-secondaire" disabled={etape === 0} onClick={() => { setEtape(v => v - 1); setStatut(''); }}>Étape précédente</button><p>Vous pouvez revenir en arrière. Vos saisies restent ici tant que la page reste ouverte.</p><button type="button" className="bouton" disabled={etape === 7} onClick={() => { setEtape(v => v + 1); setStatut(''); }}>Étape suivante</button></div>
      <p className={styles.lienSources}><a href="https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt" target="_blank" rel="noreferrer">Source : préciser et améliorer une demande<span className="visuellement-cache"> (nouvel onglet)</span></a> · <a href="/comprendre-ia/premiers-pas-ia/sources/">Sources et lexique du cours</a></p>
    </div>
  </div>;
}
