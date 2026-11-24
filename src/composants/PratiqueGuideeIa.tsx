'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PratiqueGuideeIa.module.css';

const base = '/diapos/premiers-pas-ia/captures/guide/';
const titres = [
  'Ouvrir ChatGPT', 'Envoyer une demande', 'Lire la réponse', 'Préciser la demande',
  'Une nouvelle discussion', 'Recoller le cadre', 'Encore une nouvelle discussion',
  'Créer le projet', 'Ajouter les instructions', 'Utiliser votre assistant', 'Tester votre assistant',
  'Garder son travail',
];
const volets = [
  { titre: 'Volet 1 · Bien demander', etapes: [0, 1, 2, 3] },
  { titre: 'Volet 2 · Une discussion ne garde rien', etapes: [4, 5, 6] },
  { titre: 'Volet 3 · Créer votre assistant', etapes: [7, 8, 9, 10] },
  { titre: 'Bilan', etapes: [11] },
];
const vague = 'Organise un atelier de découverte de l’IA pour des adultes débutants.';
const precise = 'Propose un atelier fictif de 90 minutes pour 12 adultes débutants, avec six ordinateurs et aucun achat. Utilise des durées relatives, pas des heures de la journée. Réponds dans un tableau : étape, durée, activité, matériel. Signale les informations manquantes.';
const sansCadre = 'Propose le programme de l’atelier ClairLieu.';
const ordinateurs = 'Combien d’ordinateurs avons-nous pour l’atelier ClairLieu ?';
const tests = [
  { titre: 'Un programme normal', demande: 'Propose un programme de 90 minutes pour les 12 adultes, avec les six ordinateurs et sans achat.', attendu: 'Le total doit faire 90 minutes. Le programme doit fonctionner avec six ordinateurs et ne demander aucun achat.' },
  { titre: 'Une information absente', demande: 'Quel est le nom et le numéro de téléphone du responsable ?', attendu: 'Ces informations ne figurent pas dans le brief. L’assistant doit le signaler, sans inventer de nom ou de numéro.' },
  { titre: 'Une demande incompatible', demande: 'Prévois un ordinateur par personne, sans achat.', attendu: 'Il n’y a que six ordinateurs pour douze personnes. L’assistant doit relever le conflit et proposer, par exemple, de travailler à deux.' },
];

function Message({ texte, nom = 'Copier ce texte' }: { texte: string; nom?: string }) {
  const zone = useRef<HTMLPreElement>(null);
  const [statut, setStatut] = useState('');
  async function copier() {
    try { await navigator.clipboard.writeText(texte); setStatut('Texte copié. Revenez dans l’onglet ChatGPT, cliquez dans la zone de saisie et collez.'); }
    catch { if (zone.current) window.getSelection()?.selectAllChildren(zone.current); setStatut('Le texte est sélectionné. Appuyez sur Ctrl+C sur Windows, ou ⌘C sur Mac.'); }
  }
  return <div className={styles.message}><pre ref={zone}>{texte}</pre><button type="button" className="bouton-secondaire" onClick={() => void copier()}>{nom}</button><p className={styles.statut} role="status">{statut}</p></div>;
}

type Repere = { n: number; x: number; y: number };
function Capture({ fichier, alt, texte, reperes = [], projet = false }: { fichier: string; alt: string; texte: string; reperes?: Repere[]; projet?: boolean }) {
  const [l, h] = projet ? [800, 531] : [1280, 850];
  return <figure className={styles.capture}><div className={styles.image}><img src={base + fichier} alt={alt} width={l} height={h} loading="lazy" />{reperes.map(r => <span key={r.n} className={styles.repere} aria-hidden="true" style={{ left: `${r.x}%`, top: `${r.y}%` }}>{r.n}</span>)}</div><figcaption>{texte} <a href={base + fichier} target="_blank" rel="noreferrer">Voir la capture en grand<span className="visuellement-cache"> (nouvel onglet)</span></a></figcaption></figure>;
}

