const ch = (c: number) => [(c >> 16) & 255, (c >> 8) & 255, c & 255];
const pack = (r: number, g: number, b: number) =>
  (Math.max(0, Math.min(255, Math.round(r))) << 16) | (Math.max(0, Math.min(255, Math.round(g))) << 8) | Math.max(0, Math.min(255, Math.round(b)));

/** Linear blend of two 0xRRGGBB colours. */
export function mix(a: number, b: number, t: number): number {
  const [ar, ag, ab] = ch(a), [br, bg, bb] = ch(b);
  return pack(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}
/** Multiply brightness (f < 1 darker, f > 1 lighter). */
export function shade(c: number, f: number): number {
  const [r, g, b] = ch(c);
  return pack(r * f, g * f, b * f);
}
