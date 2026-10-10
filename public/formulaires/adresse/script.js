// Atelier Rayon : formulaire de livraison
const form = document.getElementById('formulaire');
const erreur = document.getElementById('erreur');
const obligatoires = ['prenom', 'nom', 'email', 'telephone', 'npa', 'localite', 'rue'];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const champs = [...form.querySelectorAll('input')];
  champs.forEach(c => c.classList.remove('rouge'));
  const manquants = champs.filter(c => obligatoires.includes(c.name) && !c.value.trim());
  if (manquants.length) {
    manquants.forEach(c => c.classList.add('rouge'));
    erreur.textContent = 'Erreur champ ' + (champs.indexOf(manquants[0]) + 1);
    erreur.hidden = false;
    return;
  }
  erreur.hidden = true;
  await new Promise(r => setTimeout(r, 1800));
  form.replaceWith(Object.assign(document.createElement('p'), { className: 'merci', textContent: 'Adresse enregistrée.' }));
});
