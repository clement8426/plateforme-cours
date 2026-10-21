// Ajouté par la plateforme (scripts/integrer-comparateur.mjs) à la version réparée du formulaire, pour la démonstration.
//
// Par défaut, les suggestions d'adresse sont SIMULÉES ici, dans le navigateur : aucune requête ne part vers le service Photon,
// donc ce que la personne tape ne quitte pas la page. La page de comparaison active Photon par défaut
// en posant window.__suggestionsReelles = true et propose de revenir aux exemples avant le formulaire.
(() => {
  // Quelques rues réelles de Suisse. Le numéro vient de ce que la personne tape ; sinon on propose un numéro d'exemple.
  const RUES = [
    ['Rue du Seyon', '2000', 'Neuchâtel', '10'], ['Rue de l’Hôpital', '2000', 'Neuchâtel', '4'], ['Rue de la Treille', '2000', 'Neuchâtel', '5'],
    ['Avenue de la Gare', '2000', 'Neuchâtel', '12'], ['Place Pury', '2000', 'Neuchâtel', '1'], ['Rue du Château', '2000', 'Neuchâtel', '8'],
    ['Faubourg de l’Hôpital', '2000', 'Neuchâtel', '19'], ['Avenue du 1er-Mars', '2000', 'Neuchâtel', '6'], ['Rue des Terreaux', '2000', 'Neuchâtel', '7'],
    ['Quai Philippe-Godet', '2000', 'Neuchâtel', '2'], ['Chemin du Seyon', '2063', 'Engollon', '10'],
    ['Avenue Léopold-Robert', '2300', 'La Chaux-de-Fonds', '23'],
    ['Rue du Parc', '2300', 'La Chaux-de-Fonds', '9'], ['Rue de la Serre', '2300', 'La Chaux-de-Fonds', '11'], ['Rue du Progrès', '2300', 'La Chaux-de-Fonds', '37'],
    ['Rue Numa-Droz', '2300', 'La Chaux-de-Fonds', '14'], ['Rue de la Paix', '2300', 'La Chaux-de-Fonds', '5'], ['Rue du Doubs', '2300', 'La Chaux-de-Fonds', '32'],
    ['Place du Marché', '2300', 'La Chaux-de-Fonds', '1'], ['Rue de France', '2400', 'Le Locle', '16'], ['Rue Bournot', '2400', 'Le Locle', '33'],
    ['Rue de Bourg', '1003', 'Lausanne', '15'], ['Rue du Grand-Pont', '1003', 'Lausanne', '4'], ['Avenue d’Ouchy', '1006', 'Lausanne', '31'],
    ['Avenue de la Gare', '1003', 'Lausanne', '9'], ['Rue du Rhône', '1204', 'Genève', '40'], ['Rue de Carouge', '1205', 'Genève', '22'],
    ['Quai du Mont-Blanc', '1201', 'Genève', '3'], ['Rue de Lausanne', '1202', 'Genève', '60'], ['Rue de Romont', '1700', 'Fribourg', '12'],
    ['Boulevard de Pérolles', '1700', 'Fribourg', '25'], ['Rue de Lausanne', '1700', 'Fribourg', '45'], ['Rue du Rhône', '1950', 'Sion', '18'],
    ['Avenue de la Gare', '1950', 'Sion', '7'], ['Rue du Lac', '1400', 'Yverdon-les-Bains', '14'], ['Rue de la Plaine', '1400', 'Yverdon-les-Bains', '22'],
    ['Rue de Nidau', '2502', 'Bienne', '35'], ['Rue Centrale', '2502', 'Bienne', '50'], ['Avenue de la Gare', '2800', 'Delémont', '3'],
    ['Rue du Simplon', '1800', 'Vevey', '20'], ['Grand-Rue', '1820', 'Montreux', '38'], ['Grand-Rue', '1110', 'Morges', '24'],
    ['Avenue de la Gare', '1920', 'Martigny', '11'], ['Spitalgasse', '3011', 'Berne', '17'], ['Marktgasse', '3011', 'Berne', '28'],
    ['Bahnhofstrasse', '8001', 'Zurich', '30'], ['Limmatquai', '8001', 'Zurich', '52'], ['Freie Strasse', '4051', 'Bâle', '26'], ['Via Nassa', '6900', 'Lugano', '9'],
  ];
  const normaliser = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[-’']/g, ' ');
  const original = window.fetch.bind(window);

  function chercher(requete) {
    const mots = normaliser(requete).split(/[\s,]+/).filter(Boolean);
    const numero = mots.find((m) => /^\d{1,3}[a-z]?$/.test(m)); // 131, 10b
    const npa = mots.find((m) => /^\d{4}$/.test(m));
    const texte = mots.filter((m) => m !== numero && m !== npa);
    return RUES
      .filter(([rue, code, ville]) => {
        const cible = normaliser(`${rue} ${ville}`);
        return texte.every((m) => cible.includes(m)) && (!npa || code.startsWith(npa));
      })
      .slice(0, 5)
      .map(([street, postcode, city, exemple]) => ({ properties: { street, housenumber: numero ?? exemple, postcode, city } }));
  }

  window.fetch = (url, options) => {
    const adresse = String(url);
    if (!adresse.startsWith('https://photon.komoot.io/') || window.__suggestionsReelles === true) return original(url, options);

    const features = chercher(new URL(adresse).searchParams.get('q') || '');
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
