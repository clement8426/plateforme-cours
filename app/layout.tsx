import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import Link from 'next/link';
import BoutonContraste from '@/composants/BoutonContraste';
import BoutonTheme from '@/composants/BoutonTheme';
import EnregistrementPwa from '@/composants/EnregistrementPwa';
import NavPrincipale from '@/composants/NavPrincipale';
import { CATEGORIES } from '@/contenu/catalogue';
import './globals.css';

// Les polices sont téléchargées au moment de la construction et servies par le site : aucune requête vers Google.
const titre = Bricolage_Grotesque({ subsets: ['latin'], variable: '--police-titre', display: 'swap' });
const texte = Instrument_Sans({ subsets: ['latin'], variable: '--police-texte', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Le Labo, cours de numérique', template: '%s | Le Labo' },
  description: 'Des cours courts et concrets sur le numérique : UX, IA, données et responsabilité. Diapos et démonstrations à manipuler, libre d’accès, sans compte.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icones/icone.svg', apple: '/icones/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'Cours', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: [
    { color: '#F3F4F6' },
  ],
};

export default function Racine({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${texte.variable}`} suppressHydrationWarning>
      <head>
        {/* Contraste élevé : choix mémorisé, sinon réglage du système (prefers-contrast). Appliqué avant l'affichage. */}
        <script dangerouslySetInnerHTML={{ __html: "try{var c=localStorage.getItem('contraste');if(!c&&matchMedia('(prefers-contrast: more)').matches)c='eleve';if(c)document.documentElement.dataset.contraste=c;if(localStorage.getItem('theme')==='sombre')document.documentElement.dataset.theme='sombre'}catch(e){}" }} />
      </head>
      <body>
        <a className="evitement" href="#contenu">Aller au contenu</a>
        <div className="six" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <header className="entete">
          <Link className="marque" href="/">
            <span className="marque-signe" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
            <span>Le Labo</span>
          </Link>
          <div className="entete-outils">
            <NavPrincipale liens={CATEGORIES.map((c) => ({ slug: c.slug, court: c.court }))} />
            <BoutonTheme />
            <BoutonContraste />
          </div>
        </header>
        <main id="contenu">{children}</main>
        <footer className="pied">
          <p>Libre d’accès, sans compte et sans suivi.&nbsp;Votre progression reste sur cet appareil.</p>
          <p>Le Labo, par Clément Bastien</p>
        </footer>
        <EnregistrementPwa />
      </body>
    </html>
  );
}