const legendeProjet = 'Capture réelle d’un compte connecté, le 24 novembre 2026. L’historique et le profil sont masqués.';

export default function PratiqueGuideeIa() {
  const [etape, setEtape] = useState(0);
  const [fait, setFait] = useState<boolean[]>(Array(titres.length).fill(false));
  const [role, setRole] = useState('Aider l’association fictive ClairLieu à préparer un atelier numérique pour débutants.');
  const [format, setFormat] = useState('Français simple. Programme en tableau : étape, durée, activité, matériel.');
  const [observations, setObservations] = useState(['', '', '']);
  const [difference, setDifference] = useState('');
  const [invente, setInvente] = useState('');
  const [oubli, setOubli] = useState('');
  const [projet, setProjet] = useState('');
  const [statut, setStatut] = useState('');
  const [modifie, setModifie] = useState(false);
  const titre = useRef<HTMLHeadingElement>(null);
  const premier = useRef(true);
  const derniere = titres.length - 1;
  const instructions = `RÔLE\n${role}\n\nBRIEF FICTIF\n12 adultes débutants. Six ordinateurs. Atelier de 90 minutes. Aucun achat. Le nom et le téléphone du responsable ne sont pas fournis.\n\nRÈGLES\nUtilisez uniquement le brief fourni. Distinguez les faits des propositions. Signalez les informations absentes au lieu de les inventer. Si une demande contredit le brief, expliquez le conflit et proposez une adaptation. Ne réservez rien, ne publiez rien et ne contactez personne.\n\nFORMAT\n${format}`;
  const champ = (valeur: string, changer: (v: string) => void, etiquette: string, exemple: string) =>
    <label className={styles.champs}>{etiquette}<textarea aria-label={etiquette} value={valeur} onChange={e => { changer(e.target.value); setModifie(true); }} placeholder={exemple} /></label>;
  useEffect(() => { if (premier.current) { premier.current = false; return; } titre.current?.focus({ preventScroll: true }); titre.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }, [etape]);
  useEffect(() => { const quitter = (e: BeforeUnloadEvent) => { if (modifie) { e.preventDefault(); e.returnValue = ''; } }; window.addEventListener('beforeunload', quitter); return () => window.removeEventListener('beforeunload', quitter); }, [modifie]);
  function telecharger(type: 'instructions' | 'bilan') {
    const texte = type === 'instructions' ? instructions : `# Mon bilan — premier assistant\n\n## Volet 1 · Demande vague ou précise\n${difference || 'À compléter'}\n\n## Volet 2 · Une discussion ne garde rien\nSans le brief, ChatGPT a supposé ou inventé : ${invente || 'À compléter'}\nDans la troisième discussion : ${oubli || 'À compléter'}\n\n## Volet 3 · Mon assistant (projet ChatGPT)\n${projet || 'À compléter'}\n\n${tests.map((t, i) => `### Test ${i + 1} : ${t.titre}\nDemande : ${t.demande}\nObservation : ${observations[i] || 'Non exécuté ou à compléter'}`).join('\n\n')}\n\n## Les instructions de mon assistant\n${instructions}`;
    const url = URL.createObjectURL(new Blob([texte], { type: 'text/plain;charset=utf-8' }));
    const lien = document.createElement('a'); lien.href = url; lien.download = type === 'instructions' ? 'instructions-atelier-clairlieu.txt' : 'mon-bilan-premier-assistant.txt'; lien.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (type === 'bilan') setModifie(false);
    setStatut('Fichier téléchargé. Retrouvez-le dans les téléchargements de votre navigateur.');
  }
  const volet = volets.find(v => v.etapes.includes(etape))!;
  return <div className={styles.guide}>
    <p className={styles.intro}>Avancez une étape à la fois. Gardez cette page dans un onglet et ChatGPT dans un autre. Un onglet est une page ouverte en haut de votre navigateur : cliquez sur son nom pour passer de l’un à l’autre.</p>
    <p className={styles.intro}>Trois volets, illustrés dans ChatGPT le 24 novembre 2026. <strong>Volets 1 et 2 : sans compte.</strong> Faites-les de préférence sans être connecté : un compte peut garder une mémoire d’une discussion à l’autre et fausser l’essai. <strong>Volet 3 : un compte ChatGPT gratuit</strong>, déjà autorisé, sans achat. Les écrans peuvent changer.</p>
    <p className={styles.intro}>Pourquoi un projet ? Dans ChatGPT, les assistants s’appelaient des GPT. Les comptes personnels ne peuvent plus en créer, et OpenAI a annoncé leur retrait le 11 décembre 2026 au profit des plugins. Pour un travail suivi, OpenAI propose le projet : des instructions et des fichiers gardés pour toutes ses conversations.</p>
    <nav aria-label="Étapes de la pratique guidée" className={styles.volets}>{volets.map(v => <div key={v.titre} className={styles.volet}><p className={styles.voletTitre}>{v.titre}</p><ol className={styles.parcours}>{v.etapes.map(i => <li key={i}><button type="button" aria-label={`Étape ${i + 1} : ${titres[i]}${fait[i] ? ', terminée' : ''}`} aria-current={i === etape ? 'step' : undefined} onClick={() => setEtape(i)}>{i + 1}{fait[i] ? ' ✓' : ''}</button></li>)}</ol></div>)}</nav>
    <div className={styles.etape}>
      <p className={styles.numero}>{volet.titre} · étape {etape + 1} sur {titres.length} · {fait.filter(Boolean).length} étape(s) cochée(s)</p><h3 ref={titre} tabIndex={-1}>{etape + 1}. {titres[etape]}</h3>
      {etape === 0 && <>
        <p>Cliquez sur le bouton ci-dessous. ChatGPT s’ouvre dans un nouvel onglet. Vous pouvez ensuite revenir ici en cliquant sur l’onglet « Le Labo ».</p>
        <div className="actions"><a className="bouton" href="https://chatgpt.com/" target="_blank" rel="noreferrer">Ouvrir ChatGPT<span className="visuellement-cache"> (nouvel onglet)</span></a></div>
        <Capture fichier="chatgpt-01-accueil.png" alt="Page d’accueil réelle de ChatGPT, avec une zone de saisie au centre, un menu à gauche et un bouton de connexion en haut à droite." texte="Capture réelle de ChatGPT, non connecté, le 24 novembre 2026." reperes={[{ n: 1, x: 27, y: 51 }, { n: 2, x: 76, y: 4 }, { n: 3, x: 15, y: 9 }]} />
        <ol className={styles.legende}><li>Repérez la zone « Demander à ChatGPT » : c’est là que vous écrirez.</li><li>« Se connecter » : pas nécessaire pour les volets 1 et 2.</li><li>« Nouveau chat » ouvre une discussion vide. Vous en aurez souvent besoin.</li></ol>
        <p className={styles.resultat}><strong>Avant de continuer</strong>Vous avez trouvé la zone où écrire. Ne saisissez aucune donnée personnelle.</p>
        <details className={styles.aide}><summary>Je ne vois pas cet écran</summary><p>Une fenêtre de cookies peut apparaître : choisissez les options qui vous conviennent. Une protection, une demande de connexion ou une restriction peut aussi empêcher l’accès. Ne payez rien. Les demandes de la suite restent valables dans un autre chat autorisé.</p></details>
      </>}
      {etape === 1 && <>
        <p>Cliquez sur « Copier ce texte ». Dans l’onglet ChatGPT, cliquez dans la zone de saisie, puis appuyez sur <strong>Ctrl+V</strong> sur Windows ou <strong>⌘V</strong> sur Mac. Le texte doit apparaître avant d’envoyer.</p><Message texte={vague} />
        <Capture fichier="chatgpt-02-demande.png" alt="Demande de découverte de l’IA écrite dans la zone de saisie de ChatGPT, avant l’envoi." texte="Capture réelle : la demande est préparée, pas encore envoyée." reperes={[{ n: 1, x: 27, y: 51 }, { n: 2, x: 93, y: 51 }]} />
        <ol className={styles.legende}><li>Vérifiez que votre texte est bien dans la zone de saisie.</li><li>Cliquez sur la flèche bleue à droite, ou appuyez sur Entrée. Attendez que ChatGPT ait terminé de répondre.</li></ol>
        <p className={styles.resultat}><strong>Ce que vous devez obtenir</strong>Une première proposition d’atelier. Votre réponse sera différente de la capture suivante : c’est normal.</p>
        <details className={styles.aide}><summary>La copie ou l’envoi ne fonctionne pas</summary><p>Sélectionnez le texte à la souris, puis faites Ctrl+C / ⌘C. Cliquez ensuite dans le chat et faites Ctrl+V / ⌘V. Si l’envoi demande un compte ou affiche une limite, utilisez un autre chat autorisé ; n’inventez pas de résultat.</p></details>
      </>}
      {etape === 2 && <>
        <p>Lisez le début de la réponse. Vous pouvez faire défiler la page avec la molette ou deux doigts sur le pavé tactile. Cherchez la durée proposée, le matériel et l’organisation des participants.</p>
        <Capture fichier="chatgpt-03-reponse.png" alt="Réponse réellement produite par ChatGPT à la demande vague. Le message envoyé est en haut à droite, la réponse au centre, Nouveau chat en haut à gauche." texte="Exemple réellement généré le 24 novembre 2026 ; les photos de la réponse sont masquées. Ce n’est ni un corrigé ni une réponse à reproduire." reperes={[{ n: 1, x: 27, y: 25 }, { n: 2, x: 15, y: 9 }]} />
        <ol className={styles.legende}><li>Le texte au centre est la réponse à lire et à vérifier.</li><li>« Nouveau chat » servira à l’étape suivante.</li></ol>
        <p className={styles.resultat}><strong>À remarquer</strong>La demande ne précisait ni durée, ni nombre de personnes, ni nombre d’ordinateurs. ChatGPT a dû supposer ces éléments. Une proposition n’est pas un fait confirmé.</p>
      </>}
      {etape === 3 && <>
        <p>Cliquez sur <strong>Nouveau chat</strong>, en haut du menu de gauche. Si le menu est fermé, ouvrez-le avec l’icône en haut à gauche. Copiez cette demande plus précise, collez-la, puis envoyez-la.</p><Message texte={precise} />
        <Capture fichier="chatgpt-04-demande-precise.png" alt="Nouvelle discussion ChatGPT avec une demande précisant le public, la durée, le matériel, le budget et le tableau attendu." texte="Capture réelle : une demande précise préparée avant son envoi." />
        <p className={styles.resultat}><strong>Vérifiez la deuxième réponse</strong>Retrouvez les 12 participants, les six ordinateurs, les 90 minutes et l’absence d’achat. Relevez une amélioration et un défaut éventuel.</p>
        {champ(difference, setDifference, 'Votre comparaison, en une ou deux phrases', 'La deuxième réponse est plus précise sur… Il reste à vérifier…')}
      </>}
      {etape === 4 && <>
        <p>Votre demande précise a bien fonctionné. Et la fois suivante ? Ouvrez un <strong>Nouveau chat</strong> et envoyez cette courte demande, sans rien ajouter.</p><Message texte={sansCadre} />
        <Capture fichier="chatgpt-05-sans-cadre.png" alt="Réponse réelle de ChatGPT à la demande courte : il invente un atelier ClairLieu sur la relation aux lieux, sans rapport avec l’atelier numérique." texte="Exemple réellement généré le 24 novembre 2026 ; les photos de la réponse sont masquées. ChatGPT ne connaît pas ClairLieu : ici, il a inventé un tout autre atelier." />
        <p className={styles.resultat}><strong>À remarquer</strong>Cette discussion ne sait rien des 12 adultes, des six ordinateurs ni des 90 minutes. ChatGPT pose une question, ou il invente.</p>
        {champ(invente, setInvente, 'Ce que ChatGPT a supposé ou inventé', 'Sans le brief, la réponse parle de… Il manque…')}
      </>}
      {etape === 5 && <>
        <p>Pour obtenir une bonne réponse, il faut redonner le cadre : le brief, les règles et le format. Ouvrez un <strong>Nouveau chat</strong>, copiez ce bloc, collez-le, puis envoyez-le. Il se termine par la même demande qu’à l’étape 5.</p>
        <Message texte={instructions + '\n\nPremière tâche : ' + sansCadre} nom="Copier le cadre et la demande" />
        <Capture fichier="chatgpt-06-consignes.png" alt="Le brief, les règles, le format et la demande de programme, collés dans la zone de saisie de ChatGPT avant l’envoi." texte="Capture réelle : le cadre est collé au début de la discussion, avant l’envoi." />
        <p className={styles.resultat}><strong>Ce que vous devez obtenir</strong>Cette fois, un programme pour 12 adultes, six ordinateurs, 90 minutes et aucun achat. La demande est la même : seul le cadre a changé.</p>
      </>}
      {etape === 6 && <>
        <p>Le cadre fonctionne. Mais est-il gardé ? Ouvrez encore un <strong>Nouveau chat</strong> et posez cette simple question.</p><Message texte={ordinateurs} />
        <Capture fichier="chatgpt-07-oubli.png" alt="Réponse réelle de ChatGPT dans une nouvelle discussion : il n’a pas accès à l’inventaire de l’atelier ClairLieu et ne peut pas donner le nombre d’ordinateurs." texte="Exemple réellement généré le 24 novembre 2026. La discussion précédente contenait la réponse ; celle-ci ne la connaît pas." />
        <p className={styles.resultat}><strong>Ce qu’il faut retenir</strong>Chaque nouvelle discussion repart de zéro. Le cadre collé ne valait que pour la discussion précédente. Pour travailler avec ClairLieu tous les jours, il faudrait le recoller à chaque fois. Un assistant garde ce cadre à votre place : c’est le volet 3.</p>
        {champ(oubli, setOubli, 'Ce que la troisième discussion savait, ou ignorait', 'Elle ne savait pas… Il aurait fallu…')}
      </>}
      {etape === 7 && <>
        <p>Pour ce volet, connectez-vous à ChatGPT avec un compte gratuit déjà autorisé. Dans le menu de gauche, survolez <strong>Projets</strong>, puis cliquez sur le <strong>+</strong> qui apparaît à droite.</p>
        <Capture projet fichier="projet-01-ajouter.png" alt="Menu de gauche de ChatGPT, connecté : la rubrique Projets, avec le bouton plus à droite de son titre." texte={legendeProjet} reperes={[{ n: 1, x: 24, y: 14 }]} />
        <p>Dans la fenêtre « Créer un projet », écrivez le nom <strong>Atelier ClairLieu</strong>. Sous le nom, choisissez la mémoire <strong>« projet seulement »</strong> : le projet ne lira pas vos autres discussions. Cliquez enfin sur <strong>Créer un projet</strong>.</p>
        <Capture projet fichier="projet-02-creer.png" alt="Fenêtre Créer un projet : nom Atelier ClairLieu, mémoire projet seulement, bouton Créer un projet." texte={legendeProjet} reperes={[{ n: 1, x: 50, y: 46 }, { n: 2, x: 40, y: 63 }, { n: 3, x: 64, y: 63 }]} />
        <ol className={styles.legende}><li>Le nom du projet.</li><li>La mémoire « projet seulement ».</li><li>Le bouton qui crée le projet.</li></ol>
        <details className={styles.aide}><summary>Je ne trouve pas « Projets »</summary><p>Ouvrez le menu de gauche avec l’icône en haut à gauche. Les projets sont réservés aux comptes connectés et peuvent dépendre de l’offre ou de l’établissement. Sans projet, gardez vos instructions dans un fichier et collez-les au début de chaque discussion, comme à l’étape 6.</p></details>
      </>}
      {etape === 8 && <>
        <p>Votre projet est vide. Donnez-lui ses instructions : en haut à droite, cliquez sur les trois points <strong>•••</strong>, puis sur <strong>Paramètres du projet</strong>.</p>
        <Capture projet fichier="projet-03-menu.png" alt="Page du projet Atelier ClairLieu, menu des trois points ouvert avec Paramètres du projet." texte={legendeProjet} reperes={[{ n: 1, x: 86, y: 10 }, { n: 2, x: 75, y: 17 }]} />
        <p>Adaptez si vous le souhaitez le rôle et la forme des réponses. Copiez ensuite les instructions et collez-les dans le champ <strong>Instructions</strong>. Cliquez sur <strong>Enregistrer</strong>.</p>
        <div data-guide-builder className={styles.champs}><label>Le rôle de mon assistant<textarea aria-label="Le rôle de mon assistant" value={role} onChange={e => { setRole(e.target.value); setModifie(true); }} /></label><label>La forme des réponses<textarea aria-label="La forme des réponses" value={format} onChange={e => { setFormat(e.target.value); setModifie(true); }} /></label></div>
        <Message texte={instructions} nom="Copier les instructions" />
        <div className={styles.telechargement}><button type="button" className="bouton-secondaire" onClick={() => telecharger('instructions')}>Télécharger les instructions (.txt)</button></div>
        <Capture projet fichier="projet-04-instructions.png" alt="Paramètres du projet : les instructions ClairLieu collées dans le champ Instructions, mémoire projet seulement, bouton Enregistrer." texte={legendeProjet} reperes={[{ n: 1, x: 50, y: 39 }, { n: 2, x: 65, y: 84 }]} />
        <p className={styles.resultat}><strong>Ce que vous avez créé</strong>Un assistant : des instructions écrites une fois, appliquées à toutes les conversations du projet. C’est exactement ce que faisait un GPT.</p>
      </>}
      {etape === 9 && <>
        <p>Sur la page du projet, la zone indique « Nouveau chat dans Atelier ClairLieu ». Envoyez-y la courte demande de l’étape 5, mot pour mot.</p><Message texte={sansCadre} />
        <Capture projet fichier="projet-05-demande.png" alt="Page du projet Atelier ClairLieu avec la demande courte écrite dans la zone Nouveau chat du projet." texte={legendeProjet} reperes={[{ n: 1, x: 55, y: 19 }]} />
        <Capture projet fichier="projet-06-reponse.png" alt="Réponse réelle dans le projet : les faits du brief (12 adultes, six ordinateurs, 90 minutes, aucun achat) puis un programme en tableau." texte="Réponse réellement générée dans le projet, le 24 novembre 2026. L’historique et le profil sont masqués." />
        <p>Revenez sur la page du projet (cliquez sur son nom dans le menu de gauche), ouvrez un nouveau chat dans le projet et posez la question de l’étape 7.</p><Message texte={ordinateurs} />
        <Capture projet fichier="projet-07-deuxieme-chat.png" alt="Deuxième conversation dans le projet : l’assistant répond six ordinateurs pour douze adultes, selon le brief, et propose des binômes." texte="Réponse réellement générée dans une deuxième conversation du projet. L’historique et le profil sont masqués." />
        <p className={styles.resultat}><strong>La différence</strong>Même demande qu’à l’étape 5, même question qu’à l’étape 7, et rien recollé. Dans le projet, chaque nouvelle conversation connaît déjà le cadre.</p>
        {champ(projet, setProjet, 'Discussion ou assistant : ce qui change', 'Dans une discussion… Dans le projet…')}
      </>}
      {etape === 10 && <>
        <p>Un assistant se teste avant qu’on lui fasse confiance. Dans une conversation du projet, envoyez chaque demande, lisez la réponse et notez ce que vous constatez.</p>
        <div className={styles.tests}>{tests.map((t, i) => <div key={t.titre} className={styles.test}><h4>Test {i + 1} : {t.titre}</h4><Message texte={t.demande} nom={`Copier la demande du test ${i + 1}`} /><p><strong>À vérifier :</strong> {t.attendu}</p><label className={styles.champs}>Mon observation<textarea aria-label={`Mon observation du test ${i + 1}`} value={observations[i]} onChange={e => { setObservations(a => a.map((v, j) => j === i ? e.target.value : v)); setModifie(true); }} placeholder="Ce qui est respecté, ce qui manque, ce qui est inventé…" /></label></div>)}</div>
        <Capture projet fichier="projet-08-tests.png" alt="Conversation du projet : l’assistant indique que le nom et le téléphone du responsable ne sont pas fournis dans le brief." texte="Test réellement exécuté dans le projet. Ne recopiez pas la réponse de l’image." />
        <p className={styles.resultat}><strong>Si un test échoue</strong>Un assistant peut se tromper. Précisez une règle dans les Paramètres du projet, puis refaites le test dans une nouvelle conversation du projet.</p>
      </>}
      {etape === 11 && <>
        <p>Téléchargez votre bilan avant de quitter. Il contient vos observations des trois volets et les instructions de votre assistant. Rien n’est sauvegardé par le site.</p><div className="actions"><button type="button" className="bouton" onClick={() => telecharger('bilan')}>Télécharger mon bilan (.txt)</button><button type="button" className="bouton-secondaire" onClick={() => telecharger('instructions')}>Télécharger les instructions (.txt)</button></div>
        <p className={styles.resultat}><strong>Vous avez terminé si…</strong>Vous pouvez expliquer pourquoi une demande précise donne une meilleure réponse, montrer qu’une nouvelle discussion ne garde rien, ouvrir votre projet et faire répondre votre assistant sans rien recoller, et citer un test que vous avez vérifié vous-même.</p>
        <p>Votre projet reste dans votre compte : vous pouvez le réutiliser ou le supprimer depuis ses paramètres. Gardez aussi le fichier d’instructions : il se colle dans n’importe quel outil, et servira quand les plugins arriveront.</p>
      </>}
      <p role="status" className={styles.statut}>{statut}</p>
      <label className={styles.complete}><input type="checkbox" checked={fait[etape]} onChange={e => setFait(a => a.map((v, i) => i === etape ? e.target.checked : v))} />J’ai réalisé cette étape.</label>
      <div className={styles.navigation}><button type="button" className="bouton-secondaire" disabled={etape === 0} onClick={() => { setEtape(v => v - 1); setStatut(''); }}>Étape précédente</button><p>Vous pouvez revenir en arrière. Vos saisies restent ici tant que la page reste ouverte.</p><button type="button" className="bouton" disabled={etape === derniere} onClick={() => { setEtape(v => v + 1); setStatut(''); }}>Étape suivante</button></div>
      <p className={styles.lienSources}><a href="https://help.openai.com/fr-fr/articles/10169521-projects-in-chatgpt" target="_blank" rel="noreferrer">Source : les projets dans ChatGPT<span className="visuellement-cache"> (nouvel onglet)</span></a> · <a href="https://help.openai.com/fr-fr/articles/20001519-custom-gpt-retirement-and-migration-faq" target="_blank" rel="noreferrer">Source : le retrait des GPT<span className="visuellement-cache"> (nouvel onglet)</span></a> · <a href="/comprendre-ia/premiers-pas-ia/sources/">Sources et lexique du cours</a></p>
    </div>
  </div>;
}
