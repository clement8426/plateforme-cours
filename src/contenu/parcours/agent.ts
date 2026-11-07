// Ce que lit un agent IA : un message à copier et les bonnes pratiques en Markdown.
import { ANGLES, famille, GRAVITES, TAXONOMIE } from './moteur';
import { DATE_VERIFICATION, GROUPES, PRATIQUES, type Pratique } from './pratiques';
import { urlAbsolue } from '../site';

export const CHEMIN_GUIDE = '/bonnes-pratiques/index.md';
export const cheminMarkdown = (id: string) => `/bonnes-pratiques/${id}/index.md`;

const consignes = (url: string, cible: string) => [
  `Lis ce guide : ${url}`,
  '',
  `Vérifie ensuite ${cible}, point par point. Pour chaque vérification, réponds OK, À corriger ou Je ne sais pas, avec le fichier concerné et la correction proposée.`,
  'Commence par les points les plus graves. Ne modifie rien sans mon accord, et n’affiche ni clé ni donnée personnelle dans ta réponse.',
  'Si tu ne peux pas ouvrir le lien, dis-le-moi au lieu de deviner.',
].join('\n');

export const messageGuide = () => consignes(urlAbsolue(CHEMIN_GUIDE), 'mon projet');
export const messagePratique = (p: Pratique) => consignes(urlAbsolue(cheminMarkdown(p.id)), 'ce point dans mon projet');

// Les espaces insécables de la typographie française gênent la lecture par les outils.
export const texteBrut = (v: string) => v.replace(/[  ]/g, ' ');

function sectionPratique(p: Pratique, niveau: string) {
  return [
    `${niveau} ${p.titre}`, '',
    `Page : ${urlAbsolue(`/bonnes-pratiques/${p.id}/`)}`, '',
    p.risque, '',
    `Exemple fictif : ${p.exemple}`, '',
    'Vérifications :',
    ...p.verifications.map((v) => `- [ ] ${v}`), '',
    ...(p.blocs ?? []).flatMap((b) => [`**${b.titre}**`, '', ...b.lignes.map((l) => `- ${l.nom} : ${l.texte}`), '']),
    'Sources :',
    ...p.sources.map((s) => `- [${s.titre}](${s.url})`), '',
  ];
}

const avertissement = 'Ces pages informent et ne remplacent pas un conseil juridique. Sur un point légal, signale le doute au lieu de conclure.';

export function pratiqueMarkdown(p: Pratique) {
  return texteBrut([`# ${p.titre}`, '', `> ${p.resume}`, '', `Vérifié le ${DATE_VERIFICATION}. ${avertissement}`, '', ...sectionPratique(p, '##').slice(2)].join('\n'));
}

export function guideMarkdown() {
  const lignes = [
    '# Bonnes pratiques du Labo', '',
    '> Liste de vérification pour un projet numérique suisse : IA, légal, tests, sécurité et angles morts.', '',
    `Vérifié le ${DATE_VERIFICATION}. ${avertissement}`, '',
    'Pour un agent IA : passe chaque case en revue sur le projet. Réponds OK, À corriger ou Je ne sais pas, avec le fichier concerné. Ne modifie rien sans accord et n’affiche ni clé ni donnée personnelle.', '',
    ...GROUPES.flatMap((g) => [`## ${g}`, '', ...PRATIQUES.filter((p) => p.groupe === g).flatMap((p) => sectionPratique(p, '###'))]),
    '## Angles morts', '',
    ...TAXONOMIE.familles.flatMap((f: { id: string }) => [
      `### ${famille(f.id)}`, '',
      ...ANGLES.filter((a) => a.family === f.id).map((a) => `- [ ] **${a.title}** (${GRAVITES[a.severity].nom}) : ${a.question} ${a.action} ${urlAbsolue(`/bonnes-pratiques/angles-morts/${a.id}/`)}`), '',
    ]),
  ];
  return texteBrut(lignes.join('\n'));
}
