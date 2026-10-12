'use client';

import { useState } from 'react';
import { BLOCS, type BlocId } from '@/contenu/blocs';
import { marquerVu } from './memoire';

// Démonstration « Le dossier de Mme Fictive » : la même tâche faite deux fois.
// Version 1 : tout part dans un chat grand public américain. Version 2 : une chaîne locale et suisse, avec relecture.
// Chaque défaut porte un repère (data-d) qui s'allume dans la version affichée.

type Mode = 'v1' | 'v2' | 'cote';
type Defaut = { id: string; bloc: BlocId; titre: string; avant: string; apres: string; loi: string; qui: string };

const DEFAUTS: Defaut[] = [
  { id: 'transfert', bloc: 'transfert', titre: 'Un transfert à l’étranger non encadré', avant: 'Le dossier part sur des serveurs américains, sans analyse ni garanties.', apres: 'Le scan et la voix restent sur l’ordinateur ; seul le texte part, en Suisse.', loi: 'nLPD, art. 16 et 17 : communication de données à l’étranger.', qui: 'La personne responsable : jusqu’à 250 000 CHF d’amende (art. 61 let. a nLPD), sur plainte.' },
  { id: 'sante', bloc: 'sensible', titre: 'Une donnée de santé', avant: 'Le rapport médical est envoyé tel quel.', apres: 'Lu et transcrit sur l’ordinateur, il ne quitte pas l’étude.', loi: 'nLPD, art. 5 let. c : donnée sensible. RGPD, art. 9, pour les clients en France et en Allemagne.', qui: 'L’étude : pour ses clients dans l’UE, jusqu’à 20 M€ ou 4 % du chiffre d’affaires (RGPD).' },
  { id: 'secret', bloc: 'sensible', titre: 'Le secret professionnel', avant: 'Ce que l’avocat sait de sa cliente part chez un tiers qui n’est pas lié par le secret.', apres: 'Seul le texte utile part, chez un prestataire suisse lié par contrat, comme un auxiliaire de l’étude.', loi: 'Code pénal, art. 321 : violation du secret professionnel.', qui: 'L’avocat lui-même : jusqu’à 3 ans de peine privative de liberté.' },
  { id: 'conservation', bloc: 'personnelles', titre: 'Une conservation sans fin chez le fournisseur', avant: 'Historique gardé sans limite, et le réglage « améliorer le modèle » est activé.', apres: 'Rien n’est gardé hors de l’étude au-delà du nécessaire, et rien ne sert à entraîner un modèle.', loi: 'nLPD, art. 6 al. 4 : détruire ou anonymiser les données dès qu’elles ne sont plus nécessaires.', qui: 'L’étude, qui doit pouvoir dire où se trouvent les données de sa cliente.' },
  { id: 'cloud', bloc: 'transfert', titre: 'L’exposition au Cloud Act', avant: 'Fournisseur américain : les autorités américaines peuvent exiger les données, même stockées en Europe.', apres: 'Fournisseur suisse : il n’est pas soumis au Cloud Act.', loi: 'Cloud Act, loi américaine de 2018.', qui: 'Personne n’est condamné, mais l’étude ne maîtrise plus qui peut lire le dossier.' },
  { id: 'relecture', bloc: 'responsabilite', titre: 'Aucune relecture', avant: 'La lecture du scan a donné « droit » au lieu de « gauche » : l’erreur passe dans le compte rendu.', apres: 'Le mot douteux est signalé, et un humain relit avant l’envoi.', loi: 'nLPD, art. 6 al. 5 : s’assurer que les données sont exactes.', qui: 'L’étude, envers sa cliente : c’est elle qui signe le compte rendu.' },
  { id: 'historique', bloc: 'securite', titre: 'Une trace dans l’historique partagé', avant: 'La conversation apparaît dans l’historique de toute l’équipe.', apres: 'Le traitement se fait sur le poste ; rien n’est partagé par défaut.', loi: 'nLPD, art. 8 : sécurité des données, accès réservé à ceux qui en ont besoin.', qui: 'L’étude, et la personne qui a ouvert l’accès.' },
];

const MODES: { id: Mode; texte: string }[] = [
  { id: 'v1', texte: 'Version 1 : trois clics' },
  { id: 'v2', texte: 'Version 2 : la chaîne sûre' },
  { id: 'cote', texte: 'Côte à côte' },
];

function Version1({ allume }: { allume: string | null }) {
  const a = (id: string) => (allume === id ? ' est-allume' : '');
  return (
    <div className="maquette chat">
      <aside className={'chat-historique' + a('historique')} data-d="historique">
        <p className="maquette-etiquette">Historique de l’équipe</p>
        <ul>
          <li className="est-courant">Dossier Mme Fictive, rapport</li>
          <li>Relance assurance Témoin</li>
          <li>Contrat de bail, M. Modèle</li>
        </ul>
      </aside>
      <div className="chat-fil">
        <p className={'chat-fournisseur' + a('transfert') + a('cloud')} data-d="transfert cloud">ChatGénéral (fictif), serveurs aux États-Unis</p>
        <div className="chat-message est-moi">
          <div className="chat-pieces">
            <span className={'piece' + a('sante') + a('secret')} data-d="sante secret">📄 scan-rapport-medical.jpg</span>
            <span className="piece">🎙 note-vocale.m4a</span>
          </div>
          <p>Fais-moi un compte rendu pour la cliente.</p>
        </div>
        <div className="chat-message">
          <p><strong>Compte rendu</strong></p>
          <p>Mme Fictive, 52 ans, infirmière, a été opérée du <mark className={'erreur-ocr' + a('relecture')} data-d="relecture">genou droit</mark> le 12 mars 2026. Elle demande la prise en charge par son assurance.</p>
        </div>
        <p className={'chat-reglage' + a('conservation')} data-d="conservation">Améliorer le modèle pour tous : activé. Historique : conservé sans limite.</p>
      </div>
    </div>
  );
}

