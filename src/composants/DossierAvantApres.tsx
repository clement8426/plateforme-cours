'use client';

import { useState } from 'react';
import { BLOCS, type BlocId } from '@/contenu/blocs';
import { marquerVu } from './memoire';

// Démonstration « Le dossier Exemple » : c'est vous qui traitez le dossier. Même cas que les scans de l'exercice 01.
// À chaque étape, on choisit comment traiter la pièce ; les risques s'allument ou s'éteignent selon les choix.
// À la fin : le compte rendu obtenu, et ce que coûterait chaque risque restant. Tout est fictif, les articles de loi sont réels.

type RisqueId = 'transfert' | 'sante' | 'secret' | 'conservation' | 'cloud' | 'relecture' | 'historique';
type Risque = { id: RisqueId; bloc: BlocId; titre: string; court: string; loi: string; qui: string };

const RISQUES: Risque[] = [
  { id: 'transfert', bloc: 'transfert', titre: 'Transfert à l’étranger', court: 'Le dossier part sur des serveurs aux États-Unis.', loi: 'nLPD, art. 16 et 17 : communication de données à l’étranger.', qui: 'La personne responsable : jusqu’à 250 000 CHF d’amende (art. 61 let. a nLPD), sur plainte.' },
  { id: 'sante', bloc: 'sensible', titre: 'Donnée de santé', court: 'Un rapport médical quitte l’étude.', loi: 'nLPD, art. 5 let. c : donnée sensible. RGPD, art. 9, pour les clients dans l’UE.', qui: 'L’étude : pour ses clients dans l’UE, jusqu’à 20 M€ ou 4 % du chiffre d’affaires (RGPD).' },
  { id: 'secret', bloc: 'sensible', titre: 'Secret professionnel', court: 'Ce que l’avocat sait de sa cliente part chez un tiers.', loi: 'Code pénal, art. 321 : violation du secret professionnel.', qui: 'L’avocat lui-même : jusqu’à 3 ans de peine privative de liberté.' },
  { id: 'conservation', bloc: 'personnelles', titre: 'Conservation sans fin', court: 'Historique gardé, et le dossier peut entraîner le modèle.', loi: 'nLPD, art. 6 al. 4 : détruire les données dès qu’elles ne sont plus nécessaires.', qui: 'L’étude, qui doit pouvoir dire où sont les données de sa cliente.' },
  { id: 'cloud', bloc: 'transfert', titre: 'Cloud Act', court: 'Les autorités américaines peuvent exiger le dossier.', loi: 'Cloud Act, loi américaine de 2018.', qui: 'Personne n’est condamné, mais l’étude ne maîtrise plus qui peut lire le dossier.' },
  { id: 'historique', bloc: 'securite', titre: 'Historique partagé', court: 'Toute l’équipe voit la conversation.', loi: 'nLPD, art. 8 : sécurité des données, accès réservé à ceux qui en ont besoin.', qui: 'L’étude, et la personne qui a ouvert l’accès.' },
  { id: 'relecture', bloc: 'responsabilite', titre: 'Erreur non relue', court: 'Le scan flou a été mal lu : « droit » au lieu de « gauche ».', loi: 'nLPD, art. 6 al. 5 : s’assurer que les données sont exactes.', qui: 'L’étude, envers sa cliente : c’est elle qui signe le compte rendu.' },
];

type Option = { id: string; texte: string; detail: string; risques: RisqueId[]; sur: boolean };
type Etape = { id: string; titre: string; piece: string; options: Option[] };

