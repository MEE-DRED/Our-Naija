import { createStore } from './createStore';
import { ACTIVE_LEVEL } from '../config/leadership';
import { communityWorld } from '../game/data/communityWorld';
import type { PlayerState } from '../types/player';
import type { WorldDefinition } from '../types/world';
import type { FarmStates, ResourceInventory } from '../types/farming';
import type { BuildingLevels, Transaction } from '../types/economy';
import type { ExpansionUnlocks } from '../types/community';
import type { ProcessingJob } from '../types/processing';
import type { PoliticalState } from '../types/politics';
import type { LeadershipLevel } from '../types/leadership';
import type { LgaState } from '../types/lga';
import { initialLgaState } from '../game/data/lga';
import type { EventState } from '../types/events';
import type { StateState } from '../types/nigeria';
import type { CropId } from '../types/farming';
import type { SimulationReport } from '../types/simulation';
import type { GameTime } from '../types/time';
import type { CitizenVoiceState } from '../types/citizenVoice';
import type { PlayerProfileState } from '../types/profile';
import { regionById } from '../game/data/nigeria';
import { nigeriaRegions } from '../game/data/nigeria';
import { marketPrices } from '../game/data/economy';

const emptyResources = (): ResourceInventory => ({
  cassava: 0, maize: 0, rice: 0, tomatoes: 0, yam: 0, millet: 0, sorghum: 0, cowpea: 0, groundnut: 0, soybean: 0,
  pepper: 0, okra: 0, onion: 0, leafyVegetables: 0, cocoa: 0, oilPalm: 0, cashew: 0,
  garri: 0, fufu: 0, cassavaFlour: 0, starch: 0, milledRice: 0, packagedRice: 0, tomatoPaste: 0, tomatoSauce: 0,
  maizeFlour: 0, maizeMeal: 0, maizeFeed: 0,
});
const emptyFarm = (): FarmStates => Object.fromEntries(
  communityWorld.farmPlots.map((plot) => [plot.id, { status: 'EMPTY', cropId: null, plantedAt: null }]),
);
const readSave = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};
const defaultPlayer = {
  treasury: 125000, development: 18, foodSecurity: 72, health: 68, education: 55,
  employment: 62, waterAccess: 70, electricity: 48, happiness: 68, housingCapacity: 140, jobs: 78,
  electricityCapacity: 75, electricityDemand: 58, storageCapacity: 500,
};
const savedPlayer = { ...defaultPlayer, ...readSave<Partial<typeof defaultPlayer>>('our-naija-player', {}) };
const savedRole = readSave<LeadershipLevel>('our-naija-role', ACTIVE_LEVEL);
const savedProfile = readSave<Partial<Pick<PlayerState, 'stateName' | 'lgaName' | 'startingCommunity'>>>('our-naija-profile', {});
const savedResources = { ...emptyResources(), ...readSave<Partial<ResourceInventory>>('our-naija-resources', {}) };
const savedFoodReserve = { ...emptyResources(), ...readSave<Partial<ResourceInventory>>('our-naija-food-reserve', {}) };
const defaultPriceIndex = Object.fromEntries(Object.keys(marketPrices).map((crop) => [crop, 1])) as Record<CropId, number>;
const savedPriceIndex = { ...defaultPriceIndex, ...readSave<Partial<Record<CropId, number>>>('our-naija-market-prices', {}) };

export type Screen = 'title' | 'loading' | 'playing' | 'error';
export type Modal = 'none' | 'about' | 'settings' | 'dashboard' | 'profile' | 'politics' | 'lga' | 'events' | 'location' | 'governor' | 'nigeria' | 'president';
export type SidePanelSection = 'overview' | 'agriculture' | 'economy' | 'services' | 'politics' | 'events';

/** Game/session state: which screen, what is selected. */
export const gameStore = createStore<{
  screen: Screen; modal: Modal; selectedId: string | null; errorMessage: string | null; loadStartedAt: number; navigationTarget: string | null;
  sidePanelOpen: boolean; sidePanelSection: SidePanelSection;
}>({ screen: 'title', modal: 'none', selectedId: null, errorMessage: null, loadStartedAt: 0, navigationTarget: null, sidePanelOpen: false, sidePanelSection: 'overview' });

/** Player state and the resource inventory earned from farming. */
export const playerStore = createStore<PlayerState>({
  role: savedRole, stateName: savedProfile.stateName ?? 'Ogun', lgaName: savedProfile.lgaName ?? 'Odo-Ewa LGA',
  startingCommunity: savedProfile.startingCommunity ?? 'Odo-Ewa Community',
  communityName: savedProfile.startingCommunity ?? 'Odo-Ewa Community',
  population: 124, foodSecurity: savedPlayer.foodSecurity, treasury: savedPlayer.treasury, development: savedPlayer.development, happiness: savedPlayer.happiness,
  resources: savedResources,
  foodReserve: savedFoodReserve,
  health: savedPlayer.health, education: savedPlayer.education, employment: savedPlayer.employment,
  waterAccess: savedPlayer.waterAccess, electricity: savedPlayer.electricity,
  housingCapacity: savedPlayer.housingCapacity, jobs: savedPlayer.jobs,
  electricityCapacity: savedPlayer.electricityCapacity, electricityDemand: savedPlayer.electricityDemand,
  storageCapacity: savedPlayer.storageCapacity,
});

