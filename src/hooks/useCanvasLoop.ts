import { useEffect, useRef, type RefObject } from 'react';

export interface FrameInfo {
  w: number;
  h: number;
  /** Tiempo acumulado en ms (se conserva entre pausas). */
  t: number;
  dt: number;
}

type DrawFn = (ctx: CanvasRenderingContext2D, frame: FrameInfo) => void;

/**
 * Bucle de dibujo para canvas 2D: ajusta resolución (DPR limitado), se pausa cuando
 * `animate` es falso y en ese caso pinta un único fotograma estático.
 */
export function useCanvasLoop(
  canvasRef: RefObject<HTMLCanvasElement>,
  draw: DrawFn,
  { animate, maxDpr = 2, redrawKey }: { animate: boolean; maxDpr?: number; /** Fuerza un repintado al cambiar (p. ej. el tema). */ redrawKey?: unknown },
) {
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    let w = 0;
    let h = 0;
    let raf = 0;
    const paint = (dt: number) => drawRef.current(ctx, { w, h, t: timeRef.current, dt });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!animate) paint(0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (animate) {
      let last = performance.now();
      const loop = (now: number) => {
        const dt = Math.min(64, now - last);
        last = now;
        timeRef.current += dt;
        paint(dt);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [animate, maxDpr, canvasRef, redrawKey]);
}