const CHAT: RisqueId[] = ['transfert', 'sante', 'secret', 'conservation', 'cloud', 'historique'];
const ETAPES: Etape[] = [
  { id: 'scan', titre: 'Lire le rapport médical', piece: 'La clinique a envoyé le rapport médical de M. Exemple : un PDF scanné, un peu flou. Impossible de copier le texte. Il faut d’abord le transformer en texte que vous pouvez modifier.', options: [
    { id: 'chat', texte: 'Le joindre dans un chat en ligne', detail: 'Vous glissez le PDF dans ChatGénéral, un chat gratuit comme ChatGPT, et vous demandez : « Recopie-moi ce rapport ». Le fichier part sur ses serveurs, aux États-Unis.', risques: CHAT, sur: false },
    { id: 'ocr', texte: 'Le faire lire par votre ordinateur', detail: 'Votre ordinateur sait reconnaître le texte d’une image, sans internet : avec Aperçu sur Mac, ou l’Outil Capture sur Windows. Le fichier ne quitte pas l’étude.', risques: [], sur: true },
  ] },
  { id: 'voix', titre: 'Mettre le message vocal par écrit', piece: 'Votre collègue a reçu M. Exemple hier. Il vous a laissé un message vocal : ce que le client a raconté, sa blessure, le refus de l’assurance. Il faut le mettre par écrit.', options: [
    { id: 'chat', texte: 'L’envoyer au chat en ligne', detail: 'Vous déposez le fichier audio dans ChatGénéral et vous lui demandez de l’écrire. La voix de votre collègue et le récit du client partent avec.', risques: CHAT, sur: false },
    { id: 'whisper', texte: 'Le transcrire sur votre ordinateur', detail: 'Une application installée sur l’ordinateur transforme la voix en texte, sans internet (par exemple MacWhisper sur Mac, ou Buzz sur Windows). Rien ne sort de l’étude.', risques: [], sur: true },
  ] },
  { id: 'redaction', titre: 'Rédiger le compte rendu', piece: 'Vous avez maintenant le texte du rapport et celui du message. Il faut en faire un compte rendu clair, d’une page, pour l’assurance. Une IA peut vous aider à le rédiger : laquelle choisissez-vous ?', options: [
    { id: 'chat', texte: 'Le chat en ligne gratuit', detail: 'ChatGénéral, version grand public. Il garde la conversation et peut s’en servir pour s’améliorer.', risques: CHAT, sur: false },
    { id: 'api', texte: 'Une offre payante pour entreprises, américaine', detail: 'Le même genre d’outil, mais sous contrat : rien ne sert à entraîner l’IA, et la conservation est limitée. L’entreprise reste américaine.', risques: ['transfert', 'cloud'], sur: false },
    { id: 'suisse', texte: 'Une IA hébergée en Suisse', detail: 'Un service suisse sous contrat (Infomaniak, par exemple). Seul le texte part, et il reste en Suisse.', risques: [], sur: true },
  ] },
  { id: 'envoi', titre: 'Avant d’envoyer à l’assurance', piece: 'Le compte rendu est prêt. L’avocat va le signer et l’envoyer à l’assurance de M. Exemple.', options: [
    { id: 'direct', texte: 'L’envoyer tel quel', detail: 'Il a l’air juste, et vous gagnez dix minutes. Personne ne relit.', risques: ['relecture'], sur: false },
    { id: 'relire', texte: 'Le relire avec le rapport d’origine', detail: 'Vous vérifiez les mots importants (le côté blessé, la date) dans le PDF.', risques: [], sur: true },
  ] },
];

