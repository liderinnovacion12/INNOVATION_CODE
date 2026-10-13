import { useRef, type MutableRefObject } from 'react';
import { hero } from '../../config/site';
import { useCanvasLoop } from '../../hooks/useCanvasLoop';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useMedia';
import { useTheme } from '../../hooks/useTheme';
import { drawCore } from './coreScene';

/** Objeto 3D del hero: canvas animado + etiquetas HUD. Se pausa fuera de pantalla. */
export function CoreVisual({ pointer }: { pointer: MutableRefObject<{ x: number; y: number }> }) {
  const reduced = useReducedMotion();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wrapRef, inView] = useInView<HTMLDivElement>();
  const view = useRef({ x: 0, y: 0 });

  useCanvasLoop(
    canvasRef,
    (ctx, { w, h, t }) => {
      const v = view.current;
      v.x += (pointer.current.x - v.x) * 0.05;
      v.y += (pointer.current.y - v.y) * 0.05;
      drawCore(ctx, w, h, reduced ? 2400 : t, v, theme === 'light');
    },
    { animate: inView && !reduced, redrawKey: theme },
  );

  return (
    <div ref={wrapRef} className="core-visual relative mx-auto aspect-square w-full max-w-[640px]">
      <div className="core-visual__orbit" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Núcleo robótico abstracto con anillos orbitales y pulsos de luz rojos y azules"
      />
      <ul className="pointer-events-none absolute inset-0" aria-hidden="true">
        {hero.hud.map((item, i) => (
          <li key={item.label} className={`hud hud--${i}`}>
            <span className="hud__line" />
            <span className="hud__label">{item.label}</span>
            <span className="hud__value">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
