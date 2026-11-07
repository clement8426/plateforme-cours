import { guideMarkdown } from '@/contenu/parcours/agent';

export const dynamic = 'force-static';

// Toutes les bonnes pratiques en un seul fichier, pour qu'un agent les lise d'un coup.
export function GET() {
  return new Response(guideMarkdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
