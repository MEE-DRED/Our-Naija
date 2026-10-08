import type { ProcessingRecipe } from '../../types/processing';

export const processingRecipes: readonly ProcessingRecipe[] = [
  { facilityId: 'garri-plant', name: 'Garri Processing', input: 'cassava', output: 'garri', inputQuantity: 20, outputQuantity: 12, processingMs: 45_000, electricityRequired: 15, cost: 2000, jobs: 6, outputName: 'Garri' },
  { facilityId: 'rice-mill', name: 'Rice Milling', input: 'rice', output: 'milledRice', inputQuantity: 20, outputQuantity: 14, processingMs: 50_000, electricityRequired: 20, cost: 2200, jobs: 8, outputName: 'Milled Rice' },
  { facilityId: 'tomato-plant', name: 'Tomato Processing', input: 'tomatoes', output: 'tomatoPaste', inputQuantity: 15, outputQuantity: 8, processingMs: 35_000, electricityRequired: 18, cost: 1800, jobs: 7, outputName: 'Tomato Paste' },
  { facilityId: 'maize-plant', name: 'Maize Processing', input: 'maize', output: 'maizeFeed', inputQuantity: 20, outputQuantity: 15, processingMs: 40_000, electricityRequired: 16, cost: 1900, jobs: 6, outputName: 'Maize Meal / Feed' },
];

export const recipeFor = (facilityId: string) => processingRecipes.find((recipe) => recipe.facilityId === facilityId);
