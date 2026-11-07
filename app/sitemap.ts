import type { MetadataRoute } from 'next';
import { pagesIndexables, urlAbsolue } from '@/contenu/site';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return pagesIndexables().map(p => ({ url: urlAbsolue(p.chemin), ...(p.date ? { lastModified: p.date } : {}) }));
}
