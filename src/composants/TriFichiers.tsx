'use client';

import { useRef, useState } from 'react';
import { CHEMINS, FICHIERS, QUESTIONS, RESULTATS, couleurDe, type Couleur } from '@/contenu/tri-fichiers';
import { marquerVu } from './memoire';

// Démonstration « Puis-je l'envoyer à une IA ? » : on choisit un fichier, on répond aux trois questions,
// la couleur tombe, puis on la compare à la réponse attendue. Les fichiers sont fictifs et téléchargeables.

const PASTILLE: Record<Couleur, string> = { vert: 'vert', orangeAnon: 'orange', orange: 'orange', rouge: 'rouge' };

export default function TriFichiers({ cours }: { cours: string }) {
  const [choisi, setChoisi] = useState(FICHIERS[0].id);
  const [reponses, setReponses] = useState<Record<string, boolean[]>>({});
  const panneau = useRef<HTMLElement>(null);

  const fichier = FICHIERS.find((f) => f.id === choisi)!;
  const rep = reponses[fichier.id] ?? [];
  const resultat = couleurDe(rep);
  const question = resultat ? null : QUESTIONS[rep.length];
  const attendu = CHEMINS[fichier.attendu];
  const ecart = resultat ? rep.findIndex((r, k) => r !== attendu[k]) : -1; // la première question ratée
  const ouiNon = (b: boolean) => (b ? 'Oui' : 'Non');

  const faits = FICHIERS.filter((f) => couleurDe(reponses[f.id] ?? []));
  const justes = faits.filter((f) => couleurDe(reponses[f.id]) === f.attendu);

  const repondre = (oui: boolean) => {
    setReponses({ ...reponses, [fichier.id]: [...rep, oui] });
    marquerVu(cours, 'puis-je-l-envoyer');
  };
  const ouvrir = (id: string) => {
    setChoisi(id);
    if (window.matchMedia('(max-width: 1000px)').matches) requestAnimationFrame(() => panneau.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const suivant = () => {
    const reste = FICHIERS.find((f) => !couleurDe(reponses[f.id] ?? []) && f.id !== fichier.id);
    if (reste) ouvrir(reste.id);
  };

  return (
    <div className="tri">
      <div className="tri-gauche">
        <div className="tri-score">
          <p role="status">{faits.length === 0 ? 'Choisissez un fichier, puis répondez aux trois questions.' : `${faits.length} fichier${faits.length > 1 ? 's' : ''} trié${faits.length > 1 ? 's' : ''} sur ${FICHIERS.length}, ${justes.length} juste${justes.length > 1 ? 's' : ''}.`}</p>
          {faits.length > 0 && <button type="button" className="bouton-secondaire" onClick={() => setReponses({})}>Tout recommencer</button>}
        </div>
        <ul className="tri-liste">
          {FICHIERS.map((f) => {
            const c = couleurDe(reponses[f.id] ?? []);
            return (
              <li key={f.id}>
                <button type="button" className={'tri-fichier' + (f.id === choisi ? ' est-choisi' : '')} aria-current={f.id === choisi ? 'true' : undefined} onClick={() => ouvrir(f.id)}>
                  <span className="tri-format">{f.format}</span>
                  <span className="tri-titre">{f.titre}</span>
                  <span className={'tri-etat' + (c ? ` est-${PASTILLE[f.attendu]}` : '')}>
                    {c ? <>{RESULTATS[f.attendu].court}{c === f.attendu ? ' ✓' : ', à revoir'}<span className="visuellement-cache">{c === f.attendu ? ', juste' : ''}</span></> : 'À trier'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <section className="tri-panneau" ref={panneau} aria-labelledby="tri-titre">
        <p className="tri-format">{fichier.format} · <code>{fichier.fichier}</code></p>
        <h2 id="tri-titre" className="titre-section">{fichier.titre}</h2>
        <p className="tri-but">{fichier.but}</p>

        <div className="tri-apercu">
          {fichier.apercu.type === 'texte' && <pre>{fichier.apercu.contenu}</pre>}
          {fichier.apercu.type === 'image' && <img src={`/fichiers/tri/${fichier.fichier}`} alt={fichier.apercu.alt} width={1200} height={800} />}
          {fichier.apercu.type === 'audio' && (
            <>
              <audio controls preload="none" src={`/fichiers/tri/${fichier.fichier}`}>Votre navigateur ne lit pas l’audio.</audio>
              <p className="note-fictif">Début : {fichier.apercu.transcription}</p>
            </>
          )}
          <a className="lien-telecharger" href={`/fichiers/tri/${fichier.fichier}`} download>Télécharger le fichier (fictif)</a>
        </div>

        {rep.length > 0 && (
          <ol className="tri-chemin" aria-label="Vos réponses">
            {rep.map((r, k) => (
              <li key={k} className={resultat ? (r === attendu[k] ? 'est-juste' : 'est-faux') : undefined}>
                <strong>{ouiNon(r)}</strong> {QUESTIONS[k].question}
                {resultat && r !== attendu[k] && <span className="tri-correction"> La bonne réponse : {ouiNon(attendu[k])}.</span>}
              </li>
            ))}
          </ol>
        )}

        {question && (
          <div className="tri-question">
            <h3>Question {rep.length + 1} : {question.question}</h3>
            <p>{question.aide}</p>
            <div className="actions">
              <button type="button" className="bouton" onClick={() => repondre(true)}>Oui</button>
              <button type="button" className="bouton-secondaire" onClick={() => repondre(false)}>Non</button>
            </div>
          </div>
        )}

        {resultat && (
          <div className={`tri-verdict est-${PASTILLE[fichier.attendu]}`}>
            <p className="tri-feu"><span className="tri-feu-pastille" aria-hidden="true" />Ce fichier est {RESULTATS[fichier.attendu].nom.toLowerCase()}</p>
            <h3>{ecart < 0 ? 'Juste : vos réponses mènent à la bonne couleur.' : `Pas tout à fait : à la question ${ecart + 1}, il fallait répondre « ${ouiNon(attendu[ecart])} ».`}</h3>
            {ecart >= 0 && <p className="tri-raison"><strong>Pourquoi « {ouiNon(attendu[ecart])} » :</strong> {fichier.raisons[ecart]}</p>}
            <p>{fichier.pourquoi}</p>
            <p><strong>Avec quel outil :</strong> {RESULTATS[fichier.attendu].outil}</p>
            <div className="actions">
              {faits.length < FICHIERS.length && <button type="button" className="bouton" onClick={suivant}>Fichier suivant</button>}
              <button type="button" className="bouton-secondaire" onClick={() => setReponses({ ...reponses, [fichier.id]: [] })}>Refaire ce fichier</button>
            </div>
          </div>
        )}
        <p className="note-fictif">Étude, personnes et documents fictifs. Support pédagogique, pas un avis juridique.</p>
      </section>
    </div>
  );
}
