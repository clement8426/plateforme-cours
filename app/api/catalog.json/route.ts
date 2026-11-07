import { OUTILS } from '@/contenu/parcours/moteur';

export const dynamic = 'force-static';

// Le catalogue validé, en lecture publique, pour les agents.
export function GET() {
  return Response.json({ version: 1, tools: OUTILS });
}
