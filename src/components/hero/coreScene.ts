import { clamp, TAU } from '../../lib/math';

/**
 * Núcleo robótico abstracto renderizado con una proyección 3D propia sobre Canvas 2D:
 * carcasa icosaédrica metálica con caras abiertas, núcleo de energía, anillos orbitales
 * con pulsos de luz y fragmentos metálicos en órbita. ~0 KB de dependencias.
 */

type V3 = [number, number, number];

const RED = '255,38,56';
const BLUE = '23,105,255';
const WHITE = '234,242,255';
const INK_LIGHT = '12,16,28';

/* --- Geometría ---------------------------------------------------------- */

const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_RAW: V3[] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const ICO_LEN = Math.hypot(1, PHI);
const ICO: V3[] = ICO_RAW.map((v) => [v[0] / ICO_LEN, v[1] / ICO_LEN, v[2] / ICO_LEN]);
const ICO_EDGE = 2 / ICO_LEN;

const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const isEdge = (i: number, j: number) => Math.abs(dist(ICO[i], ICO[j]) - ICO_EDGE) < 1e-6;

const ICO_EDGES: [number, number][] = [];
const ICO_FACES: [number, number, number][] = [];
for (let i = 0; i < 12; i++) {
  for (let j = i + 1; j < 12; j++) {
    if (!isEdge(i, j)) continue;
    ICO_EDGES.push([i, j]);
    for (let k = j + 1; k < 12; k++) if (isEdge(i, k) && isEdge(j, k)) ICO_FACES.push([i, j, k]);
  }
}
/** Caras abiertas de la carcasa: dejan ver el núcleo de energía. */
const OPEN_FACES = new Set([1, 6, 11, 14, 17]);