const defaultEventState: EventState = { turn: 0, season: 'RAINY', active: null, history: [], cooldowns: {} };
export const eventStore = createStore<EventState>(readSave<EventState>('our-naija-events', defaultEventState));
const defaultGameTime: GameTime = { day: 1, month: 7, year: 2027, minute: 8 * 60, speed: 1, paused: false, pausedAt: null, pausedDuration: 0, weather: 'RAIN' };
export const timeStore = createStore<GameTime>({ ...defaultGameTime, ...readSave<Partial<GameTime>>('our-naija-time', {}) });
const selectedRegion = regionById(nigeriaRegions.find((region) => region.name === playerStore.getState().stateName)?.id ?? 'ogun')!;
const defaultStateState: StateState = {
  stateId: selectedRegion.id, population: 1000000, development: 42, foodProduction: 680, foodSecurity: 64,
  foodDemand: 620, foodReserve: 120, processingCapacity: 80, healthcare: 58,
  education: 61, electricity: 52, employment: 57, happiness: 60, treasury: 350000,
  revenue: 0, expenditure: 0, completedProjects: [], activePolicy: null,
};
export const stateStore = createStore<StateState>({
  ...defaultStateState,
  ...readSave<Partial<StateState>>('our-naija-state', {}),
  stateId: readSave<Partial<StateState>>('our-naija-state', {}).stateId ?? selectedRegion.id,
});

/** World definition plus the lightweight local farm save. */
export const worldStore = createStore<{ world: WorldDefinition }>({ world: communityWorld });
export const farmingStore = createStore<{ farms: FarmStates }>({ farms: readSave('our-naija-farms', emptyFarm()) });
export const economyStore = createStore<{
  buildingLevels: BuildingLevels;
  transactions: Transaction[];
  notification: string | null;
  expansions: ExpansionUnlocks;
  processing: ProcessingJob | null;
  priceIndex: Record<CropId, number>;
}>({
  buildingLevels: readSave('our-naija-building-levels', {}),
  transactions: readSave('our-naija-transactions', []),
  notification: null,
  expansions: readSave('our-naija-expansions', {}),
  processing: readSave<ProcessingJob | null>('our-naija-processing', null),
  priceIndex: savedPriceIndex,
});
const defaultSimulationReport: SimulationReport = {
  turn: 0, foodSecurity: playerStore.getState().foodSecurity, foodSecurityDelta: 0,
  employment: playerStore.getState().employment, employmentDelta: 0,
  electricity: playerStore.getState().electricity, electricityDelta: 0,
  happiness: playerStore.getState().happiness, happinessDelta: 0,
  approval: 0, approvalDelta: 0, treasury: playerStore.getState().treasury, treasuryDelta: 0,
  mainStrength: 'Community foundations', mainConcern: 'Keep investing in food and services',
  priceIndex: defaultPriceIndex,
};
export const simulationStore = createStore<{ report: SimulationReport }>({
  report: readSave<SimulationReport>('our-naija-simulation-report', defaultSimulationReport),
});

const defaultPolitical: PoliticalState = {
  phase: 'LOCKED', approval: 0,
  approvalFactors: { foodSecurity: 0, healthcare: 0, education: 0, electricity: 0, employment: 0, happiness: 0, development: 0, treasury: 0 },
  campaignApproval: 0, campaignSpent: 0,
  campaignUses: { meeting: 0, food: 0, health: 0, education: 0, youth: 0, infrastructure: 0, market: 0 },
  electionNumber: 1, electionHistory: [], lastResult: null,
};
export const politicsStore = createStore<PoliticalState>({
  ...defaultPolitical,
  ...readSave<Partial<PoliticalState>>('our-naija-politics', {}),
  campaignUses: { ...defaultPolitical.campaignUses, ...readSave<Partial<PoliticalState>>('our-naija-politics', {}).campaignUses },
});
const savedCitizenVoice = readSave<Partial<CitizenVoiceState>>('our-naija-citizen-voice', {});
export const citizenVoiceStore = createStore<CitizenVoiceState>({
  petitions: savedCitizenVoice.petitions ?? [], history: savedCitizenVoice.history ?? [],
  cooldown: savedCitizenVoice.cooldown ?? 0, trust: savedCitizenVoice.trust ?? 58,
});
const defaultProfile: PlayerProfileState = {
  administration: 1, communitiesDeveloped: 1, lgasGoverned: 1, statesGoverned: 0, presidentialTerms: 0,
  resolvedPetitions: 0, harvests: 0, completedUpgrades: 0, electionsWon: 0, bestElectionShare: 0,
  achievements: [], history: [], governanceStreak: 0, bestStreak: 0, lastActionDay: null, dailyTask: null,
};
export const profileStore = createStore<PlayerProfileState>({ ...defaultProfile, ...readSave<Partial<PlayerProfileState>>('our-naija-profile-stats', {}) });

const savedLga = readSave<Partial<LgaState>>('our-naija-lga', {});
const freshLga = initialLgaState();
export const lgaStore = createStore<LgaState>({
  ...freshLga,
  ...savedLga,
  wards: Object.fromEntries(Object.entries(freshLga.wards).map(([id, ward]) => [id, {
    ...ward, ...(savedLga.wards?.[id as keyof typeof freshLga.wards] ?? {}),
    metrics: { ...ward.metrics, ...(savedLga.wards?.[id as keyof typeof freshLga.wards]?.metrics ?? {}) },
    completedProjects: savedLga.wards?.[id as keyof typeof freshLga.wards]?.completedProjects ?? ward.completedProjects,
  }])) as LgaState['wards'],
  projects: savedLga.projects ?? freshLga.projects,
});
