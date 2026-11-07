import { ANGLES, REGLES, TAXONOMIE } from '@/contenu/parcours/moteur';

export const dynamic = 'force-static';

// Tout ce qu'il faut à un agent pour refaire le calcul du diagnostic sans ouvrir la page.
export function GET() {
  return Response.json({ version: 1, taxonomy: TAXONOMIE, blind_spots: ANGLES, rules: REGLES });
}
