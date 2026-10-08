import Phaser from 'phaser';
import { C } from './palette';
import { shade } from '../../utils/color';
import { mulberry32 } from '../../utils/rng';

type G = Phaser.GameObjects.Graphics;
type Pt = [number, number];

const BRIGHT = [0xe8743b, 0x2fa36b, 0xd7263d, 0xf2b705, 0x2f6fb0, 0x8e44ad, 0x1abc9c, 0xff8fab];
const WALLS = [C.cream, C.terracotta, 0xa8d5ba, 0x8fc1d9, 0xe8a3a0, 0xf0d98c];

const poly = (g: G, pts: Pt[]) => {
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath(); g.fillPath();
};
const line = (g: G, x1: number, y1: number, x2: number, y2: number) => {
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokePath();
};
const shadowE = (g: G, x: number, y: number, w: number, h: number) => { g.fillStyle(0x000000, 0.2); g.fillEllipse(x, y, w, h); };

/** Hipped corrugated roof: back slope, hips, front slope, ridge cap, rust streaks and eave shadow. */
function roof(g: G, x: number, y: number, w: number, h: number, color: number, seed = 1) {
  const inset = Math.min(h * 0.8, w * 0.18), ridge = y + h * 0.4;
  g.fillStyle(shade(color, 0.72), 1); poly(g, [[x + 2, y], [x + w - 2, y], [x + w - inset, ridge], [x + inset, ridge]]);
  g.fillStyle(shade(color, 0.86), 1);
  poly(g, [[x + 2, y], [x + inset, ridge], [x - 4, y + h]]); poly(g, [[x + w - 2, y], [x + w - inset, ridge], [x + w + 4, y + h]]);
  g.fillStyle(color, 1); poly(g, [[x - 4, y + h], [x + w + 4, y + h], [x + w - inset, ridge], [x + inset, ridge]]);
  const n = Math.max(5, Math.floor(w / 9));
  g.lineStyle(1, 0x000000, 0.16);
  for (let i = 1; i < n; i++) { const t = i / n; line(g, x - 4 + (w + 8) * t, y + h, x + inset + (w - 2 * inset) * t, ridge); }
  const r = mulberry32(seed * 31 + Math.floor(x));
  g.lineStyle(2, 0x5a2a14, 0.2);
  for (let k = 0; k < 3; k++) { const t = r(); line(g, x - 4 + (w + 8) * t, y + h, x + inset + (w - 2 * inset) * t, ridge + (y + h - ridge) * (0.2 + 0.4 * r())); }
  g.lineStyle(2, shade(color, 1.25), 0.9); line(g, x + inset, ridge, x + w - inset, ridge);
  g.fillStyle(0x000000, 0.28); g.fillRect(x - 4, y + h, w + 8, 4);
}
function wall(g: G, x: number, y: number, w: number, h: number, color: number) {
  g.fillStyle(color, 1); g.fillRect(x, y, w, h);
  g.fillStyle(0x000000, 0.1); g.fillRect(x, y + h - 5, w, 5);
  g.fillStyle(0xffffff, 0.12); g.fillRect(x, y + 5, w, 2);
}
function win(g: G, x: number, y: number, w: number, h: number) {
  g.fillStyle(0x24343a, 1); g.fillRect(x, y, w, h);
  g.fillStyle(C.waterLight, 0.75); g.fillRect(x + 2, y + 2, w - 4, h - 4);
  g.lineStyle(1, 0x24343a, 1); line(g, x + w / 2, y, x + w / 2, y + h);
  g.fillStyle(0x000000, 0.2); g.fillRect(x - 1, y + h, w + 2, 2);
}
function door(g: G, x: number, y: number, w: number, h: number, color = 0x5b3a29) {
  g.fillStyle(color, 1); g.fillRect(x, y, w, h);
  g.fillStyle(0x000000, 0.25); g.fillRect(x + w - 4, y + h / 2, 2, 2);
}
function compound(g: G, w: number, h: number, ground: number = C.yard) {
  g.fillStyle(ground, 1); g.fillRect(0, 0, w, h);
  g.lineStyle(5, C.wallEdge, 1); g.strokeRect(3, 3, w - 6, h - 6);
  g.lineStyle(1, 0x000000, 0.3); g.strokeRect(0.5, 0.5, w - 1, h - 1);
}
function flag(g: G, x: number, bottom: number, height: number) {
  g.lineStyle(2, 0xdddddd, 1); line(g, x, bottom, x, bottom - height);
  const fy = bottom - height;
  g.fillStyle(C.naija, 1); g.fillRect(x + 1, fy, 8, 13);
  g.fillStyle(0xffffff, 1); g.fillRect(x + 9, fy, 8, 13);
  g.fillStyle(C.naija, 1); g.fillRect(x + 17, fy, 8, 13);
}
function awning(g: G, x: number, y: number, w: number, h: number, c1: number, c2: number) {
  const n = Math.max(2, Math.floor(w / 5));
  for (let i = 0; i < n; i++) { g.fillStyle(i % 2 ? c2 : c1, 1); g.fillRect(x + (i * w) / n, y, w / n + 0.5, h); }
  g.fillStyle(0x000000, 0.2); g.fillRect(x, y + h, w, 2);
}
function parkedBike(g: G, x: number, y: number) {
  shadowE(g, x, y + 1, 26, 5);
  g.fillStyle(0x1b1b1b, 1); g.fillCircle(x - 9, y - 4, 4); g.fillCircle(x + 9, y - 4, 4);
  g.lineStyle(2, 0x2c3e50, 1); line(g, x - 9, y - 4, x - 1, y - 9); line(g, x - 1, y - 9, x + 9, y - 4); line(g, x + 5, y - 11, x + 9, y - 4);
  g.fillStyle(0xd7263d, 1); g.fillRect(x - 6, y - 12, 10, 3);
}

