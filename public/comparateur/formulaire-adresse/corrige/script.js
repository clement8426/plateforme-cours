// Atelier Rayon : formulaire d'exercice, version corrigée.
// Validation à la sortie de chaque champ, messages précis, retour pendant l'envoi,
// et autocomplétion d'adresse avec Photon (gratuit, sans clé, données OpenStreetMap).

const form = document.getElementById('formulaire');
const resume = document.getElementById('resume');
const resumeListe = document.getElementById('resume-liste');
const envoyer = document.getElementById('envoyer');
const merci = document.getElementById('merci');

// ---------- Règles et messages : ce qui est attendu, et comment corriger
const regles = {
  prenom: v => v ? '' : 'Indiquez votre prénom.',
  nom: v => v ? '' : 'Indiquez votre nom.',
  rue: v => !v ? 'Indiquez votre rue et votre numéro.' : (/\d/.test(v) ? '' : 'Ajoutez le numéro de la maison, par exemple : Rue du Seyon 10.'),
  npa: v => /^\d{4}$/.test(v) ? '' : 'Le NPA suisse compte 4 chiffres, par exemple 2000.',
  localite: v => v ? '' : 'Indiquez votre localité.',
  telephone: v => v.replace(/[\s.+-]/g, '').replace(/^0041|^41/, '0').match(/^0\d{9}$/) ? '' : 'Indiquez un numéro à 10 chiffres, par exemple 079 123 45 67.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Vérifiez votre e-mail : il manque peut-être le @ ou le point.'
};

function verifier(input) {
  const regle = regles[input.name];
  if (!regle) return true;
  const message = regle(input.value.trim());
  const zone = document.getElementById(input.name + '-erreur');
  zone.textContent = message;
  zone.hidden = !message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  input.classList.toggle('valide', !message);
  return !message;
}

// On vérifie quand la personne quitte le champ, pas pendant qu'elle tape
Object.keys(regles).forEach(nom => {
  const input = form.elements[nom];
  input.addEventListener('blur', () => { if (input.value.trim() || input.dataset.touche) { input.dataset.touche = '1'; verifier(input); } });
  input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') verifier(input); });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (envoyer.getAttribute('aria-busy') === 'true') return; // pas de double envoi
  const fautifs = Object.keys(regles).map(n => form.elements[n]).filter(i => !verifier(i));
  resumeListe.textContent = '';
  if (fautifs.length) {
    fautifs.forEach(i => {
      const a = Object.assign(document.createElement('a'), { href: '#' + i.id, textContent: document.querySelector('label[for="' + i.id + '"]').textContent.replace(/\s*\(facultatif\)/, '') + ' : ' + document.getElementById(i.name + '-erreur').textContent });
      a.addEventListener('click', ev => { ev.preventDefault(); i.focus(); });
      const li = document.createElement('li'); li.append(a); resumeListe.append(li);
    });
    resume.hidden = false;
    resume.focus();
    return;
  }
  resume.hidden = true;
  envoyer.setAttribute('aria-busy', 'true');
  envoyer.querySelector('.bouton-texte').textContent = 'Envoi en cours…';
  await new Promise(r => setTimeout(r, 1800)); // même délai que la version de départ, mais visible
  form.hidden = true;
  merci.hidden = false;
  merci.focus();
});

// ---------- Autocomplétion d'adresse (motif « combobox » du W3C)
const rue = document.getElementById('rue');
const liste = document.getElementById('suggestions');
const statut = document.getElementById('statut');
const charge = document.getElementById('charge');
const PHOTON = 'https://photon.komoot.io/api/';
const cache = new Map();
let minuteur = 0, requete = null, resultats = [], actif = -1;

function texteAdresse(p) {
  const voie = p.street || p.name || '';
  return { ligne: (voie + (p.housenumber ? ' ' + p.housenumber : '')).trim(), lieu: [p.postcode, p.city].filter(Boolean).join(' ') };
}

