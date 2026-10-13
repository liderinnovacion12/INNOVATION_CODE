import { useEffect, useRef } from 'react';
import type { ServiceModule } from '../../config/site';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useMedia';
import { ModuleGlyph } from './ModuleGlyph';

/**
 * Video del módulo: silenciado, en bucle y solo mientras está en pantalla.
 * Solo existe un <video> a la vez (el del módulo activo), así que nunca se
 * descargan los demás. Con movimiento reducido se muestra la imagen fija.
 * Los módulos sin video muestran su firma generativa.
 */
export function ServiceMedia({ mod }: { mod: ServiceModule }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const start = mod.video?.start ?? 0;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !reduced) v.play().catch(() => undefined);
    else v.pause();
  }, [inView, reduced, mod.id]);

  return (
    <div ref={ref} className="service-media force-dark">
      {mod.video ? (
        reduced ? (
          <img src={mod.video.poster} alt="" className="service-media__el" loading="lazy" />
        ) : (
          <video
            key={mod.id}
            ref={videoRef}
            className="service-media__el"
            poster={mod.video.poster}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            onLoadedMetadata={(e) => {
              if (start) e.currentTarget.currentTime = start;
            }}
            onEnded={(e) => {
              e.currentTarget.currentTime = start;
              e.currentTarget.play().catch(() => undefined);
            }}
          >
            <source src={mod.video.src} type="video/mp4" />
          </video>
        )
      ) : (
        <div className="service-media__fallback" aria-hidden="true">
          <ModuleGlyph seed={mod.seed} active className="h-24 w-24 sm:h-32 sm:w-32" />
        </div>
      )}
      <span className="service-media__code" aria-hidden="true">
        {mod.code}
      </span>
    </div>
  );
}