function Version2({ allume }: { allume: string | null }) {
  const a = (id: string) => (allume === id ? ' est-allume' : '');
  return (
    <ol className="maquette chaine">
      <li className={a('sante') + a('historique')} data-d="sante historique">
        <span className="lieu est-local">Sur l’ordinateur</span>
        <h3>1. Lire le scan</h3>
        <p>Reconnaissance de texte (OCR) en local. Un mot douteux est signalé : <mark className="doute">genou [gauche ?]</mark></p>
      </li>
      <li data-d="sante">
        <span className="lieu est-local">Sur l’ordinateur</span>
        <h3>2. Transcrire la note vocale</h3>
        <p>Whisper, hors ligne. La voix ne quitte pas l’étude.</p>
      </li>
      <li className={a('transfert') + a('cloud') + a('secret') + a('conservation')} data-d="transfert cloud secret conservation">
        <span className="lieu est-suisse">En Suisse</span>
        <h3>3. Rédiger</h3>
        <p>Seul le texte part, vers une IA hébergée en Suisse (Infomaniak), sous contrat, sans entraînement.</p>
      </li>
      <li>
        <span className="lieu est-local">Fedlex</span>
        <h3>4. Citer la loi</h3>
        <p>L’article exact est tiré de Fedlex, la source officielle, pas inventé par le modèle.</p>
      </li>
      <li className={a('relecture')} data-d="relecture">
        <span className="lieu est-humain">Un humain</span>
        <h3>5. Relire</h3>
        <p>« gauche » est confirmé, le compte rendu est validé avant l’envoi.</p>
      </li>
      <li className="resultat">
        <p><strong>Compte rendu</strong></p>
        <p>Mme Fictive, 52 ans, infirmière, a été opérée du genou gauche le 12 mars 2026. Elle demande la prise en charge par son assurance.</p>
      </li>
    </ol>
  );
}

export default function DossierAvantApres({ cours }: { cours: string }) {
  const [mode, setMode] = useState<Mode>('v1');
  const [ouvert, setOuvert] = useState<string | null>(null);
  const visibles = mode === 'cote' ? ['v1', 'v2'] : [mode];

  return (
    <div className="comparateur">
      <div className="comparateur-scene">
        <fieldset className="bascule">
          <legend className="visuellement-cache">Version affichée</legend>
          {MODES.map((m) => (
            <label key={m.id} className={mode === m.id ? 'est-choisi' : undefined}>
              <input type="radio" name="version-dossier" value={m.id} checked={mode === m.id} onChange={() => { setMode(m.id); marquerVu(cours, 'dossier-mme-fictive'); }} />
              <span>{m.texte}</span>
            </label>
          ))}
        </fieldset>
        <div className={`vitrines vitrines-${mode}`}>
          <section className="vitrine vitrine-depart" hidden={!visibles.includes('v1')} aria-label="Version 1">
            <h2 className="vitrine-titre">Version 1 : un chat grand public américain</h2>
            <Version1 allume={ouvert} />
          </section>
          <section className="vitrine vitrine-repare" hidden={!visibles.includes('v2')} aria-label="Version 2">
            <h2 className="vitrine-titre">Version 2 : local, puis une IA suisse, puis un humain</h2>
            <Version2 allume={ouvert} />
          </section>
        </div>
      </div>

      <aside className="comparateur-defauts" aria-labelledby="titre-defauts-dossier">
        <h2 id="titre-defauts-dossier" className="titre-section">Les sept défauts de la version 1</h2>
        <ol className="defauts">
          {DEFAUTS.map((d) => {
            const estOuvert = ouvert === d.id;
            return (
              <li key={d.id} style={{ '--bloc': BLOCS[d.bloc].couleur } as React.CSSProperties}>
                <h3>
                  <button type="button" aria-expanded={estOuvert} aria-controls={`defaut-dossier-${d.id}`} onClick={() => setOuvert(estOuvert ? null : d.id)}>
                    <span className="defaut-bloc">{BLOCS[d.bloc].nom}</span>
                    <span className="defaut-titre">{d.titre}</span>
                  </button>
                </h3>
                <div id={`defaut-dossier-${d.id}`} className="defaut-corps" hidden={!estOuvert}>
                  <dl>
                    <div><dt>Version 1</dt><dd>{d.avant}</dd></div>
                    <div><dt>Version 2</dt><dd>{d.apres}</dd></div>
                    <div><dt>La loi</dt><dd>{d.loi}</dd></div>
                    <div className="defaut-outil"><dt>Qui en répond</dt><dd>{d.qui}</dd></div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="note-fictif">Personnes, étude et fournisseur « ChatGénéral » fictifs. Les articles cités sont réels : à vérifier dans les sources du cours.</p>
      </aside>
    </div>
  );
}
