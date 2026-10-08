import type { WardId } from './ward';
import type { WardMetrics } from './ward';
import type { ActiveLgaProject } from './project';

export interface LgaState {
  name: string;
  wards: Record<WardId, LgaWardState>;
  treasury: number;
  development: number;
  foodReserve: number;
  storageCapacity: number;
  lastRevenueAt: number;
  projects: ActiveLgaProject[];
}

export interface LgaWardState {
  population: number;
  foodProduction: number;
  foodDemand: number;
  revenue: number;
  serviceAccess: number;
  metrics: WardMetrics;
  completedProjects: string[];
}

export interface FoodBalance {
  demand: number;
  production: number;
  surplus: number;
  shortage: number;
  balance: number;
  isSelfSufficient: boolean;
}

export interface WardDistribution {
  wardId: WardId;
  allocation: number;
  populationShare: number;
  allocationShare: number;
  fairnessScore: number;
}

export interface DistributionResult {
  allocations: WardDistribution[];
  fairnessScore: number;
  underservedWards: WardId[];
}
