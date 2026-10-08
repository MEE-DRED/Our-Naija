import type { WardId } from './ward';

export interface GovernanceInputs {
  foodSecurity: number;
  health: number;
  education: number;
  employment: number;
  electricityAccess: number;
  waterAccess: number;
  happiness: number;
  development: number;
}

export interface GovernanceMetrics extends GovernanceInputs {
  serviceDelivery: number;
  accountability: number;
  overall: number;
}

export interface GovernorEligibilityThresholds {
  development: number;
  foodSecurity: number;
  serviceDelivery: number;
  accountability: number;
  fairness: number;
}

export interface GovernorEligibility {
  eligible: boolean;
  unmet: readonly string[];
  thresholds: GovernorEligibilityThresholds;
}

export type WardMetricKey = 'health' | 'education' | 'employment' | 'electricityAccess' | 'waterAccess' | 'happiness';
export type WardMetricValues = Record<WardId, number>;
