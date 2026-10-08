import type { WardId } from './ward';

export type LgaProjectId = 'road' | 'clinic' | 'solar-mini-grid' | 'primary-school';

export interface ProjectEffects {
  development: number;
  health?: number;
  education?: number;
  electricityAccess?: number;
  waterAccess?: number;
  employment?: number;
  happiness?: number;
}

export interface LgaProjectDefinition {
  id: LgaProjectId;
  name: string;
  description: string;
  cost: number;
  constructionDurationDays: number;
  effects: ProjectEffects;
  eligibleWardTypes: readonly WardId[];
}

export interface ActiveLgaProject {
  projectId: LgaProjectId;
  wardId: WardId;
  startedAt: number;
  completesAt: number;
}
