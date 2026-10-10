import { CATEGORIES, trouverCategorie, trouverCours } from './catalogue';

export type ParamsCours = { params: Promise<{ categorie: string; cours: string }> };

// Toutes les paires catégorie / cours, pour générer les pages statiques.
export const tousLesCours = () => CATEGORIES.flatMap((c) => c.cours.map((cours) => ({ categorie: c.slug, cours: cours.slug })));

export async function lireCours({ params }: ParamsCours) {
  const { categorie, cours } = await params;
  return { categorie: trouverCategorie(categorie), cours: trouverCours(categorie, cours) };
}
