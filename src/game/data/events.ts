import type { GameEvent } from '../../types/events';

export const gameEvents: GameEvent[] = [
  {
    id: 'fuel-scarcity', title: 'Fuel Scarcity', category: 'economic', severity: 'moderate',
    description: 'Fuel prices have increased sharply. Transport costs are rising and food distribution is becoming more expensive.',
    affectedArea: 'LGA-wide', duration: 3, cooldown: 5, trigger: { baseChance: 0.36 },
    choices: [
      { id: 'subsidize', label: 'Subsidize Transport', description: 'Protect food distribution and household budgets.', cost: 18000 },
      { id: 'prices', label: 'Allow Food Prices to Rise', description: 'Protect the treasury but reduce affordability.', cost: 0 },
      { id: 'local-processing', label: 'Encourage Local Processing', description: 'Spend now to reduce dependence on long-distance transport.', cost: 12000 },
    ],
  },
  {
    id: 'flooding', title: 'Flooding', category: 'agricultural', severity: 'major',
    description: 'Heavy rainfall has flooded farms. Food production and road access are under pressure.',
    affectedArea: 'Farm wards', duration: 4, cooldown: 6, trigger: { baseChance: 0.42, seasons: ['RAINY'] },
    choices: [
      { id: 'farms', label: 'Rebuild Farms', description: 'Restore damaged production quickly.', cost: 22000 },
      { id: 'drainage', label: 'Build Drainage', description: 'Pay more for longer-term flood protection.', cost: 35000 },
      { id: 'switch-crops', label: 'Switch Crops', description: 'Reduce the immediate loss with a lower-cost response.', cost: 9000 },
    ],
  },
  {
    id: 'drought', title: 'Dry-Season Water Stress', category: 'agricultural', severity: 'major',
    description: 'Water sources are under strain during the dry season. Crops and food reserves may suffer.',
    affectedArea: 'Farm wards', duration: 4, cooldown: 6, trigger: { baseChance: 0.35, seasons: ['DRY'], maxHappiness: 75 },
    choices: [
      { id: 'water', label: 'Emergency Water Support', description: 'Protect crops and households immediately.', cost: 24000 },
      { id: 'irrigation', label: 'Invest in Irrigation', description: 'A larger investment that strengthens future production.', cost: 42000 },
      { id: 'conserve', label: 'Conserve Water', description: 'No treasury cost, but accept a temporary food setback.', cost: 0 },
    ],
  },
  {
    id: 'crop-disease', title: 'Crop Disease Alert', category: 'agricultural', severity: 'moderate',
    description: 'A crop disease has been detected in cassava farms. Early action can contain the loss.',
    affectedArea: 'Cassava farms', duration: 3, cooldown: 7, trigger: { baseChance: 0.25, minProduction: 1 },
    choices: [
      { id: 'contain', label: 'Contain the Affected Crop', description: 'Accept a short-term production loss to protect other farms.', cost: 5000 },
      { id: 'treat', label: 'Treat the Farms', description: 'Fund agricultural intervention.', cost: 16000 },
      { id: 'ignore', label: 'Ignore the Alert', description: 'Save money now and risk a larger production decline.', cost: 0 },
    ],
  },
  {
    id: 'power-outage', title: 'Power Outage', category: 'infrastructure', severity: 'moderate',
    description: 'The grid has failed. Processing and community services are losing operating time.',
    affectedArea: 'Community', duration: 2, cooldown: 4, trigger: { baseChance: 0.38 },
    choices: [
      { id: 'generator', label: 'Use Backup Generator', description: 'Keep processing moving at a fuel cost.', cost: 14000 },
      { id: 'critical', label: 'Prioritize Critical Facilities', description: 'Protect clinics and water facilities.', cost: 6000 },
      { id: 'wait', label: 'Wait for Grid Recovery', description: 'No immediate spending, but accept lost productivity.', cost: 0 },
    ],
  },
  {
    id: 'food-contamination', title: 'Food Contamination Alert', category: 'food-safety', severity: 'major',
    description: 'A batch of processed food may be contaminated. Trust and food reserves are at risk.',
    affectedArea: 'Community stores', duration: 2, cooldown: 8, trigger: { baseChance: 0.2, minProduction: 2 },
    choices: [
      { id: 'investigate', label: 'Investigate', description: 'Pay for a careful review and protect public trust.', cost: 13000 },
      { id: 'remove', label: 'Remove the Product', description: 'Lose some stored food to reduce the risk.', cost: 0 },
      { id: 'ignore', label: 'Ignore the Alert', description: 'Save money now but risk trust and approval.', cost: 0 },
    ],
  },
  {
    id: 'transport-problem', title: 'Transport Disruption', category: 'economic', severity: 'moderate',
    description: 'Road damage and a vehicle shortage are delaying farm-to-market deliveries.',
    affectedArea: 'Market route', duration: 3, cooldown: 5, trigger: { baseChance: 0.3 },
    choices: [
      { id: 'repair', label: 'Repair the Route', description: 'Restore market access with an immediate repair.', cost: 20000 },
      { id: 'reroute', label: 'Reroute Food Vehicles', description: 'Spend less, but accept slower distribution.', cost: 8000 },
      { id: 'wait', label: 'Wait for Repairs', description: 'No cost, with a temporary employment and food hit.', cost: 0 },
    ],
  },
  {
    id: 'contractor-issue', title: 'Contractor Issue', category: 'governance', severity: 'moderate',
    description: 'A contractor working on a community road reports unexpected cost increases.',
    affectedArea: 'Road project', duration: 2, cooldown: 8, trigger: { baseChance: 0.18 },
    choices: [
      { id: 'fund', label: 'Approve Additional Funding', description: 'Keep the project moving.', cost: 18000 },
      { id: 'replace', label: 'Replace the Contractor', description: 'Protect the treasury but delay the project.', cost: 5000 },
      { id: 'investigate', label: 'Investigate', description: 'Accept a delay while checking the claim.', cost: 3000 },
    ],
  },
  {
    id: 'community-protest', title: 'Community Protest', category: 'social', severity: 'major',
    description: 'Residents have gathered outside the Local Government Secretariat after repeated service failures.',
    affectedArea: 'Community', duration: 2, cooldown: 8, trigger: { baseChance: 0.3, maxHappiness: 48 },
    choices: [
      { id: 'meet', label: 'Meet the Community', description: 'Listen and restore some trust.', cost: 4000 },
      { id: 'address', label: 'Address the Immediate Problem', description: 'Spend more for a stronger recovery.', cost: 18000 },
      { id: 'ignore', label: 'Ignore the Protest', description: 'Save money but lose approval.', cost: 0 },
    ],
  },
  {
    id: 'agricultural-opportunity', title: 'Agricultural Opportunity', category: 'opportunity', severity: 'minor',
    description: 'A regional buyer is looking for large quantities of processed cassava products.',
    affectedArea: 'Regional market', duration: 2, cooldown: 6, trigger: { baseChance: 0.25, minProduction: 3 },
    choices: [
      { id: 'accept', label: 'Accept Contract', description: 'Sell available processed goods for immediate revenue.', cost: 0 },
      { id: 'expand', label: 'Expand Processing First', description: 'Spend now for a larger future return.', cost: 15000 },
      { id: 'decline', label: 'Decline', description: 'Keep your inventory and let the opportunity pass.', cost: 0 },
    ],
  },
  {
    id: 'trade-opportunity', title: 'Trade Opportunity', category: 'opportunity', severity: 'minor',
    description: 'A neighboring market is willing to buy surplus rice from the community.',
    affectedArea: 'Neighboring market', duration: 2, cooldown: 6, trigger: { baseChance: 0.22, minFoodSecurity: 65, minProduction: 2 },
    choices: [
      { id: 'sell', label: 'Sell Immediately', description: 'Turn surplus rice into treasury now.', cost: 0 },
      { id: 'store', label: 'Store for Later', description: 'Protect food security and wait for a better price.', cost: 0 },
      { id: 'process', label: 'Process More Before Selling', description: 'Invest in processing for a better return.', cost: 10000 },
    ],
  },
];

export const eventById = (id: string) => gameEvents.find((event) => event.id === id);
