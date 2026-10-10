// Typographie française : espace insécable avant : ; ! ? et à l'intérieur des guillemets,
// pour qu'un signe ne se retrouve jamais seul en début de ligne.
export function typo(texte: string): string {
  return texte
    .replace(/ ([:;!?»])/g, ' $1')
    .replace(/« /g, '« ');
}

// Applique typo() à toutes les chaînes d'un objet (sauf les adresses).
export function typoProfonde<T>(valeur: T): T {
  if (typeof valeur === 'string') return (/^(https?:)?\//.test(valeur) ? valeur : typo(valeur)) as T;
  if (Array.isArray(valeur)) return valeur.map(typoProfonde) as T;
  if (valeur && typeof valeur === 'object') {
    return Object.fromEntries(Object.entries(valeur).map(([k, v]) => [k, typoProfonde(v)])) as T;
  }
  return valeur;
}
