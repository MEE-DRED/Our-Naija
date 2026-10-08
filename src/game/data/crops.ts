import type { CropDefinition, CropId } from '../../types/farming';

export const crops: readonly CropDefinition[] = [
  { id: 'cassava', name: 'Cassava', emoji: '🌱', role: 'Staple crop', category: 'Staple', growthMs: 75_000, harvestAmount: 35, value: 18, baseMarketPrice: 120, foodValue: 1, futureProducts: 'Garri, fufu and starch', preferredRegions: ['south-west', 'south-east'] },
  { id: 'rice', name: 'Rice', emoji: '🍚', role: 'Staple crop', category: 'Staple', growthMs: 60_000, harvestAmount: 30, value: 26, baseMarketPrice: 250, foodValue: 1, futureProducts: 'Milled rice', preferredRegions: ['north-central', 'north-west'] },
  { id: 'maize', name: 'Maize', emoji: '🌽', role: 'Staple crop / livestock feed', category: 'Staple', growthMs: 45_000, harvestAmount: 25, value: 22, baseMarketPrice: 150, foodValue: 1, futureProducts: 'Flour, meal and livestock feed', preferredRegions: ['north-central', 'north-west'] },
  { id: 'yam', name: 'Yam', emoji: '🍠', role: 'Staple crop', category: 'Staple', growthMs: 80_000, harvestAmount: 28, value: 32, baseMarketPrice: 280, foodValue: 1, futureProducts: 'Fresh market sales' },
  { id: 'millet', name: 'Millet', emoji: '🌾', role: 'Dryland staple', category: 'Staple', growthMs: 50_000, harvestAmount: 24, value: 20, baseMarketPrice: 170, foodValue: 1, futureProducts: 'Fresh market sales', preferredRegions: ['north-west', 'north-east'] },
  { id: 'sorghum', name: 'Sorghum', emoji: '🌾', role: 'Dryland staple', category: 'Staple', growthMs: 52_000, harvestAmount: 24, value: 21, baseMarketPrice: 180, foodValue: 1, futureProducts: 'Fresh market sales', preferredRegions: ['north-west', 'north-east'] },
  { id: 'cowpea', name: 'Cowpea', emoji: '🫘', role: 'Legume', category: 'Legume', growthMs: 42_000, harvestAmount: 20, value: 24, baseMarketPrice: 230, foodValue: 1, futureProducts: 'Fresh market sales' },
  { id: 'groundnut', name: 'Groundnut', emoji: '🥜', role: 'Legume / cash crop', category: 'Legume', growthMs: 48_000, harvestAmount: 18, value: 27, baseMarketPrice: 260, foodValue: 1, futureProducts: 'Fresh market sales' },
  { id: 'soybean', name: 'Soybean', emoji: '🫘', role: 'Legume / livestock feed', category: 'Legume', growthMs: 50_000, harvestAmount: 20, value: 25, baseMarketPrice: 240, foodValue: 1, futureProducts: 'Fresh market sales' },
  { id: 'tomatoes', name: 'Tomatoes', emoji: '🍅', role: 'Vegetable / cash crop', category: 'Vegetable', growthMs: 30_000, harvestAmount: 25, value: 30, baseMarketPrice: 180, futureProducts: 'Tomato paste and sauce' },
  { id: 'pepper', name: 'Pepper', emoji: '🌶️', role: 'Vegetable / cash crop', category: 'Vegetable', growthMs: 32_000, harvestAmount: 18, value: 28, baseMarketPrice: 210, futureProducts: 'Fresh market sales' },
  { id: 'okra', name: 'Okra', emoji: '🥬', role: 'Vegetable', category: 'Vegetable', growthMs: 28_000, harvestAmount: 18, value: 23, baseMarketPrice: 190, futureProducts: 'Fresh market sales' },
  { id: 'onion', name: 'Onion', emoji: '🧅', role: 'Vegetable / cash crop', category: 'Vegetable', growthMs: 38_000, harvestAmount: 20, value: 26, baseMarketPrice: 220, futureProducts: 'Fresh market sales' },
  { id: 'leafyVegetables', name: 'Leafy vegetables', emoji: '🥗', role: 'Vegetable', category: 'Vegetable', growthMs: 22_000, harvestAmount: 16, value: 18, baseMarketPrice: 150, futureProducts: 'Fresh market sales' },
  { id: 'cocoa', name: 'Cocoa', emoji: '🍫', role: 'Commercial tree crop', category: 'Commercial', growthMs: 95_000, harvestAmount: 14, value: 42, baseMarketPrice: 420, futureProducts: 'Fresh market sales', preferredRegions: ['south-west', 'south-south'] },
  { id: 'oilPalm', name: 'Oil palm', emoji: '🌴', role: 'Commercial tree crop', category: 'Commercial', growthMs: 90_000, harvestAmount: 15, value: 38, baseMarketPrice: 360, futureProducts: 'Fresh market sales', preferredRegions: ['south-south', 'south-west'] },
  { id: 'cashew', name: 'Cashew', emoji: '🥭', role: 'Commercial tree crop', category: 'Commercial', growthMs: 88_000, harvestAmount: 14, value: 40, baseMarketPrice: 390, futureProducts: 'Fresh market sales', preferredRegions: ['north-central', 'south-west'] },
];

export const cropById = (id: CropId | null): CropDefinition | undefined => crops.find((crop) => crop.id === id);
