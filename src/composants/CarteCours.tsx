import Link from 'next/link';
import type { Cours } from '@/contenu/catalogue';

// Une carte de cours, sur l'accueil et sur la page d'un thème. Toute la carte est cliquable (le lien du titre la couvre).
export default function CarteCours({ categorie, cours }: { categorie: string; cours: Cours }) {
  return (
    <li className={'cours-carte' + (cours.enPreparation ? ' est-prepa' : '')}>
      <h3><Link href={`/${categorie}/${cours.slug}/`}>{cours.titre}</Link></h3>
      <p>{cours.accroche}{cours.demos.length > 0 && ` ${cours.demos.length} démonstrations interactives.`}</p>
      <p className="cours-meta">
        {cours.enPreparation ? <span className="etat-prepa">En préparation</span> : cours.duree.replace(/^Environ /, '')}
        <span className="fleche" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
      </p>
    </li>
  );
}
