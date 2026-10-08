import { dynamicMarketPrice, marketPrices } from '../data/economy';
import { communityWorld } from '../data/communityWorld';
import { citizenVoiceStore, economyStore, eventStore, playerStore, politicsStore, simulationStore } from '../../state/stores';
import type { CropId } from '../../types/farming';
import type { SimulationReport } from '../../types/simulation';
import { advancePetitions } from './citizenVoice';

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const stapleCrops: readonly CropId[] = ['cassava', 'maize', 'rice'];

const activePressure = () => {
  const id = eventStore.getState().active?.eventId;
  return {
    food: id === 'flooding' || id === 'drought' || id === 'crop-disease' || id === 'food-contamination' ? -8 : 0,
    electricity: id === 'power-outage' ? -12 : 0,
    happiness: id === 'fuel-scarcity' || id === 'transport-problem' ? -4 : 0,
    transport: id === 'fuel-scarcity' || id === 'transport-problem' ? 0.12 : 0,
  };
};

const save = () => {
  try {
    window.localStorage.setItem('our-naija-market-prices', JSON.stringify(economyStore.getState().priceIndex));
    window.localStorage.setItem('our-naija-simulation-report', JSON.stringify(simulationStore.getState().report));
    window.localStorage.setItem('our-naija-player', JSON.stringify(playerStore.getState()));
  } catch { /* persistence is optional */ }
};

export function runMonthlySimulation(turn: number): SimulationReport {
  const before = playerStore.getState();
  const economy = economyStore.getState();
  const pressure = activePressure();
  const resources = before.resources;
  const reserve = stapleCrops.reduce((sum, crop) => sum + before.foodReserve[crop], 0);
  const processedFood = before.resources.garri + before.resources.milledRice + before.resources.tomatoPaste;
  const farmCapacity = communityWorld.farmPlots.length * 4;
  const supply = reserve + stapleCrops.reduce((sum, crop) => sum + resources[crop], 0) + processedFood * 1.4 + farmCapacity;
  const demand = Math.max(1, before.population * 0.12);
  const foodSecurity = clamp(48 + (supply / demand) * 28 + pressure.food);

  const farmJobs = communityWorld.farmPlots.length * 2;
  const buildingJobs = 3 + 4 + 6 + 4;
  const processingJobs = economy.processing ? 6 : 0;
  const jobs = farmJobs + buildingJobs + processingJobs;
  const employment = clamp((jobs / Math.max(1, before.population)) * 100);

  const electricityRatio = before.electricityCapacity / Math.max(1, before.electricityDemand);
  const electricity = clamp(Math.min(100, electricityRatio * 78) + pressure.electricity);
  const health = clamp(45 + before.health * 0.25 + foodSecurity * 0.2 + (electricity < 45 ? -8 : 0));
  const education = clamp(42 + before.education * 0.35 + (electricity < 40 ? -6 : 0));
  const housing = Math.min(100, (before.housingCapacity / Math.max(1, before.population)) * 100);
  const happiness = clamp(foodSecurity * 0.24 + health * 0.2 + education * 0.12 + employment * 0.16 + electricity * 0.12 + housing * 0.16 + pressure.happiness);
  const development = clamp((health + education + employment + electricity + foodSecurity + happiness) / 6);
  const populationDelta = happiness >= 68 && housing >= 90 ? 1 : happiness < 38 || housing < 60 ? -1 : 0;

  const nextPlayer = {
    ...before, foodSecurity, health, education, employment, electricity, happiness, development,
    population: Math.max(1, Math.min(before.housingCapacity, before.population + populationDelta)),
    jobs,
  };
  playerStore.setState(nextPlayer);

  const priceIndex = { ...economy.priceIndex };
  for (const crop of Object.keys(marketPrices) as CropId[]) {
    const stock = resources[crop] + before.foodReserve[crop];
    const scarcity = Math.max(-0.2, Math.min(0.2, 1 - stock / Math.max(10, demand)));
    const current = priceIndex[crop] ?? 1;
    priceIndex[crop] = Math.max(0.75, Math.min(1.5, current * 0.85 + (1 + scarcity + pressure.transport) * 0.15));
  }
  economyStore.setState({ priceIndex });

  const approvalBefore = politicsStore.getState().approval + politicsStore.getState().campaignApproval;
  const serviceApproval = foodSecurity * 0.2 + health * 0.13 + education * 0.1 + employment * 0.14 + electricity * 0.1 + happiness * 0.2 + development * 0.13;
  const approval = clamp(serviceApproval * 0.9 + citizenVoiceStore.getState().trust * 0.1);
  politicsStore.setState({ approval: Math.max(0, Math.min(100, approval - politicsStore.getState().campaignApproval)) });
  const approvalAfter = approval;

  const deltas = {
    foodSecurityDelta: foodSecurity - before.foodSecurity,
    employmentDelta: employment - before.employment,
    electricityDelta: electricity - before.electricity,
    happinessDelta: happiness - before.happiness,
    approvalDelta: approvalAfter - approvalBefore,
  };
  const candidates = ([
    ['Food production', foodSecurity], ['Employment', employment], ['Electricity', electricity],
    ['Healthcare', health], ['Happiness', happiness],
  ] as [string, number][]).sort((a, b) => b[1] - a[1]);
  const concern = candidates[candidates.length - 1][0];
  const report: SimulationReport = {
    turn, foodSecurity, ...deltas, employment, electricity, happiness, approval: approvalAfter,
    treasury: nextPlayer.treasury, treasuryDelta: 0, mainStrength: candidates[0][0],
    mainConcern: concern, priceIndex,
  };
  simulationStore.setState({ report });
  advancePetitions();
  save();
  return report;
}

export const marketPriceFor = (crop: CropId) => {
  const level = economyStore.getState().buildingLevels.market?.level ?? 1;
  return dynamicMarketPrice(crop, level, economyStore.getState().priceIndex[crop]);
};