export default function DossierAvantApres({ cours }: { cours: string }) {
  const [choix, setChoix] = useState<Record<string, string>>({});
  const [ouvert, setOuvert] = useState<RisqueId | null>(null);
  const fini = ETAPES.every((e) => choix[e.id]);
  const actifs = new Set<RisqueId>(ETAPES.flatMap((e) => e.options.find((o) => o.id === choix[e.id])?.risques ?? []));
  const choisir = (etape: string, option: string) => { setChoix((c) => ({ ...c, [etape]: option })); marquerVu(cours, 'dossier-exemple'); };
  const remplir = (sur: boolean) => setChoix(Object.fromEntries(ETAPES.map((e) => [e.id, (e.options.find((o) => o.sur === sur) ?? e.options[0]).id])));

  return (
    <div className="dossier">
      <div className="dossier-etapes">
        <div className="dossier-situation">
          <h2 className="titre-section">La situation</h2>
          <p>Vous travaillez dans une étude d’avocats à Neuchâtel. Votre client, M. Jean Exemple, frontalier de Morteau, s’est fracturé le poignet au travail. Son assurance refuse de payer les indemnités journalières. L’avocat vous demande un compte rendu pour former opposition.</p>
          <p>Vous avez deux pièces : un rapport médical scanné et un message vocal. À chaque étape, choisissez comment vous faites.</p>
        </div>
        {ETAPES.map((e, k) => (
          <fieldset key={e.id} className={'dossier-etape' + (choix[e.id] ? ' est-faite' : '')}>
            <legend><span className="dossier-num">{k + 1}</span>{e.titre}</legend>
            <p className="dossier-piece">{e.piece}</p>
            <div className="dossier-options">
              {e.options.map((o) => (
                <label key={o.id} className={'dossier-option' + (choix[e.id] === o.id ? (o.risques.length ? ' est-risque' : ' est-sur') : '')}>
                  <input type="radio" name={`dossier-${e.id}`} value={o.id} checked={choix[e.id] === o.id} onChange={() => choisir(e.id, o.id)} />
                  <strong>{o.texte}</strong>
                  <span>{o.detail}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <aside className="dossier-risques" aria-labelledby="titre-risques">
        <h2 id="titre-risques" className="titre-section">Ce que vous risquez</h2>
        <p className="dossier-compteur" role="status">
          {Object.keys(choix).length === 0 ? 'Faites vos choix à gauche.' : actifs.size === 0 ? 'Aucun risque : bravo.' : `${actifs.size} risque${actifs.size > 1 ? 's' : ''} sur ${RISQUES.length}`}
        </p>
        <ul className="dossier-tuiles">
          {RISQUES.map((r) => {
            const actif = actifs.has(r.id);
            return (
              <li key={r.id} className={actif ? 'est-actif' : fini ? 'est-evite' : ''} style={{ '--bloc': BLOCS[r.bloc].couleur } as React.CSSProperties}>
                <button type="button" aria-expanded={ouvert === r.id} onClick={() => setOuvert(ouvert === r.id ? null : r.id)}>
                  <span className="dossier-etat" aria-hidden="true">{actif ? '!' : fini ? '✓' : ''}</span>
                  <span className="dossier-tuile-titre">{r.titre}<span className="visuellement-cache">{actif ? ' : risque présent' : ''}</span></span>
                </button>
                {ouvert === r.id && (
                  <div className="dossier-detail">
                    <p>{r.court}</p>
                    <p><strong>La loi :</strong> {r.loi}</p>
                    <p><strong>Qui en répond :</strong> {r.qui}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {fini && (
          <article className="dossier-resultat">
            <h3>Le compte rendu envoyé à l’assurance</h3>
            <p>M. Jean Exemple, 45 ans, horloger, s’est fracturé le <mark className={choix.envoi === 'direct' ? 'erreur-ocr' : 'juste'}>{choix.envoi === 'direct' ? 'poignet droit' : 'poignet gauche'}</mark> le 12 août 2026, sur son lieu de travail. Il demande le versement des indemnités journalières.</p>
            <p className="note-fictif">{choix.envoi === 'direct' ? 'Le scan flou a été mal lu, et personne n’a relu : l’erreur part à l’assurance, signée par l’avocat.' : 'Le mot douteux a été relu : le compte rendu est juste.'} Dans les deux cas, il a fallu quatre clics.</p>
          </article>
        )}
        {fini && (
          <section className="dossier-comparer" aria-labelledby="titre-comparer">
            <h3 id="titre-comparer">Comparer avec</h3>
            <p>Remplace vos quatre choix d’un coup, pour voir la différence.</p>
            <div className="actions">
              <button type="button" className="bouton-secondaire" onClick={() => remplir(false)}>Tous les choix les plus rapides</button>
              <button type="button" className="bouton-secondaire" onClick={() => remplir(true)}>Tous les choix sûrs</button>
              <button type="button" className="bouton-secondaire" onClick={() => setChoix({})}>Recommencer</button>
            </div>
          </section>
        )}
        <p className="note-fictif">Personnes, étude et « ChatGénéral » fictifs. Les articles cités sont réels : à vérifier dans les sources du cours.</p>
      </aside>
    </div>
  );
}