export function drawHouse(g: G, w: number, h: number, v: number) {
  const roofs = [C.rust, C.green, C.teal, C.brown, 0x7b3f2a];
  const wc = WALLS[v % 6], rc = roofs[(v * 2 + 1) % 5], fc = WALLS[(v + 2) % 6], layout = v % 3;
  g.fillStyle(C.yard, 1); g.fillRect(0, 0, w, h);
  g.fillStyle(0xb98355, 0.5); g.fillEllipse(w * 0.3, h * 0.8, 56, 18);
  g.fillStyle(0x6bb25a, 0.7); g.fillEllipse(w * 0.8, h * 0.84, 34, 14);
  g.lineStyle(6, fc, 1); g.strokeRect(3, 3, w - 6, h - 6);
  g.lineStyle(1, 0x000000, 0.3); g.strokeRect(0.5, 0.5, w - 1, h - 1);
  g.fillStyle(C.yard, 1); g.fillRect(w / 2 - 15, h - 8, 30, 9);
  g.fillStyle(shade(fc, 0.8), 1); g.fillRect(w / 2 - 19, h - 11, 8, 13); g.fillRect(w / 2 + 11, h - 11, 8, 13);
  g.fillStyle(shade(fc, 1.15), 1); g.fillRect(w / 2 - 20, h - 13, 10, 3); g.fillRect(w / 2 + 10, h - 13, 10, 3);
  g.fillStyle(0x3b4a54, 1); g.fillRect(w / 2 - 11, h - 6, 9, 4); g.fillRect(w / 2 + 2, h - 6, 9, 4);
  g.fillStyle(0x000000, 0.2); g.fillRect(20, 92, w - 28, 8);
  if (layout === 1) {
    wall(g, 16, 58, 74, 36, wc); roof(g, 16, 16, 74, 42, rc, v);
    wall(g, 86, 70, 42, 24, shade(wc, 0.94)); roof(g, 84, 46, 46, 24, shade(rc, 0.92), v + 3);
    door(g, 44, 68, 14, 26); win(g, 24, 70, 14, 12); win(g, 64, 70, 14, 12); win(g, 100, 74, 16, 12);
  } else {
    wall(g, 16, 56, w - 32, 38, wc); roof(g, 16, 12, w - 32, 44, rc, v);
    door(g, w / 2 - 8, 66, 16, 28); win(g, 28, 68, 18, 14); win(g, w - 46, 68, 18, 14);
    if (layout === 2) {
      g.lineStyle(4, shade(rc, 1.1), 1); line(g, 14, 96, w - 14, 96);
      g.lineStyle(3, 0xf1ece0, 1); [20, 52, w - 52, w - 20].forEach((x) => line(g, x, 96, x, 106));
    }
  }
  if (v % 2 === 0) {
    wall(g, w - 44, 102, 28, 16, [0xf2b705, 0x2fa36b, 0x2f6fb0][v % 3]);
    awning(g, w - 46, 96, 32, 8, 0xd7263d, 0xffffff);
    g.fillStyle(0xffffff, 1); g.fillRect(w - 40, 106, 10, 6);
  }
  if (v % 3 === 0) {
    g.lineStyle(2, 0x5a6770, 1); line(g, 22, 112, 22, 126); line(g, 34, 112, 34, 126);
    g.fillStyle(C.tank, 1); g.fillRoundedRect(18, 100, 20, 14, 5);
    g.fillStyle(0xffffff, 0.25); g.fillRect(21, 102, 14, 3);
  }
  if (v % 3 === 1) {
    g.lineStyle(2, 0x6b4a2f, 1); line(g, 22, 104, 22, 126); line(g, w - 70, 104, w - 70, 126); line(g, 22, 106, w - 70, 106);
    for (let i = 0; i < 5; i++) { g.fillStyle(BRIGHT[(v + i) % 8], 1); g.fillRect(28 + i * 12, 107, 9, 12); }
  }
  if (v % 4 === 2) parkedBike(g, 34, 130);
}

