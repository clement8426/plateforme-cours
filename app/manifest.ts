import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// Rend le site installable comme une application (ordinateur, téléphone).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Les cours de Clément Bastien',
    short_name: 'Cours',
    description: 'Diapos et démonstrations interactives.',
    lang: 'fr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#F3F4F6',
    theme_color: '#F3F4F6',
    icons: [
      { src: '/icones/icone-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icones/icone-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icones/icone-masquable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
