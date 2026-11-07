import type { Metadata } from 'next';
import { CATEGORIES } from './catalogue';

export const ORIGINE = 'https://www.labonumerique.ch';
export const AUTEUR = { '@type': 'Person', '@id': `${ORIGINE}/#auteur`, name: 'Clément Bastien', url: `${ORIGINE}/` };
export const urlAbsolue = (chemin: string) => new URL(chemin, ORIGINE).href;

export function metadonnees({ titre, description, chemin, image, indexable = true }: {
  titre: string; description: string; chemin: string; image?: string; indexable?: boolean;
}): Metadata {
  const url = urlAbsolue(chemin);
  const images = image
    ? [{ url: image, alt: titre }]
    : [{ url: '/icones/icone-512.png', width: 512, height: 512, alt: 'Le Labo' }];
  return {
    title: titre, description, alternates: { canonical: url },
    robots: { index: indexable, follow: true },
    openGraph: { title: titre, description, url, siteName: 'Le Labo', locale: 'fr_CH', type: 'website', images },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: titre, description, images: images.map(i => i.url) },
  };
}

// Une seule source pour le sitemap et les contrôles d’indexation. Pas de page « bientôt », de redirection ou de prototype cassé.
export function pagesIndexables() {
  const pages: { chemin: string; date?: string }[] = [{ chemin: '/' }, { chemin: '/accessibilite/', date: '2026-11-07' }];
  for (const categorie of CATEGORIES) {
    const publies = categorie.cours.filter(c => !c.enPreparation);
    if (!publies.length) continue;
    pages.push({ chemin: `/${categorie.slug}/` });
    for (const cours of publies) {
      const base = `/${categorie.slug}/${cours.slug}/`;
      pages.push({ chemin: base, date: cours.misAJour }, { chemin: base + 'sources/', date: cours.misAJour });
      if (cours.diapos) pages.push({ chemin: base + 'diapos/', date: cours.misAJour });
      if (cours.exercice?.tuto) pages.push({ chemin: base + 'tuto/', date: cours.misAJour });
      for (const demo of cours.demos.filter(d => !d.indisponible)) pages.push({ chemin: base + `demos/${demo.slug}/`, date: cours.misAJour });
    }
  }
  return pages;
}
