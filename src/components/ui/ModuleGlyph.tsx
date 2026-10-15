import { useId, useMemo } from 'react';
import { mulberry32 } from '../../lib/math';

const GRID = 5;
const STEP = 100 / (GRID + 1);

/**
 * Firma visual generativa por módulo (en lugar de iconos convencionales):
 * un circuito sobre una matriz 5×5 trazado a partir de una semilla.
 */
export function ModuleGlyph({ seed, active = false, className = '' }: { seed: number; active?: boolean; className?: string }) {
  const id = useId();
  const { path, start, end } = useMemo(() => {
    const rand = mulberry32(seed);
    let x = Math.floor(rand() * GRID);
    let y = Math.floor(rand() * GRID);
    const pts: [number, number][] = [[x, y]];
    const visited = new Set([`${x},${y}`]);
    const dirs: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    for (let i = 0; i < 9; i++) {
      const options = dirs
        .map(([dx, dy]) => [x + dx, y + dy] as [number, number])
        .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < GRID && ny < GRID && !visited.has(`${nx},${ny}`));
      if (!options.length) break;
      [x, y] = options[Math.floor(rand() * options.length)];
      visited.add(`${x},${y}`);
      pts.push([x, y]);
    }
    const toXY = ([px, py]: [number, number]) => [STEP * (px + 1), STEP * (py + 1)] as const;
    return {
      path: pts.map((p, i) => `${i ? 'L' : 'M'}${toXY(p).join(' ')}`).join(' '),
      start: toXY(pts[0]),
      end: toXY(pts[pts.length - 1]),
    };
  }, [seed]);

  return (
    <svg viewBox="0 0 100 100" className={`glyph ${active ? 'is-active' : ''} ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B9F9" />
          <stop offset="1" stopColor="#0057D3" />
        </linearGradient>
      </defs>
      {Array.from({ length: GRID * GRID }, (_, i) => (
        <circle key={i} cx={STEP * ((i % GRID) + 1)} cy={STEP * (Math.floor(i / GRID) + 1)} r="1.1" className="glyph__dot" />
      ))}
      <path d={path} className="glyph__trace" stroke={`url(#${id}-g)`} pathLength={100} />
      <circle cx={start[0]} cy={start[1]} r="4" className="glyph__node glyph__node--a" />
      <circle cx={end[0]} cy={end[1]} r="4" className="glyph__node glyph__node--b" />
    </svg>
  );
}
