import type { LgaState } from '../../types/lga';
import { lgaWards } from './wards';

export const initialLgaState = (): LgaState => ({
  name: 'Odo-Ewa Local Government Area',
  treasury: 250_000, foodReserve: 0, storageCapacity: 2500, lastRevenueAt: Date.now(), projects: [],
  development: 18,
  wards: Object.fromEntries(lgaWards.map(({ id, startingMetrics }) => [id, {
    population: startingMetrics.population,
    foodProduction: startingMetrics.foodProduction,
    foodDemand: startingMetrics.foodDemand,
    revenue: 0,
    serviceAccess: Math.round((startingMetrics.health + startingMetrics.education + startingMetrics.electricityAccess + startingMetrics.waterAccess) / 4),
    metrics: startingMetrics, completedProjects: [],
  }])) as unknown as LgaState['wards'],
});
