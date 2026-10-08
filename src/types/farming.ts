export type CropId = 'cassava' | 'maize' | 'rice' | 'tomatoes';
export type ProductId = 'garri' | 'milledRice' | 'tomatoPaste' | 'maizeFeed';
export type ResourceId = CropId | ProductId;
export type FarmStatus = 'EMPTY' | 'PLANTED' | 'GROWING' | 'READY_TO_HARVEST';

export interface CropDefinition {
  id: CropId;
  name: string;
  emoji: string;
  role: string;
  growthMs: number;
  harvestAmount: number;
  value: number;
  futureProducts: string;
}

export interface FarmState {
  status: FarmStatus;
  cropId: CropId | null;
  plantedAt: number | null;
}

export type ResourceInventory = Record<ResourceId, number>;
export type FarmStates = Record<string, FarmState>;
