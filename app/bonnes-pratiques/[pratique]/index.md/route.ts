import { pratiqueMarkdown } from '@/contenu/parcours/agent';
import { PRATIQUES, trouverPratique } from '@/contenu/parcours/pratiques';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const generateStaticParams = () => PRATIQUES.map((p) => ({ pratique: p.id }));

export async function GET(_: Request, { params }: { params: Promise<{ pratique: string }> }) {
  const p = trouverPratique((await params).pratique);
  if (!p) return new Response('Page introuvable', { status: 404 });
  return new Response(pratiqueMarkdown(p), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
