import { CATEGORIES } from '@/contenu/catalogue';
import { ANGLES } from '@/contenu/parcours/moteur';
import { PRATIQUES } from '@/contenu/parcours/pratiques';
import { urlAbsolue } from '@/contenu/site';

export const dynamic = 'force-static';

const espaces = (v: string) => v.replace(/[  ]/g, ' ');

// Présente le site aux agents IA : espaces, données publiques et lien de l'entonnoir.
export function GET() {
  const cours = CATEGORIES.flatMap((c) => c.cours.filter((x) => !x.enPreparation).map((x) => `- [${x.titre}](${urlAbsolue(`/${c.slug}/${x.slug}/`)})`));
  const texte = [
    '# Le Labo', '',
    '> Cours de numérique, parcours pour démarrer un projet et bonnes pratiques. Site statique, sans compte. Les réponses des élèves ne quittent jamais leur navigateur.', '',
    '## Données publiques', '',
    `- [Catalogue d’outils validés](${urlAbsolue('/api/catalog.json')})`,
    `- [Taxonomie, angles morts et règles](${urlAbsolue('/api/rules.json')})`, '',
    '## Entonnoir', '',
    `Le plan se calcule dans le navigateur à ${urlAbsolue('/entonnoir/')}. Un lien se construit dans le fragment : #i=<intention>&t=<type>&c=<question>:<o|n|s>,...&o=<outil>. o = oui, n = non, s = je ne sais pas. Sans navigateur, refais le calcul avec les règles publiques.`, '',
    '## Bonnes pratiques', '',
    ...PRATIQUES.map((p) => `- [${p.titre}](${urlAbsolue(`/bonnes-pratiques/${p.id}/`)}) : ${p.resume}`), '',
    '## Angles morts', '',
    ...ANGLES.map((a) => `- [${a.title}](${urlAbsolue(`/bonnes-pratiques/angles-morts/${a.id}/`)})`), '',
    '## Cours', '', ...cours, '',
  ].join('\n');
  return new Response(espaces(texte), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
