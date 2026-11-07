'use client';

import { Analytics } from '@vercel/analytics/next';

// Vercel ne reçoit que le chemin de la page : ni paramètres ni fragment, donc aucune réponse d'élève.
export default function StatistiquesVisite() {
  return <Analytics beforeSend={(evenement) => ({ ...evenement, url: evenement.url.split(/[?#]/)[0] })} />;
}
