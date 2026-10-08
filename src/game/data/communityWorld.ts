import type {
  BuildingDefinition, Decoration, FarmPlot, Road, ResourceNode, CommunityZone,
  Route, TileRect, WorldDefinition, ExpansionPlot,
} from '../../types/world';
import { mulberry32 } from '../../utils/rng';

const COLS = 60;
const ROWS = 45;
const T = 48;

const rect = (x: number, y: number, w: number, h: number): TileRect => ({ position: { x, y }, footprint: { w, h } });

const roads: Road[] = [
  { id: 'road-earth-n', surface: 'EARTH', ...rect(19, 0, 2, 30) },
  { id: 'road-earth-lane-n', surface: 'EARTH', ...rect(0, 6, 19, 1) },
  { id: 'road-earth-lane-s', surface: 'EARTH', ...rect(0, 23, 19, 1) },
  { id: 'road-earth-farm', surface: 'EARTH', ...rect(21, 6, 19, 1) },
  { id: 'road-expansion-north', surface: 'EARTH', ...rect(40, 6, 20, 1) },
  { id: 'road-expansion-east', surface: 'EARTH', ...rect(40, 32, 20, 1) },
  { id: 'road-main', surface: 'TARRED', ...rect(0, 14, 40, 2) },
];

const redEarth: TileRect[] = [rect(0, 11, 9, 2), rect(21, 11, 10, 2), rect(10, 27, 8, 3), rect(36, 13, 4, 1)];

const house = (n: number, x: number, y: number): BuildingDefinition => ({
  id: `house-${n}`, kind: 'HOUSE', name: `Family Compound ${n}`, category: 'RESIDENTIAL',
  description: 'A family compound home within the community.',
  position: { x, y }, footprint: { w: 3, h: 3 }, level: 1, unlocked: true, status: 'Occupied',
  stats: [{ label: 'Residents', value: String(3 + (n % 4)) }], variant: n,
});

const houses = [[3, 2], [8, 2], [13, 2], [3, 8], [8, 8], [13, 8], [3, 25], [8, 25], [13, 25]]
  .map(([x, y], i) => house(i + 1, x, y));

