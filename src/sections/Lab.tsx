import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { labLinks, labNodes, type LabNode } from '../config/site';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { useFinePointer, useMediaQuery } from '../hooks/useMedia';
import { vars } from '../lib/css';

const byId = Object.fromEntries(labNodes.map((n) => [n.id, n])) as Record<string, LabNode>;
const stamp = () => new Date().toLocaleTimeString('es', { hour12: false });

/** Laboratorio: grafo explorable de nodos físicos, digitales e inteligentes. */
export default function Lab() {
  const desktop = useMediaQuery('(min-width: 768px)');
  const fine = useFinePointer();
  const [activeId, setActiveId] = useState('edge');
  const [pulse, setPulse] = useState(0);
  const [log, setLog] = useState<string[]>(['[sys] laboratorio en línea · selecciona un nodo']);
  const fieldRef = useRef<HTMLDivElement>(null);

  const active = byId[activeId];
  const pos = (n: LabNode) => (desktop ? { x: n.x, y: n.y } : { x: n.mx, y: n.my });
  const neighbors = useMemo(
    () => labLinks.filter(([a, b]) => a === activeId || b === activeId).map(([a, b]) => (a === activeId ? b : a)),
    [activeId],
  );

  const pushLog = (line: string) => setLog((l) => [`[${stamp()}] ${line}`, ...l].slice(0, 5));

  const select = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    setPulse(0);
    const count = labLinks.filter(([a, b]) => a === id || b === id).length;
    pushLog(`nodo:${id} → ${count} enlaces activos`);
  };

  const emit = () => {
    setPulse((p) => p + 1);
    pushLog(`pulso emitido desde ${activeId} → ${neighbors.join(', ')}`);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine || !fieldRef.current) return;
    const r = fieldRef.current.getBoundingClientRect();
    fieldRef.current.style.setProperty('--sx', `${e.clientX - r.left}px`);
    fieldRef.current.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  return (
    <section id="laboratorio" aria-labelledby="laboratorio-title" className="section relative overflow-hidden">
      <div className="shell">
        <SectionHeading
          id="laboratorio-title"
          index="03"
          label="Laboratorio de innovación"
          title={
            <>
              Un ecosistema donde <span className="text-gradient">sensores, datos y máquinas</span> conversan.
            </>
          }
          lead="Así conectamos las piezas de una solución. Selecciona un nodo para inspeccionarlo y emite un pulso para ver cómo viaja la información."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <Reveal>
            <div ref={fieldRef} onPointerMove={onPointerMove} className="lab-field relative aspect-[3/4] w-full md:aspect-[16/10]">
              <div className="lab-field__scan" aria-hidden="true" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {labLinks.map(([a, b]) => {
                  const pa = pos(byId[a]);
                  const pb = pos(byId[b]);
                  const on = a === activeId || b === activeId;
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={pa.x}
                      y1={pa.y}
                      x2={pb.x}
                      y2={pb.y}
                      vectorEffect="non-scaling-stroke"
                      className={`lab-link ${on ? 'is-on' : ''}`}
                    />
                  );
                })}
              </svg>

              {pulse > 0 &&
                neighbors.map((id) => {
                  const from = pos(active);
                  const to = pos(byId[id]);
                  return (
                    <span
                      key={`${pulse}-${id}`}
                      className="lab-pulse"
                      aria-hidden="true"
                      style={vars({ '--x1': `${from.x}%`, '--y1': `${from.y}%`, '--x2': `${to.x}%`, '--y2': `${to.y}%` })}
                    />
                  );
                })}

              <ul className="absolute inset-0" aria-label="Nodos del laboratorio">
                {labNodes.map((n) => {
                  const p = pos(n);
                  const isActive = n.id === activeId;
                  const linked = neighbors.includes(n.id);
                  return (
                    <li key={n.id} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                      <button
                        type="button"
                        onClick={() => select(n.id)}
                        aria-pressed={isActive}
                        className={`lab-node lab-node--${n.kind === 'físico' ? 'phys' : n.kind === 'digital' ? 'dig' : 'ai'} ${isActive ? 'is-active' : ''} ${linked ? 'is-linked' : ''}`}
                      >
                        <span className="lab-node__core" aria-hidden="true" />
                        <span className="lab-node__label">{n.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-frost-600" aria-hidden="true">
                <span className="text-crimson-300">■</span> físico <span className="ml-3 text-volt-300">■</span> digital{' '}
                <span className="ml-3 text-frost-200">■</span> inteligencia
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-6">
            <div className="lab-panel" aria-live="polite">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">
                Lectura del nodo · <span className="text-crimson-300">{active.kind}</span>
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">{active.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-frost-200">{active.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-frost-600">Entradas</dt>
                  {active.inputs.map((x) => (
                    <dd key={x} className="mt-1 text-frost-200">
                      ↘ {x}
                    </dd>
                  ))}
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-frost-600">Salidas</dt>
                  {active.outputs.map((x) => (
                    <dd key={x} className="mt-1 text-frost-200">
                      ↗ {x}
                    </dd>
                  ))}
                </div>
              </dl>
              <button type="button" onClick={emit} className="lab-emit mt-7">
                <span className="lab-emit__ring" aria-hidden="true" />
                Emitir pulso
              </button>
            </div>
            <div className="lab-log" aria-label="Registro del laboratorio">
              {log.map((line, i) => (
                <p key={`${line}-${i}`} className={i === 0 ? 'text-frost-200' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
