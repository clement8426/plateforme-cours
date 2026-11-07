import Link from 'next/link';
import FilAriane from '@/composants/FilAriane';
import { metadonnees } from '@/contenu/site';

export const metadata = metadonnees({ titre: 'Accessibilité du Labo', description: 'Navigation au clavier, contraste, lecture texte des diapos et état des vérifications d’accessibilité du Labo. Signaler une difficulté.', chemin: '/accessibilite/' });

export default function Accessibilite() {
  return <div className="page lecture-information">
    <FilAriane etapes={[{ nom: 'Accessibilité' }]} />
    <header className="tete"><h1>Accessibilité du Labo</h1><p className="chapeau">Apprendre le numérique doit rester possible avec des façons différentes de lire et de naviguer.</p></header>
    <section className="section"><h2>Les aides disponibles</h2><ul>
      <li>Le lien « Aller au contenu », au début du parcours Tab, permet de passer la navigation.</li>
      <li>Les liens et boutons fonctionnent au clavier, avec un repère de focus visible.</li>
      <li>Les boutons « Mode sombre » et « Contraste élevé » adaptent l’affichage et mémorisent votre choix sur cet appareil.</li>
      <li>La commande « Lire la version texte » des quatre présentations donne une lecture continue, avec un sommaire, des textes redimensionnables et les réponses des quiz.</li>
      <li>En présentation, Échap quitte le plein écran ou le mode théâtre et ramène à sa commande d’ouverture.</li>
    </ul></section>
    <section className="section"><h2>État des vérifications</h2><p>Dernière vérification : <time dateTime="2026-11-07">7 novembre 2026</time>. Les pages ont été examinées avec des contrôles automatiques WCAG 2.2 A et AA, en clair, en sombre, en contraste élevé et sur petits écrans. Des parcours au clavier et le retour de focus ont aussi été testés.</p><p>Ces contrôles assistés ne remplacent pas une évaluation complète avec des personnes utilisant des technologies d’assistance. Ils ne permettent pas d’annoncer une conformité intégrale. Les essais approfondis avec un lecteur d’écran restent à compléter.</p></section>
    <section className="section"><h2>Les exemples volontairement défectueux</h2><p>Les cours UX présentent des contre-exemples : contraste trop faible, formulaire sans étiquettes, boutique piégée. Leurs défauts servent à apprendre à les reconnaître. Ils sont distingués des pages du cours et accompagnés d’explications. Les rapports d’outils archivés peuvent aussi présenter des limites propres à leur interface.</p><p>Pour lire les explications sans manipuler ces contre-exemples, utilisez la version texte des diapos ou les ressources du cours.</p><Link href="/ux/ux-ia/">Retrouver le cours UX × IA</Link></section>
    <section className="section"><h2>Signaler une difficulté</h2><p>Indiquez la page concernée, ce que vous vouliez faire et ce qui vous a bloqué. Si possible, précisez votre navigateur et votre mode de navigation.</p><a href="https://github.com/clement8426/plateforme-cours/issues/new" target="_blank" rel="noreferrer">Signaler une difficulté sur GitHub<span className="visuellement-cache"> (nouvel onglet)</span></a><p>Un compte GitHub est nécessaire pour publier ce signalement.</p></section>
  </div>;
}
