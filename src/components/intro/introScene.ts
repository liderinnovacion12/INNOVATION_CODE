import { clamp, easeInOutCubic, easeOutCubic, easeOutExpo, lerp, TAU } from '../../lib/math';

/**
 * Escena de la intro (colores del logo: cian #00B9F9 y azul #0057D3) (canvas 2D, sin dependencias). Cada partícula tiene una
 * posición que es función pura del tiempo, así la animación es estable ante
 * cambios de tamaño y no acumula estado entre fotogramas.
 *
 *  0 ─ T1  convergencia: partículas cian (izq.) y azules (der.) en espiral al centro
 * T1 ─ T2  singularidad: órbita comprimida + ondas cian/azul que colisionan
 * T2 ─ T3  expansión: onda expansiva, destello y reorganización en anillos orbitales
 */
export const T1 = 1500;
export const T2 = 1950;
export const T3 = 3700;

const CYAN = '0,185,249';
const BLUE = '0,87,211';
const BLUE_LIGHT = '92,156,255';
/** Color de contraste: blanco frío en oscuro, navy del logo en claro (se fija en drawScene). */
let WHITE = '234,242,255';
const RING_FACTOR = [0.7, 0.88, 1.06];
const RING_SPEED = [0.00016, -0.00011, 0.00007];
const ringColor = (i: number) => [CYAN, BLUE, WHITE][i];
const GLYPHS = ['{', '}', '</>', '01', '=>', '[]', ';', '#', 'fn', '0x', '&&', '//'];

interface Particle {
  hue: 0 | 1;
  kind: 0 | 1 | 2; // 0 punto con estela · 1 glifo de código · 2 fragmento geométrico
  theta: number;
  spin: number;
  delay: number;
  end: number;
  burstAng: number;
  burstDist: number;
  ring: number;
  ringAng: number;
  size: number;
  phase: number;
  rot: number;
  glyph: string;
}

export interface Scene {
  particles: Particle[];
  rings: Particle[][];
}

export function createScene(w: number, h: number): Scene {
  const count = Math.round(clamp((w * h) / 4000, 140, 420));
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i % 2) as 0 | 1;
    const r = Math.random();
    particles.push({
      hue,
      kind: r < 0.08 ? 1 : r < 0.14 ? 2 : 0,
      theta: (hue === 0 ? Math.PI : 0) + (Math.random() - 0.5) * Math.PI * 1.15,
      spin: (hue === 0 ? 1 : -1) * (0.6 + Math.random() * 1.2),
      delay: Math.random() * 420,
      end: 2 + Math.random() * 16,
      burstAng: Math.random() * TAU,
      burstDist: 0.35 + Math.random() * 0.75,
      ring: Math.floor(Math.random() * 3),
      ringAng: Math.random() * TAU,
      size: 0.6 + Math.random() * 1.6,
      phase: Math.random() * TAU,
      rot: Math.random() * TAU,
      glyph: GLYPHS[i % GLYPHS.length],
    });
  }
  const rings = [0, 1, 2].map((ring) =>
    particles.filter((p) => p.ring === ring && p.kind === 0).sort((a, b) => a.ringAng - b.ringAng),
  );
  return { particles, rings };
}

interface Point {
  x: number;
  y: number;
  alpha: number;
}
const cur: Point = { x: 0, y: 0, alpha: 0 };
const prev: Point = { x: 0, y: 0, alpha: 0 };

function locate(p: Particle, t: number, w: number, h: number, out: Point) {
  const cx = w / 2;
  const cy = h / 2;
  const m = Math.min(w, h);

  if (t < T1) {
    const pr = clamp((t - p.delay) / (T1 - p.delay));
    const e = pr * pr * pr;
    const r = lerp(Math.hypot(w, h) * 0.62, p.end, e);
    const a = p.theta + p.spin * e;
    out.x = cx + Math.cos(a) * r;
    out.y = cy + Math.sin(a) * r;
    out.alpha = clamp(pr * 5);
    return;
  }
  if (t < T2) {
    const q = (t - T1) / (T2 - T1);
    const r = p.end * (1 - 0.85 * q);
    const a = p.theta + p.spin + (t - T1) * 0.02 * (p.hue === 0 ? 1 : -1);
    out.x = cx + Math.cos(a) * r;
    out.y = cy + Math.sin(a) * r;
    out.alpha = 1;
    return;
  }
  const u = clamp((t - T2) / (T3 - T2));
  const burst = easeOutExpo(clamp(u * 2.2)) * p.burstDist * m * 0.8;
  const bx = cx + Math.cos(p.burstAng) * burst;
  const by = cy + Math.sin(p.burstAng) * burst;
  const landscape = w >= h;
  const base = m * 0.45 * RING_FACTOR[p.ring];
  const rx = base * (landscape ? 1.55 : 1);
  const ry = base * (landscape ? 0.7 : 1.3);
  const ang = p.ringAng + (t - T2) * RING_SPEED[p.ring];
  const k = easeInOutCubic(clamp((u - 0.25) / 0.75));
  out.x = lerp(bx, cx + Math.cos(ang) * rx, k);
  out.y = lerp(by, cy + Math.sin(ang) * ry, k);
  out.alpha = 1 - 0.35 * k;
}

