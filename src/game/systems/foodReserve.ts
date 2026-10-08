import type { FoodBalance, LgaState } from '../../types/lga';

export function calculateFoodBalance(state: Pick<LgaState, 'wards'>): FoodBalance {
  const wards = Object.values(state.wards);
  const demand = wards.reduce((sum, ward) => sum + Math.max(0, ward.foodDemand), 0);
  const production = wards.reduce((sum, ward) => sum + Math.max(0, ward.foodProduction), 0);
  const balance = production - demand;
  return { demand, production, balance, surplus: Math.max(0, balance), shortage: Math.max(0, -balance), isSelfSufficient: balance >= 0 };
}

export function foodSecurityScore(balance: FoodBalance): number {
  if (balance.demand === 0) return 100;
  return Math.max(0, Math.min(100, Math.round((balance.production / balance.demand) * 100)));
}
