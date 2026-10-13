import type { ProjectVisualKind } from '../../config/site';

/** Composiciones vectoriales abstractas por tipo de proyecto (sin fotos de stock). */
export function ProjectVisual({ kind }: { kind: ProjectVisualKind }) {
  return (
    <svg viewBox="0 0 400 260" className="pv" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="260" className="pv__bg" />
      {kind === 'platform' && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${70 + i * 34} ${150 - i * 38}) skewY(-14)`}>
              <rect width="200" height="80" rx="6" className={i === 2 ? 'pv__panel pv__panel--hi' : 'pv__panel'} />
              {[0, 1, 2, 3, 4].map((b) => (
                <rect key={b} x={16 + b * 34} y={56 - ((b * 13 + i * 7) % 36)} width="18" height={8 + ((b * 13 + i * 7) % 36)} className={b === 3 && i === 2 ? 'pv__fill-red' : 'pv__fill-dim'} />
              ))}
            </g>
          ))}
          <circle cx="330" cy="58" r="5" className="pv__fill-blue pv-pulse" />
        </g>
      )}
      {kind === 'arm' && (
        <g>
          <path d="M60 220h280" className="pv__line" />
          <path d="M150 220a110 110 0 0 1 200-60" className="pv__dash pv-dash" />
          <rect x="120" y="196" width="60" height="24" rx="4" className="pv__panel" />
          <path d="M150 196 175 120 255 92" className="pv__arm" />
          <circle cx="150" cy="196" r="9" className="pv__joint" />
          <circle cx="175" cy="120" r="8" className="pv__joint pv__joint--red" />
          <circle cx="255" cy="92" r="7" className="pv__joint pv__joint--blue" />
          <path d="M255 92v26m-8 0h16" className="pv__line" />
          <rect x="300" y="196" width="24" height="24" className="pv__fill-red" />
        </g>
      )}
      {kind === 'portal' && (
        <g>
          <rect x="70" y="40" width="260" height="180" rx="10" className="pv__panel" />
          <path d="M70 66h260" className="pv__line" />
          <circle cx="86" cy="53" r="3" className="pv__fill-red" />
          <circle cx="98" cy="53" r="3" className="pv__fill-dim" />
          <rect x="88" y="84" width="104" height="58" rx="4" className="pv__panel pv__panel--hi" />
          <rect x="204" y="84" width="108" height="26" rx="4" className="pv__fill-dim" />
          <rect x="204" y="116" width="72" height="26" rx="4" className="pv__fill-dim" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={88 + i * 76} y="156" width="66" height="46" rx="4" className="pv__fill-dim" />
          ))}
          <path d="M262 170l10 26 5-10 11-3z" className="pv__fill-blue pv-float" />
        </g>
      )}
      {kind === 'flow' && (
        <g>
          <path d="M70 130h70M190 130c30 0 30-50 60-50h40M190 130c30 0 30 50 60 50h40" className="pv__dash pv-dash" />
          {[
            [40, 112],
            [140, 112],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={i ? 50 : 30} height="36" rx="6" className={i ? 'pv__panel pv__panel--hi' : 'pv__panel'} />
          ))}
          <rect x="290" y="62" width="70" height="36" rx="6" className="pv__panel" />
          <rect x="290" y="162" width="70" height="36" rx="6" className="pv__panel" />
          <circle cx="325" cy="80" r="5" className="pv__fill-blue" />
          <circle cx="325" cy="180" r="5" className="pv__fill-red pv-pulse" />
        </g>
      )}
      {kind === 'vision' && (
        <g>
          <polygon points="110,170 150,100 190,170" className="pv__panel" />
          <rect x="220" y="110" width="60" height="60" className="pv__panel" />
          <circle cx="320" cy="140" r="26" className="pv__panel" />
          <rect x="98" y="88" width="104" height="94" className="pv__box pv__box--blue" />
          <rect x="208" y="98" width="84" height="84" className="pv__box pv__box--red" />
          <text x="208" y="92" className="pv__label">defecto · 0.94</text>
          <path d="M60 0v260" className="pv__scan pv-scan" />
          <path d="M40 40h28M40 40v28M360 220h-28M360 220v-28" className="pv__line" />
        </g>
      )}
      {kind === 'twin' && (
        <g>
          {Array.from({ length: 7 }, (_, i) => (
            <path key={`h${i}`} d={`M${40 + i * 10} ${130 + i * 18}h${320 - i * 20}`} className="pv__grid" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`v${i}`} d={`M${80 + i * 30} 130L${40 + i * 40} 248`} className="pv__grid" />
          ))}
          {[
            [130, 150],
            [210, 180],
            [290, 160],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 20} y={y - 60} width="40" height="60" className="pv__panel" />
              <circle cx={x} cy={y - 74} r="4" className={`${i === 1 ? 'pv__fill-red' : 'pv__fill-blue'} pv-pulse`} />
            </g>
          ))}
          <path d="M130 90 210 120 290 100" className="pv__dash pv-dash" />
        </g>
      )}
    </svg>
  );
}