const OCTA: V3[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const OCTA_FACES: [number, number, number][] = [];
for (const x of [0, 1]) for (const y of [2, 3]) for (const z of [4, 5]) OCTA_FACES.push([x, y, z]);

const RINGS = [
  { r: 1.55, tx: 1.22, tz: 0.25, color: RED, speed: 0.0011, pulses: 2, alpha: 0.85, dashed: true },
  { r: 1.9, tx: 1.78, tz: -0.5, color: BLUE, speed: -0.0008, pulses: 3, alpha: 0.85, dashed: false },
  { r: 2.3, tx: 0.92, tz: 0.9, color: WHITE, speed: 0.0005, pulses: 1, alpha: 0.32, dashed: false },
];

const SHARDS = Array.from({ length: 7 }, (_, i) => ({
  orbit: 2.55 + (i % 3) * 0.25,
  phase: (i / 7) * TAU,
  speed: 0.00018 + (i % 4) * 0.00005,
  lift: ((i % 5) - 2) * 0.35,
  size: 0.1 + (i % 3) * 0.05,
  spin: 0.0008 + (i % 3) * 0.0004,
}));

const LIGHT: V3 = (() => {
  const v: V3 = [-0.45, -0.6, -0.66];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

/* --- Matemática ----------------------------------------------------------- */

function rotate(v: V3, ax: number, ay: number): V3 {
  const cy = Math.cos(ay);
  const sy = Math.sin(ay);
  const cx = Math.cos(ax);
  const sx = Math.sin(ax);
  const x = v[0] * cy + v[2] * sy;
  const z = -v[0] * sy + v[2] * cy;
  const y = v[1];
  return [x, y * cx - z * sx, y * sx + z * cx];
}

function tilt(v: V3, tx: number, tz: number): V3 {
  const c = Math.cos(tx);
  const s = Math.sin(tx);
  const y = v[1] * c - v[2] * s;
  const z = v[1] * s + v[2] * c;
  const cz = Math.cos(tz);
  const sz = Math.sin(tz);
  return [v[0] * cz - y * sz, v[0] * sz + y * cz, z];
}

function faceNormal(a: V3, b: V3, c: V3): V3 {
  const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v: V3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const l = Math.hypot(...n) || 1;
  return [n[0] / l, n[1] / l, n[2] / l];
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Color metálico con iluminación difusa y luz de borde roja (izq.) / azul (der.). */
function metal(n: V3, alpha: number) {
  const diffuse = clamp(dot(n, LIGHT));
  const rim = Math.pow(1 - Math.abs(n[2]), 2.2);
  const base = 16 + 78 * diffuse;
  const left = n[0] < 0;
  const r = base + rim * (left ? 190 : 12);
  const g = base * 1.04 + rim * (left ? 18 : 70);
  const b = base * 1.18 + rim * (left ? 40 : 230);
  return `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
}

/* --- Dibujo -------------------------------------------------------------- */

export function drawCore(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  view: { x: number; y: number },
  light = false,
) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const S = Math.min(w, h) * 0.19;
  const F = 5;
  const ay = t * 0.00022 + view.x * 0.6;
  const ax = -0.32 + view.y * 0.4 + Math.sin(t * 0.0004) * 0.06;
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.0026);

  const project = (v: V3, scale = 1): [number, number, number] => {
    const s = F / (F + v[2] * scale);
    return [cx + v[0] * S * scale * s, cy + v[1] * S * scale * s, v[2]];
  };

  // Halo de fondo
  const halo = ctx.createRadialGradient(cx, cy, S * 0.4, cx, cy, S * 3);
  halo.addColorStop(0, `rgba(${BLUE},0.16)`);
  halo.addColorStop(0.5, `rgba(${RED},0.05)`);
  halo.addColorStop(1, `rgba(${BLUE},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  // Anillos: se dividen en mitad trasera / delantera para ordenar profundidad con la carcasa.
  const ringPass = (front: boolean) => {
    ctx.lineCap = 'round';
    for (const ring of RINGS) {
      const seg = 120;
      ctx.beginPath();
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * TAU;
        const a1 = ((i + 1) / seg) * TAU;
        const p0 = rotate(tilt([Math.cos(a0) * ring.r, 0, Math.sin(a0) * ring.r], ring.tx, ring.tz), ax, ay);
        const p1 = rotate(tilt([Math.cos(a1) * ring.r, 0, Math.sin(a1) * ring.r], ring.tx, ring.tz), ax, ay);
        if ((p0[2] + p1[2] <= 0) !== front) continue;
        const [x0, y0] = project(p0);
        const [x1, y1] = project(p1);
        if (ring.dashed && i % 6 > 3) continue;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      const ringColor = light && ring.color === WHITE ? INK_LIGHT : ring.color;
      ctx.strokeStyle = `rgba(${ringColor},${ring.alpha * (front ? 1 : 0.32)})`;
      ctx.lineWidth = front ? 1.4 : 1;
      ctx.stroke();

      for (let k = 0; k < ring.pulses; k++) {
        const a = t * ring.speed + (k * TAU) / ring.pulses;
        const p = rotate(tilt([Math.cos(a) * ring.r, 0, Math.sin(a) * ring.r], ring.tx, ring.tz), ax, ay);
        if ((p[2] <= 0) !== front) continue;
        const [x, y] = project(p);
        const glowR = S * (front ? 0.22 : 0.14);
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        g.addColorStop(0, `rgba(${ring.color},${front ? 0.9 : 0.4})`);
        g.addColorStop(1, `rgba(${ring.color},0)`);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${front ? 0.95 : 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, front ? 2.2 : 1.4, 0, TAU);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  };

  // Fragmentos metálicos en órbita
  const shards = SHARDS.map((s) => {
    const o = s.phase + t * s.speed;
    const center = rotate([Math.cos(o) * s.orbit, s.lift, Math.sin(o) * s.orbit], ax, ay);
    return { s, center };
  });
  const drawShard = ({ s, center }: (typeof shards)[number]) => {
    const verts = OCTA.map((v) => {
      const r = rotate(v, t * s.spin, t * s.spin * 1.3);
      return [center[0] + r[0] * s.size, center[1] + r[1] * s.size * 1.6, center[2] + r[2] * s.size] as V3;
    });
    const faces = OCTA_FACES.map((f) => {
      const n = faceNormal(verts[f[0]], verts[f[1]], verts[f[2]]);
      const c: V3 = [
        (verts[f[0]][0] + verts[f[1]][0] + verts[f[2]][0]) / 3 - center[0],
        (verts[f[0]][1] + verts[f[1]][1] + verts[f[2]][1]) / 3 - center[1],
        (verts[f[0]][2] + verts[f[1]][2] + verts[f[2]][2]) / 3 - center[2],
      ];
      const out: V3 = dot(n, c) < 0 ? [-n[0], -n[1], -n[2]] : n;
      return { f, n: out };
    });
    for (const { f, n } of faces) {
      if (n[2] > 0) continue;
      const pts = f.map((i) => project(verts[i]));
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      ctx.lineTo(pts[1][0], pts[1][1]);
      ctx.lineTo(pts[2][0], pts[2][1]);
      ctx.closePath();
      ctx.fillStyle = metal(n, 0.95);
      ctx.fill();
      ctx.strokeStyle = 'rgba(234,242,255,0.14)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
  };

  // Carcasa exterior
  const shellScale = 1 + pulse * 0.015;
  const shell = ICO.map((v) => rotate(v, ax, ay));
  const shellFaces = ICO_FACES.map((f, index) => {
    const a = shell[f[0]];
    const b = shell[f[1]];
    const c = shell[f[2]];
    let n = faceNormal(a, b, c);
    const centroid: V3 = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
    if (dot(n, centroid) < 0) n = [-n[0], -n[1], -n[2]];
    return { f, n, z: centroid[2], open: OPEN_FACES.has(index) };
  });
  const tri = (f: [number, number, number], scale: number) => {
    const pts = f.map((i) => project(shell[i], scale));
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.closePath();
  };

  // 1 · fondo
  ringPass(false);
  shards.filter((s) => s.center[2] > 0).forEach(drawShard);

  // 2 · caras traseras de la carcasa (estructura interior)
  ctx.lineWidth = 0.8;
  for (const face of shellFaces) {
    if (face.n[2] <= 0) continue;
    tri(face.f, shellScale);
    ctx.strokeStyle = 'rgba(107,157,255,0.16)';
    ctx.stroke();
  }

  // 3 · núcleo interior: icosaedro en contra-rotación
  const inner = ICO.map((v) => rotate(v, -ax * 1.4 + t * 0.0007, -ay * 1.6));
  ctx.strokeStyle = `rgba(${BLUE},0.75)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [i, j] of ICO_EDGES) {
    const [x0, y0] = project(inner[i], 0.5);
    const [x1, y1] = project(inner[j], 0.5);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
  }
  ctx.stroke();

  // 4 · energía del núcleo
  ctx.globalCompositeOperation = 'lighter';
  const coreR = S * (0.78 + pulse * 0.08);
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  core.addColorStop(0, 'rgba(255,255,255,0.95)');
  core.addColorStop(0.16, `rgba(${RED},0.85)`);
  core.addColorStop(0.5, `rgba(${BLUE},0.35)`);
  core.addColorStop(1, `rgba(${BLUE},0)`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, TAU);
  ctx.fill();
  for (const v of inner) {
    const [x, y] = project(v, 0.5);
    ctx.fillStyle = `rgba(${RED},0.9)`;
    ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
  }
  ctx.globalCompositeOperation = 'source-over';

  // 5 · caras frontales metálicas (las abiertas solo como bordes de luz)
  const front = shellFaces.filter((f) => f.n[2] <= 0).sort((a, b) => b.z - a.z);
  for (const face of front) {
    tri(face.f, shellScale);
    if (face.open) {
      ctx.strokeStyle = face.n[0] < 0 ? `rgba(${RED},${0.55 + pulse * 0.4})` : `rgba(${BLUE},${0.6 + pulse * 0.35})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      continue;
    }
    ctx.fillStyle = metal(face.n, 0.93);
    ctx.fill();
    ctx.strokeStyle = 'rgba(234,242,255,0.2)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 6 · primer plano
  shards.filter((s) => s.center[2] <= 0).forEach(drawShard);
  ringPass(true);
}
