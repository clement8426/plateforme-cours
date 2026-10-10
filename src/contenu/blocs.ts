// Les six blocs du cours. Les couleurs sont les mêmes que dans Tilleul (mode cours) :
// un apprenant qui a vu « Friction » en terracotta dans la démo le retrouve ici dans la même couleur.
export type BlocId = 'design-system' | 'friction' | 'accessibilite' | 'comportement' | 'microcopie' | 'performance';

export const BLOCS: Record<BlocId, { nom: string; couleur: string }> = {
  'design-system': { nom: 'Design system', couleur: 'var(--b-design)' },
  friction: { nom: 'Friction', couleur: 'var(--b-friction)' },
  accessibilite: { nom: 'Accessibilité', couleur: 'var(--b-access)' },
  comportement: { nom: 'Analyse comportementale', couleur: 'var(--b-comportement)' },
  microcopie: { nom: 'Microcopie', couleur: 'var(--b-micro)' },
  performance: { nom: 'Performance perçue', couleur: 'var(--b-perf)' },
};
