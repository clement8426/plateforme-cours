import type { Metadata } from 'next';
import FilAriane from '@/composants/FilAriane';
import ExerciceHuggingFace from '@/composants/ExerciceHuggingFace';

export const metadata: Metadata = { title: 'Tester les types d’IA · Le Labo', description: 'Sept missions avec des démos Hugging Face : faire deux essais, comparer et documenter les limites des IA.' };

export default function Page() {
  return <div className="page zone-cours">
    <FilAriane etapes={[{ nom: 'Cours', href: '/cours/' }, { nom: 'Les types d’IA', href: '/comprendre-ia/types-ia/' }, { nom: 'Tester des IA' }]} />
    <header className="tete"><p>Exercice · 30 à 45 minutes · Internet nécessaire</p><h1>Essayez. Changez. Comparez.</h1><p className="chapeau">Choisissez trois familles d’IA, dont une qui génère un contenu. Avant chaque essai, formulez une attente. Faites varier un seul élément et cherchez ce que le résultat réussit… ou rate.</p></header>
    <ExerciceHuggingFace />
  </div>;
}
