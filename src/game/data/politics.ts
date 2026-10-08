import type { CampaignActionId, ElectionRequirements } from '../../types/politics';

export const electionRequirements: ElectionRequirements = {
  development: 70, foodSecurity: 65, healthcare: 55, education: 50,
  electricity: 50, employment: 55, happiness: 60,
};

export const approvalWeights = {
  foodSecurity: 0.20, healthcare: 0.15, education: 0.10, electricity: 0.10,
  employment: 0.15, happiness: 0.10, development: 0.10, treasury: 0.10,
} as const;

export const campaignActions: Record<CampaignActionId, {
  name: string; description: string; cost: number; approval: number; maximum: number;
}> = {
  meeting: { name: 'Community Meeting', description: 'Listen to residents at a town meeting.', cost: 10000, approval: 3, maximum: 2 },
  food: { name: 'Food Security Campaign', description: 'Showcase the Food Reserve and local harvests.', cost: 7000, approval: 2, maximum: 2 },
  health: { name: 'Healthcare Outreach', description: 'Bring health workers to neighbourhoods.', cost: 9000, approval: 3, maximum: 1 },
  education: { name: 'Education Programme', description: 'Meet teachers, families, and young learners.', cost: 8000, approval: 2, maximum: 1 },
  youth: { name: 'Youth Employment Programme', description: 'Connect young people to community jobs.', cost: 12000, approval: 4, maximum: 1 },
  infrastructure: { name: 'Infrastructure Tour', description: 'Account for roads, power, water, and storage.', cost: 11000, approval: 3, maximum: 1 },
  market: { name: 'Market Visit', description: 'Meet traders and market associations.', cost: 6000, approval: 2, maximum: 2 },
};

export const candidateData = [
  { id: 'chinedu', name: 'Chinedu Okafor', party: 'Independent', baseSupport: 0.18, strengths: ['traders'] },
  { id: 'amina', name: 'Amina Bello', party: 'Community Development Party', baseSupport: 0.14, strengths: ['youth', 'families'] },
  { id: 'musa', name: 'Musa Ibrahim', party: "People's Development Party", baseSupport: 0.12, strengths: ['farmers'] },
] as const;

export const voterGroups = [
  { id: 'farmers', name: 'Farmers', weight: 0.24, priorities: ['foodSecurity', 'electricity', 'development'] as const },
  { id: 'traders', name: 'Traders', weight: 0.18, priorities: ['development', 'employment', 'happiness'] as const },
  { id: 'youth', name: 'Youth', weight: 0.20, priorities: ['employment', 'education', 'electricity'] as const },
  { id: 'families', name: 'Families', weight: 0.20, priorities: ['healthcare', 'foodSecurity', 'education'] as const },
  { id: 'workers', name: 'Workers', weight: 0.10, priorities: ['employment', 'electricity', 'happiness'] as const },
  { id: 'healthcare', name: 'Health and community workers', weight: 0.08, priorities: ['healthcare', 'development', 'happiness'] as const },
] as const;
