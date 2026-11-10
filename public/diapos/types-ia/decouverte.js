(() => {
  if (new URLSearchParams(location.search).get('lecture') === '1') return;

  document.querySelectorAll('.slide audio, .slide video').forEach(audio => {
    const slide = audio.closest('.slide');
    new MutationObserver(() => {
      if (slide.hidden || !slide.classList.contains('active')) audio.pause();
    }).observe(slide, { attributes: true, attributeFilter: ['class', 'hidden'] });
  });

  const retoursImage = {
    vague: 'Le sujet est présent, mais « oiseau » laisse libres l’espèce, le cadrage et la lumière.',
    precis: 'Oui. Le sujet, le gros plan, la branche mouillée et la lumière correspondent à l’image.',
    contraire: 'Ici, le sujet, l’action et le décor ne correspondent pas. Chaque précision peut changer le résultat.',
  };
  document.querySelectorAll('.image-choix button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.image-choix button').forEach(option => option.setAttribute('aria-pressed', String(option === b)));
    document.querySelector('.image-retour').textContent = retoursImage[b.dataset.prompt];
  }));

  const variantes = {
    generation: ['Un rouge-gorge dans son environnement, plan large au lever du jour.', 'Gros plan sur le rouge-gorge, plumage détaillé et fond flou.'],
    'generation-audio': ['Un instrumental acoustique lent, avec une mélodie répétée.', 'La même mélodie acoustique, avec un tempo plus vif.'],
  };
  document.querySelectorAll('[data-studio]').forEach(studio => {
    const boutons = [...studio.querySelectorAll('button')];
    const audio = studio.querySelector('audio');
    function choisir(index) {
      studio.dataset.variante = String(index);
      boutons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
      studio.querySelector('.studio-prompt').textContent = '« ' + variantes[studio.dataset.studio][index] + ' »';
      if (audio) audio.playbackRate = index === 0 ? 0.82 : 1.35;
    }
    boutons.forEach((b, i) => b.addEventListener('click', () => choisir(i)));
    choisir(0);
    if (audio) {
      const slide = studio.closest('.slide');
      new MutationObserver(() => { if (slide.hidden || !slide.classList.contains('active')) audio.pause(); })
        .observe(slide, { attributes: true, attributeFilter: ['class', 'hidden'] });
    }
  });

  function bouton(label, action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'decouverte-action';
    b.textContent = label;
    b.addEventListener('click', action);
    return b;
  }

  // Les indices et les réponses sont les cellules du tableau du cours.
  const table = document.querySelector('.tbl-familles');
  const commandes = document.createElement('div');
  commandes.className = 'famille-commandes';
  const reponses = Array.from(table.tBodies[0].rows, (row, i) => {
    const cell = row.cells[0];
    const nom = document.createElement('span');
    nom.append(...cell.childNodes);
    const label = nom.textContent;
    const reveler = bouton('Révéler la famille', () => {
      reveler.textContent = label;
      reveler.setAttribute('aria-label', label);
    });
    reveler.hidden = true;
    cell.append(nom, reveler);
    return { reveler, indice: i + 1 };
  });
  const quiz = bouton('Deviner les familles', () => {
    const actif = table.classList.toggle('quiz-actif');
    quiz.setAttribute('aria-pressed', String(actif));
    quiz.textContent = actif ? 'Revoir le tableau' : 'Deviner les familles';
    for (const { reveler, indice } of reponses) {
      reveler.hidden = !actif;
      reveler.textContent = 'Révéler la famille';
      reveler.setAttribute('aria-label', 'Révéler la famille de la ligne ' + indice);
    }
  });
  quiz.setAttribute('aria-pressed', 'false');
  commandes.append(quiz);
  table.before(commandes);

  // Sorties enregistrées dans Atelier des IA, images-2026-11-10.json.
  const vision = document.querySelector('[data-key="vision"] .places');
  const exemple = document.createElement('div');
  exemple.className = 'vision-exemple';
  exemple.innerHTML = '<div class="vision-photo"><img src="./velo.jpg" alt="Vélo bleu dans un parc"><span class="vision-cadre" hidden></span></div><div><div class="vision-choix"></div><p class="vision-legende" aria-live="polite"></p></div>';
  const cadre = exemple.querySelector('.vision-cadre');
  Object.assign(cadre.style, { left: '18.40%', top: '22.30%', width: '65.88%', height: '56.46%' });
  const modes = ['Classer la photo', 'Localiser le vélo'];
  const controles = modes.map((label, i) => bouton(label, () => choisir(i)));
  function choisir(i) {
    controles.forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    cadre.hidden = i === 0;
    exemple.querySelector('.vision-legende').textContent = i === 0
      ? 'Image entière · « VTT » arrive en tête du classement (41 %).'
      : 'Objet · YOLOS a repéré le vélo (99,6 %), mais aussi produit des faux positifs.';
  }
  exemple.querySelector('.vision-choix').append(...controles);
  choisir(0);
  vision.after(exemple);

  const prediction = document.querySelector('.prediction');
  prediction.removeAttribute('role');
  prediction.removeAttribute('aria-label');
  prediction.querySelector('.pred-liste').removeAttribute('aria-hidden');
  const phrase = prediction.querySelector('.pred-phrase');
  const debut = phrase.textContent;
  phrase.setAttribute('aria-live', 'polite');
  const mots = [...prediction.querySelectorAll('.pred-liste li')].map(li => ({
    mot: li.firstElementChild.textContent, poids: parseInt(li.lastElementChild.textContent, 10),
  }));
  prediction.append(bouton('Tirer le mot suivant', () => {
    let tirage = Math.random() * 100;
    const choix = mots.find(m => (tirage -= m.poids) < 0);
    phrase.textContent = debut.replace('…', choix.mot === 'autres' ? '[autre mot]' : choix.mot);
  }));
})();
