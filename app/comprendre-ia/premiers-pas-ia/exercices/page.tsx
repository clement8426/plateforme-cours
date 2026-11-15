import Link from 'next/link';
import PratiqueGuideeIa from '@/composants/PratiqueGuideeIa';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Pratique : votre premier assistant', description: 'Configurez et testez un assistant, puis préparez un atelier fictif avec un programme, un budget et des supports vérifiés.', chemin: '/comprendre-ia/premiers-pas-ia/exercices/' });
const fichiers = '/diapos/premiers-pas-ia/exercices/';
const documents = [
  ['01-mini-brief.md', 'Mini-brief et exercices de pratique guidée'],
  ['02-consignes-assistant.md', 'Consignes de l’assistant à adapter'],
  ['03-mission-projet.md', 'Mission complète de mise en application'],
  ['04-brief-evenement.md', 'Brief de Déclic numérique'],
  ['05-prix-et-materiel.csv', 'Prix fictifs et matériel disponible'],
  ['06-dossier-a-rendre.md', 'Modèle du dossier à rendre'],
  ['07-grille-verification.md', 'Grille de vérification'],
];
const etapes = [
  ['Comprendre', 'Lire le brief et distinguer les faits, les propositions et les points à confirmer.'],
  ['Configurer', 'Adapter l’assistant et exécuter trois tests.'],
  ['Produire', 'Construire le programme et vérifier le budget avec une calculatrice ou un tableur.'],
  ['Faire une pause si nécessaire', 'Pause, après avoir enregistré les fichiers.'],
  ['Compléter', 'Rédiger l’invitation, l’aide-mémoire et la fiche d’observation.'],
  ['Vérifier', 'Échanger les dossiers et appliquer la grille de contrôle.'],
  ['Corriger', 'Corriger le dossier et refaire les tests importants.'],
  ['Présenter', 'Expliquer les choix, les vérifications et les limites, puis faire le bilan.'],
];

export default function Page() {
  return <div className="page zone-cours">
    <FilAriane etapes={[{ nom: 'Cours', href: '/cours/' }, { nom: 'Premiers pas avec l’IA', href: '/comprendre-ia/premiers-pas-ia/' }, { nom: 'Exercices' }]} />
    <header className="tete"><h1>Votre premier assistant, puis votre premier dossier</h1><p className="chapeau">Des exercices courts pour démarrer, puis une mission modulable pour produire, vérifier et améliorer un résultat.</p><div className="actions"><a className="bouton" href={`${fichiers}dossier-clairlieu.zip`} download>Télécharger le dossier complet (.zip)</a><a className="bouton-secondaire" href="#pratique-guidee">Exercices de pratique guidée</a><a className="bouton-secondaire" href="#mission">Mission de mise en application</a></div></header>
    <p className="fiche-ephemere">Toutes les données sont fictives. Utilisez un outil accessible et autorisé, sans achat ni connecteur. Le site ne recueille aucune réponse : enregistrez votre travail dans vos fichiers.</p>
    <section id="pratique-guidee" className="section" aria-labelledby="titre-pratique-guidee"><h2 id="titre-pratique-guidee">Pratique guidée : configurer et tester un assistant</h2><p className="intro-section">Huit étapes illustrées. Vous ouvrez un outil, envoyez vos premières demandes, préparez vos consignes et vérifiez les réponses.</p><PratiqueGuideeIa /></section>
    <section className="section lien-ligne" aria-labelledby="titre-suite"><div><h2 id="titre-suite">Avant la mission : découvrir les types d’IA</h2><p>Suivez le cours existant, puis documentez trois missions Hugging Face avec deux essais et un seul changement par mission.</p></div><Link className="bouton-secondaire" href="/comprendre-ia/types-ia/">Les types d’IA</Link></section>
    <section id="mission" className="section objectifs" aria-labelledby="titre-mission"><h2 id="titre-mission">Mise en application : préparer Déclic numérique</h2><p className="intro-section">L’association fictive ClairLieu prépare une initiation pour 18 adultes débutants. Vous produisez le dossier à faire valider, avec votre assistant, puis vous contrôlez les résultats.</p><p>Le nouveau brief remplace celui de pratique guidée : l’atelier fictif dure 180 minutes, à planifier en durées relatives, avec 15 minutes de pause, six ordinateurs et deux animateurs. La salle accueille au maximum 24 personnes. Le budget est de 150 CHF, avec une réserve d’au moins 15 CHF. La date, l’adresse complète et les modalités d’inscription restent à confirmer.</p><p>Ces durées sont les données du projet fictif ; elles n’imposent aucun horaire à votre cours. Ne réservez rien, ne contactez personne et ne publiez rien.</p><h3>Le déroulé de votre travail</h3><ol>{etapes.map(([phase, texte]) => <li key={phase}><strong>{phase}.</strong> {texte}</li>)}</ol><h3>Les livrables</h3><ul><li>Les consignes de l’assistant et trois tests commentés.</li><li>Un programme sans trou ni chevauchement et un budget recalculé indépendamment du chat.</li><li>Une invitation de 100 à 150 mots, un aide-mémoire d’une page et une fiche d’observation Hugging Face.</li><li>Un journal de trois améliorations, le contrôle croisé et les points restant à confirmer.</li></ul><p>Si l’IA ou Internet est indisponible, continuez avec les fichiers et une calculatrice ; indiquez les tests non exécutés. Si vous terminez tôt, adaptez le dossier à l’indisponibilité d’un animateur ou à six participants supplémentaires, en vérifiant d’abord la capacité de la salle.</p><div className="actions"><a className="bouton" href={`${fichiers}03-mission-projet.md`} download>Télécharger les consignes complètes</a><a className="bouton-secondaire" href={`${fichiers}index.html#mission`}>Lire le dossier détaillé</a></div></section>
    <section className="section objectifs" aria-labelledby="titre-documents"><h2 id="titre-documents">Les documents de travail</h2><ul>{documents.map(([nom, titre]) => <li key={nom}><a href={`${fichiers}${nom}`} download>{titre}</a></li>)}</ul><p>Les fichiers Markdown (.md) s’ouvrent dans un éditeur de texte. Le CSV s’ouvre dans un tableur, avec le point-virgule comme séparateur.</p></section>
    <section className="section lien-ligne" aria-labelledby="titre-retour"><div><h2 id="titre-retour">Revenir au cours</h2><p>Retrouvez les diapos, le déroulé, les sources et le lexique.</p></div><Link className="bouton-secondaire" href="/comprendre-ia/premiers-pas-ia/">Premiers pas avec l’IA</Link></section>
  </div>;
}