export function drawSchool(g: G, w: number, h: number) {
  compound(g, w, h, 0xd2a070);
  g.fillStyle(0x000000, 0.2); g.fillRect(16, 122, w - 52, 8);
  wall(g, 12, 70, w - 56, 54, C.cream);
  g.fillStyle(C.green, 0.9); g.fillRect(12, 112, w - 56, 12);
  roof(g, 12, 12, w - 56, 58, 0x2f7d5b, 3);
  for (let i = 0; i < 6; i++) if (i !== 2 && i !== 3) win(g, 26 + i * 38, 84, 20, 18);
  door(g, 12 + (w - 56) / 2 - 14, 84, 28, 40);
  g.lineStyle(4, 0xf1ece0, 1); line(g, 12, 126, w - 44, 126);
  [18, 80, 142, 204].forEach((x) => line(g, x, 126, x, 138));
  g.fillStyle(0x6bb25a, 1); g.fillRoundedRect(16, 148, 104, 36, 6);
  g.lineStyle(2, 0xffffff, 0.8); g.strokeRect(22, 152, 92, 28); line(g, 68, 152, 68, 180);
  g.fillStyle(0x7a4b2a, 1); g.fillRect(150, 156, 40, 6);
  flag(g, w - 28, h - 12, 80);
}

