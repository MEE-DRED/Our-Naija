export type AchievementId = 'first-harvest' | 'community-builder' | 'food-secure' | 'peoples-choice' | 'no-wahala' | 'power-to-the-people';

export interface GovernanceTask {
  id: string;
  day: number;
  title: string;
  description: string;
  kind: 'petition' | 'market' | 'services' | 'inspection';
  completed: boolean;
}

export interface PlayerProfileState {
  administration: number;
  communitiesDeveloped: number;
  lgasGoverned: number;
  statesGoverned: number;
  presidentialTerms: number;
  resolvedPetitions: number;
  harvests: number;
  completedUpgrades: number;
  electionsWon: number;
  bestElectionShare: number;
  achievements: AchievementId[];
  history: string[];
  governanceStreak: number;
  bestStreak: number;
  lastActionDay: number | null;
  dailyTask: GovernanceTask | null;
}
