export type WahalaCategory =
  | 'electricity' | 'fuel' | 'transport' | 'roads' | 'water' | 'healthcare'
  | 'education' | 'markets' | 'agriculture' | 'food-prices' | 'connectivity'
  | 'flooding' | 'infrastructure' | 'public-services' | 'community';

export type PetitionPriority = 'low' | 'medium' | 'high' | 'critical';
export type PetitionStatus = 'SUBMITTED' | 'RECEIVED' | 'UNDER_REVIEW' | 'ACTION_PLANNED' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED';

export interface CitizenPetition {
  id: string;
  category: WahalaCategory;
  title: string;
  message: string;
  submittedBy: string;
  ward: string;
  priority: PetitionPriority;
  status: PetitionStatus;
  affectedSystems: string[];
  impact: string;
  submittedTurn: number;
  updatedTurn: number;
}

export interface CitizenVoiceState {
  petitions: CitizenPetition[];
  history: CitizenPetition[];
  cooldown: number;
  trust: number;
}