function fermer() {
  liste.hidden = true; liste.textContent = ''; rue.setAttribute('aria-expanded', 'false'); rue.removeAttribute('aria-activedescendant'); actif = -1;
}

function afficher(features) {
  resultats = features;
  liste.textContent = '';
  if (!features.length) { fermer(); statut.textContent = 'Aucune adresse trouvée : vous pouvez la saisir à la main.'; return; }
  features.forEach((f, k) => {
    const a = texteAdresse(f.properties);
    const li = document.createElement('li');
    li.id = 'suggestion-' + k; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
    li.append(a.ligne, Object.assign(document.createElement('span'), { textContent: a.lieu }));
    li.addEventListener('mousedown', e => e.preventDefault()); // garde le focus dans le champ
    li.addEventListener('click', () => choisir(k));
    liste.append(li);
  });
  liste.hidden = false; rue.setAttribute('aria-expanded', 'true');
  statut.textContent = features.length + (features.length > 1 ? ' adresses proposées' : ' adresse proposée') + ' : flèches pour parcourir, Entrée pour choisir.';
}

function surligner(k) {
  [...liste.children].forEach((li, j) => li.setAttribute('aria-selected', String(j === k)));
  actif = k;
  if (k >= 0) { rue.setAttribute('aria-activedescendant', 'suggestion-' + k); liste.children[k].scrollIntoView({ block: 'nearest' }); }
  else rue.removeAttribute('aria-activedescendant');
}

function choisir(k) {
  const p = resultats[k].properties, a = texteAdresse(p);
  rue.value = a.ligne + (p.housenumber ? '' : ' ');
  if (p.postcode) form.elements.npa.value = p.postcode;
  if (p.city) form.elements.localite.value = p.city;
  fermer();
  statut.textContent = p.housenumber ? 'Adresse complétée : NPA et localité remplis.' : 'Rue choisie : ajoutez le numéro de la maison.';
  ['rue', 'npa', 'localite'].forEach(n => { if (form.elements[n].value.trim()) verifier(form.elements[n]); });
  rue.focus();
}

async function chercher(q) {
  if (cache.has(q)) return afficher(cache.get(q));
  if (requete) requete.abort();
  requete = new AbortController();
  charge.hidden = false; statut.textContent = 'Recherche…';
  try {
    // limite à la Suisse, résultats proches de Neuchâtel en premier, 5 suggestions au plus
    const url = PHOTON + '?' + new URLSearchParams({ q, lang: 'fr', limit: '5', countrycode: 'CH', lat: '46.99', lon: '6.93' }) + '&layer=house&layer=street';
    const r = await fetch(url, { signal: requete.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    const vus = new Set();
    const features = data.features.filter(f => f.properties.postcode && (f.properties.street || f.properties.name)).filter(f => {
      const a = texteAdresse(f.properties), cle = a.ligne + a.lieu; if (vus.has(cle)) return false; vus.add(cle); return true;
    });
    cache.set(q, features);
    afficher(features);
  } catch (err) {
    if (err.name === 'AbortError') return;
    fermer();
    statut.textContent = 'Suggestions indisponibles : saisissez l’adresse à la main.';
  } finally {
    charge.hidden = true;
  }
}

rue.addEventListener('input', () => {
  clearTimeout(minuteur);
  const q = rue.value.trim();
  if (q.length < 3) { fermer(); statut.textContent = ''; return; }
  minuteur = setTimeout(() => chercher(q), 300); // on attend une pause dans la frappe : moins de requêtes
});

rue.addEventListener('keydown', e => {
  if (liste.hidden) return;
  const n = liste.children.length;
  if (e.key === 'ArrowDown') { e.preventDefault(); surligner((actif + 1) % n); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); surligner((actif - 1 + n) % n); }
  else if (e.key === 'Enter' && actif >= 0) { e.preventDefault(); choisir(actif); }
  else if (e.key === 'Escape') { fermer(); statut.textContent = ''; }
});

rue.addEventListener('blur', () => setTimeout(fermer, 120));
