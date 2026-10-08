import type { LeadershipLevel } from './leadership';

export type PoliticalPhase = 'LOCKED' | 'CAMPAIGN' | 'ELECTION_READY' | 'WON' | 'LOST';
export type CampaignActionId = 'meeting' | 'food' | 'health' | 'education' | 'youth' | 'infrastructure' | 'market';

export interface ApprovalFactors {
  foodSecurity: number;
  healthcare: number;
  education: number;
  electricity: number;
  employment: number;
  happiness: number;
  development: number;
  treasury: number;
}

export interface ElectionRequirements {
  development: number;
  foodSecurity: number;
  healthcare: number;
  education: number;
  electricity: number;
  employment: number;
  happiness: number;
}

export interface ElectionRecord {
  number: number;
  position: LeadershipLevel;
  result: 'WON' | 'LOST';
  playerShare: number;
  date: number;
  gameYear?: number;
}

export interface PoliticalState {
  phase: PoliticalPhase;
  approval: number;
  approvalFactors: ApprovalFactors;
  campaignApproval: number;
  campaignSpent: number;
  campaignUses: Record<CampaignActionId, number>;
  electionNumber: number;
  electionHistory: ElectionRecord[];
  lastResult: 'WON' | 'LOST' | null;
}
