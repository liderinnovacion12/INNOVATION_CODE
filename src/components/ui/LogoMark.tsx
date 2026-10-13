import { useId } from 'react';

/** Monograma de marca: hexágono rojo-azul con corchetes de código y núcleo. */
export function LogoMark({ className = '', title }: { className?: string; title?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF2638" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
        <radialGradient id={`${id}-c`} cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#fff" />
          <stop offset="0.5" stopColor="#FF6875" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1769FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M24 3.5 41.8 13.75v20.5L24 44.5 6.2 34.25v-20.5Z" stroke={`url(#${id}-g)`} strokeWidth="2" />
      <path d="M24 9.5 36.6 16.75v14.5L24 38.5" stroke="currentColor" strokeOpacity="0.2" />
      <path d="M18.5 17 12.5 24l6 7" stroke="#FF2638" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29.5 17l6 7-6 7" stroke="#1769FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="6" fill={`url(#${id}-c)`} />
      <circle cx="24" cy="24" r="2.2" fill="#fff" />
    </svg>
  );
}
