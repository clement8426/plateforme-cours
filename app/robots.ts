import type { MetadataRoute } from 'next';
import { ORIGINE } from '@/contenu/site';

export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  // Les pages noindex restent explorables pour que les robots puissent lire cette consigne.
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${ORIGINE}/sitemap.xml`, host: ORIGINE };
}
