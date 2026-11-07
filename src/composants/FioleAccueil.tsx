'use client';

import { useEffect, useRef } from 'react';

// Les six couleurs de la bande, dans leur version vive : la fiole reste décorative, dans les deux thèmes.
const COUCHES = ['#FF92B0', '#62D8A2', '#E6C85C', '#8CBDF2', '#FF9C73', '#C3A6F0'];

// La mascotte du Labo en grand : ses six couches reprennent la bande de couleurs du site.
// Le liquide penche avec la souris. Décoratif : caché aux lecteurs d'écran, immobile si l'on réduit les animations.
export default function FioleAccueil() {
  const liquide = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bouger = (e: PointerEvent) => {
      const angle = ((e.clientX / window.innerWidth) - 0.5) * -22;
      liquide.current?.style.setProperty('transform', `rotate(${angle.toFixed(1)}deg)`);
    };
    window.addEventListener('pointermove', bouger, { passive: true });
    return () => window.removeEventListener('pointermove', bouger);
  }, []);

  return (
    <svg className="fiole" viewBox="0 0 200 216" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="fiole-accueil"><path d="M80 24H120V82L176 176Q190 204 160 204H40Q10 204 24 176L80 82Z" /></clipPath>
      </defs>
      <path className="fiole-verre" d="M80 24H120V82L176 176Q190 204 160 204H40Q10 204 24 176L80 82Z" />
      <g clipPath="url(#fiole-accueil)">
        <g className="fiole-montee">
          <g ref={liquide} className="fiole-liquide">
            {COUCHES.map((c, i) => <rect key={c} x="-120" y={116 + i * 16} width="440" height={i === 5 ? 200 : 17} fill={c} />)}
            <circle cx="72" cy="150" r="6" fill="#fff" opacity=".55" />
            <circle cx="128" cy="168" r="4" fill="#fff" opacity=".55" />
            <circle cx="104" cy="136" r="3" fill="#fff" opacity=".55" />
          </g>
        </g>
      </g>
      <rect className="fiole-verre" x="66" y="10" width="68" height="20" rx="10" />
      <circle cx="89" cy="86" r="6" fill="#14161B" />
      <circle cx="111" cy="86" r="6" fill="#14161B" />
      <path d="M92 97Q100 105 108 97" fill="none" stroke="#14161B" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}
