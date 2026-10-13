'use client';

import { useState } from 'react';
import { BLOCS, type BlocId } from '@/contenu/blocs';
import { marquerVu } from './memoire';

// Démonstration « Le dossier de Mme Fictive » : c'est vous qui traitez le dossier.
// À chaque étape, on choisit comment traiter la pièce ; les risques s'allument ou s'éteignent selon les choix.
// À la fin : le compte rendu obtenu, et ce que coûterait chaque risque restant. Tout est fictif, les articles de loi sont réels.

type RisqueId = 'transfert' | 'sante' | 'secret' | 'conservation' | 'cloud' | 'relecture' | 'historique';
type Risque = { id: RisqueId; bloc: BlocId; titre: string; court: string; loi: string; qui: string };

const RISQUES: Risque[] = [
  { id: 'transfert', bloc: 'transfert', titre: 'Transfert à l’étranger', court: 'Le dossier part sur des serveurs aux États-Unis.', loi: 'nLPD, art. 16 et 17 : communication de données à l’étranger.', qui: 'La personne responsable : jusqu’à 250 000 CHF d’amende (art. 61 let. a nLPD), sur plainte.' },
  { id: 'sante', bloc: 'sensible', titre: 'Donnée de santé', court: 'Un rapport médical quitte l’étude.', loi: 'nLPD, art. 5 let. c : donnée sensible. RGPD, art. 9, pour les clients dans l’UE.', qui: 'L’étude : pour ses clients dans l’UE, jusqu’à 20 M€ ou 4 % du chiffre d’affaires (RGPD).' },
  { id: 'secret', bloc: 'sensible', titre: 'Secret professionnel', court: 'Ce que l’avocat sait de sa cliente part chez un tiers.', loi: 'Code pénal, art. 321 : violation du secret professionnel.', qui: 'L’avocat lui-même : jusqu’à 3 ans de peine privative de liberté.' },
  { id: 'conservation', bloc: 'personnelles', titre: 'Conservation sans fin', court: 'Historique gardé, et le dossier peut entraîner le modèle.', loi: 'nLPD, art. 6 al. 4 : détruire les données dès qu’elles ne sont plus nécessaires.', qui: 'L’étude, qui doit pouvoir dire où sont les données de sa cliente.' },
  { id: 'cloud', bloc: 'transfert', titre: 'Cloud Act', court: 'Les autorités américaines peuvent exiger le dossier.', loi: 'Cloud Act, loi américaine de 2018.', qui: 'Personne n’est condamné, mais l’étude ne maîtrise plus qui peut lire le dossier.' },
  { id: 'historique', bloc: 'securite', titre: 'Historique partagé', court: 'Toute l’équipe voit la conversation.', loi: 'nLPD, art. 8 : sécurité des données, accès réservé à ceux qui en ont besoin.', qui: 'L’étude, et la personne qui a ouvert l’accès.' },
  { id: 'relecture', bloc: 'responsabilite', titre: 'Erreur non relue', court: 'Le scan a été mal lu : « droit » au lieu de « gauche ».', loi: 'nLPD, art. 6 al. 5 : s’assurer que les données sont exactes.', qui: 'L’étude, envers sa cliente : c’est elle qui signe le compte rendu.' },
];

type Option = { id: string; texte: string; detail: string; risques: RisqueId[]; sur: boolean };
type Etape = { id: string; titre: string; piece: string; options: Option[] };

