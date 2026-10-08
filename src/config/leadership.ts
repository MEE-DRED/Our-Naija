import type { LeadershipLevel, LeadershipLevelConfig } from '../types/leadership';

export const leadershipLevels: Record<LeadershipLevel, LeadershipLevelConfig> = {
  COMMUNITY_LEADER: { id: 'COMMUNITY_LEADER', order: 1, name: 'Community Leader', playable: true, scope: 'A single community' },
  LOCAL_GOVERNMENT_CHAIRMAN: { id: 'LOCAL_GOVERNMENT_CHAIRMAN', order: 2, name: 'Local Government Chairman', playable: false, scope: 'A local government area' },
  GOVERNOR: { id: 'GOVERNOR', order: 3, name: 'Governor', playable: false, scope: 'A state' },
  PRESIDENT: { id: 'PRESIDENT', order: 4, name: 'President', playable: false, scope: 'The federation' },
};

export const ACTIVE_LEVEL: LeadershipLevel = 'COMMUNITY_LEADER';

export const orderedLevels = (): LeadershipLevelConfig[] =>
  Object.values(leadershipLevels).sort((a, b) => a.order - b.order);
