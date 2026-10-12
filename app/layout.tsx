import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import Link from 'next/link';
import EnregistrementPwa from '@/composants/EnregistrementPwa';
import NavPrincipale from '@/composants/NavPrincipale';
import { CATEGORIES } from '@/contenu/catalogue';
import './globals.css';

// Les polices sont téléchargées au moment de la construction et servies par le site : aucune requête vers Google.
const titre = Bricolage_Grotesque({ subsets: ['latin'], variable: '--police-titre', display: 'swap' });
const texte = Instrument_Sans({ subsets: ['latin'], variable: '--police-texte', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Les cours de Clément Bastien', template: '%s · Cours de Clément Bastien' },
  description: 'Diapos, démonstrations et exercices interactifs : UX, IA et législation. Libre d’accès, sans compte.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icones/icone.svg', apple: '/icones/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'Cours', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3F4F6' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
};

export default function Racine({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${texte.variable}`}>
      <body>
        <a className="evitement" href="#contenu">Aller au contenu</a>
        <div className="six" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <header className="entete">
          <Link className="marque" href="/">
            <span className="marque-signe" aria-hidden="true">CB</span>
            <span>Les cours de Clément&nbsp;Bastien</span>
          </Link>
          <NavPrincipale liens={CATEGORIES.map((c) => ({ slug: c.slug, court: c.court }))} />
        </header>
        <main id="contenu">{children}</main>
        <footer className="pied">
          <p>Libre d’accès, sans compte et sans suivi.&nbsp;Votre progression reste sur cet appareil.</p>
          <p>© Clément Bastien</p>
        </footer>
        <EnregistrementPwa />
      </body>
    </html>
  );
}