const CHAT: RisqueId[] = ['transfert', 'sante', 'secret', 'conservation', 'cloud', 'historique'];
const ETAPES: Etape[] = [
  { id: 'scan', titre: 'Lire le scan', piece: 'Un rapport médical scanné, de mauvaise qualité.', options: [
    { id: 'chat', texte: 'Le coller dans ChatGénéral', detail: 'Chat grand public, serveurs aux États-Unis. Un clic.', risques: CHAT, sur: false },
    { id: 'ocr', texte: 'Le lire sur l’ordinateur', detail: 'Reconnaissance de texte (OCR) en local. Un clic.', risques: [], sur: true },
  ] },
  { id: 'voix', titre: 'Transcrire la note vocale', piece: 'Un collaborateur demande un résumé, à l’oral.', options: [
    { id: 'chat', texte: 'L’envoyer dans ChatGénéral', detail: 'Le fichier audio part avec le reste. Un clic.', risques: CHAT, sur: false },
    { id: 'whisper', texte: 'La transcrire sur l’ordinateur', detail: 'Whisper, hors ligne. Un clic.', risques: [], sur: true },
  ] },
  { id: 'redaction', titre: 'Rédiger le compte rendu', piece: 'Le texte du scan et de la note, à mettre en forme.', options: [
    { id: 'chat', texte: 'ChatGénéral, grand public', detail: 'Le plus connu. Historique gardé, entraînement possible.', risques: CHAT, sur: false },
    { id: 'api', texte: 'Un fournisseur américain, offre entreprise', detail: 'Pas d’entraînement, pas d’historique, mais toujours aux États-Unis.', risques: ['transfert', 'cloud'], sur: false },
    { id: 'suisse', texte: 'Une IA hébergée en Suisse', detail: 'Seul le texte part, sous contrat (Infomaniak, par exemple).', risques: [], sur: true },
  ] },
  { id: 'envoi', titre: 'Avant l’envoi à la cliente', piece: 'Le compte rendu est prêt.', options: [
    { id: 'direct', texte: 'L’envoyer tel quel', detail: 'Gain de temps : personne ne relit.', risques: ['relecture'], sur: false },
    { id: 'relire', texte: 'Le relire', detail: 'Le mot douteux est vérifié avant l’envoi.', risques: [], sur: true },
  ] },
];

export default function DossierAvantApres({ cours }: { cours: string }) {
  const [choix, setChoix] = useState<Record<string, string>>({});
  const [ouvert, setOuvert] = useState<RisqueId | null>(null);
  const fini = ETAPES.every((e) => choix[e.id]);
  const actifs = new Set<RisqueId>(ETAPES.flatMap((e) => e.options.find((o) => o.id === choix[e.id])?.risques ?? []));
  const choisir = (etape: string, option: string) => { setChoix((c) => ({ ...c, [etape]: option })); marquerVu(cours, 'dossier-mme-fictive'); };
  const remplir = (sur: boolean) => setChoix(Object.fromEntries(ETAPES.map((e) => [e.id, (e.options.find((o) => o.sur === sur) ?? e.options[0]).id])));

  return (
    <div className="dossier">
      <div className="dossier-etapes">
        <div className="actions dossier-raccourcis">
          <button type="button" className="bouton-secondaire" onClick={() => remplir(false)}>Version en trois clics</button>
          <button type="button" className="bouton-secondaire" onClick={() => remplir(true)}>Version sûre</button>
          {Object.keys(choix).length > 0 && <button type="button" className="bouton-secondaire" onClick={() => setChoix({})}>Recommencer</button>}
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
          {Object.keys(choix).length === 0 ? 'Faites vos choix à gauche.' : actifs.size === 0 ? 'Aucun risque : bravo.' : `${actifs.size} risque${actifs.size > 1 ? 's' : ''} sur ${RISQUES.length}`}
        </p>
        <ul className="dossier-tuiles">
          {RISQUES.map((r) => {
            const actif = actifs.has(r.id);
            return (
              <li key={r.id} className={actif ? 'est-actif' : Object.keys(choix).length ? 'est-evite' : ''} style={{ '--bloc': BLOCS[r.bloc].couleur } as React.CSSProperties}>
                <button type="button" aria-expanded={ouvert === r.id} onClick={() => setOuvert(ouvert === r.id ? null : r.id)}>
                  <span className="dossier-etat" aria-hidden="true">{actif ? '!' : Object.keys(choix).length ? '✓' : ''}</span>
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
            <h3>Le compte rendu obtenu</h3>
            <p>Mme Fictive, 52 ans, infirmière, a été opérée du <mark className={choix.envoi === 'direct' ? 'erreur-ocr' : 'juste'}>{choix.envoi === 'direct' ? 'genou droit' : 'genou gauche'}</mark> le 12 mars 2026. Elle demande la prise en charge par son assurance.</p>
            <p className="note-fictif">{choix.envoi === 'direct' ? 'Le scan a été mal lu, et personne n’a relu : l’erreur part chez la cliente.' : 'Le mot douteux a été relu : le compte rendu est juste.'} Dans les deux cas, il a fallu quatre clics.</p>
          </article>
        )}
        <p className="note-fictif">Personnes, étude et « ChatGénéral » fictifs. Les articles cités sont réels : à vérifier dans les sources du cours.</p>
      </aside>
    </div>
  );
}
