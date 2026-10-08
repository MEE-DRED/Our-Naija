export const governorRequirements = {
  development: 80, foodSecurity: 80, healthcare: 70, education: 70,
  electricity: 70, employment: 70, happiness: 75, approval: 70,
} as const;

export const stateProjects = [
  { id: 'processing-hub', name: 'Agricultural Processing Hub', description: 'Raises state processing capacity and employment.', cost: 90000, development: 4, foodSecurity: 3, healthcare: 0, education: 0, electricity: 0, employment: 5 },
  { id: 'rural-roads', name: 'State Rural Road Programme', description: 'Improves transport between LGAs.', cost: 75000, development: 4, foodSecurity: 2, healthcare: 0, education: 0, electricity: 0, employment: 3 },
  { id: 'state-hospital', name: 'State Hospital', description: 'Improves healthcare across the state.', cost: 110000, development: 4, foodSecurity: 0, healthcare: 8, education: 0, electricity: 0, employment: 2 },
  { id: 'extension', name: 'Agricultural Extension Programme', description: 'Improves agricultural productivity.', cost: 65000, development: 3, foodSecurity: 6, healthcare: 0, education: 2, electricity: 0, employment: 3 },
  { id: 'technical-college', name: 'State Technical College', description: 'Improves skilled employment.', cost: 85000, development: 4, foodSecurity: 0, healthcare: 0, education: 8, electricity: 0, employment: 6 },
  { id: 'electricity-expansion', name: 'Electricity Expansion', description: 'Extends reliable power to more LGAs.', cost: 100000, development: 5, foodSecurity: 0, healthcare: 0, education: 0, electricity: 8, employment: 3 },
] as const;
