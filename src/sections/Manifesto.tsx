import { useEffect, useMemo, useRef } from 'react';
import { manifesto } from '../config/site';
import { useReducedMotion } from '../hooks/useMedia';
import { clamp } from '../lib/math';
import { vars } from '../lib/css';

/**
 * Manifiesto: frases que se encienden palabra a palabra con el desplazamiento.
 * El progreso se escribe en una variable CSS (--p), sin re-renderizar React.
 */
export default function Manifesto() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const lines = useMemo(() => {
    let index = 0;
    return manifesto.map((line) => {
      // Los asteriscos abren/cierran el resaltado, que puede abarcar varias palabras.
      let inAccent = false;
      return line.split(' ').map((raw) => {
        if (raw.startsWith('*')) inAccent = true;
        const word = { word: raw.replace(/\*/g, ''), accent: inAccent, i: index++ };
        if (raw.endsWith('*')) inAccent = false;
        return word;
      });
    });
  }, []);
  const total = lines.reduce((n, l) => n + l.length, 0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (reduced) {
      el.style.setProperty('--p', '1');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      el.style.setProperty('--p', clamp(range > 0 ? -r.top / range : 1).toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduced]);

  return (
    <section
      id="manifiesto"
      ref={sectionRef}
      aria-labelledby="manifiesto-title"
      className={`manifesto relative ${reduced ? 'py-28' : ''}`}
      style={vars({ '--n': total, height: reduced ? 'auto' : `${manifesto.length * 55 + 70}vh` })}
    >
      <div className={`${reduced ? '' : 'sticky top-0 flex h-[100svh] items-center'} overflow-hidden`}>
        <div className="manifesto__beam" aria-hidden="true" />
        <div className="shell relative w-full">
          <div className="mb-10 flex items-center gap-4">
            <h2 id="manifiesto-title" className="eyebrow">
              <span className="text-crimson-300">01</span>
              <span className="eyebrow__rule" aria-hidden="true" />
              Manifiesto
            </h2>
            <span className="manifesto__progress" aria-hidden="true">
              <span />
            </span>
          </div>
          <p className="font-display text-[clamp(2rem,5.4vw,5rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
            {lines.map((words, li) => (
              <span key={li} className={`block ${li % 2 ? 'lg:pl-[12%]' : ''}`}>
                {words.map(({ word, accent, i }) => (
                  <span
                    key={i}
                    className={`mf-word ${accent ? 'mf-word--accent' : ''}`}
                    style={vars({ '--i': i })}
                  >
                    {word}{' '}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
