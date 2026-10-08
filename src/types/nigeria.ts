export type NigerianRegion = 'North West' | 'North East' | 'North Central' | 'South West' | 'South East' | 'South South' | 'Federal Capital Territory';

export interface NigerianState {
  id: string;
  name: string;
  region: NigerianRegion;
  capital: string;
  agriculturalStrengths: string[];
  secondaryStrengths: string[];
  opportunities: string[];
  challenges: string[];
  lgas: string[];
}

export interface StateProject {
  id: string;
  name: string;
  description: string;
  cost: number;
  development: number;
  foodSecurity: number;
  healthcare: number;
  education: number;
  electricity: number;
  employment: number;
}

export interface StateState {
  stateId: string;
  population: number;
  development: number;
  foodProduction: number;
  foodDemand: number;
  foodSecurity: number;
  foodReserve: number;
  processingCapacity: number;
  healthcare: number;
  education: number;
  electricity: number;
  employment: number;
  happiness: number;
  treasury: number;
  revenue: number;
  expenditure: number;
  completedProjects: string[];
  activePolicy: string | null;
}
