import { approvalWeights, candidateData, electionRequirements, voterGroups } from '../data/politics';
import type { PlayerState } from '../../types/player';
import type { ApprovalFactors, PoliticalState } from '../../types/politics';

export const calculateApproval = (player: PlayerState): { approval: number; factors: ApprovalFactors } => {
  const factors: ApprovalFactors = {
    foodSecurity: Math.round(player.foodSecurity * approvalWeights.foodSecurity),
    healthcare: Math.round(player.health * approvalWeights.healthcare),
    education: Math.round(player.education * approvalWeights.education),
    electricity: Math.round(player.electricity * approvalWeights.electricity),
    employment: Math.round(player.employment * approvalWeights.employment),
    happiness: Math.round(player.happiness * approvalWeights.happiness),
    development: Math.round(player.development * approvalWeights.development),
    treasury: Math.round(Math.min(100, player.treasury / 2000) * approvalWeights.treasury),
  };
  return { approval: Math.min(100, Object.values(factors).reduce((sum, value) => sum + value, 0)), factors };
};

export const eligibility = (player: PlayerState) => ({
  development: player.development >= electionRequirements.development,
  foodSecurity: player.foodSecurity >= electionRequirements.foodSecurity,
  healthcare: player.health >= electionRequirements.healthcare,
  education: player.education >= electionRequirements.education,
  electricity: player.electricity >= electionRequirements.electricity,
  employment: player.employment >= electionRequirements.employment,
  happiness: player.happiness >= electionRequirements.happiness,
});

export const isEligible = (player: PlayerState) => Object.values(eligibility(player)).every(Boolean);

const seededNoise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

export const calculateElection = (player: PlayerState, political: PoliticalState) => {
  const support: number[] = [political.approval + political.campaignApproval];
  for (const candidate of candidateData) {
    const issueSupport = voterGroups.reduce((sum, group) => {
      const average = group.priorities.reduce((total, key) => total + political.approvalFactors[key], 0) / group.priorities.length;
      const strength = (candidate.strengths as readonly string[]).includes(group.id) ? 12 : 0;
      return sum + group.weight * (candidate.baseSupport * 100 + strength + (100 - average) * 0.08);
    }, 0);
    support.push(issueSupport);
  }
  support[0] += seededNoise(political.electionNumber + Math.round(player.treasury)) * 8 - 4;
  const total = support.reduce((sum, value) => sum + Math.max(1, value), 0);
  return support.map((value) => Math.round((Math.max(1, value) / total) * 100));
};
