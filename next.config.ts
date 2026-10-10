import type { NextConfig } from 'next';

// Site entièrement statique : « npm run build » produit le dossier out/, à déposer chez n'importe quel hébergeur.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true, // chaque page devient un dossier avec son index.html : fonctionne partout, sans réécriture
  images: { unoptimized: true },
};

export default config;