export function drawClinic(g: G, w: number, h: number) {
  compound(g, w, h);
  g.fillStyle(0x000000, 0.2); g.fillRect(18, 90, w - 28, 8);
  wall(g, 14, 48, w - 28, 44, C.white);
  g.fillStyle(C.naija, 1); g.fillRect(14, 82, w - 28, 6);
  roof(g, 14, 10, w - 28, 38, C.teal, 5);
  door(g, w / 2 - 12, 58, 24, 34, 0x3b5d6b);
  win(g, 26, 60, 22, 16); win(g, w - 48, 60, 22, 16);
  g.fillStyle(0xcfd4d8, 1); poly(g, [[w / 2 - 20, 108], [w / 2 + 20, 108], [w / 2 + 14, 92], [w / 2 - 14, 92]]);
  g.fillStyle(0xffffff, 1); g.fillRect(w - 44, 98, 26, 26);
  g.lineStyle(2, 0x3b4a54, 1); g.strokeRect(w - 44, 98, 26, 26);
  g.fillStyle(0xd7263d, 1); g.fillRect(w - 33, 102, 4, 18); g.fillRect(w - 40, 109, 18, 4);
  g.fillStyle(0x7a4b2a, 1); g.fillRect(20, 104, 30, 5); g.fillRect(22, 109, 3, 6); g.fillRect(45, 109, 3, 6);
}

export interface Stall { x: number; y: number; w: number; umbrella: boolean; color: number }

/** Deterministic stall layout shared by the renderer and the vendor placement. */
export function marketStalls(): Stall[] {
  const r = mulberry32(99), out: Stall[] = [];
  for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++)
    out.push({ x: 8 + col * 94 + (r() - 0.5) * 8, y: 44 + row * 70 + (r() - 0.5) * 4, w: 78 + r() * 10, umbrella: r() < 0.45, color: BRIGHT[Math.floor(r() * 8)] });
  return out;
}

export function drawMarket(g: G, w: number, h: number) {
  const r = mulberry32(17), produce = [0xf28c28, 0x6bbf4b, 0xc0392b, 0xf2b705, 0x8e5a3c, 0x7bc67e];
  g.fillStyle(0xd9a46a, 1); g.fillRect(0, 0, w, h);
  g.fillStyle(0xb98355, 0.35); g.fillEllipse(w * 0.5, 104, 150, 16);
  g.lineStyle(2, 0x000000, 0.12); g.strokeRect(1, 1, w - 2, h - 2);
  wall(g, 0, 14, w, 26, C.cream);
  for (let i = 0; i < 14; i++) { g.fillStyle(BRIGHT[(i * 3) % 8], 1); g.fillRect(6 + i * 20, 18, 13, 20); }
  roof(g, 0, 0, w, 18, C.rust, 9);
  for (const s of marketStalls()) {
    shadowE(g, s.x + s.w / 2, s.y + 56, s.w, 9);
    g.lineStyle(2, 0x5b3a29, 1); line(g, s.x + 6, s.y + 24, s.x + 6, s.y + 54); line(g, s.x + s.w - 6, s.y + 24, s.x + s.w - 6, s.y + 54);
    g.fillStyle(0x7a4b2a, 1); g.fillRect(s.x + 4, s.y + 34, s.w - 8, 16);
    for (let k = 0; k < 6; k++) { g.fillStyle(produce[Math.floor(r() * 6)], 1); g.fillCircle(s.x + 12 + (k * (s.w - 24)) / 5, s.y + 34, 5 + r() * 2); }
    [C.teal, 0x2fa36b, 0xe8743b].forEach((c, k) => { g.fillStyle(c, 1); g.fillEllipse(s.x + 14 + k * 20, s.y + 54, 14, 6); });
    if (s.umbrella) {
      g.fillStyle(s.color, 1); g.fillEllipse(s.x + s.w / 2, s.y + 10, 70, 28);
      g.fillStyle(0xffffff, 0.35); g.fillEllipse(s.x + s.w / 2 - 14, s.y + 8, 18, 20); g.fillEllipse(s.x + s.w / 2 + 14, s.y + 8, 18, 20);
      g.lineStyle(2, 0x000000, 0.25); g.strokeEllipse(s.x + s.w / 2, s.y + 10, 70, 28);
    } else {
      g.fillStyle(s.color, 1); poly(g, [[s.x, s.y + 26], [s.x + s.w, s.y + 26], [s.x + s.w - 6, s.y], [s.x + 6, s.y]]);
      g.fillStyle(0xffffff, 0.28); for (let k = 0; k < 5; k += 2) g.fillRect(s.x + 8 + (k * (s.w - 16)) / 5, s.y, (s.w - 16) / 5, 26);
      g.fillStyle(0x000000, 0.18); g.fillRect(s.x, s.y + 24, s.w, 3);
    }
  }
}

