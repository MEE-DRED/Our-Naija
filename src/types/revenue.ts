export interface RevenueRates {
  marketPerTransaction: number;
  agriculturalPerUnit: number;
  processingPerUnit: number;
}

export interface RevenueActivity {
  marketTransactions: number;
  agriculturalUnits: number;
  processedUnits: number;
}

export interface RevenueBreakdown {
  market: number;
  agriculture: number;
  processing: number;
  total: number;
}
