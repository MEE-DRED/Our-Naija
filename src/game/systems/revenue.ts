import type { RevenueActivity, RevenueBreakdown, RevenueRates } from '../../types/revenue';
import { lgaRevenueRates } from '../data/revenue';

export function calculateRevenue(activity: RevenueActivity, rates: RevenueRates = lgaRevenueRates): RevenueBreakdown {
  const market = Math.max(0, activity.marketTransactions) * rates.marketPerTransaction;
  const agriculture = Math.max(0, activity.agriculturalUnits) * rates.agriculturalPerUnit;
  const processing = Math.max(0, activity.processedUnits) * rates.processingPerUnit;
  return { market, agriculture, processing, total: market + agriculture + processing };
}