const civic: BuildingDefinition[] = [
  { id: 'school', kind: 'SCHOOL', name: 'Community School', category: 'EDUCATION',
    description: 'A community school serving local families.', position: { x: 4, y: 18 }, footprint: { w: 6, h: 4 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Capacity', value: '50 students' }] },
  { id: 'clinic', kind: 'CLINIC', name: 'Primary Health Clinic', category: 'HEALTHCARE',
    description: 'A small primary healthcare facility for everyday care.', position: { x: 12, y: 18 }, footprint: { w: 4, h: 3 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Capacity', value: '20 patients per day' }] },
  { id: 'market', kind: 'MARKET', name: 'Community Market', category: 'MARKET',
    description: 'The local trading centre where neighbours buy and sell.', position: { x: 22, y: 17 }, footprint: { w: 6, h: 4 },
    level: 1, unlocked: true, status: 'Open', stats: [{ label: 'Stalls', value: '6' }] },
  { id: 'lg-office', kind: 'LG_OFFICE', name: 'Local Government Office', category: 'GOVERNMENT',
    description: 'The community administration centre.', position: { x: 29, y: 17 }, footprint: { w: 7, h: 5 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Function', value: 'Local administration' }] },
  { id: 'borehole', kind: 'BOREHOLE', name: 'Borehole Water Point', category: 'WATER',
    description: 'A borehole with an elevated tank supplying clean water.', position: { x: 16, y: 17 }, footprint: { w: 2, h: 2 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Supply', value: 'Community water point' }] },
  { id: 'power', kind: 'POWER', name: 'Power Transformer', category: 'ELECTRICITY',
    description: 'A transformer and solar panels connecting the community to electricity.', position: { x: 17, y: 11 }, footprint: { w: 2, h: 2 },
    level: 1, unlocked: true, status: 'Connected', stats: [{ label: 'Supply', value: 'Grid and solar' }] },
  { id: 'garri-plant', kind: 'PROCESSING', name: 'Garri Processing Plant', category: 'AGRICULTURAL',
    description: 'A community cassava processing plant producing garri.', position: { x: 42, y: 16 }, footprint: { w: 5, h: 4 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Jobs', value: '6' }] },
  { id: 'rice-mill', kind: 'PROCESSING', name: 'Rice Mill', category: 'AGRICULTURAL',
    description: 'A small rice mill serving nearby farms.', position: { x: 49, y: 16 }, footprint: { w: 5, h: 4 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Jobs', value: '8' }] },
  { id: 'tomato-plant', kind: 'PROCESSING', name: 'Tomato Processing Facility', category: 'AGRICULTURAL',
    description: 'A tomato processing facility producing tomato paste.', position: { x: 42, y: 22 }, footprint: { w: 5, h: 4 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Jobs', value: '7' }] },
  { id: 'maize-plant', kind: 'PROCESSING', name: 'Maize Processing Facility', category: 'AGRICULTURAL',
    description: 'A maize facility producing meal and livestock feed.', position: { x: 49, y: 22 }, footprint: { w: 5, h: 4 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Jobs', value: '6' }] },
  { id: 'storage', kind: 'STORAGE', name: 'Community Storage', category: 'AGRICULTURAL',
    description: 'A dry store for raw crops and processed foods.', position: { x: 42, y: 29 }, footprint: { w: 6, h: 4 },
    level: 1, unlocked: true, status: 'Operational', stats: [{ label: 'Capacity', value: '500 units' }] },
  { id: 'solar-farm', kind: 'SOLAR', name: 'Community Solar Farm', category: 'ELECTRICITY',
    description: 'A modest solar installation supporting local processing.', position: { x: 50, y: 29 }, footprint: { w: 6, h: 4 },
    level: 1, unlocked: true, status: 'Generating', stats: [{ label: 'Capacity', value: '+30 electricity' }] },
  { id: 'biogas-plant', kind: 'BIOGAS', name: 'Farm Waste Biogas Plant', category: 'ELECTRICITY',
    description: 'Converts agricultural waste into useful electricity.', position: { x: 50, y: 36 }, footprint: { w: 6, h: 4 },
    level: 1, unlocked: true, status: 'Ready', stats: [{ label: 'Capacity', value: '+20 electricity' }] },
];

const farmPositions: [number, number, number, number][] = [
  [22, 2, 5, 4], [28, 2, 5, 4], [34, 2, 5, 4], [22, 7, 5, 4], [28, 7, 5, 4], [34, 7, 5, 4], [22, 24, 6, 4],
];
const farmPlots: FarmPlot[] = farmPositions.map(([x, y, w, h], i) => ({
  id: `farm-${i + 1}`, name: `Farm Plot ${i + 1}`, soil: i % 2 ? 'LOAM' : 'RED_EARTH', unlocked: true,
  description: 'Available for agricultural development.', ...rect(x, y, w, h),
}));

const resources: ResourceNode[] = [{ id: 'pond-1', kind: 'POND', name: 'Community Pond', ...rect(30, 24, 7, 5) }];

const zones: CommunityZone[] = [
  { id: 'zone-res', name: 'Residential Area', type: 'RESIDENTIAL', ...rect(2, 1, 15, 11) },
  { id: 'zone-agri', name: 'Farmland', type: 'AGRICULTURAL', ...rect(22, 2, 17, 9) },
  { id: 'zone-civic', name: 'Civic Centre', type: 'CIVIC', ...rect(29, 17, 7, 5) },
  { id: 'zone-market', name: 'Market Square', type: 'COMMERCIAL', ...rect(22, 17, 6, 4) },
  { id: 'zone-expansion-north', name: 'Northern Expansion', type: 'AGRICULTURAL', ...rect(42, 2, 15, 12) },
  { id: 'zone-expansion-east', name: 'Riverside Expansion', type: 'RESIDENTIAL', ...rect(42, 25, 15, 14) },
];

const expansionPlots: ExpansionPlot[] = [
  { id: 'expansion-north', name: 'Northern Farmland', description: 'Open land for future farms and food production.', cost: 30000, developmentRequired: 20, ...rect(43, 3, 12, 9) },
  { id: 'expansion-east', name: 'Riverside Residential Area', description: 'A new residential area beside the community waterway.', cost: 45000, developmentRequired: 40, ...rect(43, 27, 12, 10) },
];

function generateDecorations(): Decoration[] {
  const rnd = mulberry32(2026);
  const blocked: boolean[][] = Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(false));
  const block = (r: TileRect, pad: number) => {
    for (let y = r.position.y - pad; y < r.position.y + r.footprint.h + pad; y++)
      for (let x = r.position.x - pad; x < r.position.x + r.footprint.w + pad; x++)
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) blocked[y][x] = true;
  };
  roads.forEach((r) => block(r, 0));
  [...houses, ...civic].forEach((b) => block(b, 1));
  farmPlots.forEach((f) => block(f, 1));
  resources.forEach((r) => block(r, 1));
  block(rect(0, 13, COLS, 1), 0);
  block(rect(0, 16, COLS, 1), 0);

  const out: Decoration[] = [];
  const add = (kind: Decoration['kind'], count: number, tries: number) => {
    let placed = 0;
    for (let i = 0; i < tries && placed < count; i++) {
      const tx = Math.floor(rnd() * COLS);
      const ty = Math.floor(rnd() * ROWS);
      if (blocked[ty][tx]) continue;
      blocked[ty][tx] = true;
      out.push({ id: `${kind.toLowerCase()}-${out.length}`, kind, x: tx * T + T / 2, y: ty * T + T / 2 + 14, variant: Math.floor(rnd() * 3), scale: 0.75 + rnd() * 0.55 });
      placed++;
    }
  };
  add('PALM', 38, 600);
  add('TREE', 26, 600);
  add('BANANA', 10, 400);
  add('SHRUB', 70, 800);

  for (let x = 1; x < COLS; x += 4) out.push({ id: `pole-${x}`, kind: 'POWER_POLE', x: x * T + 10, y: 13 * T + 40, variant: 0, scale: 1 });
  [[22.4, 21.7], [23.9, 21.7], [25.4, 21.7]].forEach(([tx, ty], i) =>
    out.push({ id: `stall-${i}`, kind: 'STALL', x: tx * T, y: ty * T, variant: i, scale: 1 }));
  [3, 11, 24, 33].forEach((tx, i) =>
    out.push({ id: `kiosk-${i}`, kind: 'KIOSK', x: tx * T, y: 16 * T + 46, variant: i, scale: 1 }));
  return out;
}

const pt = (x: number, y: number) => ({ x, y });
const routes: Route[] = [
  { id: 'veh-main-east', kind: 'VEHICLE', facing: 'E', speed: 75, count: 5, points: [pt(-1.5, 14.7), pt(41.5, 14.7)] },
  { id: 'veh-main-west', kind: 'VEHICLE', facing: 'W', speed: 70, count: 5, points: [pt(41.5, 15.5), pt(-1.5, 15.5)] },
  { id: 'veh-ns-south', kind: 'VEHICLE', facing: 'S', speed: 55, count: 2, points: [pt(19.45, -1.5), pt(19.45, 31.5)] },
  { id: 'veh-ns-north', kind: 'VEHICLE', facing: 'N', speed: 55, count: 2, points: [pt(20.55, 31.5), pt(20.55, -1.5)] },
  { id: 'ped-north-lane', kind: 'PEDESTRIAN', pingPong: true, speed: 22, count: 3, points: [pt(1, 6.55), pt(18.5, 6.55)] },
  { id: 'ped-to-road', kind: 'PEDESTRIAN', pingPong: true, speed: 24, count: 3, points: [pt(18.55, 6.55), pt(18.55, 13.6), pt(33, 13.6)] },
  { id: 'ped-shoulder', kind: 'PEDESTRIAN', pingPong: true, speed: 26, count: 4, points: [pt(0.5, 14.1), pt(39.5, 14.1)] },
  { id: 'ped-south-lane', kind: 'PEDESTRIAN', pingPong: true, speed: 22, count: 3, points: [pt(1, 23.55), pt(18.5, 23.55)] },
  { id: 'ped-civic', kind: 'PEDESTRIAN', pingPong: true, speed: 22, count: 3, points: [pt(21.3, 22.4), pt(37, 22.4)] },
  { id: 'ped-farm-track', kind: 'PEDESTRIAN', pingPong: true, speed: 20, count: 2, points: [pt(21, 6.55), pt(38.5, 6.55)] },
  { id: 'ped-market', kind: 'PEDESTRIAN', pingPong: true, speed: 14, count: 5, points: [pt(22.5, 19.3), pt(27.4, 19.3)] },
  { id: 'ped-school', kind: 'PEDESTRIAN', pingPong: true, speed: 16, count: 3, points: [pt(4.5, 22.6), pt(9.5, 22.6)] },
  { id: 'ped-west', kind: 'PEDESTRIAN', pingPong: true, speed: 20, count: 2, points: [pt(1.5, 2), pt(1.5, 23)] },
];

export const communityWorld: WorldDefinition = {
  id: 'odo-ewa', name: 'Odo-Ewa', tileSize: T, cols: COLS, rows: ROWS,
  roads, redEarth, buildings: [...houses, ...civic], farmPlots, resources, zones,
  decorations: generateDecorations(), routes, expansionPlots,
};
