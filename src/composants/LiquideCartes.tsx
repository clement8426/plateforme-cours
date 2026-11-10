'use client';

import { useEffect } from 'react';

const CARTES = '.cours-carte:not(.est-vide, .est-prepa), .outil-carte, .demo-carte:not(.est-indisponible), .carte-choix, .rayon li';
const NAMESPACE = 'http://www.w3.org/2000/svg';
const INTERVALLES = 8;

function svg<K extends keyof SVGElementTagNameMap>(tag: K) {
  return document.createElementNS(NAMESPACE, tag);
}

function creerEau(carte: HTMLElement, id: number) {
  const largeur = carte.clientWidth;
  const hauteur = carte.clientHeight;
  const dessin = svg('svg');
  dessin.setAttribute('class', 'carte-liquide');
  dessin.setAttribute('viewBox', `0 0 ${largeur} ${hauteur}`);
  dessin.setAttribute('preserveAspectRatio', 'none');
  dessin.setAttribute('aria-hidden', 'true');
  dessin.setAttribute('focusable', 'false');
  const eau = svg('path');
  eau.id = `surface-liquide-${id}`;
  eau.setAttribute('class', 'eau');
  const masque = svg('clipPath');
  masque.id = `masque-liquide-${id}`;
  const contour = svg('use');
  contour.setAttribute('href', `#${eau.id}`);
  masque.append(contour);
  const defs = svg('defs');
  defs.append(masque);
  const air = svg('g');
  air.setAttribute('clip-path', `url(#${masque.id})`);
  const bulles = [0.19, 0.44, 0.72].map((x, i) => {
    const cercle = svg('ellipse');
    const rayon = Math.min(13, Math.max(5, hauteur * 0.065)) * [1, 0.62, 0.8][i];
    cercle.setAttribute('class', 'bulle');
    cercle.setAttribute('rx', String(rayon));
    cercle.setAttribute('ry', String(rayon * 1.13));
    cercle.style.display = 'none';
    air.append(cercle);
    return { cercle, x, rayon, eclatee: false };
  });
  dessin.append(defs, eau, air);
  carte.prepend(dessin);
  carte.dataset.liquide = '';

  const bas = hauteur + 4;
  const points = Array.from({ length: INTERVALLES + 1 }, () => ({ y: bas, vitesse: 0 }));
  return { carte, largeur, hauteur, dessin, eau, bulles, points, niveau: 0, age: 0, remplir: true };
}
type Eau = ReturnType<typeof creerEau>;

function avancer(e: Eau, dt: number) {
  const { hauteur, largeur, points } = e;
  e.age += dt;
  e.niveau = Math.max(0, Math.min(1, e.niveau + dt * (e.remplir ? 1.05 : -1.35)));
  const precedent = points.map(p => p.y);
  let stable = true;
  points.forEach((p, i) => {
    const x = i / INTERVALLES;
    // L'arrivée à gauche soulève une poche, puis la crête traverse la carte.
    const phase = Math.max(0, Math.min(1, (e.niveau - 0.30 * x) / 0.70));
    const cible = hauteur + 4 - (hauteur + 12) * phase * phase * (3 - 2 * phase);
    const courbure = (precedent[i - 1] ?? p.y) + (precedent[i + 1] ?? p.y) - 2 * p.y;
    p.vitesse += ((cible - p.y) * 118 + courbure * 44 - p.vitesse * 15) * dt;
    p.y += p.vitesse * dt;
    if (Math.abs(p.vitesse) > 1 || Math.abs(cible - p.y) > 0.4) stable = false;
  });
  const pas = largeur / INTERVALLES;
  let d = `M -2 ${points[0].y} H 0`;
  for (let i = 0; i < INTERVALLES; i++) {
    const milieu = (i + 0.5) * pas;
    d += ` C ${milieu} ${points[i].y} ${milieu} ${points[i + 1].y} ${(i + 1) * pas} ${points[i + 1].y}`;
  }
  e.eau.setAttribute('d', `${d} h 2 V ${hauteur + 6} H -2 Z`);

  let airEnCours = false;
  e.bulles.forEach((b, i) => {
    if (b.eclatee) return;
    const age = e.age - (0.24 + i * 0.15);
    if (age < 0) return;
    const x = b.x * largeur + Math.sin(age * 5 + i) * b.rayon;
    const y = hauteur + b.rayon - age * hauteur * (1.5 - i * 0.12);
    const index = Math.max(0, Math.min(INTERVALLES, Math.round(x / pas)));
    if (y - b.rayon <= points[index].y) {
      if (points[index].y < hauteur && points[index].y > 0) points[index].vitesse -= b.rayon * 12;
      b.eclatee = true;
      b.cercle.style.display = 'none';
    } else {
      airEnCours = true;
      b.cercle.style.display = '';
      b.cercle.setAttribute('cx', String(x));
      b.cercle.setAttribute('cy', String(y));
    }
  });
  return stable && !airEnCours && e.niveau === (e.remplir ? 1 : 0);
}

