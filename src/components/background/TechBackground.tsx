import { useEffect, useRef } from 'react';
import { useCanvasLoop } from '../../hooks/useCanvasLoop';
import { useFinePointer, useReducedMotion } from '../../hooks/useMedia';
import { useTheme } from '../../hooks/useTheme';
import { createTechScene, drawTechScene, type TechScene } from './techScene';

/**
 * Fondo animado global, fijo detrás del contenido. Reacciona al cursor (solo
 * escritorio) y al desplazamiento; con movimiento reducido queda estático.
 */
export function TechBackground() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<TechScene | null>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => (scroll.current = window.scrollY);
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, active: fine && !reduced };
    };
    const onLeave = () => (pointer.current.active = false);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [fine, reduced]);

  useCanvasLoop(
    canvasRef,
    (ctx, { w, h, t, dt }) => {
      const s = sceneRef.current;
      // se regenera solo si cambia mucho el tamaño (evita saltos al mostrar/ocultar la barra móvil)
      if (!s || Math.abs(s.w - w) > 80 || Math.abs(s.h - h) > 200) sceneRef.current = createTechScene(w, h);
      else {
        s.w = w;
        s.h = h;
      }
      drawTechScene(ctx, sceneRef.current!, {
        t: reduced ? 4000 : t,
        dt: reduced ? 0 : dt,
        scrollY: scroll.current,
        pointer: pointer.current,
        light: theme === 'light',
      });
    },
    { animate: !reduced, maxDpr: 1.5, redrawKey: theme },
  );

  return <canvas ref={canvasRef} className="tech-bg" aria-hidden="true" />;
}
