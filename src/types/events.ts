import type { ResourceId } from './farming';

export type EventCategory = 'agricultural' | 'economic' | 'food-safety' | 'infrastructure' | 'governance' | 'social' | 'opportunity';
export type EventSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type Season = 'RAINY' | 'DRY' | 'HARMATTAN';

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  cost: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  severity: EventSeverity;
  affectedArea: string;
  trigger: { baseChance: number; seasons?: Season[]; minFoodSecurity?: number; maxHappiness?: number; minProduction?: number };
  duration: number;
  cooldown: number;
  choices: EventChoice[];
}

export interface EventConsequence {
  treasury: number;
  foodSecurity: number;
  development?: number;
  happiness: number;
  approval: number;
  electricity: number;
  employment: number;
  resources?: Partial<Record<ResourceId, number>>;
  modifier?: string;
}

export interface EventHistoryEntry {
  eventId: string;
  title: string;
  turn: number;
  decision: string;
  outcome: string;
}

export interface ActiveEvent {
  eventId: string;
  startedTurn: number;
  expiresTurn: number;
  effects: EventConsequence;
}

export interface EventState {
  turn: number;
  season: Season;
  active: ActiveEvent | null;
  history: EventHistoryEntry[];
  cooldowns: Record<string, number>;
}
