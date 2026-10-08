export type LeadershipLevel =
  | 'COMMUNITY_LEADER'
  | 'LOCAL_GOVERNMENT_CHAIRMAN'
  | 'GOVERNOR'
  | 'PRESIDENT';

export interface LeadershipLevelConfig {
  id: LeadershipLevel;
  order: number;
  name: string;
  /** Whether the level can be played in the current build. */
  playable: boolean;
  /** Short, player-facing description of what this level governs. */
  scope: string;
}
