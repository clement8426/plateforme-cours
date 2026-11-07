import Fiche from './Fiche';
import FilAriane from './FilAriane';
import { trouverFiche } from '@/contenu/parcours/fiches';
import { metadonnees } from '@/contenu/site';

const CHEMINS: Record<string, string> = { test: '/demarrer/test/', idee: '/demarrer/idee/', technique: '/demarrer/technique/' };
const DESCRIPTIONS: Record<string, string> = {
  test: 'Un test pour savoir d’où tu pars en numérique, en IA et en développement web. Rien n’est enregistré, tu repars avec ton fichier.',
  idee: 'Clarifie ton idée, ta cible, ta marque et ton parcours client. Rien n’est enregistré, tu repars avec ton PDF ou ton fichier Markdown.',
  technique: 'Décris ton produit, tes données, tes fonctionnalités et ton MVP. Rien n’est enregistré, tu repars avec ton PDF ou ton fichier Markdown.',
};

export const metaFiche = (slug: string) => metadonnees({ titre: trouverFiche(slug)!.court, description: DESCRIPTIONS[slug], chemin: CHEMINS[slug] });

export default function PageFiche({ slug, suite }: { slug: string; suite: { href: string; nom: string } }) {
  const fiche = trouverFiche(slug)!;
  return (
    <div className="page page-formulaire">
      <FilAriane etapes={[{ nom: 'Démarrer', href: '/demarrer/' }, { nom: fiche.court }]} />
      <header className="tete tete-compacte"><h1>{fiche.titre}</h1></header>
      <Fiche slug={slug} suite={suite} />
    </div>
  );
}
