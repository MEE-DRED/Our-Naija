import type { GovernorEligibility, GovernorEligibilityThresholds, GovernanceInputs, GovernanceMetrics } from '../../types/governance';

export const governorEligibilityThresholds: GovernorEligibilityThresholds = {
  development: 60, foodSecurity: 70, serviceDelivery: 65, accountability: 60, fairness: 60,
};

export function calculateGovernanceMetrics(inputs: GovernanceInputs, fairness = 100): GovernanceMetrics {
  const serviceDelivery = Math.round((inputs.health + inputs.education + inputs.electricityAccess + inputs.waterAccess) / 4);
  const accountability = Math.round((inputs.happiness + inputs.employment + inputs.development + fairness) / 4);
  const overall = Math.round((inputs.foodSecurity + serviceDelivery + accountability + inputs.development) / 4);
  return { ...inputs, serviceDelivery, accountability, overall };
}

/** Eligibility is intentionally a read-only foundation; elections are implemented elsewhere in a future cycle. */
export function checkGovernorEligibility(metrics: GovernanceMetrics, fairness: number, thresholds = governorEligibilityThresholds): GovernorEligibility {
  const unmet: string[] = [];
  if (metrics.development < thresholds.development) unmet.push('development');
  if (metrics.foodSecurity < thresholds.foodSecurity) unmet.push('foodSecurity');
  if (metrics.serviceDelivery < thresholds.serviceDelivery) unmet.push('serviceDelivery');
  if (metrics.accountability < thresholds.accountability) unmet.push('accountability');
  if (fairness < thresholds.fairness) unmet.push('fairness');
  return { eligible: unmet.length === 0, unmet, thresholds };
}
