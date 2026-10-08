import type { ResourceId } from './farming';

export interface Transaction {
  type: 'HARVEST' | 'SALE' | 'RESERVE' | 'UPGRADE' | 'PROCESSING';
  resource?: ResourceId;
  quantity?: number;
  amount: number;
  message: string;
  timestamp: number;
}

export interface BuildingLevel {
  level: number;
}

export type BuildingLevels = Record<string, BuildingLevel>;
