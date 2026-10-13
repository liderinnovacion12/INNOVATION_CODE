import { useEffect, useRef } from 'react';
import { navSections } from '../../config/site';

/** Indicador de exploración: barra de progreso superior + raíl de secciones (escritorio). */
export function ScrollRail({ active }: { active: string }) {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
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
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
      <nav aria-label="Indicador de exploración" className="rail">
        <ol>
          {navSections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={`rail__item ${active === s.id ? 'is-active' : ''}`} aria-current={active === s.id ? 'location' : undefined}>
                <span className="rail__label">{s.label}</span>
                <span className="rail__index">{String(i).padStart(2, '0')}</span>
                <span className="rail__dot" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
