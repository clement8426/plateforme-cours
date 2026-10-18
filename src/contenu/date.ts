// Met en forme une date AAAA-MM-JJ : « 18 octobre 2026 ».
export const formaterDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
