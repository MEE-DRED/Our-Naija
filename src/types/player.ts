import type { LeadershipLevel } from './leadership';
import type { ResourceInventory } from './farming';

export interface PlayerState {
  role: LeadershipLevel;
  stateName: string;
  lgaName: string;
  startingCommunity: string;
  communityName: string;
  population: number;
  foodSecurity: number;
  treasury: number;
  development: number;
  happiness: number;
  resources: ResourceInventory;
  foodReserve: ResourceInventory;
  health: number;
  education: number;
  employment: number;
  waterAccess: number;
  electricity: number;
  housingCapacity: number;
  jobs: number;
  electricityCapacity: number;
  electricityDemand: number;
  storageCapacity: number;
}
