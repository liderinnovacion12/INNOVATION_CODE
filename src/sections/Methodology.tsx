import { useRef, useState, type KeyboardEvent } from 'react';
import { methodology } from '../config/site';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { vars } from '../lib/css';

/** Metodología como línea de tiempo interactiva (tablist horizontal accesible). */
export default function Methodology() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const step = methodology[active];
  const last = methodology.length - 1;

  const go = (i: number) => {
    const next = Math.max(0, Math.min(last, i));
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(active + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(active - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(last);
    else return;
    e.preventDefault();
  };

  return (
    <section id="metodologia" aria-labelledby="metodologia-title" className="section relative">
      <div className="shell">
        <SectionHeading
          id="metodologia-title"
          index="05"
          label="Metodología"
          title={
            <>
              Cinco fases. <span className="text-gradient">Cero cajas negras.</span>
            </>
          }
          lead="Un proceso iterativo y transparente: sabes en qué fase estamos, qué recibes y qué decisión viene después."
        />

        <Reveal className="timeline mt-16" >
          <div className="timeline__track" aria-hidden="true">
            <span style={vars({ '--progress': active / last })} />
          </div>
          <div role="tablist" aria-label="Fases de la metodología" className="timeline__steps" onKeyDown={onKeyDown}>
            {methodology.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`fase-${s.id}`}
                aria-selected={i === active}
                aria-controls="fase-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`timeline__step ${i <= active ? 'is-done' : ''}`}
              >
                <span className="timeline__node" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-[0.2em] text-frost-400">{String(i + 1).padStart(2, '0')}</span>
                <span className="timeline__label">{s.label}</span>
              </button>
            ))}
          </div>

          <div role="tabpanel" id="fase-panel" aria-labelledby={`fase-${step.id}`} tabIndex={0} className="timeline__panel">
            <div key={step.id} className="panel-swap grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <div>
                <p className="font-display text-[clamp(4rem,10vw,8rem)] font-bold leading-none text-outline" aria-hidden="true">
                  {String(active + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">{step.label}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-frost-200">{step.description}</p>
                <p className="mt-6 border-l-2 border-accent pl-4 font-display text-lg italic text-frost">“{step.question}”</p>
              </div>
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">Entregables</h4>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {step.deliverables.map((d) => (
                    <li key={d} className="flex items-center justify-between py-3 text-frost-200">
                      {d}
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-2">
                  <button type="button" className="chip" onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}>
                    ← Anterior
                  </button>
                  <button type="button" className="chip" onClick={() => setActive(Math.min(last, active + 1))} disabled={active === last}>
                    Siguiente →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
