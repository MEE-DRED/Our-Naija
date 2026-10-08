export type CropId = 'cassava' | 'maize' | 'rice' | 'tomatoes' | 'yam' | 'millet' | 'sorghum' | 'cowpea' | 'groundnut' | 'soybean' | 'pepper' | 'okra' | 'onion' | 'leafyVegetables' | 'cocoa' | 'oilPalm' | 'cashew';
export type ProductId = 'garri' | 'fufu' | 'cassavaFlour' | 'starch' | 'milledRice' | 'packagedRice' | 'tomatoPaste' | 'tomatoSauce' | 'maizeFlour' | 'maizeMeal' | 'maizeFeed';
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
  category?: string;
  waterRequirement?: number;
  baseMarketPrice?: number;
  foodValue?: number;
  preferredRegions?: string[];
}

export interface FarmState {
  status: FarmStatus;
  cropId: CropId | null;
  plantedAt: number | null;
}

export type ResourceInventory = Record<ResourceId, number>;
export type FarmStates = Record<string, FarmState>;
