import type { CropDefinition, CropId } from '../../types/farming';

export const crops: readonly CropDefinition[] = [
  { id: 'cassava', name: 'Cassava', emoji: '🌱', role: 'Staple crop', growthMs: 75_000, harvestAmount: 35, value: 18, futureProducts: 'Garri, fufu and starch' },
  { id: 'maize', name: 'Maize', emoji: '🌽', role: 'Staple crop / livestock feed', growthMs: 45_000, harvestAmount: 25, value: 22, futureProducts: 'Corn products and animal feed' },
  { id: 'rice', name: 'Rice', emoji: '🍚', role: 'Staple crop', growthMs: 60_000, harvestAmount: 30, value: 26, futureProducts: 'Milled rice' },
  { id: 'tomatoes', name: 'Tomatoes', emoji: '🍅', role: 'Vegetable / cash crop', growthMs: 30_000, harvestAmount: 25, value: 30, futureProducts: 'Tomato paste and sauces' },
];

export const cropById = (id: CropId | null): CropDefinition | undefined => crops.find((crop) => crop.id === id);
