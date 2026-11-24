import Link from 'next/link';
import PratiqueGuideeIa from '@/composants/PratiqueGuideeIa';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Pratique : votre premier assistant', description: 'Trois volets dans ChatGPT : bien demander, constater qu’une discussion ne garde rien, puis créer votre assistant dans un projet et le tester.', chemin: '/comprendre-ia/premiers-pas-ia/exercices/' });
const fichiers = '/diapos/premiers-pas-ia/exercices/';
const documents = [
  ['01-mini-brief.md', 'Mini-brief ClairLieu et les trois volets'],
  ['02-consignes-assistant.md', 'Instructions de l’assistant à adapter'],
];

export default function Page() {
  return <div className="page zone-cours">
    <FilAriane etapes={[{ nom: 'Cours', href: '/cours/' }, { nom: 'Premiers pas avec l’IA', href: '/comprendre-ia/premiers-pas-ia/' }, { nom: 'Exercices' }]} />
    <header className="tete"><h1>Votre premier assistant</h1><p className="chapeau">Bien demander, voir ce qu’une discussion oublie, puis créer un assistant qui garde le cadre à votre place.</p><div className="actions"><a className="bouton" href="#pratique-guidee">Commencer la pratique guidée</a></div></header>
    <p className="fiche-ephemere">Toutes les données sont fictives. Utilisez un compte accessible et autorisé, sans achat ni connecteur. Le site ne recueille aucune réponse : enregistrez votre travail dans vos fichiers.</p>
    <section id="pratique-guidee" className="section" aria-labelledby="titre-pratique-guidee"><h2 id="titre-pratique-guidee">Pratique guidée : de la discussion à l’assistant</h2><p className="intro-section">Douze étapes illustrées dans ChatGPT, en trois volets. Volet 1 : bien demander. Volet 2 : constater qu’une discussion ne garde rien. Volet 3 : créer votre assistant dans un projet, puis le tester.</p><PratiqueGuideeIa /></section>
    <section className="section objectifs" aria-labelledby="titre-documents"><h2 id="titre-documents">Les documents de travail</h2><ul>{documents.map(([nom, titre]) => <li key={nom}><a href={`${fichiers}${nom}`} download>{titre}</a></li>)}</ul><p>Les fichiers Markdown (.md) s’ouvrent dans un éditeur de texte.</p></section>
    <section className="section lien-ligne" aria-labelledby="titre-retour"><div><h2 id="titre-retour">Revenir au cours</h2><p>Retrouvez les diapos, le déroulé, les sources et le lexique.</p></div><Link className="bouton-secondaire" href="/comprendre-ia/premiers-pas-ia/">Premiers pas avec l’IA</Link></section>
  </div>;
}
