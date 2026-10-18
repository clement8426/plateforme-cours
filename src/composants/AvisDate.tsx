import { formaterDate } from '@/contenu/date';

// La date de la dernière modification d'un cours, et un rappel : tout va vite, il faut vérifier les sources.
export default function AvisDate({ date }: { date?: string }) {
  if (!date) return null;
  return (
    <p className="avis-date" role="note">
      <strong>Dernière modification : {formaterDate(date)}.</strong> Certaines informations peuvent être datées : tout va vite.
      La curiosité est votre meilleur allié. Suivez les flèches « source » et vérifiez par vous-même.
    </p>
  );
}
