import Phaser from 'phaser';
import { shade } from '../../utils/color';

type G = Phaser.GameObjects.Graphics;
export type Facing = 'E' | 'W' | 'N' | 'S';
export type VehicleKind = 'KEKE' | 'OKADA' | 'CAR' | 'BUS';

export interface PersonStyle {
  shirt: number; bottom: number; skin: number; head: 'gele' | 'cap' | 'hair';
  headColor: number; skirt: boolean; carry: boolean; seated: boolean;
}

export const BRIGHTS = [0xe8743b, 0x2fa36b, 0xd7263d, 0xf2b705, 0x2f6fb0, 0x8e44ad, 0x1abc9c, 0xff8fab];
const SKINS = [0x5a3825, 0x6b4430, 0x4a2e1f, 0x7a5238];
const MEN_BOTTOMS = [0x2c3e50, 0x6b5b3e, 0x3b4a54, 0xf7f3ea];

const ln = (g: G, x1: number, y1: number, x2: number, y2: number) => {
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokePath();
};
const pick = <A>(rnd: () => number, a: readonly A[]): A => a[Math.floor(rnd() * a.length)];

export function randomStyle(rnd: () => number, seated = false): PersonStyle {
  const female = rnd() < 0.55;
  return {
    shirt: pick(rnd, BRIGHTS), bottom: female ? pick(rnd, BRIGHTS) : pick(rnd, MEN_BOTTOMS), skin: pick(rnd, SKINS),
    head: female ? 'gele' : rnd() < 0.5 ? 'cap' : 'hair', headColor: pick(rnd, BRIGHTS),
    skirt: female, carry: female && !seated && rnd() < 0.3, seated,
  };
}

/** Person with feet at (0,0). */
export function drawPerson(g: G, s: PersonStyle) {
  g.fillStyle(0x000000, 0.2); g.fillEllipse(0, 1, 13, 4);
  const hy = s.seated ? -19 : -25;
  if (s.seated) {
    g.fillStyle(s.bottom, 1); g.fillRoundedRect(-7, -6, 14, 6, 2);
    g.fillStyle(s.shirt, 1); g.fillRoundedRect(-5, -15, 10, 10, 2);
  } else {
    if (s.skirt) { g.fillStyle(s.bottom, 1); g.fillTriangle(-6, 0, 6, 0, 3.5, -11); g.fillTriangle(-6, 0, 3.5, -11, -3.5, -11); }
    else { g.lineStyle(3, s.bottom, 1); ln(g, -2, -1, -2, -11); ln(g, 2, -1, 2, -11); }
    g.fillStyle(s.shirt, 1); g.fillRoundedRect(-5, -21, 10, 12, 2);
    g.lineStyle(2.5, s.skin, 1); ln(g, -5, -19, -7, -12); ln(g, 5, -19, 7, -12);
  }
  g.fillStyle(s.skin, 1); g.fillCircle(0, hy, 4.5);
  if (s.head === 'gele') { g.fillStyle(s.headColor, 1); g.fillEllipse(0, hy - 4, 13, 7); }
  else if (s.head === 'cap') { g.fillStyle(s.headColor, 1); g.fillRect(-4.5, hy - 5, 9, 3.5); }
  else { g.fillStyle(0x1a1a1a, 1); g.fillEllipse(0, hy - 3, 9, 5); }
  if (s.carry) { g.fillStyle(0x8a5a2b, 1); g.fillEllipse(0, hy - 9, 12, 5); g.fillStyle(0xf2b705, 1); g.fillEllipse(0, hy - 11, 9, 4); }
}

export function drawHoe(g: G) {
  g.lineStyle(2, 0x7a5233, 1); ln(g, 7, -14, 18, -1);
  g.fillStyle(0x9aa0a6, 1); g.fillRect(16, -3, 7, 3);
}

const wheel = (g: G, x: number, y: number, r: number) => {
  g.fillStyle(0x1b1b1b, 1); g.fillCircle(x, y, r); g.fillStyle(0x9aa0a6, 1); g.fillCircle(x, y, r * 0.4);
};

