export interface TilePoint { x: number; y: number }
export interface Footprint { w: number; h: number }
export interface TileRect { position: TilePoint; footprint: Footprint }

export type TerrainType = 'GRASS' | 'RED_EARTH' | 'ROAD_TARRED' | 'ROAD_EARTH' | 'WATER' | 'FARMLAND';

export type BuildingCategory =
  | 'RESIDENTIAL' | 'EDUCATION' | 'HEALTHCARE' | 'MARKET' | 'WATER' | 'ELECTRICITY' | 'GOVERNMENT' | 'AGRICULTURAL';

export type BuildingKind = 'HOUSE' | 'SCHOOL' | 'CLINIC' | 'MARKET' | 'BOREHOLE' | 'POWER' | 'LG_OFFICE' | 'PROCESSING' | 'STORAGE' | 'SOLAR' | 'BIOGAS';

export interface InfoStat { label: string; value: string }

export interface BuildingDefinition {
  id: string;
  kind: BuildingKind;
  name: string;
  category: BuildingCategory;
  description: string;
  position: TilePoint;
  footprint: Footprint;
  level: number;
  unlocked: boolean;
  status: string;
  stats: InfoStat[];
  /** Visual variation only (roof/wall colours). */
  variant?: number;
}

export type SoilType = 'RED_EARTH' | 'LOAM';

export interface FarmPlot extends TileRect {
  id: string;
  name: string;
  soil: SoilType;
  unlocked: boolean;
  description: string;
}

export type RoadSurface = 'TARRED' | 'EARTH';
export interface Road extends TileRect { id: string; surface: RoadSurface }

export type ResourceNodeKind = 'POND';
export interface ResourceNode extends TileRect { id: string; kind: ResourceNodeKind; name: string }

export type CommunityZoneType = 'RESIDENTIAL' | 'AGRICULTURAL' | 'CIVIC' | 'COMMERCIAL';
export interface CommunityZone extends TileRect { id: string; name: string; type: CommunityZoneType }
export interface ExpansionPlot extends TileRect {
  id: string;
  name: string;
  description: string;
  cost: number;
  developmentRequired: number;
}

export type DecorationKind = 'PALM' | 'TREE' | 'SHRUB' | 'BANANA' | 'POWER_POLE' | 'STALL' | 'KIOSK';
/** Positions are in pixels so decorations can sit off-grid. */
export interface Decoration { id: string; kind: DecorationKind; x: number; y: number; variant: number; scale: number }

/** Ambient life: people and vehicles follow these polylines (points in tile units, may be fractional). */
export interface Route {
  id: string;
  kind: 'VEHICLE' | 'PEDESTRIAN';
  points: TilePoint[];
  speed: number;
  count: number;
  facing?: 'E' | 'W' | 'N' | 'S';
  pingPong?: boolean;
}

export interface WorldDefinition {
  id: string;
  name: string;
  tileSize: number;
  cols: number;
  rows: number;
  roads: Road[];
  redEarth: TileRect[];
  buildings: BuildingDefinition[];
  farmPlots: FarmPlot[];
  resources: ResourceNode[];
  zones: CommunityZone[];
  expansionPlots: ExpansionPlot[];
  decorations: Decoration[];
  routes: Route[];
}

/** Display model for anything the player can select. */
export interface EntityInfo {
  id: string;
  title: string;
  categoryLabel: string;
  level?: number;
  status: string;
  description: string;
  stats: InfoStat[];
  icon: 'home' | 'school' | 'health' | 'market' | 'water' | 'power' | 'gov' | 'farm';
}
