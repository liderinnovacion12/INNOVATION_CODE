import { TAU } from '../../lib/math';

/**
 * Fondo tecnológico animado (Canvas 2D):
 *  · red de nodos en deriva que se conecta entre sí y con el cursor
 *  · pistas de circuito ortogonales con pulsos de datos
 *  · fragmentos de código flotando hacia arriba
 * Todo en la paleta del logo y con parallax según el desplazamiento.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}
interface Trace {
  pts: [number, number][];
  len: number;
  speed: number;
  offset: number;
}
interface Token {
  text: string;
  x: number;
  y: number;
  speed: number;
  alpha: number;
  size: number;
}
export interface TechScene {
  w: number;
  h: number;
  nodes: Node[];
  traces: Trace[];
  tokens: Token[];
}

const SNIPPETS = [
  '<ICS />',
  'await robot.move(x, y)',
  'servo.rotate(45°)',
  'deploy --prod',
  '01101001',
  'sensor.read()',
  'fn main() {}',
  'const ai = model.predict()',
  'git push origin main',
  '{ status: 200 }',
  'MQTT › telemetry',
  'while (true) build()',
  '#include <motor.h>',
  'npm run build',
];

const CELL = 44;

function makeTrace(w: number, h: number): Trace {
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil((h * 1.6) / CELL);
  let x = Math.floor(Math.random() * cols) * CELL;
  let y = Math.floor(Math.random() * rows) * CELL;
  const pts: [number, number][] = [[x, y]];
  let dir = Math.floor(Math.random() * 4);
  const segs = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < segs; i++) {
    const steps = 2 + Math.floor(Math.random() * 5);
    // giros de 45° o 90°, como pistas de una placa de circuito
    const dirs: [number, number][] = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    const [dx, dy] = dirs[(dir * 2) % 8];
    x += dx * steps * CELL;
    y += dy * steps * CELL;
    pts.push([x, y]);
    dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
    if (Math.random() < 0.4) {
      const [ddx, ddy] = dirs[((dir * 2) % 8) + 1] ?? [1, 1];
      x += ddx * CELL;
      y += ddy * CELL;
      pts.push([x, y]);
    }
  }
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return { pts, len, speed: 0.05 + Math.random() * 0.08, offset: Math.random() * len };
}

export function createTechScene(w: number, h: number): TechScene {
  const area = w * h;
  const nodeCount = Math.round(Math.min(90, Math.max(36, area / 17000)));
  const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.012,
    vy: (Math.random() - 0.5) * 0.012,
    r: 1 + Math.random() * 1.6,
  }));
  const traces = Array.from({ length: Math.round(Math.min(16, Math.max(7, w / 110))) }, () => makeTrace(w, h));
  const tokens: Token[] = Array.from({ length: Math.round(Math.min(14, Math.max(6, w / 120))) }, (_, i) => ({
    text: SNIPPETS[i % SNIPPETS.length],
    x: Math.random() * w,
    y: Math.random() * h,
    speed: 0.006 + Math.random() * 0.01,
    alpha: 0.35 + Math.random() * 0.65,
    size: 11 + Math.round(Math.random() * 3),
  }));
  return { w, h, nodes, traces, tokens };
}

function pointAt(tr: Trace, d: number): [number, number] {
  let rest = ((d % tr.len) + tr.len) % tr.len;
  for (let i = 1; i < tr.pts.length; i++) {
    const [x0, y0] = tr.pts[i - 1];
    const [x1, y1] = tr.pts[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (rest <= seg) {
      const k = rest / seg;
      return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
    }
    rest -= seg;
  }
  return tr.pts[tr.pts.length - 1];
}

export interface TechFrame {
  t: number;
  dt: number;
  scrollY: number;
  pointer: { x: number; y: number; active: boolean };
  light: boolean;
}

export function drawTechScene(ctx: CanvasRenderingContext2D, s: TechScene, f: TechFrame) {
  const { w, h } = s;
  ctx.clearRect(0, 0, w, h);

  // Paleta del logo según el tema
  const line = f.light ? '0,87,211' : '92,156,255';
  const node = f.light ? '0,51,132' : '146,190,255';
  const pulse = '0,185,249';
  const code = f.light ? '11,29,55' : '146,190,255';
  const k = f.light ? 0.75 : 1;

  /* 1 · pistas de circuito (capa más profunda, parallax lento) */
  const traceShift = -f.scrollY * 0.12;
  const wrapH = h * 1.6;
  ctx.save();
  ctx.translate(0, ((traceShift % wrapH) + wrapH) % wrapH - wrapH * 0.3);
  ctx.lineWidth = 1;
  ctx.lineJoin = 'round';
  for (const tr of s.traces) {
    ctx.strokeStyle = `rgba(${line},${0.09 * k})`;
    ctx.beginPath();
    tr.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    // pads en los extremos
    const [sx, sy] = tr.pts[0];
    const [ex, ey] = tr.pts[tr.pts.length - 1];
    ctx.strokeStyle = `rgba(${line},${0.2 * k})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, TAU);
    ctx.moveTo(ex + 3, ey);
    ctx.arc(ex, ey, 3, 0, TAU);
    ctx.stroke();

    // pulso de datos con estela
    const d = tr.offset + f.t * tr.speed;
    const [px, py] = pointAt(tr, d);
    for (let j = 1; j <= 6; j++) {
      const [qx, qy] = pointAt(tr, d - j * 7);
      ctx.fillStyle = `rgba(${pulse},${(0.5 - j * 0.07) * k})`;
      ctx.fillRect(qx - 1, qy - 1, 2, 2);
    }
    const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
    g.addColorStop(0, `rgba(${pulse},${0.9 * k})`);
    g.addColorStop(1, `rgba(${pulse},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  /* 2 · fragmentos de código flotando hacia arriba */
  ctx.textBaseline = 'middle';
  for (const tk of s.tokens) {
    tk.y -= tk.speed * f.dt;
    if (tk.y < -30) {
      tk.y = h + 30;
      tk.x = Math.random() * w;
    }
    const y = tk.y - ((f.scrollY * 0.05) % h);
    const yy = y < -30 ? y + h + 60 : y;
    const fade = Math.min(1, Math.min(yy, h - yy) / 160);
    ctx.font = `500 ${tk.size}px "JetBrains Mono", monospace`;
    ctx.fillStyle = `rgba(${code},${0.13 * tk.alpha * Math.max(0, fade) * k})`;
    ctx.fillText(tk.text, tk.x, yy);
  }

  /* 3 · red de nodos (capa más cercana) */
  const maxD = Math.min(150, Math.max(110, w / 11));
  const nodeShift = -f.scrollY * 0.04;
  const pts: [number, number][] = [];
  for (const n of s.nodes) {
    n.x += n.vx * f.dt;
    n.y += n.vy * f.dt;
    if (n.x < -20) n.x = w + 20;
    if (n.x > w + 20) n.x = -20;
    if (n.y < -20) n.y = h + 20;
    if (n.y > h + 20) n.y = -20;
    let y = (n.y + nodeShift) % (h + 40);
    if (y < -20) y += h + 40;
    let x = n.x;
    // leve repulsión del cursor
    if (f.pointer.active) {
      const dx = x - f.pointer.x;
      const dy = y - f.pointer.y;
      const dd = Math.hypot(dx, dy);
      if (dd < 120 && dd > 0.1) {
        x += (dx / dd) * (120 - dd) * 0.18;
        y += (dy / dd) * (120 - dd) * 0.18;
      }
    }
    pts.push([x, y]);
  }
  ctx.lineWidth = 0.8;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (d > maxD) continue;
      ctx.strokeStyle = `rgba(${line},${(1 - d / maxD) * 0.22 * k})`;
      ctx.beginPath();
      ctx.moveTo(pts[i][0], pts[i][1]);
      ctx.lineTo(pts[j][0], pts[j][1]);
      ctx.stroke();
    }
    if (f.pointer.active) {
      const d = Math.hypot(pts[i][0] - f.pointer.x, pts[i][1] - f.pointer.y);
      if (d < 200) {
        ctx.strokeStyle = `rgba(${pulse},${(1 - d / 200) * 0.45 * k})`;
        ctx.beginPath();
        ctx.moveTo(pts[i][0], pts[i][1]);
        ctx.lineTo(f.pointer.x, f.pointer.y);
        ctx.stroke();
      }
    }
  }
  for (let i = 0; i < pts.length; i++) {
    const n = s.nodes[i];
    const tw = 0.55 + 0.45 * Math.sin(f.t * 0.0015 + i);
    ctx.fillStyle = i % 7 === 0 ? `rgba(${pulse},${0.85 * tw * k})` : `rgba(${node},${0.5 * tw * k})`;
    ctx.beginPath();
    ctx.arc(pts[i][0], pts[i][1], n.r, 0, TAU);
    ctx.fill();
  }
}
