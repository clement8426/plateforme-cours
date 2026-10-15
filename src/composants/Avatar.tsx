// L'avatar du Labo : une petite fiole qui sourit. Même dessin que public/icones/icone.svg (favicon et icônes).
export default function Avatar({ taille = 38 }: { taille?: number }) {
  return (
    <svg className="avatar" width={taille} height={taille} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="avatar-fiole"><path d="M27 12H37V25L50.5 47.5Q53 52 48 52H16Q11 52 13.5 47.5L27 25Z" /></clipPath>
      </defs>
      <rect width="64" height="64" rx="15" fill="#2B44E8" />
      <g transform="translate(32 31) scale(1.13) translate(-32 -31)">
        <rect x="23.5" y="8.5" width="17" height="5" rx="2.5" fill="#FFFFFF" />
        <path d="M27 12H37V25L50.5 47.5Q53 52 48 52H16Q11 52 13.5 47.5L27 25Z" fill="#FFFFFF" />
        <g clipPath="url(#avatar-fiole)">
          <path d="M8 42Q16 38.5 24 42T40 42T56 42V58H8Z" fill="#FFC23D" />
          <circle cx="24" cy="47.5" r="1.7" fill="#FFFFFF" opacity=".85" />
          <circle cx="39" cy="46" r="1.2" fill="#FFFFFF" opacity=".85" />
        </g>
        <circle cx="28.5" cy="31" r="2.3" fill="#14161B" />
        <circle cx="35.5" cy="31" r="2.3" fill="#14161B" />
        <ellipse cx="25.3" cy="35" rx="1.9" ry="1.2" fill="#FF8FA3" opacity=".75" />
        <ellipse cx="38.7" cy="35" rx="1.9" ry="1.2" fill="#FF8FA3" opacity=".75" />
        <path d="M29.6 35.2Q32 37.6 34.4 35.2" fill="none" stroke="#14161B" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