function drawFront(g: G, kind: VehicleKind, facing: Facing, color: number) {
  const w = kind === 'BUS' ? 26 : kind === 'CAR' ? 22 : kind === 'KEKE' ? 16 : 7, h = 26;
  g.fillStyle(0x000000, 0.22); g.fillEllipse(0, 1, w + 10, 6);
  if (kind === 'OKADA') {
    g.fillStyle(0x222222, 1); g.fillRect(-2, -8, 4, 8);
    g.fillStyle(color, 1); g.fillRoundedRect(-5, -24, 10, 15, 2);
    g.fillStyle(0x5a3825, 1); g.fillCircle(0, -28, 4);
    g.fillStyle(0xf2b705, 1); g.fillEllipse(0, -30, 9, 5);
    return;
  }
  g.fillStyle(0x1b1b1b, 1); g.fillRect(-w / 2 - 1, -7, 3, 7); g.fillRect(w / 2 - 2, -7, 3, 7);
  g.fillStyle(color, 1); g.fillRoundedRect(-w / 2, -h, w, h - 4, 3);
  g.fillStyle(0xcfe9f5, 1);
  if (facing === 'S') g.fillRect(-w / 2 + 2, -h + 2, w - 4, 8);
  else { g.fillRect(-w / 2 + 3, -h + 3, w - 6, 5); g.fillStyle(0xd7263d, 1); g.fillRect(-w / 2 + 2, -8, 3, 3); g.fillRect(w / 2 - 5, -8, 3, 3); }
  if (kind === 'KEKE') { g.fillStyle(0x2c7a4f, 1); g.fillRect(-w / 2 - 1, -h - 3, w + 2, 4); }
}

/** Vehicle with its wheels on y = 0, drawn facing east then mirrored for west. */
export function drawVehicle(g: G, kind: VehicleKind, facing: Facing, color: number) {
  if (facing === 'N' || facing === 'S') { drawFront(g, kind, facing, color); return; }
  g.fillStyle(0x000000, 0.22); g.fillEllipse(0, 1, kind === 'BUS' ? 60 : 44, 8);
  switch (kind) {
    case 'KEKE':
      wheel(g, -10, -4, 5); wheel(g, 15, -3, 4);
      g.fillStyle(color, 1); g.fillRoundedRect(-16, -16, 34, 11, 3);
      g.fillStyle(0x2c7a4f, 1); g.fillRect(-17, -24, 28, 5);
      g.lineStyle(2, 0x2c7a4f, 1); ln(g, -15, -19, -15, -16); ln(g, 9, -19, 9, -16);
      g.fillStyle(0xcfe9f5, 1); g.fillRect(11, -22, 6, 8);
      g.fillStyle(0x1b1b1b, 1); g.fillRect(-4, -14, 8, 5);
      break;
    case 'OKADA':
      wheel(g, -11, -5, 5); wheel(g, 11, -5, 5);
      g.lineStyle(2.5, 0x333333, 1); ln(g, -11, -5, -2, -11); ln(g, -2, -11, 11, -5); ln(g, 6, -12, 9, -14);
      g.fillStyle(0x222222, 1); g.fillRoundedRect(-10, -12, 13, 3, 1);
      g.fillStyle(color, 1); g.fillRoundedRect(-4, -25, 7, 13, 2);
      g.fillStyle(0x5a3825, 1); g.fillCircle(0, -29, 4);
      g.fillStyle(0xf2b705, 1); g.fillEllipse(0, -31, 9, 5);
      g.lineStyle(2.5, 0x5a3825, 1); ln(g, 2, -21, 9, -14);
      break;
    case 'CAR':
      g.fillStyle(color, 1); g.fillRoundedRect(-22, -13, 44, 10, 3);
      g.fillStyle(shade(color, 1.12), 1); g.fillTriangle(-13, -13, -8, -22, 12, -22); g.fillTriangle(-13, -13, 12, -22, 17, -13);
      g.fillStyle(0xcfe9f5, 1); g.fillRect(-5, -21, 12, 7);
      wheel(g, -13, -3, 5.5); wheel(g, 13, -3, 5.5);
      break;
    case 'BUS':
      g.fillStyle(color, 1); g.fillRoundedRect(-28, -24, 56, 21, 3);
      g.fillStyle(0x1b1b1b, 1); g.fillRect(-28, -12, 56, 4);
      g.fillStyle(0xcfe9f5, 1); for (let i = 0; i < 5; i++) g.fillRect(-24 + i * 10, -21, 8, 8);
      g.lineStyle(2, 0x333333, 1); ln(g, -24, -27, 24, -27);
      wheel(g, -18, -3, 5.5); wheel(g, 18, -3, 5.5);
      break;
  }
  if (facing === 'W') g.setScale(-1, 1);
}
