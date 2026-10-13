import { useCallback, useEffect, useRef, useState } from 'react';
import { company } from '../../config/site';
import { useCanvasLoop } from '../../hooks/useCanvasLoop';
import { useReducedMotion } from '../../hooks/useMedia';
import { LogoMark } from '../ui/LogoMark';
import { ScrambleText } from '../ui/ScrambleText';
import { createScene, drawScene, T2, T3, type Scene } from './introScene';

/** Tiempos de revelado del texto (ms) y avance automático si no hay interacción. */
const STAGES = [T2 + 100, T2 + 800, T2 + 1350];
const AUTO_ENTER = 7000;

export default function Intro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const exitingRef = useRef(false);
  const [stage, setStage] = useState(reduced ? 3 : 0);
  const [exiting, setExiting] = useState(false);

  const exit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    window.setTimeout(onDone, reduced ? 250 : 900);
  }, [onDone, reduced]);

  useCanvasLoop(
    canvasRef,
    (ctx, { w, h, t }) => {
      sceneRef.current ??= createScene(w, h);
      // Con movimiento reducido se pinta solo el estado final, estático.
      drawScene(ctx, sceneRef.current, w, h, reduced ? T3 + 600 : t);
    },
    { animate: !reduced, maxDpr: 1.5 },
  );

  useEffect(() => {
    if (reduced) {
      setStage(3);
      const id = window.setTimeout(exit, 4500);
      return () => window.clearTimeout(id);
    }
    const ids = STAGES.map((at, i) => window.setTimeout(() => setStage(i + 1), at));
    ids.push(window.setTimeout(exit, AUTO_ENTER));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [reduced, exit]);

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exit]);

  return (
    <div
      className={`intro force-dark ${exiting ? 'intro--exit' : ''} ${reduced ? 'intro--reduced' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Introducción · ${company.legalName}`}
    >
      <div className={`intro__grid ${stage >= 1 ? 'is-on' : ''}`} aria-hidden="true" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <LogoMark className={`intro__logo h-14 w-14 sm:h-16 sm:w-16 ${stage >= 1 ? 'is-on' : ''}`} />
        <p className="mt-6 font-display font-bold uppercase leading-none tracking-[0.04em] text-frost">
          <ScrambleText
            text={company.brandTop}
            active={stage >= 1}
            reduced={reduced}
            className="text-[clamp(2rem,7.5vw,5.75rem)]"
          />
          <span className={`intro__sub mt-3 block text-[clamp(0.85rem,2.2vw,1.35rem)] ${stage >= 1 ? 'is-on' : ''}`}>
            {company.brandBottom}
          </span>
        </p>
        <p className={`intro__fade mt-8 max-w-md text-base text-frost-200 sm:text-lg ${stage >= 2 ? 'is-on' : ''}`}>
          {company.tagline}
        </p>
        <div className="mt-10 h-12">
          {stage >= 3 && (
            <button type="button" onClick={exit} className="intro__enter">
              <span className="intro__enter-dot" aria-hidden="true" />
              Entrar al sistema
            </button>
          )}
        </div>
      </div>

      <button ref={skipRef} type="button" onClick={exit} className="intro__skip">
        Omitir intro <span aria-hidden="true">⟶</span>
        <span className="sr-only"> (o pulsa Escape)</span>
      </button>
      <div className="intro__boot" aria-hidden="true">
        <span>SYS.BOOT</span>
        <span className="intro__bar">
          <span />
        </span>
      </div>
    </div>
  );
}
