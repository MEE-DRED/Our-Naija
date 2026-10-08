import type { ProductId, CropId } from './farming';

export interface ProcessingRecipe {
  facilityId: string;
  name: string;
  input: CropId;
  output: ProductId;
  inputQuantity: number;
  outputQuantity: number;
  processingMs: number;
  electricityRequired: number;
  cost: number;
  jobs: number;
  outputName: string;
}

export interface ProcessingJob {
  facilityId: string;
  startedAt: number;
  recipeId: string;
}
