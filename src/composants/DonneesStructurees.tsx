// Données du contenu éditorial, jamais de notes, scores ou avis inventés.
export default function DonneesStructurees({ valeur }: { valeur: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(valeur).replace(/</g, '\\u003c') }} />;
}
