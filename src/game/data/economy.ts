import type { ResourceId, CropId } from '../../types/farming';

export const marketPrices: Record<CropId, number> = {
  cassava: 120, maize: 150, rice: 250, tomatoes: 180, yam: 280, millet: 170, sorghum: 180,
  cowpea: 230, groundnut: 260, soybean: 240, pepper: 210, okra: 190, onion: 220,
  leafyVegetables: 150, cocoa: 420, oilPalm: 360, cashew: 390,
};
export const productPrices: Record<Exclude<ResourceId, CropId>, number> = {
  garri: 220, fufu: 230, cassavaFlour: 260, starch: 280, milledRice: 380, packagedRice: 430,
  tomatoPaste: 340, tomatoSauce: 320, maizeFlour: 280, maizeMeal: 270, maizeFeed: 300,
};
export const marketPrice = (cropId: CropId, marketLevel = 1) =>
  Math.round(marketPrices[cropId] * (marketLevel >= 2 ? 1.05 : 1));

export const dynamicMarketPrice = (cropId: CropId, marketLevel = 1, priceIndex = 1) =>
  Math.round(marketPrice(cropId, marketLevel) * Math.max(0.75, Math.min(1.5, priceIndex)));

export const upgradeCosts: Record<string, number> = {
  'farm-1': 20_000,
  market: 25_000,
  borehole: 15_000,
  school: 18_000,
  clinic: 22_000,
  storage: 18_000,
  'solar-farm': 25_000,
  'biogas-plant': 22_000,
};

export const upgradeEffects: Record<string, string> = {
  'farm-1': '+1 farming capacity',
  market: '+5% crop sale value',
  borehole: '+3% water access',
  school: '+3% education',
  clinic: '+3% health access',
  storage: '+500 storage capacity',
  'solar-farm': '+30 electricity capacity',
  'biogas-plant': '+20 electricity capacity',
};

export const reserveCrops: readonly CropId[] = ['cassava', 'maize', 'rice'];
