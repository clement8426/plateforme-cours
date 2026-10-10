// Ajouté par la plateforme (scripts/integrer-comparateur.mjs) à la version réparée du formulaire, pour la démonstration.
//
// Par défaut, les suggestions d'adresse sont SIMULÉES ici, dans le navigateur : aucune requête ne part vers le service Photon,
// donc ce que la personne tape ne quitte pas la page. La page qui présente la démonstration peut activer le vrai service
// (case à cocher, accord explicite) en posant window.__suggestionsReelles = true.
(() => {
  const ADRESSES = [
    { street: 'Rue du Seyon', housenumber: '10', postcode: '2000', city: 'Neuchâtel' },
    { street: 'Chemin du Seyon', housenumber: '10', postcode: '2063', city: 'Engollon' },
    { street: 'Chemin du Seyon', housenumber: '10b', postcode: '2063', city: 'Engollon' },
    { street: 'Rue du Seyon', housenumber: '2', postcode: '2000', city: 'Neuchâtel' },
    { street: 'Rue du Seyon', housenumber: '21', postcode: '2000', city: 'Neuchâtel' },
    { street: 'Rue de l’Hôpital', housenumber: '4', postcode: '2000', city: 'Neuchâtel' },
    { street: 'Rue de la Treille', housenumber: '5', postcode: '2000', city: 'Neuchâtel' },
    { street: 'Avenue de la Gare', housenumber: '12', postcode: '2000', city: 'Neuchâtel' },
    { street: 'Place Pury', housenumber: '1', postcode: '2000', city: 'Neuchâtel' },
  ];
  const normaliser = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const original = window.fetch.bind(window);

  window.fetch = (url, options) => {
    const adresse = String(url);
    if (!adresse.startsWith('https://photon.komoot.io/') || window.__suggestionsReelles === true) return original(url, options);

    const mots = normaliser(new URL(adresse).searchParams.get('q') || '').split(/[\s,]+/).filter(Boolean);
    const features = ADRESSES
      .filter((a) => mots.every((m) => normaliser(`${a.street} ${a.housenumber} ${a.postcode} ${a.city}`).includes(m)))
      .slice(0, 5)
      .map((properties) => ({ properties }));

    return new Promise((resolve, reject) => {
      // Un court délai, pour que l'état « Recherche… » du formulaire soit visible comme avec un vrai service.
      const minuteur = setTimeout(() => resolve(new Response(JSON.stringify({ features }), { status: 200, headers: { 'content-type': 'application/json' } })), 180);
      options?.signal?.addEventListener('abort', () => {
        clearTimeout(minuteur);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  };
})();
