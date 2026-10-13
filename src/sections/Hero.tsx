import { useRef, type PointerEvent } from 'react';
import { hero } from '../config/site';
import { Button } from '../components/ui/Button';
import { CoreVisual } from '../components/hero/CoreVisual';
import { useFinePointer, useReducedMotion } from '../hooks/useMedia';
import { vars } from '../lib/css';

export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const interactive = fine && !reduced;

  const setPointer = (x: number, y: number) => {
    pointer.current = { x, y };
    sectionRef.current?.style.setProperty('--mx', x.toFixed(3));
    sectionRef.current?.style.setProperty('--my', y.toFixed(3));
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!interactive || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      data-ready={ready}
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={() => interactive && setPointer(0, 0)}
      className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-20"
    >
      <div className="hero-grid depth-1" aria-hidden="true" />
      <div className="hero-glow depth-2" aria-hidden="true" />

      <div className="shell relative z-10 grid flex-1 items-center gap-6 py-10 lg:grid-cols-12 lg:gap-0 lg:py-6">
        <div className="relative z-10 lg:col-span-7">
          <p className="eyebrow hero-in" style={vars({ '--d': '80ms' })}>
            <span className="pulse-dot" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(2.7rem,7.6vw,7.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]"
          >
            {hero.title.map((line, i) => (
              <span key={line} className="h-line">
                <span
                  className={i === hero.title.length - 1 ? 'text-gradient' : ''}
                  style={vars({ '--d': `${180 + i * 130}ms` })}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="hero-in mt-8 max-w-xl text-base leading-relaxed text-frost-200 sm:text-lg"
            style={vars({ '--d': '620ms' })}
          >
            {hero.lead}
          </p>
          <div className="hero-in mt-10 flex flex-wrap gap-3" style={vars({ '--d': '760ms' })}>
            <Button href="#servicios">{hero.primaryCta}</Button>
            <Button href="#contacto" variant="ghost">
              {hero.secondaryCta}
            </Button>
          </div>
        </div>

        <div className="hero-in depth-3 relative lg:col-span-5 lg:-ml-[10%] lg:-mr-[14%]" style={vars({ '--d': '300ms' })}>
          <CoreVisual pointer={pointer} />
        </div>
      </div>

      <div className="shell relative z-10 pb-8">
        <a href="#manifiesto" className="scroll-cue">
          <span className="scroll-cue__track" aria-hidden="true">
            <span />
          </span>
          <span>Explorar</span>
        </a>
      </div>
    </section>
  );
}
