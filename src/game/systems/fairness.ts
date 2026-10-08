import type { DistributionResult, WardDistribution } from '../../types/lga';
import type { WardId } from '../../types/ward';

/**
 * Measures whether allocations broadly follow population share.
 * A score of 100 is perfectly proportional; a score of 0 is maximally unequal.
 */
export function calculateDistributionFairness(
  allocations: Record<WardId, number>,
  populations: Record<WardId, number>,
): DistributionResult {
  const ids = Object.keys(populations) as WardId[];
  const totalPopulation = ids.reduce((sum, id) => sum + Math.max(0, populations[id]), 0);
  const totalAllocation = ids.reduce((sum, id) => sum + Math.max(0, allocations[id] ?? 0), 0);
  const rows: WardDistribution[] = ids.map((wardId) => {
    const populationShare = totalPopulation ? Math.max(0, populations[wardId]) / totalPopulation : 0;
    const allocationShare = totalAllocation ? Math.max(0, allocations[wardId] ?? 0) / totalAllocation : 0;
    return { wardId, allocation: Math.max(0, allocations[wardId] ?? 0), populationShare, allocationShare, fairnessScore: Math.max(0, Math.round(100 - Math.abs(populationShare - allocationShare) * 100)) };
  });
  const fairnessScore = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.fairnessScore, 0) / rows.length) : 100;
  return { allocations: rows, fairnessScore, underservedWards: rows.filter((row) => row.allocationShare + 0.05 < row.populationShare).map((row) => row.wardId) };
}
