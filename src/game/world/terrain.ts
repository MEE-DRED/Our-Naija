import type { TerrainType, TileRect, WorldDefinition } from '../../types/world';

export function buildTerrainGrid(world: WorldDefinition): TerrainType[][] {
  const grid: TerrainType[][] = Array.from({ length: world.rows }, () => Array<TerrainType>(world.cols).fill('GRASS'));
  const paint = (r: TileRect, type: TerrainType) => {
    for (let y = r.position.y; y < r.position.y + r.footprint.h; y++)
      for (let x = r.position.x; x < r.position.x + r.footprint.w; x++)
        if (grid[y]?.[x] !== undefined) grid[y][x] = type;
  };
  world.redEarth.forEach((r) => paint(r, 'RED_EARTH'));
  world.farmPlots.forEach((f) => paint(f, 'FARMLAND'));
  world.resources.forEach((r) => paint(r, 'WATER'));
  world.roads.filter((r) => r.surface === 'EARTH').forEach((r) => paint(r, 'ROAD_EARTH'));
  world.roads.filter((r) => r.surface === 'TARRED').forEach((r) => paint(r, 'ROAD_TARRED'));
  return grid;
}
