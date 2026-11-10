'use client';

import { useState } from 'react';
import styles from './ExerciceHuggingFace.module.css';

const hf = 'https://huggingface.co/spaces/';
const missions = [
  { id: 'classification', titre: 'Reconnaître', flux: 'Image + catégories proposées → scores', modele: 'Comparer CLIP et SigLIP', url: 'merve/compare_clip_siglip', but: 'Le modèle doit choisir parmi vos catégories. Comment le choix des mots influence-t-il son classement ?', depart: 'Téléchargez la photo de vélo ci-dessous. Dans la démo, chargez-la dans le cadre image. Dans « Input a list of labels », écrivez : bicycle, motorcycle, car. Cliquez sur « Run ». Les colonnes « CLIP Output » et « SigLIP Output » classent vos trois propositions.', changer: 'Gardez la photo et remplacez seulement les catégories par : motorcycle, car, bus. Cliquez à nouveau sur « Run ». Le bon mot « bicycle » a volontairement disparu.', regarder: 'Que proposent les modèles quand la bonne catégorie est absente ? Les scores CLIP et SigLIP ne se calculent pas de la même manière : comparez les classements, sans lire leurs pourcentages comme une certitude.' },
  { id: 'description', titre: 'Décrire', flux: 'Image → phrase', modele: 'BLIP · légendage', url: 'hysts/image-captioning-with-blip', but: 'Une image doit être comprise sans être vue. Quelles informations la légende devrait-elle conserver ?', depart: 'Chargez la photo de vélo fournie ci-dessous, puis lancez la génération de légende. Comparez la phrase, éventuellement en anglais, à ce que vous voyez.', changer: 'Recadrez la même photo pour ne garder qu’une partie du vélo, puis chargez cette version et relancez la légende.', regarder: 'Quels détails sont ajoutés, oubliés ou inventés ? Pour un texte alternatif, que faudrait-il corriger ?' },
  { id: 'ocr', titre: 'Lire du texte', flux: 'Image de texte → texte', modele: 'PP-OCRv5', url: 'PaddlePaddle/PP-OCRv5_Online_Demo', but: 'Un menu photographié doit devenir du texte copiable. Comment vérifier les prix ?', depart: 'Téléchargez le menu fictif ci-dessous, chargez-le dans la démo puis lancez l’OCR. Vérifiez les noms des plats et les prix.', changer: 'Recadrez le même menu sur une petite zone, ou utilisez une version inclinée. Gardez le même modèle.', regarder: 'Les accents, nombres et lignes sont-ils fidèles ? Les prix restent-ils associés aux bons plats ?' },
  { id: 'detection', titre: 'Localiser', flux: 'Image → objets et cadres', modele: 'YOLOv10 Web', url: 'Xenova/yolov10-web', but: 'Pour compter des objets, il faut aussi savoir où ils sont. Une simple liste de noms ne suffit pas.', depart: 'Chargez une image d’exemple contenant plusieurs objets. Choisissez le mode image si la démo propose aussi une caméra. Comptez les objets visibles puis les cadres.', changer: 'Si un seuil de confiance est disponible, modifiez seulement ce seuil. Sinon, recadrez l’image pour masquer partiellement un objet.', regarder: 'Combien d’objets sont oubliés ou encadrés à tort ? Un seuil filtre les résultats ; il ne réentraîne pas le modèle.' },
  { id: 'stt', titre: 'Transcrire', flux: 'Voix → texte', modele: 'Whisper Large V3', url: 'hf-audio/whisper-large-v3', but: 'Préparer les sous-titres d’une vidéo : quels mots faudra-t-il relire ?', depart: 'Chargez l’extrait audio fourni ci-dessous puis lancez la transcription. Si la langue est demandée, choisissez le français. Comparez la transcription à ce que vous entendez.', changer: 'Enregistrez une phrase fictive une fois au calme puis avec un bruit de fond. Transcrivez les deux versions avec les mêmes réglages.', regarder: 'Quels mots et signes de ponctuation changent ? Une transcription fluide peut-elle contenir une erreur ?' },
  { id: 'tts', titre: 'Faire parler', flux: 'Texte → voix', modele: 'Kokoro Web', url: 'Xenova/kokoro-web', but: 'Créer une annonce audio compréhensible, sans devoir enregistrer chaque version.', depart: 'Choisissez une langue proposée par la démo et une voix compatible. Pour l’anglais : « Your train leaves at nine fifteen. Please go to platform three. » Écoutez le résultat.', changer: 'Gardez le même texte et changez seulement la voix ou la vitesse si ce réglage existe.', regarder: 'Les nombres sont-ils compréhensibles ? Quelle voix ou vitesse convient à une annonce ? Le modèle comprend-il le message qu’il lit ?' },
  { id: 'image', titre: 'Créer une image', flux: 'Texte → image', modele: 'FLUX.1 Schnell', url: 'black-forest-labs/FLUX.1-schnell', but: 'Explorer une idée visuelle avant de choisir une photo ou de réaliser une illustration.', depart: 'Essayez : « A red robin on a wet branch, close-up photograph, soft morning light, no text ». Notez le résultat et la graine aléatoire (seed) si elle est affichée.', changer: 'Remplacez seulement « soft morning light » par « dramatic night lighting ». Conservez les autres réglages et la même graine si possible.', regarder: 'La lumière change-t-elle comme prévu ? Si la graine change aussi, on ne peut pas attribuer toutes les différences au texte. Inspectez les pattes et la branche.' },
];
type Notes = { attente: string; premier: string; second: string; bilan: string };
const vide: Notes = { attente: '', premier: '', second: '', bilan: '' };

