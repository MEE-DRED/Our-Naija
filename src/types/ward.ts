export type WardId = 'odo-ewa' | 'iyetoro' | 'igbokuta' | 'oke-aro';

export type AgriculturalStrength = 'cassava' | 'maize' | 'rice' | 'vegetables';

export interface WardMetrics {
  population: number;
  foodProduction: number;
  foodDemand: number;
  employment: number;
  health: number;
  education: number;
  electricityAccess: number;
  waterAccess: number;
  happiness: number;
}

export interface WardDefinition {
  id: WardId;
  wardNumber: 1 | 2 | 3 | 4;
  name: string;
  isHeadquarters: boolean;
  description: string;
  agriculturalStrengths: readonly AgriculturalStrength[];
  startingMetrics: WardMetrics;
}
