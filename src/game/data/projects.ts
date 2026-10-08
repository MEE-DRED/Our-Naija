import type { LgaProjectDefinition } from '../../types/project';

export const lgaProjects: readonly LgaProjectDefinition[] = [
  { id: 'road', name: 'Ward Connector Road', description: 'A durable road linking farms and markets.', cost: 48_000, constructionDurationDays: 18, effects: { development: 6, employment: 4, happiness: 3 }, eligibleWardTypes: ['odo-ewa', 'iyetoro', 'igbokuta', 'oke-aro'] },
  { id: 'clinic', name: 'Primary Health Clinic', description: 'A ward clinic for basic healthcare and maternal services.', cost: 72_000, constructionDurationDays: 30, effects: { development: 7, health: 12, employment: 3, happiness: 4 }, eligibleWardTypes: ['odo-ewa', 'iyetoro', 'igbokuta', 'oke-aro'] },
  { id: 'solar-mini-grid', name: 'Solar Mini-Grid', description: 'Reliable distributed power for homes, farms, and small businesses.', cost: 95_000, constructionDurationDays: 35, effects: { development: 9, electricityAccess: 22, employment: 5, happiness: 5 }, eligibleWardTypes: ['odo-ewa', 'iyetoro', 'igbokuta', 'oke-aro'] },
  { id: 'primary-school', name: 'Primary School', description: 'A local school expanding access to foundational education.', cost: 66_000, constructionDurationDays: 28, effects: { development: 8, education: 14, employment: 4, happiness: 4 }, eligibleWardTypes: ['odo-ewa', 'iyetoro', 'igbokuta', 'oke-aro'] },
];

export const projectById = (id: LgaProjectDefinition['id']) => lgaProjects.find((project) => project.id === id);