function drawCore(ctx: CanvasRenderingContext2D, cx: number, cy: number, m: number, t: number) {
  let r: number;
  let a: number;
  if (t < T1) {
    const p = t / T1;
    r = 6 + m * 0.06 * p * p;
    a = 0.15 + 0.5 * p;
  } else if (t < T2) {
    const q = (t - T1) / (T2 - T1);
    r = m * 0.06 + m * 0.05 * q + Math.sin(t * 0.05) * 4;
    a = 0.65 + 0.35 * q;
  } else {
    const u = easeOutCubic(clamp((t - T2) / 1100));
    r = lerp(m * 0.75, m * 0.42, u);
    a = lerp(0.9, 0.16, u) + Math.sin(t * 0.0016) * 0.02;
  }
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, `rgba(${WHITE},${a})`);
  g.addColorStop(0.18, `rgba(${CYAN},${a * 0.75})`);
  g.addColorStop(0.55, `rgba(${BLUE},${a * 0.35})`);
  g.addColorStop(1, `rgba(${BLUE},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fill();
}

/** Dos frentes de energía (rojo desde la izquierda, azul desde la derecha) que chocan en el centro. */
function drawWaves(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number, t: number) {
  const start = T1 - 300;
  if (t < start || t > T2) return;
  const e = Math.pow((t - start) / (T2 - start), 2);
  const R = h * 0.85;
  const span = 0.5;
  ctx.lineCap = 'round';
  for (const side of [-1, 1] as const) {
    const front = side < 0 ? lerp(-40, cx, e) : lerp(w + 40, cx, e);
    const ccx = front + side * R;
    const a0 = side < 0 ? -span : Math.PI - span;
    const col = side < 0 ? CYAN : BLUE;
    ctx.strokeStyle = `rgba(${col},0.14)`;
    ctx.lineWidth = 34 * e + 6;
    ctx.beginPath();
    ctx.arc(ccx, cy, R, a0, a0 + span * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(${col},0.9)`;
    ctx.lineWidth = 1.5 + 3 * e;
    ctx.beginPath();
    ctx.arc(ccx, cy, R, a0, a0 + span * 2);
    ctx.stroke();
  }
}

function drawRingLinks(ctx: CanvasRenderingContext2D, scene: Scene, w: number, h: number, t: number) {
  if (t < T2 + 700) return;
  const a = clamp((t - T2 - 700) / 900) * 0.22;
  const maxD = Math.min(w, h) * 0.16;
  ctx.lineWidth = 0.7;
  scene.rings.forEach((ring, i) => {
    ctx.strokeStyle = `rgba(${ringColor(i)},${a})`;
    ctx.beginPath();
    for (let j = 0; j < ring.length; j++) {
      locate(ring[j], t, w, h, cur);
      locate(ring[(j + 1) % ring.length], t, w, h, prev);
      if (Math.hypot(cur.x - prev.x, cur.y - prev.y) < maxD) {
        ctx.moveTo(cur.x, cur.y);
        ctx.lineTo(prev.x, prev.y);
      }
    }
    ctx.stroke();
  });
}

function drawParticles(ctx: CanvasRenderingContext2D, scene: Scene, w: number, h: number, t: number) {
  const fast = t < T2 + 900;
  ctx.lineCap = 'round';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of scene.particles) {
    locate(p, t, w, h, cur);
    if (cur.alpha <= 0.01) continue;
    const col = p.hue === 0 ? CYAN : p.kind === 1 ? BLUE_LIGHT : BLUE;
    const a = cur.alpha * (t > T3 ? 0.65 + 0.35 * Math.sin(t * 0.003 + p.phase) : 1);

    if (p.kind === 0) {
      if (fast) {
        locate(p, t - 55, w, h, prev);
        ctx.strokeStyle = `rgba(${col},${a * 0.55})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(cur.x, cur.y);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(${col},${a})`;
      ctx.fillRect(cur.x - p.size, cur.y - p.size, p.size * 2, p.size * 2);
    } else if (p.kind === 1) {
      ctx.fillStyle = `rgba(${col},${a * 0.85})`;
      ctx.fillText(p.glyph, cur.x, cur.y);
    } else {
      const s = 3 + p.size * 3;
      const r = p.rot + t * 0.003;
      ctx.strokeStyle = `rgba(${col},${a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k < 3; k++) {
        const ang = r + (k * TAU) / 3;
        const x = cur.x + Math.cos(ang) * s;
        const y = cur.y + Math.sin(ang) * s;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function drawShockwaves(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, t: number) {
  const waves: [number, string][] = [
    [T2, CYAN],
    [T2 + 110, BLUE],
    [T2 + 260, WHITE],
  ];
  const maxR = Math.hypot(w, h) * 0.65;
  for (const [start, col] of waves) {
    const s = (t - start) / 1200;
    if (s <= 0 || s >= 1) continue;
    const R = easeOutCubic(s) * maxR;
    ctx.lineWidth = (1 - s) * 16 + 0.5;
    ctx.strokeStyle = `rgba(${col},${(1 - s) * 0.85})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.92, 0, 0, TAU);
    ctx.stroke();
  }
}

export function drawScene(ctx: CanvasRenderingContext2D, scene: Scene, w: number, h: number, t: number, light = false) {
  WHITE = light ? '11,29,55' : '234,242,255';
  const cx = w / 2;
  const cy = h / 2;
  const m = Math.min(w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
  drawCore(ctx, cx, cy, m, t);
  drawWaves(ctx, w, h, cx, cy, t);
  drawRingLinks(ctx, scene, w, h, t);
  drawParticles(ctx, scene, w, h, t);
  drawShockwaves(ctx, cx, cy, w, h, t);
  ctx.globalCompositeOperation = 'source-over';
  if (t >= T2 && t < T2 + 450) {
    const a = Math.pow(1 - (t - T2) / 450, 2) * 0.75;
    ctx.fillStyle = light ? `rgba(${CYAN},${a * 0.3})` : `rgba(${WHITE},${a})`;
    ctx.fillRect(0, 0, w, h);
  }
}