export function drawBorehole(g: G, w: number, h: number) {
  g.fillStyle(C.concrete, 1); g.fillRect(4, 58, w - 8, h - 62);
  g.fillStyle(0x000000, 0.12); g.fillRect(4, h - 8, w - 8, 4);
  g.fillStyle(C.waterLight, 0.9); g.fillEllipse(24, 82, 30, 9);
  g.lineStyle(3, 0x5a6770, 1); [24, 34, 60, 70].forEach((x) => line(g, x, 34, x, 66)); line(g, 24, 50, 70, 50);
  g.fillStyle(C.tank, 1); g.fillRoundedRect(18, 6, 58, 30, 9);
  g.fillStyle(0xffffff, 0.2); g.fillRoundedRect(22, 9, 50, 7, 3);
  g.lineStyle(2, 0x000000, 0.25); line(g, 30, 8, 30, 34); line(g, 64, 8, 64, 34);
  wall(g, 52, 60, 34, 26, C.cream); roof(g, 52, 50, 34, 12, 0x8c939a, 2); door(g, 64, 68, 10, 18);
}

export function drawPower(g: G, w: number, h: number) {
  g.fillStyle(C.concrete, 1); g.fillRect(4, 56, w - 8, h - 60);
  g.lineStyle(5, 0x6b4a2f, 1); line(g, 24, 8, 24, 66); line(g, 72, 8, 72, 66);
  g.lineStyle(3, 0x4a3422, 1); line(g, 10, 16, 86, 16);
  g.lineStyle(1, 0x222222, 1); line(g, 24, 16, 48, 34); line(g, 72, 16, 48, 34);
  g.fillStyle(0x7d8a93, 1); g.fillRoundedRect(36, 30, 24, 24, 4);
  g.lineStyle(1, 0x3b4a54, 1); for (let i = 0; i < 4; i++) line(g, 40 + i * 5, 32, 40 + i * 5, 52);
  g.fillStyle(0x2d5fa8, 1); poly(g, [[8, 92], [46, 92], [52, 72], [14, 72]]); poly(g, [[52, 92], [88, 92], [90, 72], [56, 72]]);
  g.lineStyle(1, 0xcfe3ff, 0.8);
  [[8, 92, 52, 72], [27, 92, 33, 72], [52, 92, 56, 72], [70, 92, 73, 72]].forEach(([a, b, c, d]) => line(g, a, b, c, d));
  g.fillStyle(C.gold, 1); g.fillRect(40, 60, 16, 8);
}

