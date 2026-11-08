import { OUTILS } from '@/contenu/parcours/moteur';

export const dynamic = 'force-static';

// Les outils recommandés par le diagnostic. L'annuaire complet est dans /annuaire/index.json.
export function GET() {
  return Response.json({ version: 2, annuaire: '/annuaire/index.json', tools: OUTILS });
}
