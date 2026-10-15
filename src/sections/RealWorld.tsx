import { useEffect, useState, type CSSProperties } from 'react';
import { realWorldPipeline, realWorldProgram } from '../config/site';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useMedia';

const STEP_MS = 1800;

const joint = (deg: number, x: number, y: number): CSSProperties => ({
  transform: `rotate(${deg}deg)`,
  transformOrigin: `${x}px ${y}px`,
});

/** Brazo robótico en SVG sincronizado con la línea de código en ejecución. */
function RoboticArm({ step }: { step: number }) {
  const { shoulder, elbow, wrist, grip, scan } = realWorldProgram[step].pose;
  return (
    <svg viewBox="0 0 400 360" className="arm" role="img" aria-label={`Simulación de brazo robótico: ${realWorldProgram[step].log}`}>
      <defs>
        <linearGradient id="arm-metal" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2A3142" />
          <stop offset="1" stopColor="#11141C" />
        </linearGradient>
      </defs>
      <path d="M20 322h360" className="arm__floor" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${40 + i * 40} 322l-14 22`} className="arm__hatch" />
      ))}
      <rect x="296" y="300" width="58" height="22" rx="3" className="arm__belt" />
      <rect x="312" y="284" width="18" height="16" className={`arm__piece ${grip ? 'is-held' : ''}`} />

      <rect x="150" y="296" width="100" height="26" rx="5" fill="url(#arm-metal)" className="arm__stroke" />
      <circle cx="200" cy="280" r="24" fill="url(#arm-metal)" className="arm__stroke" />

      <g className="arm__seg" style={joint(shoulder, 200, 270)}>
        <rect x="187" y="160" width="26" height="114" rx="10" fill="url(#arm-metal)" className="arm__stroke" />
        <path d="M195 260V176" className="arm__cable" />
        <g className="arm__seg" style={joint(elbow, 200, 165)}>
          <rect x="194" y="156" width="100" height="18" rx="9" fill="url(#arm-metal)" className="arm__stroke" />
          <path d="M210 168h70" className="arm__cable arm__cable--blue" />
          <g className="arm__seg" style={joint(wrist, 290, 165)}>
            <rect x="282" y="160" width="16" height="26" rx="4" fill="url(#arm-metal)" className="arm__stroke" />
            <g className="arm__seg" style={{ transform: `translateX(${grip ? 4 : 0}px)` }}>
              <path d="M282 186v18l4 6" className="arm__finger" />
            </g>
            <g className="arm__seg" style={{ transform: `translateX(${grip ? -4 : 0}px)` }}>
              <path d="M298 186v18l-4 6" className="arm__finger" />
            </g>
            {scan && <path d="M290 212v110" className="arm__laser" />}
          </g>
          <circle cx="290" cy="165" r="7" className="arm__joint arm__joint--blue" />
        </g>
        <circle cx="200" cy="165" r="10" className="arm__joint arm__joint--red" />
      </g>
      <circle cx="200" cy="270" r="12" className="arm__joint" />
    </svg>
  );
}

export default function RealWorld() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const pose = realWorldProgram[step].pose;

  useEffect(() => {
    if (!inView || !playing || reduced) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % realWorldProgram.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [inView, playing, reduced]);

  const stage = Math.min(realWorldPipeline.length - 1, Math.floor((step / (realWorldProgram.length - 1)) * realWorldPipeline.length));

  return (
    <section id="mundo-real" aria-labelledby="mundo-real-title" className="section relative overflow-hidden">
      <div className="realworld-glow" aria-hidden="true" />
      <div className="shell relative">
        <SectionHeading
          id="mundo-real-title"
          index="06"
          label="Nuestro diferencial"
          title={
            <>
              Del código <span className="text-gradient">al mundo real.</span>
            </>
          }
          lead="No nos quedamos en la pantalla. Escribimos el software y lo llevamos al hardware: cada línea se convierte en lectura de sensores, decisiones y movimiento físico."
        />

        <Reveal className="mt-14">
          <div ref={ref} className="realworld grid lg:grid-cols-2">
            <div className="realworld__code force-dark">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="font-mono text-xs text-frost-400">celda_clasificacion.ts</span>
                <button
                  type="button"
                  className="chip chip--sm"
                  onClick={() => setPlaying((p) => !p)}
                  aria-pressed={!playing}
                  hidden={reduced}
                >
                  {playing ? 'Pausar' : 'Reanudar'}
                </button>
              </div>
              <ol className="py-4 font-mono text-[12.5px] leading-7 sm:text-[13px]" aria-label="Programa del robot. Selecciona una línea para ejecutarla.">
                {realWorldProgram.map((line, i) => (
                  <li key={line.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(i);
                        setPlaying(false);
                      }}
                      aria-current={i === step ? 'step' : undefined}
                      className={`code-line ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
                    >
                      <span className="code-line__n" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="code-line__src">{line.code}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <p className="border-t border-line px-5 py-3 font-mono text-xs text-brand-300" aria-live="polite">
                &gt; {realWorldProgram[step].log}
              </p>
            </div>

            <div className="realworld__stage">
              <RoboticArm step={step} />
              <dl className="realworld__telemetry" aria-label="Telemetría simulada">
                <div>
                  <dt>Hombro</dt>
                  <dd>{pose.shoulder}°</dd>
                </div>
                <div>
                  <dt>Codo</dt>
                  <dd>{pose.elbow}°</dd>
                </div>
                <div>
                  <dt>Muñeca</dt>
                  <dd>{pose.wrist}°</dd>
                </div>
                <div>
                  <dt>Pinza</dt>
                  <dd className={pose.grip ? 'text-accent-300' : 'text-brand-300'}>{pose.grip ? 'Cerrada' : 'Abierta'}</dd>
                </div>
              </dl>
              <p className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-frost-600">Simulación ilustrativa</p>
            </div>
          </div>

          <ol className="pipeline mt-6" aria-label="Del código al movimiento">
            {realWorldPipeline.map((p, i) => (
              <li key={p} className={i <= stage ? 'is-on' : ''}>
                <span className="font-mono text-[10px] text-frost-600">{String(i + 1).padStart(2, '0')}</span>
                {p}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
