import { communityWorld } from '../data/communityWorld';
import { economyStore, playerStore } from '../../state/stores';

export function calculateCommunityMetrics() {
  const player = playerStore.getState();
  const levels = economyStore.getState().buildingLevels;
  const expansions = economyStore.getState().expansions;
  const clinic = (levels.clinic?.level ?? 1) >= 2 ? 3 : 0;
  const school = (levels.school?.level ?? 1) >= 2 ? 4 : 0;
  const borehole = (levels.borehole?.level ?? 1) >= 2 ? 70 : 40;
  const marketJobs = (levels.market?.level ?? 1) >= 2 ? 4 : 3;
  const processingJobs = 27;
  const farmJobs = communityWorld.farmPlots.length * 2 + ((levels['farm-1']?.level ?? 1) >= 2 ? 1 : 0);
  const housingCapacity = communityWorld.buildings.filter((building) => building.kind === 'HOUSE').length * 8 + (expansions['expansion-east'] ? 16 : 0);
  const jobs = farmJobs + marketJobs + processingJobs;
  const employment = Math.min(100, Math.round((Math.min(jobs, player.population) / Math.max(1, player.population)) * 100));
  const foodSecurity = Math.round(player.foodSecurity);
  const health = Math.min(100, Math.round(50 + foodSecurity * 0.18 + clinic));
  const education = Math.min(100, 45 + school + (housingCapacity >= player.population ? 5 : 0));
  const waterAccess = Math.min(100, Math.round((borehole / Math.max(1, player.population * 0.4)) * 100));
  const electricityCapacity = player.electricityCapacity;
  const electricityDemand = player.electricityDemand;
  const electricity = Math.min(100, Math.round((electricityCapacity / Math.max(1, electricityDemand)) * 48));
  const happiness = Math.round((foodSecurity + health + employment + waterAccess + electricity + Math.min(100, (housingCapacity / Math.max(1, player.population)) * 100)) / 6);
  const development = Math.min(100, Math.round((health + education + employment + waterAccess + electricity + foodSecurity) / 6));
  return { health, education, employment, waterAccess, electricity, happiness, development, housingCapacity, jobs };
}

export function refreshCommunityMetrics() {
  playerStore.setState(calculateCommunityMetrics());
}
