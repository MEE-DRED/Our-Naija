import type { CitizenPetition, PetitionPriority, WahalaCategory } from '../../types/citizenVoice';
import type { PlayerState } from '../../types/player';

interface PetitionTemplate {
  id: string;
  category: WahalaCategory;
  title: string;
  message: string;
  submittedBy: string;
  priority: PetitionPriority;
  affectedSystems: string[];
  impact: string;
  condition: (player: PlayerState) => boolean;
}

export const petitionTemplates: readonly PetitionTemplate[] = [
  { id: 'power-clinic', category: 'electricity', title: 'Clinic needs reliable power', message: 'NEPA don take light again. Clinic generator fuel don finish.', submittedBy: 'Community Health Workers', priority: 'critical', affectedSystems: ['Healthcare', 'Electricity'], impact: 'Healthcare activity and trust are falling.', condition: (p) => p.electricity < 45 },
  { id: 'farm-road', category: 'roads', title: 'Farm road is no longer motorable', message: 'Our road dey bad. Farmers cannot carry cassava to the market.', submittedBy: 'Amina Farms & 18 residents', priority: 'high', affectedSystems: ['Transport', 'Food prices', 'Agriculture'], impact: 'Transport costs rise and farm-to-market movement slows.', condition: (p) => p.foodSecurity < 55 || p.employment < 50 },
  { id: 'borehole', category: 'water', title: 'Residents request a borehole', message: 'We need a borehole closer to the homes.', submittedBy: 'Ward residents', priority: 'high', affectedSystems: ['Water', 'Public services'], impact: 'Water access is below a comfortable level.', condition: (p) => p.waterAccess < 55 },
  { id: 'clinic-capacity', category: 'healthcare', title: 'Clinic waiting times are too long', message: 'Clinic no get enough capacity for the people wey need care.', submittedBy: 'Patients and health workers', priority: 'medium', affectedSystems: ['Healthcare'], impact: 'Health outcomes and happiness are under pressure.', condition: (p) => p.health < 55 },
  { id: 'classroom', category: 'education', title: 'Parents request another classroom', message: 'Our children need more space to learn.', submittedBy: 'Parents Association', priority: 'medium', affectedSystems: ['Education'], impact: 'Education access is falling behind population needs.', condition: (p) => p.education < 50 },
  { id: 'food-prices', category: 'food-prices', title: 'Food prices are hurting households', message: 'Market prices don rise. Families need affordable staples.', submittedBy: 'Market Traders Association', priority: 'high', affectedSystems: ['Markets', 'Food prices'], impact: 'Food affordability is reducing happiness.', condition: (p) => p.foodSecurity < 60 || p.happiness < 50 },
];

export const createPetition = (template: PetitionTemplate, turn: number, index: number): CitizenPetition => ({
  id: `${template.id}-${turn}-${index}`,
  category: template.category,
  title: template.title,
  message: template.message,
  submittedBy: template.submittedBy,
  ward: 'Ward 2',
  priority: template.priority,
  status: 'SUBMITTED',
  affectedSystems: template.affectedSystems,
  impact: template.impact,
  submittedTurn: turn,
  updatedTurn: turn,
});

export type { PetitionTemplate };
