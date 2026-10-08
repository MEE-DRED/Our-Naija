import type { CropId } from './farming';

export interface SimulationReport {
  turn: number;
  foodSecurity: number;
  foodSecurityDelta: number;
  employment: number;
  employmentDelta: number;
  electricity: number;
  electricityDelta: number;
  happiness: number;
  happinessDelta: number;
  approval: number;
  approvalDelta: number;
  treasury: number;
  treasuryDelta: number;
  mainStrength: string;
  mainConcern: string;
  priceIndex: Record<CropId, number>;
}
