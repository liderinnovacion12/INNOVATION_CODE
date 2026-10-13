import { useEffect, useState } from 'react';

const CHARS = '01<>/{}[]#*+=_';

/**
 * Revela un texto "decodificándolo" carácter por carácter. El texto final reserva
 * el espacio (sin saltos de diseño) y los lectores de pantalla leen siempre el texto real.
 */
export function ScrambleText({
  text,
  active,
  duration = 950,
  reduced = false,
  className = '',
}: {
  text: string;
  active: boolean;
  duration?: number;
  reduced?: boolean;
  className?: string;
}) {
  const [out, setOut] = useState(reduced ? text : '');

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = (now - start) / duration;
      let s = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const at = (i / text.length) * 0.65;
        if (ch === ' ' || p >= at + 0.35) s += ch;
        else if (p >= at) s += CHARS[(Math.random() * CHARS.length) | 0];
        else s += ' ';
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration, reduced, text]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-pre">
        {out}
      </span>
    </span>
  );
}
