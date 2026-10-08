import type { RevenueRates } from '../../types/revenue';

/** Rates are deliberately data, so balancing does not require changing calculations. */
export const lgaRevenueRates: RevenueRates = {
  marketPerTransaction: 0.05,
  agriculturalPerUnit: 2,
  processingPerUnit: 4,
};
