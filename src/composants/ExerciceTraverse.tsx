'use client';

import { useState } from 'react';
import MarqueVu from './MarqueVu';

const FICHIER = '/diapos/ux-ia/exercice-traverse.md';

export default function ExerciceTraverse({ cours }: { cours: string }) {
  const [message, setMessage] = useState('');

  async function copier() {
    try {
      const reponse = await fetch(FICHIER);
      if (!reponse.ok) throw new Error('Fichier indisponible');
      await navigator.clipboard.writeText(await reponse.text());
      setMessage('Consigne copiée. Collez-la dans votre agent local pour préparer l’exercice.');
    } catch {
      setMessage('La copie est indisponible. Téléchargez le fichier ci-dessous et joignez-le à votre agent.');
    }
  }

  return (
    <div className="traverse-exercice">
      <MarqueVu cours={cours} etape="labo-ux-demo" />
      <section className="traverse-intro" aria-labelledby="traverse-mission">
        <div className="encart">
          <p className="avis-titre">Votre mission</p>
          <h2 id="traverse-mission">Choisir une sortie et envoyer une demande</h2>
          <p>Le site Traverse est joli, mais plusieurs obstacles gênent son utilisation. Essayez d’atteindre la confirmation. Notez ce qui vous bloque, vous surprend ou vous fait attendre.</p>
          <p><strong>Données fictives uniquement :</strong> Alex Exemple, alex@example.test et 0600000000. Aucune réservation, aucun paiement, aucun e-mail réel.</p>
        </div>
        <figure className="traverse-apercu">
          <img src="/apercus/traverse.jpg" alt="Accueil de Traverse : des sorties nature, une grande photographie et un bouton pour trouver une échappée." width={1440} height={900} />
          <figcaption>Aperçu du site à tester. Le vrai exercice démarre sur votre ordinateur avec l’agent.</figcaption>
        </figure>
      </section>

      <section className="encart" aria-labelledby="traverse-preparer">
        <h2 id="traverse-preparer">1. L’agent prépare tout</h2>
        <p>Copiez la consigne complète ou joignez le fichier à votre agent, puis dites : <strong>« Prépare cet exercice et ouvre Traverse pour moi. »</strong> Il installe Labo UX, vérifie ses outils et démarre le site local. Vous n’avez aucune commande à taper.</p>
        <div className="actions">
          <button className="bouton" type="button" onClick={copier}>Copier la consigne complète</button>
          <a className="bouton-secondaire" href={FICHIER} download="exercice-traverse.md">Télécharger le fichier pour l’agent</a>
        </div>
        <p role="status" className="traverse-statut">{message}</p>
        <p>Il faut un agent qui accède aux fichiers, au terminal et au navigateur local. Un simple chat ne suffit pas. Les dépôts Labo UX sont privés : le formateur doit vous donner l’accès GitHub. Préparez l’installation avant le cours.</p>
      </section>

      <section className="encart" aria-labelledby="traverse-essayer">
        <h2 id="traverse-essayer">2. Essayez avant de lire l’audit</h2>
        <p>Une fois le site démarré par l’agent, choisissez une sortie, remplissez le formulaire et essayez d’envoyer la demande. Refaites quelques actions avec Tabulation et Entrée. Relevez trois obstacles sans chercher les réponses dans le code.</p>
        <div className="actions">
          <a className="bouton-secondaire" href="http://127.0.0.1:4192/" target="_blank" rel="noreferrer">Ouvrir Traverse sur mon ordinateur<span className="visuellement-cache"> (nouvel onglet)</span></a>
        </div>
        <p>Ce lien fonctionne uniquement après le démarrage local. Si le port est déjà utilisé, ouvrez l’adresse donnée par votre agent.</p>
      </section>

      <section className="encart" aria-labelledby="traverse-auditer">
        <h2 id="traverse-auditer">3. Lancez le plugin en mode Audit</h2>
        <p>Dites : <strong>« Lance l’audit de Traverse sans corriger le code. »</strong> L’agent vous fait confirmer l’objectif, la cible et les tests du formulaire fictif, puis explore les six blocs avec les contrôles disponibles.</p>
        <p>Ouvrez le rapport HTML proposé par l’agent. Pour chaque bloc, regardez les preuves, les limites et les contrôles non réalisés. Les événements du tunnel sont synthétiques : ils ne décrivent pas de vrais visiteurs.</p>
        <details>
          <summary>Voir à quoi ressemble un rapport</summary>
          <figure className="traverse-apercu">
            <img src="/apercus/labo-ux-rapport.jpg" alt="Exemple du rapport Labo UX de Traverse, avec les blocs explorés, les preuves et les points à examiner en priorité." width={1440} height={900} loading="lazy" />
            <figcaption>Capture d’un audit réel du 20 octobre 2026, moteur 0.1.0. Illustration du format : votre audit produit ses propres mesures.</figcaption>
          </figure>
        </details>
      </section>

      <section className="encart" aria-labelledby="traverse-rendre">
        <h2 id="traverse-rendre">À rendre : trois problèmes expliqués</h2>
        <ul>
          <li><strong>L’obstacle :</strong> l’écran, l’action et ce qui gêne la personne.</li>
          <li><strong>La preuve :</strong> une capture, une mesure ou une observation vérifiable.</li>
          <li><strong>La priorité :</strong> pourquoi le traiter et quelle amélioration proposer.</li>
        </ul>
        <p>Comparez vos observations au rapport. Un test qui échoue peut révéler le défaut recherché. Traverse reste volontairement cassé : aucune correction automatique ni version corrigée dans cet exercice.</p>
      </section>
    </div>
  );
}