export default function LiquideCartes() {
  useEffect(() => {
    const reduit = matchMedia('(prefers-reduced-motion: reduce)');
    const eaux = new Map<HTMLElement, Eau>();
    const actives = new Set<Eau>();
    let survolee: HTMLElement | null = null;
    let focalisee: HTMLElement | null = null;
    let id = 0, frame = 0, precedent = 0;

    function retirer(e: Eau) {
      e.dessin.remove();
      delete e.carte.dataset.liquide;
      eaux.delete(e.carte);
      actives.delete(e);
    }
    function animer(temps: number) {
      const dt = Math.min((temps - precedent) / 1000, 1 / 30);
      precedent = temps;
      for (const e of actives) {
        if (!e.carte.isConnected) retirer(e);
        else if (avancer(e, dt)) {
          actives.delete(e);
          if (!e.remplir) retirer(e);
        }
      }
      frame = actives.size ? requestAnimationFrame(animer) : 0;
    }
    function actualiser() {
      if (reduit.matches) {
        eaux.forEach(retirer);
        return;
      }
      for (const carte of [survolee, focalisee]) {
        if (carte?.isConnected && !eaux.has(carte) && carte.clientWidth && carte.clientHeight) {
          const e = creerEau(carte, ++id);
          eaux.set(carte, e);
          actives.add(e);
        }
      }
      for (const e of eaux.values()) {
        if (!e.carte.isConnected) { retirer(e); continue; }
        const remplir = e.carte === survolee || e.carte === focalisee;
        if (remplir === e.remplir) continue;
        e.remplir = remplir;
        if (remplir) {
          e.age = 0;
          for (const b of e.bulles) { b.eclatee = false; b.cercle.style.display = 'none'; }
        }
        actives.add(e);
      }
      if (!frame && actives.size) {
        precedent = performance.now();
        frame = requestAnimationFrame(animer);
      }
    }
    const carteDe = (cible: EventTarget | null) => cible instanceof Element ? cible.closest<HTMLElement>(CARTES) : null;
    function pointeur(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      const carte = carteDe(e.type === 'pointerout' ? e.relatedTarget : e.target);
      if (carte !== survolee) { survolee = carte; actualiser(); }
    }
    function focus(e: FocusEvent) {
      const cible = e.type === 'focusout' ? e.relatedTarget : e.target;
      focalisee = cible instanceof Element && cible.matches(':focus-visible') ? carteDe(cible) : null;
      actualiser();
    }
    document.addEventListener('pointerover', pointeur);
    document.addEventListener('pointerout', pointeur);
    document.addEventListener('focusin', focus);
    document.addEventListener('focusout', focus);
    reduit.addEventListener('change', actualiser);
    return () => {
      cancelAnimationFrame(frame);
      eaux.forEach(retirer);
      document.removeEventListener('pointerover', pointeur);
      document.removeEventListener('pointerout', pointeur);
      document.removeEventListener('focusin', focus);
      document.removeEventListener('focusout', focus);
      reduit.removeEventListener('change', actualiser);
    };
  }, []);
  return null;
}
