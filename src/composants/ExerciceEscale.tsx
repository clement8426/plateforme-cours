import Link from 'next/link';
import MarqueVu from './MarqueVu';

export default function ExerciceEscale({cours}:{cours:string}){
 return <div className="escale-exercice">
  <MarqueVu cours={cours} etape="escale"/>
  <section className="escale-presentation" aria-labelledby="escale-mission">
   <div><h2 id="escale-mission">Acheter Le Week-end, puis annuler la commande fictive</h2><p>Une boutique Next.js de 18 produits, avec neuf défauts activables séparément : cohérence, friction, accessibilité, microcopie et performances. Le comportement reste théorique.</p><p>Le formateur montre les outils à la main. Les slides contiennent les gestes, les captures avant/après et les prompts pour refaire les contrôles avec un agent.</p><div className="actions"><Link className="bouton" href="/ux/ux-ia/diapos/?diapo=32">Ouvrir la pratique dans les slides</Link><a className="bouton-secondaire" href="/diapos/ux-ia/escale-prompts-agents.md" download>Emporter les prompts</a></div></div>
   <figure><img src="/diapos/ux-ia/preuves/escale/boutique.png" alt="Accueil de la boutique fictive Escale, avec son sac de voyage et ses produits." width={1440} height={1000}/><figcaption>Capture de la démonstration locale du 22 octobre 2026.</figcaption></figure>
  </section>
  <section aria-labelledby="escale-demarrer"><h2 id="escale-demarrer">Préparer Escale sur son ordinateur</h2><ol><li>Ouvrir le dossier <code>exercices/escale</code> du dépôt GitHub. Le dépôt est privé : demander l’accès au formateur.</li><li>Sous Windows, lancer <code>LANCER-ESCALE.cmd</code>. Node.js LTS doit être installé. La première préparation demande une connexion Internet.</li><li>Attendre le démarrage et ouvrir l’adresse indiquée. Le port dépend de la configuration locale ; aucun bouton du cours ne suppose que le serveur est déjà lancé.</li></ol><a className="bouton-secondaire" href="/diapos/ux-ia/demarrer-escale.md" download>Télécharger la préparation pour l’agent</a></section>
  <section aria-labelledby="escale-comptes"><h2 id="escale-comptes">Comptes de test</h2><p><code>camille@example.test</code> ou <code>alex@example.test</code> · mot de passe : <code>Escale2026!</code>.</p><p>Coordonnées fictives uniquement. Aucun paiement, aucun colis, aucune authentification de production.</p></section>
 </div>
}