export default function ExerciceHuggingFace() {
  const [actif, setActif] = useState(0);
  const [notes, setNotes] = useState<Record<string, Notes>>({});
  const mission = missions[actif];
  const fiche = notes[mission.id] ?? vide;
  const faites = missions.filter(m => Object.values(notes[m.id] ?? vide).every(v => v.trim())).length;
  function modifier(champ: keyof Notes, valeur: string) {
    setNotes(n => ({ ...n, [mission.id]: { ...(n[mission.id] ?? vide), [champ]: valeur } }));
  }
  function telecharger() {
    const contenu = ['# Mes essais — Les types d’IA', ...missions.filter(m => notes[m.id]).map(m => {
      const n = notes[m.id];
      return `## ${m.titre} · ${m.flux}\nModèle proposé : ${m.modele}\nLien : ${hf}${m.url}\n\n### Mon attente\n${n.attente}\n\n### Premier essai\n${n.premier}\n\n### Second essai (modification et résultat)\n${n.second}\n\n### Utilité, limite et vérification humaine\n${n.bilan}`;
    })].join('\n\n');
    const url = URL.createObjectURL(new Blob([contenu], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'mes-essais-types-ia.md'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={styles.atelier}>
    <div className={styles.barre}><p aria-live="polite">{faites} / {missions.length} fiches remplies · objectif : 3 missions au choix</p><button className="bouton-secondaire" onClick={telecharger}>Télécharger mes observations (.md)</button></div>
    <p className={styles.info}>Vos notes restent dans cette page et disparaissent au rechargement. Téléchargez-les avant de partir. Les liens ouvrent un service externe : les fichiers et consignes saisis là-bas sont traités selon ses conditions. Utilisez les exemples fournis ou des données fictives.</p>
    <div className={styles.choix} role="group" aria-label="Choisir une mission">{missions.map((m, i) => <button key={m.id} onClick={() => setActif(i)} aria-pressed={i === actif}><span>{String(i + 1).padStart(2, '0')}</span>{m.titre}</button>)}</div>
    <section className={styles.mission} aria-labelledby="mission-titre">
      <header><p className={styles.flux}>{mission.flux}</p><h2 id="mission-titre">{mission.titre}</h2><p>{mission.but}</p></header>
      <div className={styles.colonnes}>
        <div className={styles.consigne}>
          <h3>1. Préparer et lancer</h3><p>{mission.depart}</p>
          <div className={styles.liens}><a className="bouton" href={hf + mission.url} target="_blank" rel="noopener noreferrer">Tester {mission.modele} ↗<span className="visuellement-cache"> (nouvel onglet)</span></a></div>
          {(mission.id === 'classification' || mission.id === 'description') && <a className="bouton-secondaire" download href="/diapos/types-ia/velo.jpg">Télécharger la photo de vélo</a>}
          {(mission.id === 'ocr' || mission.id === 'stt') && <a className="bouton-secondaire" download href={'/diapos/types-ia/' + (mission.id === 'ocr' ? 'menu.png' : 'voix-exemple.wav')}>Télécharger {mission.id === 'ocr' ? 'le menu fictif' : 'l’extrait audio'}</a>}
          <h3>2. Changer un seul élément</h3><p>{mission.changer}</p>
          <h3>3. Examiner le résultat</h3><p>{mission.regarder}</p>
          <details><summary>Si la démo ne fonctionne pas</summary><p>Le premier lancement peut télécharger un modèle et prendre du temps. Un statut « Running » indique que la démo est démarrée, sans garantir qu’un calcul aboutira. Les démos dans le navigateur dépendent du matériel ; celles sur serveur peuvent avoir une file d’attente ou un quota. Si un crédit ou un paiement est demandé, choisissez une autre mission et notez le blocage.</p></details>
        </div>
        <div className={styles.notes} key={mission.id}>
          <h3>Votre fiche d’observation</h3>
          {([['attente', 'Avant : quel résultat attendez-vous ?'], ['premier', 'Essai 1 : modèle utilisé, entrée et résultat observé'], ['second', 'Essai 2 : élément changé et différence observée'], ['bilan', 'Bilan : un usage utile, une limite et une vérification humaine']] as const).map(([champ, label]) => <label key={champ} htmlFor={mission.id + champ}>{label}<textarea id={mission.id + champ} rows={3} value={fiche[champ]} onChange={e => modifier(champ, e.target.value)} /></label>)}
        </div>
      </div>
    </section>
    <p className={styles.info}>Pour terminer : téléchargez vos observations de trois missions, avec deux essais comparés par mission. Une fiche remplie compte dans la progression ; ses réponses ne sont pas corrigées automatiquement. Bonus : essayez une quatrième famille et expliquez la différence entre ses entrées et ses sorties.</p>
  </div>;
}
