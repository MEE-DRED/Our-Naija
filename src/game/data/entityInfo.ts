import type { BuildingCategory, BuildingDefinition, EntityInfo, FarmPlot, WorldDefinition } from '../../types/world';

const CATEGORY_LABEL: Record<BuildingCategory, string> = {
  RESIDENTIAL: 'Housing', EDUCATION: 'Education', HEALTHCARE: 'Healthcare', MARKET: 'Market',
  WATER: 'Water', ELECTRICITY: 'Electricity', GOVERNMENT: 'Local Administration', AGRICULTURAL: 'Agriculture',
};
const CATEGORY_ICON: Record<BuildingCategory, EntityInfo['icon']> = {
  RESIDENTIAL: 'home', EDUCATION: 'school', HEALTHCARE: 'health', MARKET: 'market',
  WATER: 'water', ELECTRICITY: 'power',   GOVERNMENT: 'gov', AGRICULTURAL: 'farm',
};

export const buildingToInfo = (b: BuildingDefinition): EntityInfo => ({
  id: b.id, title: b.name, categoryLabel: CATEGORY_LABEL[b.category], level: b.level,
  status: b.status, description: b.description, stats: b.stats, icon: CATEGORY_ICON[b.category],
});

export const farmPlotToInfo = (f: FarmPlot): EntityInfo => ({
  id: f.id, title: f.name, categoryLabel: 'Farm Plot', status: 'Available',
  description: f.description, icon: 'farm',
  stats: [{ label: 'Soil', value: f.soil === 'RED_EARTH' ? 'Red earth' : 'Loam' }, { label: 'Size', value: `${f.footprint.w * f.footprint.h} tiles` }],
});

/** Returns null for unknown ids so callers can fail gracefully. */
export function getEntityInfo(world: WorldDefinition, id: string | null): EntityInfo | null {
  if (!id) return null;
  const b = world.buildings.find((x) => x.id === id);
  if (b) return buildingToInfo(b);
  const f = world.farmPlots.find((x) => x.id === id);
  return f ? farmPlotToInfo(f) : null;
}
