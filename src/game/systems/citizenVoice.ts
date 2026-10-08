import { petitionTemplates, createPetition } from '../data/petitions';
import { citizenVoiceStore, eventStore, playerStore } from '../../state/stores';
import type { CitizenPetition, PetitionStatus } from '../../types/citizenVoice';
import { audioManager } from './audio';

const save = () => {
  try { window.localStorage.setItem('our-naija-citizen-voice', JSON.stringify(citizenVoiceStore.getState())); } catch { /* persistence is optional */ }
};

const priorityWeight: Record<CitizenPetition['priority'], number> = { low: 1, medium: 2, high: 3, critical: 4 };

export const generatePetition = () => {
  const voice = citizenVoiceStore.getState();
  const player = playerStore.getState();
  const turn = eventStore.getState().turn;
  if (voice.cooldown > 0 || voice.petitions.length >= 4) return null;
  const activeIds = new Set(voice.petitions.map((petition) => petition.category));
  const eligible = petitionTemplates.filter((template) => template.condition(player) && !activeIds.has(template.category));
  if (!eligible.length) return null;
  const template = eligible.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])[0];
  const petition = createPetition(template, turn, voice.history.length + voice.petitions.length);
  citizenVoiceStore.setState({ petitions: [petition, ...voice.petitions], cooldown: 2 });
  audioManager.playSFX('petition');
  save();
  return petition;
};

export const advancePetitions = () => {
  const voice = citizenVoiceStore.getState();
  const petitions = voice.petitions.map((petition) => petition.status === 'SUBMITTED'
    ? { ...petition, status: 'RECEIVED' as PetitionStatus, updatedTurn: eventStore.getState().turn }
    : petition);
  citizenVoiceStore.setState({ petitions, cooldown: Math.max(0, voice.cooldown - 1) });
  return generatePetition();
};

export const petitionImpact = (petition: CitizenPetition) => priorityWeight[petition.priority];

export const saveCitizenVoice = save;

export const responseLabel = (status: PetitionStatus): string | undefined => ({
  SUBMITTED: 'Receive petition',
  RECEIVED: 'Investigate',
  UNDER_REVIEW: 'Plan action',
  ACTION_PLANNED: 'Start work',
  IN_PROGRESS: 'Resolve',
}[status as 'SUBMITTED' | 'RECEIVED' | 'UNDER_REVIEW' | 'ACTION_PLANNED' | 'IN_PROGRESS']);

export const ignoredTrustPenalty = (petition: CitizenPetition) => Math.max(1, petitionImpact(petition));