export function drawLGOffice(g: G, w: number, h: number) {
  compound(g, w, h, 0xe4d6bd);
  g.fillStyle(0xcdbb98, 1); g.fillRect(w / 2 - 20, 142, 40, h - 146);
  g.fillStyle(0x000000, 0.2); g.fillRect(20, 134, w - 40, 8);
  wall(g, 14, 40, 76, 40, C.white); roof(g, 14, 32, 76, 32, C.green, 4);
  wall(g, w - 90, 40, 76, 40, C.white); roof(g, w - 90, 32, 76, 32, C.green, 6);
  for (let i = 0; i < 3; i++) { win(g, 24 + i * 24, 52, 14, 14); win(g, w - 80 + i * 24, 52, 14, 14); }
  wall(g, 90, 66, w - 180, 68, C.white); roof(g, 90, 12, w - 180, 54, 0x1f6f4a, 7);
  g.fillStyle(C.cream, 1); poly(g, [[w / 2 - 66, 80], [w / 2 + 66, 80], [w / 2, 48]]);
  g.lineStyle(2, C.gold, 1); g.strokeTriangle(w / 2 - 66, 80, w / 2 + 66, 80, w / 2, 48);
  for (let i = 0; i < 4; i++) { g.fillStyle(0xffffff, 1); g.fillRect(w / 2 - 54 + i * 34, 82, 8, 50); g.fillStyle(0x000000, 0.12); g.fillRect(w / 2 - 49 + i * 34, 82, 3, 50); }
  g.fillStyle(0x5b3a29, 1); g.fillRect(w / 2 - 12, 96, 24, 38);
  g.fillStyle(0xd8cdb8, 1); g.fillRect(w / 2 - 52, 134, 104, 5); g.fillRect(w / 2 - 44, 139, 88, 4);
  flag(g, 34, 190, 110); flag(g, w - 58, 190, 110);
  g.fillStyle(C.naija, 1); g.fillRect(w / 2 - 60, h - 40, 120, 16);
  g.fillStyle(0xffffff, 1); [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => g.fillRect(w / 2 - 54 + i * 14, h - 36, 8, 8));
  g.fillStyle(0x3d8f3c, 1); [26, 64, w - 64, w - 28].forEach((x) => g.fillCircle(x, h - 24, 10));
}

function plant(g: G, crop: number, x: number, y: number, r: () => number) {
  switch (crop) {
    case 0:
      g.lineStyle(2, 0x6fbf4b, 1); line(g, x, y, x, y - 11 - r() * 4);
      g.fillStyle(0x58a845, 1); g.fillTriangle(x, y - 8, x - 7, y - 4, x, y - 6); g.fillTriangle(x, y - 11, x + 7, y - 7, x, y - 8);
      if (r() < 0.5) { g.fillStyle(0xf2d05b, 1); g.fillRect(x - 1, y - 16, 2, 4); }
      break;
    case 1:
      g.fillStyle(0x7a3f22, 1); g.fillEllipse(x, y - 1, 16, 7);
      g.fillStyle(0x4fa04a, 1); g.fillTriangle(x, y - 5, x - 6, y - 11, x - 1, y - 12); g.fillTriangle(x, y - 5, x + 6, y - 11, x + 1, y - 12); g.fillTriangle(x, y - 5, x - 2, y - 14, x + 2, y - 14);
      break;
    case 2:
      g.lineStyle(2, 0x7a5233, 1); line(g, x, y, x - 2, y - 16);
      g.fillStyle(0x3fa04a, 1); g.fillCircle(x - 3, y - 10, 3); g.fillCircle(x, y - 14, 3); g.fillCircle(x - 2, y - 17, 3);
      break;
    case 3:
      g.fillStyle(0x3f9a45, 1); g.fillCircle(x, y - 4, 4.5);
      if (r() < 0.5) { g.fillStyle(0xd7263d, 1); g.fillCircle(x + 2, y - 5, 1.6); }
      break;
    case 5:
      g.fillStyle(0x5cae4c, 1); g.fillEllipse(x, y - 3, 11, 5);
      break;
    default:
      if (r() < 0.1) { g.fillStyle(0x6fbf4b, 1); g.fillTriangle(x, y - 1, x + 3, y - 7, x + 6, y - 1); }
  }
}

