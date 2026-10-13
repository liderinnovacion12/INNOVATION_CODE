import { useRef, useState, type KeyboardEvent } from 'react';
import { services } from '../config/site';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceMedia } from '../components/ui/ServiceMedia';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { requestContact } from '../lib/events';

/** Servicios como consola de módulos: lista (tablist accesible) + panel de detalle. */
export default function Services() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const mod = services[active];

  const focusTab = (i: number) => {
    const next = (i + services.length) % services.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => focusTab(active + 1),
      ArrowRight: () => focusTab(active + 1),
      ArrowUp: () => focusTab(active - 1),
      ArrowLeft: () => focusTab(active - 1),
      Home: () => focusTab(0),
      End: () => focusTab(services.length - 1),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  return (
    <section id="servicios" aria-labelledby="servicios-title" className="section relative">
      <div className="shell">
        <SectionHeading
          id="servicios-title"
          index="02"
          label="Servicios"
          title={
            <>
              Módulos tecnológicos <span className="text-gradient">listos para ensamblar.</span>
            </>
          }
          lead="Cada proyecto combina los módulos que necesita. Explóralos: selecciona uno para ver qué resuelve y qué incluye."
        />

        <Reveal className="console mt-14 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div
            role="tablist"
            aria-label="Módulos de servicio"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="console__list"
          >
            {services.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={i === active}
                aria-controls="servicio-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className="module-tab"
              >
                <span className="module-tab__code">{s.code}</span>
                <span className="module-tab__name">{s.name}</span>
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id="servicio-panel"
            aria-labelledby={`tab-${mod.id}`}
            tabIndex={0}
            className="console__panel"
          >
            <ServiceMedia mod={mod} />
            <div key={mod.id} className="panel-swap mt-8">
              <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{mod.name}</h3>
              <p className="mt-2 text-lg text-volt-300">{mod.short}</p>
              <p className="mt-5 max-w-xl leading-relaxed text-frost-200">{mod.description}</p>

              <ul className="mt-7 grid gap-x-8 sm:grid-cols-2">
                {mod.capabilities.map((c) => (
                  <li key={c} className="flex items-center gap-3 border-t border-line py-3 text-sm text-frost-200">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-crimson" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>

              {mod.note && <p className="mt-5 text-sm text-frost-400">{mod.note}</p>}

              <div className="mt-8">
                <Button onClick={() => requestContact({ projectType: mod.name })} size="sm">
                  Consultar este módulo
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
