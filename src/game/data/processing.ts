import type { ProcessingRecipe } from '../../types/processing';

export const processingRecipes: readonly ProcessingRecipe[] = [
  { facilityId: 'garri-plant', recipeId: 'garri', name: 'Garri Processing', input: 'cassava', output: 'garri', inputQuantity: 20, outputQuantity: 12, processingMs: 45_000, electricityRequired: 15, cost: 2000, jobs: 6, outputName: 'Garri' },
  { facilityId: 'garri-plant', recipeId: 'fufu', name: 'Fufu Processing', input: 'cassava', output: 'fufu', inputQuantity: 20, outputQuantity: 13, processingMs: 48_000, electricityRequired: 16, cost: 2000, jobs: 6, outputName: 'Fufu' },
  { facilityId: 'garri-plant', recipeId: 'cassava-flour', name: 'Cassava Flour', input: 'cassava', output: 'cassavaFlour', inputQuantity: 25, outputQuantity: 15, processingMs: 52_000, electricityRequired: 18, cost: 2200, jobs: 6, outputName: 'Cassava Flour' },
  { facilityId: 'garri-plant', recipeId: 'starch', name: 'Cassava Starch', input: 'cassava', output: 'starch', inputQuantity: 25, outputQuantity: 14, processingMs: 55_000, electricityRequired: 20, cost: 2400, jobs: 6, outputName: 'Starch' },
  { facilityId: 'rice-mill', recipeId: 'milled-rice', name: 'Rice Milling', input: 'rice', output: 'milledRice', inputQuantity: 20, outputQuantity: 14, processingMs: 50_000, electricityRequired: 20, cost: 2200, jobs: 8, outputName: 'Milled Rice' },
  { facilityId: 'rice-mill', recipeId: 'packaged-rice', name: 'Packaged Rice', input: 'rice', output: 'packagedRice', inputQuantity: 25, outputQuantity: 16, processingMs: 58_000, electricityRequired: 24, cost: 2600, jobs: 8, outputName: 'Packaged Rice' },
  { facilityId: 'tomato-plant', recipeId: 'tomato-paste', name: 'Tomato Processing', input: 'tomatoes', output: 'tomatoPaste', inputQuantity: 15, outputQuantity: 8, processingMs: 35_000, electricityRequired: 18, cost: 1800, jobs: 7, outputName: 'Tomato Paste' },
  { facilityId: 'tomato-plant', recipeId: 'tomato-sauce', name: 'Tomato Sauce', input: 'tomatoes', output: 'tomatoSauce', inputQuantity: 15, outputQuantity: 9, processingMs: 38_000, electricityRequired: 19, cost: 1900, jobs: 7, outputName: 'Tomato Sauce' },
  { facilityId: 'maize-plant', recipeId: 'maize-flour', name: 'Maize Flour', input: 'maize', output: 'maizeFlour', inputQuantity: 20, outputQuantity: 14, processingMs: 40_000, electricityRequired: 16, cost: 1900, jobs: 6, outputName: 'Maize Flour' },
  { facilityId: 'maize-plant', recipeId: 'maize-meal', name: 'Maize Meal', input: 'maize', output: 'maizeMeal', inputQuantity: 20, outputQuantity: 15, processingMs: 40_000, electricityRequired: 16, cost: 1900, jobs: 6, outputName: 'Maize Meal' },
  { facilityId: 'maize-plant', recipeId: 'maize-feed', name: 'Livestock Feed', input: 'maize', output: 'maizeFeed', inputQuantity: 20, outputQuantity: 15, processingMs: 40_000, electricityRequired: 16, cost: 1900, jobs: 6, outputName: 'Livestock Feed' },
];

export const recipesFor = (facilityId: string) => processingRecipes.filter((recipe) => recipe.facilityId === facilityId);
export const recipeFor = (facilityId: string, recipeId?: string) => processingRecipes.find((recipe) => recipe.facilityId === facilityId && (!recipeId || recipe.recipeId === recipeId));