export function drawFarmPlot(g: G, w: number, h: number, soil: 'RED_EARTH' | 'LOAM', idx: number) {
  const r = mulberry32(300 + idx), base = soil === 'RED_EARTH' ? C.soil[1] : C.soil[0], crop = idx % 6;
  g.fillStyle(shade(base, 0.82), 1); g.fillRoundedRect(-2, -2, w + 4, h + 4, 10);
  g.fillStyle(base, 1); g.fillRoundedRect(2, 2, w - 4, h - 4, 8);
  for (let y = 16; y < h - 8; y += 14) {
    g.lineStyle(5, C.soilDark, 0.5); line(g, 10, y, w - 10, y);
    g.lineStyle(2, 0xc47a4a, 0.5); line(g, 10, y - 3, w - 10, y - 3);
    const step = crop === 1 || crop === 2 ? 30 : 14;
    for (let x = 14 + r() * 8; x < w - 12; x += step) plant(g, crop, x, y, r);
  }

  for (let i = 0; i < 12; i++) { g.fillStyle(0x3f8a40, 1); g.fillCircle(r() * w, r() < 0.5 ? 1 : h - 1, 3 + r() * 3); }
}

export function drawProcessingBuilding(g: G, w: number, h: number, kind: 'PROCESSING' | 'STORAGE' | 'SOLAR' | 'BIOGAS') {
  shadowE(g, w / 2, h - 6, w * 0.8, 14);
  g.fillStyle(kind === 'SOLAR' ? 0x2f6fb0 : kind === 'BIOGAS' ? 0x6b8e45 : 0xb87542, 1);
  g.fillRoundedRect(4, 10, w - 8, h - 16, 8);
  g.fillStyle(0x6e3d2a, 1); g.fillRect(8, 4, w - 16, 16);
  g.fillStyle(0xf2b705, 1); g.fillRect(w / 2 - 9, h - 30, 18, 24);
  if (kind === 'SOLAR') {
    g.fillStyle(0x173f68, 1);
    for (let x = 12; x < w - 12; x += 24) g.fillRect(x, 24, 17, 12);
  } else {
    g.fillStyle(0xd9c08a, 1);
    g.fillCircle(w * 0.25, h * 0.55, 10); g.fillCircle(w * 0.75, h * 0.55, 10);
    g.lineStyle(3, 0x24343a, 1); g.lineBetween(w * 0.25, h * 0.55, w * 0.75, h * 0.55);
  }
}

export function drawPalm(g: G, x: number, y: number, v: number) {
  const lean = v === 1 ? -1 : 1;
  shadowE(g, x + 8, y + 2, 38, 10);
  g.lineStyle(5, 0x7a5233, 1); g.beginPath(); g.moveTo(x, y); g.lineTo(x + lean * (3 + v * 2), y - 24); g.lineTo(x + lean * (2 + v), y - 46); g.strokePath();
  g.lineStyle(1, 0x000000, 0.18); for (let i = 1; i < 6; i++) line(g, x + lean * i * 0.8 - 3, y - i * 8, x + lean * i * 0.8 + 3, y - i * 8);
  const cx = x + lean * (2 + v), cy = y - 46;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + v * 0.4, tx = cx + Math.cos(a) * 32, ty = cy + Math.sin(a) * 13 + 11;
    const mx = (cx + tx) / 2, my = (cy + ty) / 2 - 5;
    g.fillStyle(i % 2 ? 0x2f8f3f : 0x46ad52, 1);
    g.fillTriangle(cx, cy, tx, ty, mx + Math.sin(a) * 6, my - Math.cos(a) * 6);
    g.fillTriangle(cx, cy, tx, ty, mx - Math.sin(a) * 6, my + Math.cos(a) * 6);
  }
  g.fillStyle(v === 2 ? 0xd9822b : 0x6b4a2f, 1); g.fillCircle(cx - 2, cy + 3, 3); g.fillCircle(cx + 3, cy + 4, 3);
}

