const hash = (x: number, y: number, s: number) => {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const smooth = (t: number) => t * t * (3 - 2 * t);

export function valueNoise(x: number, y: number, seed = 1): number {
  const xi = Math.floor(x), yi = Math.floor(y), xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed), c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
/** Three-octave noise in roughly 0..1. */
export const fbm = (x: number, y: number, seed = 1): number =>
  valueNoise(x, y, seed) * 0.6 + valueNoise(x * 2.1, y * 2.1, seed + 1) * 0.3 + valueNoise(x * 4.3, y * 4.3, seed + 2) * 0.1;
