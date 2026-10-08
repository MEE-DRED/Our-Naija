export const presidentialRequirements = {
  development: 80, foodSecurity: 80, healthcare: 75, education: 75,
  electricity: 75, employment: 75, happiness: 75, approval: 70,
} as const;

export const presidentialCampaigns = [
  { id: 'food', name: 'Food Security Tour', description: 'Builds farmer and rural support.', cost: 45000, support: 5 },
  { id: 'youth', name: 'Youth Employment Programme', description: 'Builds youth and worker support.', cost: 50000, support: 5 },
  { id: 'health', name: 'Healthcare Campaign', description: 'Builds family and healthcare support.', cost: 55000, support: 5 },
  { id: 'education', name: 'Education Programme', description: 'Builds educator and family support.', cost: 50000, support: 5 },
  { id: 'infrastructure', name: 'National Infrastructure Tour', description: 'Builds broad public confidence.', cost: 65000, support: 6 },
] as const;