export function drawTree(g: G, x: number, y: number, v: number) {
  const dark = [0x2f7a3a, 0x3d8f3c, 0x5c9a3a][v % 3], light = [0x4da24a, 0x5fae4a, 0x7fb84a][v % 3];
  shadowE(g, x + 6, y + 2, 60, 15);
  g.fillStyle(0x6b4a2f, 1); g.fillRect(x - 4, y - 28, 8, 30);
  g.fillStyle(dark, 1); g.fillCircle(x - 15, y - 36, 16); g.fillCircle(x + 15, y - 36, 16); g.fillCircle(x, y - 52, 20);
  g.fillStyle(light, 1); g.fillCircle(x - 6, y - 56, 11); g.fillCircle(x + 14, y - 42, 8); g.fillCircle(x - 18, y - 42, 6);
  if (v === 1) { g.fillStyle(0xe8532b, 1); [[-12, -52], [8, -60], [18, -40], [-20, -36], [2, -44]].forEach(([dx, dy]) => g.fillCircle(x + dx, y + dy, 3)); }
}

export function drawShrub(g: G, x: number, y: number, v: number) {
  const c = [0x3f8f3f, 0x4fa04a, 0x6aa84f][v % 3];
  shadowE(g, x, y + 4, 24, 7);
  g.fillStyle(c, 1); g.fillCircle(x - 6, y, 7); g.fillCircle(x + 6, y, 7); g.fillCircle(x, y - 6, 8);
  if (v === 0) { g.fillStyle(0xff8fab, 1); g.fillCircle(x - 4, y - 5, 2); g.fillCircle(x + 5, y - 2, 2); }
}

export function drawBanana(g: G, x: number, y: number) {
  shadowE(g, x, y + 3, 30, 8);
  g.lineStyle(4, 0x8fae5a, 1); line(g, x, y, x, y - 18);
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI + (i / 4) * Math.PI, tx = x + Math.cos(a) * 24, ty = y - 18 + Math.sin(a) * 8 + 8;
    g.fillStyle(i % 2 ? 0x5fb046 : 0x74c456, 1); g.fillTriangle(x, y - 18, tx, ty, (x + tx) / 2, (y - 18 + ty) / 2 - 7);
  }
}

export function drawStall(g: G, x: number, y: number, v: number) {
  const c = [C.gold, 0x2fa36b, 0xe8743b][v % 3];
  shadowE(g, x, y + 2, 40, 8);
  g.lineStyle(2, 0x5b3a29, 1); line(g, x - 16, y - 18, x - 16, y); line(g, x + 16, y - 18, x + 16, y);
  g.fillStyle(0x7a4b2a, 1); g.fillRect(x - 17, y - 12, 34, 10);
  g.fillStyle(v % 2 ? 0xf28c28 : 0xc0392b, 1); [-9, 0, 9].forEach((d) => g.fillCircle(x + d, y - 14, 4));
  g.fillStyle(c, 1); poly(g, [[x - 20, y - 18], [x + 20, y - 18], [x + 15, y - 32], [x - 15, y - 32]]);
  g.fillStyle(0xffffff, 0.3); g.fillRect(x - 15, y - 32, 10, 14); g.fillRect(x + 5, y - 32, 10, 14);
}

export function drawKiosk(g: G, x: number, y: number, v: number) {
  const body = [0xf2b705, 0x2fa36b, 0x2f6fb0, 0xd7263d][v % 4];
  shadowE(g, x, y + 2, 44, 8);
  g.fillStyle(body, 1); g.fillRect(x - 18, y - 24, 36, 24);
  g.fillStyle(0x000000, 0.15); g.fillRect(x - 18, y - 5, 36, 5);
  g.fillStyle(0x24343a, 1); g.fillRect(x - 11, y - 18, 22, 11);
  g.fillStyle(0xffffff, 1); g.fillRect(x - 14, y - 26, 28, 5);
  g.fillStyle(0xe8743b, 1); [-8, 0, 8].forEach((d) => g.fillCircle(x + d, y - 9, 2));
  awning(g, x - 21, y - 22, 42, 6, 0xd7263d, 0xffffff);
}

export function drawPole(g: G, x: number, y: number) {
  g.lineStyle(4, 0x6b4a2f, 1); line(g, x, y, x, y - 54);
  g.lineStyle(3, 0x4a3422, 1); line(g, x - 10, y - 50, x + 10, y - 50);
}
