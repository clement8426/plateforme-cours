// Le kit à coller dans l'agent IA : écrit en anglais, la langue de travail des agents, avec la langue de l'élève en variable.
import { ORIGINE } from '../site';
import { outilsDe, TAXONOMIE, type Choix, type Outil, type Plan } from './moteur';

export const NIVEAUX_KIT = [
  { id: 'autonomous', nom: 'Autonome', texte: 'Work autonomously and ask only when blocked.' },
  { id: 'essential', nom: 'Questions essentielles', texte: 'Ask only the questions that change a decision.' },
  { id: 'guided', nom: 'Guidé pas à pas', texte: 'Go step by step and wait for my confirmation after each step.' },
];

const lib = (liste: { id: string; label_fr: string }[], id?: string) => liste.find((x) => x.id === id)?.label_fr ?? 'Not specified';

export function kitMarkdown(c: Choix, plan: Plan, niveau: string, notes: string[]) {
  const interaction = NIVEAUX_KIT.find((n) => n.id === niveau) ?? NIVEAUX_KIT[1];
  const outils = [...new Map(plan.actifs.flatMap((a) => outilsDe(a.id)).map((o) => [o.id, o])).values()] as Outil[];
  const lignes = [
    '# Project kit from Le Labo', '',
    'Student language: French. Answer in this language.', '',
    '## Project context', '',
    `- Intention: ${lib(TAXONOMIE.intentions, c.intention)}`,
    `- Project type: ${lib(TAXONOMIE.types, c.type)}`,
    `- Tool already chosen: ${lib(TAXONOMIE.outils, c.outil)}`,
    ...TAXONOMIE.contexte.map((q) => `- ${q.label_fr} ${c.contexte[q.id] === 'oui' ? 'Yes' : c.contexte[q.id] === 'non' ? 'No' : 'Unknown, treat as yes'}`),
    ...notes.map((n) => `- ${n}`), '',
    '## Interaction level', '', interaction.texte, '',
    '## Tools to install', '',
    ...(outils.length ? outils.flatMap((o) => [
      `### ${o.name}`, `Repository: https://github.com/${o.repo}`,
      ...Object.entries(o.install).map(([agent, commande]) => `- ${agent}: \`${commande}\``),
      ...o.constraints.map((x) => `- Constraint: ${x}`),
      'Verify it works before moving on. If it is not available for this agent, report it instead of inventing a command.', '',
    ]) : ['No validated tool applies yet. Continue with the blind spots.', '']),
    '## Blind spots, in order', '',
    ...plan.actifs.flatMap((a, i) => [
      `${i + 1}. **${a.title}** (${a.severity})`,
      `   - Question: ${a.question}`,
      `   - Why: ${a.why}`,
      `   - Action: ${a.action}`,
      `   - Reference: ${ORIGINE}/bonnes-pratiques/angles-morts/${a.id}/`,
    ]), '',
    ...(plan.aVerifier.length ? ['## Also check', '', ...plan.aVerifier.map((a) => `- ${a.title}: ${a.when.verifier}`), ''] : []),
    '## Data rule', '',
    'Never paste real personal data into a prompt. Use fake data with the same structure.', '',
    '## Project memory', '',
    'Create or complete CLAUDE.md or AGENTS.md with what you learned about this project.', '',
    '## Final report', '',
    'End with four lists: installed, working, unavailable, blocked.', '',
  ];
  return lignes.join('\n').replace(/[  ]/g, ' ');
}
