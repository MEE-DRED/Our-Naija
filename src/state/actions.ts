import { economyStore, farmingStore, gameStore, playerStore, politicsStore, lgaStore, eventStore, stateStore, citizenVoiceStore, profileStore, timeStore } from './stores';
import type { Modal, SidePanelSection } from './stores';
import { MIN_LOADING_MS } from '../config/app';
import { cropById } from '../game/data/crops';
import type { CropId, FarmState, FarmStates, ResourceId, ResourceInventory } from '../types/farming';
import { productPrices, reserveCrops, upgradeCosts, upgradeEffects } from '../game/data/economy';
import type { Transaction } from '../types/economy';
import { refreshCommunityMetrics } from '../game/systems/communityMetrics';
import type { ExpansionPlot } from '../types/world';
import { recipeFor } from '../game/data/processing';
import { campaignActions } from '../game/data/politics';
import { calculateApproval, calculateElection, eligibility, isEligible } from '../game/systems/politics';
import type { CampaignActionId, ElectionRecord } from '../types/politics';
import { projectById } from '../game/data/projects';
import { calculateFoodBalance } from '../game/systems/foodReserve';
import { calculateRevenue } from '../game/systems/revenue';
import type { LgaProjectId } from '../types/project';
import type { WardId } from '../types/ward';
import { advanceTurn, resolveEvent } from '../game/systems/events';
import { governorRequirements, stateProjects } from '../config/governor';
import { presidentialRequirements } from '../config/president';
import { runMonthlySimulation, marketPriceFor } from '../game/systems/simulation';
import { simulationNow } from '../game/systems/time';
import { ignoredTrustPenalty, petitionImpact, saveCitizenVoice } from '../game/systems/citizenVoice';
import type { CitizenPetition, PetitionStatus } from '../types/citizenVoice';
import { audioManager } from '../game/systems/audio';
import { checkAchievements, completeGovernanceAction } from '../game/systems/profile';

export const startGame = () =>
  gameStore.setState({ screen: 'loading', modal: 'none', selectedId: null, errorMessage: null, loadStartedAt: Date.now() });

export const establishProfile = (stateName: string, lgaName: string, startingCommunity: string) => {
  playerStore.setState({ stateName, lgaName, startingCommunity, communityName: startingCommunity });
  const stateId = stateName.toLowerCase().replace(/\s+/g, '-').replace('federal-capital-territory', 'fct');
  stateStore.setState({ stateId });
  try { window.localStorage.setItem('our-naija-profile', JSON.stringify({ stateName, lgaName, startingCommunity })); } catch { /* optional persistence */ }
};

export const markWorldReady = () => {
  const { loadStartedAt, screen } = gameStore.getState();
  if (screen !== 'loading') return;
  const wait = Math.max(0, MIN_LOADING_MS - (Date.now() - loadStartedAt));
  window.setTimeout(() => {
    if (gameStore.getState().screen === 'loading') gameStore.setState({ screen: 'playing' });
  }, wait);
};

export const selectEntity = (id: string | null) => { gameStore.setState({ selectedId: id }); if (id) audioManager.playSFX('select'); };
export const navigateTo = (target: string) => gameStore.setState({ navigationTarget: target });
export const openModal = (modal: Modal) => gameStore.setState({ modal });
export const closeModal = () => gameStore.setState({ modal: 'none' });
export const openSidePanel = (section: SidePanelSection = 'overview') => gameStore.setState({ sidePanelOpen: true, sidePanelSection: section });
export const closeSidePanel = () => gameStore.setState({ sidePanelOpen: false });
export const failGame = (message: string) => gameStore.setState({ screen: 'error', errorMessage: message });
export const backToTitle = () => gameStore.setState({ screen: 'title', modal: 'none', selectedId: null, errorMessage: null });

const saveFarms = (farms: FarmStates) => {
  try { window.localStorage.setItem('our-naija-farms', JSON.stringify(farms)); } catch { /* persistence is optional */ }
};
const saveResources = (resources: ResourceInventory) => {
  try { window.localStorage.setItem('our-naija-resources', JSON.stringify(resources)); } catch { /* persistence is optional */ }
};
const savePlayer = () => {
  const player = playerStore.getState();
  try {
    window.localStorage.setItem('our-naija-resources', JSON.stringify(player.resources));
    window.localStorage.setItem('our-naija-food-reserve', JSON.stringify(player.foodReserve));
    window.localStorage.setItem('our-naija-player', JSON.stringify({
      treasury: player.treasury, development: player.development, foodSecurity: player.foodSecurity,
      health: player.health, education: player.education, employment: player.employment,
      waterAccess: player.waterAccess, electricity: player.electricity, happiness: player.happiness,
      housingCapacity: player.housingCapacity, jobs: player.jobs, electricityCapacity: player.electricityCapacity,
      electricityDemand: player.electricityDemand, storageCapacity: player.storageCapacity,
    }));
    window.localStorage.setItem('our-naija-role', JSON.stringify(player.role));
    window.localStorage.setItem('our-naija-profile', JSON.stringify({ stateName: player.stateName, lgaName: player.lgaName, startingCommunity: player.startingCommunity }));
  } catch { /* persistence is optional */ }
};
export const advanceGameTurn = () => {
  advanceTurn();
  const report = runMonthlySimulation(eventStore.getState().turn);
  completeGovernanceAction('inspection');
  checkAchievements();
  notify(`Month ${eventStore.getState().turn} · ${eventStore.getState().season.toLowerCase()} · ${report.mainConcern} needs attention`);
};
export const resolveActiveEvent = (choiceId: string) => {
  const resolved = resolveEvent(choiceId);
  if (resolved) { completeGovernanceAction('services'); audioManager.playSFX('success'); checkAchievements(); notify('Decision recorded in governance history'); }
  return resolved;
};
const petitionNextStatus: Partial<Record<PetitionStatus, PetitionStatus>> = {
  SUBMITTED: 'RECEIVED', RECEIVED: 'UNDER_REVIEW', UNDER_REVIEW: 'ACTION_PLANNED',
  ACTION_PLANNED: 'IN_PROGRESS', IN_PROGRESS: 'RESOLVED',
};
export const respondToPetition = (petitionId: string, response: 'progress' | 'ignore') => {
  const voice = citizenVoiceStore.getState();
  const petition = voice.petitions.find((item) => item.id === petitionId);
  if (!petition) return false;
  if (response === 'ignore') {
    const trust = Math.max(0, voice.trust - ignoredTrustPenalty(petition));
    citizenVoiceStore.setState({
      trust,
      petitions: voice.petitions.filter((item) => item.id !== petitionId),
      history: [{ ...petition, status: 'IGNORED' as const, updatedTurn: eventStore.getState().turn }, ...voice.history].slice(0, 30),
    });
    politicsStore.setState({ approval: Math.max(0, politicsStore.getState().approval - ignoredTrustPenalty(petition)) });
    saveCitizenVoice();
    completeGovernanceAction('petition');
    audioManager.playSFX('wahala');
    notify('Citizens will remember that petition was ignored');
    return true;
  }
  const nextStatus = petitionNextStatus[petition.status];
  if (!nextStatus) return false;
  const isResolved = nextStatus === 'RESOLVED';
  const updated: CitizenPetition = { ...petition, status: nextStatus, updatedTurn: eventStore.getState().turn };
  const petitions = isResolved ? voice.petitions.filter((item) => item.id !== petitionId) : voice.petitions.map((item) => item.id === petitionId ? updated : item);
  citizenVoiceStore.setState({
    trust: Math.min(100, voice.trust + (isResolved ? petitionImpact(petition) : 0)),
    petitions,
    history: isResolved ? [{ ...updated, status: 'RESOLVED' as const }, ...voice.history].slice(0, 30) : voice.history,
  });
  if (isResolved) politicsStore.setState({ approval: Math.min(100, politicsStore.getState().approval + petitionImpact(petition)) });
  completeGovernanceAction('petition');
  if (isResolved) {
    profileStore.setState({ ...profileStore.getState(), resolvedPetitions: profileStore.getState().resolvedPetitions + 1 });
    audioManager.playSFX('success');
    checkAchievements();
  } else audioManager.playSFX('petition');
  saveCitizenVoice();
  notify(isResolved ? 'Resolution delivered · citizens noticed the improvement' : `Petition ${nextStatus.toLowerCase().replace('_', ' ')}`);
  return true;
};
export const governorEligibility = () => {
  const player = playerStore.getState();
  const lga = lgaSummary();
  const approval = politicsStore.getState().approval + politicsStore.getState().campaignApproval;
  return {
    development: lga.development, foodSecurity: lga.foodSecurity, healthcare: lga.health,
    education: lga.education, electricity: lga.electricity, employment: lga.employment,
    happiness: lga.happiness, approval,
    eligible: lga.development >= governorRequirements.development && lga.foodSecurity >= governorRequirements.foodSecurity &&
      lga.health >= governorRequirements.healthcare && lga.education >= governorRequirements.education &&
      lga.electricity >= governorRequirements.electricity && lga.employment >= governorRequirements.employment &&
      lga.happiness >= governorRequirements.happiness && approval >= governorRequirements.approval &&
      player.role === 'LOCAL_GOVERNMENT_CHAIRMAN',
  };
};
export const fundStateProject = (projectId: string) => {
  const project = stateProjects.find((item) => item.id === projectId);
  const state = stateStore.getState();
  if (!project || state.completedProjects.includes(projectId) || state.treasury < project.cost || playerStore.getState().role !== 'GOVERNOR') return false;
  stateStore.setState({
    treasury: state.treasury - project.cost,
    expenditure: state.expenditure + project.cost,
    development: Math.min(100, state.development + project.development),
    foodSecurity: Math.min(100, state.foodSecurity + project.foodSecurity),
    healthcare: Math.min(100, state.healthcare + project.healthcare),
    education: Math.min(100, state.education + project.education),
    electricity: Math.min(100, state.electricity + project.electricity),
    employment: Math.min(100, state.employment + project.employment),
    completedProjects: [...state.completedProjects, projectId],
  });
  try { window.localStorage.setItem('our-naija-state', JSON.stringify(stateStore.getState())); } catch { /* optional persistence */ }
  notify(`${project.name} funded for ${playerStore.getState().stateName}`);
  return true;
};
export const presidentialEligibility = () => {
  const player = playerStore.getState();
  const state = stateStore.getState();
  const approval = politicsStore.getState().approval + politicsStore.getState().campaignApproval;
  return {
    development: state.development, foodSecurity: state.foodSecurity, healthcare: state.healthcare,
    education: state.education, electricity: state.electricity, employment: state.employment,
    happiness: state.happiness, approval,
    eligible: player.role === 'GOVERNOR' && state.development >= presidentialRequirements.development &&
      state.foodSecurity >= presidentialRequirements.foodSecurity && state.healthcare >= presidentialRequirements.healthcare &&
      state.education >= presidentialRequirements.education && state.electricity >= presidentialRequirements.electricity &&
      state.employment >= presidentialRequirements.employment && state.happiness >= presidentialRequirements.happiness &&
      approval >= presidentialRequirements.approval,
  };
};
export const runPresidentialElection = (campaignSupport: number) => {
  const eligible = presidentialEligibility();
  if (!eligible.eligible) return { won: false, share: 0 };
  const performance = (eligible.development + eligible.foodSecurity + eligible.healthcare + eligible.education +
    eligible.electricity + eligible.employment + eligible.happiness + eligible.approval) / 8;
  const share = Math.max(25, Math.min(72, Math.round(35 + (performance - 70) * 0.55 + campaignSupport + (Math.random() * 12 - 6))));
  const won = share >= 51;
  if (won) {
    playerStore.setState({ role: 'PRESIDENT' });
    savePlayer();
  }
  notify(won ? 'You were elected President of Nigeria' : 'The Presidential Election was lost · your governorship continues');
  return { won, share };
};
const saveEconomy = () => {
  const economy = economyStore.getState();
  try {
    window.localStorage.setItem('our-naija-building-levels', JSON.stringify(economy.buildingLevels));
    window.localStorage.setItem('our-naija-transactions', JSON.stringify(economy.transactions));
    window.localStorage.setItem('our-naija-processing', JSON.stringify(economy.processing));
  } catch { /* persistence is optional */ }
};
const savePolitics = () => {
  try { window.localStorage.setItem('our-naija-politics', JSON.stringify(politicsStore.getState())); } catch { /* persistence is optional */ }
};
const saveLga = () => {
  try { window.localStorage.setItem('our-naija-lga', JSON.stringify(lgaStore.getState())); } catch { /* persistence is optional */ }
};
const notify = (message: string) => {
  economyStore.setState({ notification: message });
  window.setTimeout(() => {
    if (economyStore.getState().notification === message) economyStore.setState({ notification: null });
  }, 3200);
};
const record = (transaction: Transaction) => {
  economyStore.setState({ transactions: [transaction, ...economyStore.getState().transactions].slice(0, 8) });
  saveEconomy();
};

export const farmStateAt = (farmId: string, now = simulationNow()): FarmState => {
  const state = farmingStore.getState().farms[farmId] ?? { status: 'EMPTY', cropId: null, plantedAt: null };
  const crop = cropById(state.cropId);
  if (!crop || !state.plantedAt || state.status === 'READY_TO_HARVEST') return state;
  if (now - state.plantedAt >= crop.growthMs) return { ...state, status: 'READY_TO_HARVEST' };
  return { ...state, status: now - state.plantedAt < 1_000 ? 'PLANTED' : 'GROWING' };
};

export const plantCrop = (farmId: string, cropId: CropId) => {
  const state = { status: 'PLANTED' as const, cropId, plantedAt: Date.now() };
  const farms = { ...farmingStore.getState().farms, [farmId]: state };
  farmingStore.setState({ farms }); saveFarms(farms);
};

export const harvestFarm = (farmId: string): number => {
  const state = farmStateAt(farmId);
  const crop = cropById(state.cropId);
  if (state.status !== 'READY_TO_HARVEST' || !crop) return 0;
  const player = playerStore.getState();
  const stored = Object.values(player.resources).reduce((sum, value) => sum + value, 0);
  if (stored + crop.harvestAmount > player.storageCapacity) { notify('Community Storage is full'); return 0; }
  const resources = { ...player.resources, [crop.id]: player.resources[crop.id] + crop.harvestAmount };
  const farms = { ...farmingStore.getState().farms, [farmId]: { status: 'EMPTY' as const, cropId: null, plantedAt: null } };
  farmingStore.setState({ farms }); playerStore.setState({ resources }); saveFarms(farms); saveResources(resources);
  profileStore.setState({ ...profileStore.getState(), harvests: profileStore.getState().harvests + 1 });
  completeGovernanceAction();
  checkAchievements();
  record({ type: 'HARVEST', resource: crop.id, quantity: crop.harvestAmount, amount: crop.harvestAmount, message: `Harvested ${crop.harvestAmount} ${crop.name}`, timestamp: Date.now() });
  audioManager.playSFX('success');
  notify(`+${crop.harvestAmount} ${crop.name}`);
  return crop.harvestAmount;
};

export const sellCrop = (cropId: ResourceId, quantity: number) => {
  const player = playerStore.getState();
  const amountToSell = Math.max(0, Math.min(Math.floor(quantity), player.resources[cropId]));
  if (!amountToSell) return false;
  const price = cropId in productPrices ? productPrices[cropId as keyof typeof productPrices] : marketPriceFor(cropId as CropId);
  const amount = amountToSell * price;
  const resources = { ...player.resources, [cropId]: player.resources[cropId] - amountToSell };
  playerStore.setState({ resources, treasury: player.treasury + amount });
  savePlayer();
  refreshCommunityMetrics();
  savePlayer();
  const name = cropById(cropId as CropId)?.name ?? cropId;
  record({ type: 'SALE', resource: cropId, quantity: amountToSell, amount, message: `Sold ${amountToSell} ${name} for ₦${amount.toLocaleString()}`, timestamp: Date.now() });
  notify(`Sold ${amountToSell} ${name} · +₦${amount.toLocaleString()}`);
  return true;
};

export const addToFoodReserve = (cropId: CropId, quantity: number) => {
  if (!reserveCrops.includes(cropId)) return false;
  const player = playerStore.getState();
  const amount = Math.max(0, Math.min(Math.floor(quantity), player.resources[cropId]));
  if (!amount) return false;
  const resources = { ...player.resources, [cropId]: player.resources[cropId] - amount };
  const foodReserve = { ...player.foodReserve, [cropId]: player.foodReserve[cropId] + amount };
  const foodSecurity = Math.min(100, player.foodSecurity + Math.min(5, amount / 5));
  playerStore.setState({ resources, foodReserve, foodSecurity });
  savePlayer();
  refreshCommunityMetrics();
  savePlayer();
  const name = cropById(cropId)?.name ?? cropId;
  record({ type: 'RESERVE', resource: cropId, quantity: amount, amount: 0, message: `Added ${amount} ${name} to Food Reserve`, timestamp: Date.now() });
  notify(`Food Reserve +${amount} ${name} · Food Security +${Math.min(5, amount / 5).toFixed(1)}%`);
  return true;
};

export const startProcessing = (facilityId: string) => {
  const recipe = recipeFor(facilityId);
  const player = playerStore.getState();
  const economy = economyStore.getState();
  if (!recipe || economy.processing || player.resources[recipe.input] < recipe.inputQuantity || player.treasury < recipe.cost ||
      player.electricityCapacity - player.electricityDemand < recipe.electricityRequired) return false;
  const resources = { ...player.resources, [recipe.input]: player.resources[recipe.input] - recipe.inputQuantity };
  playerStore.setState({ resources, treasury: player.treasury - recipe.cost, electricityDemand: player.electricityDemand + recipe.electricityRequired, jobs: player.jobs + recipe.jobs });
  economyStore.setState({ processing: { facilityId, recipeId: facilityId, startedAt: Date.now() } });
  savePlayer(); saveEconomy(); notify(`${recipe.name} started`);
  return true;
};

export const processingState = (now = simulationNow()) => {
  const job = economyStore.getState().processing;
  const recipe = job ? recipeFor(job.facilityId) : undefined;
  if (!job || !recipe) return { job: null, recipe: undefined, progress: 0, ready: false };
  const progress = Math.min(100, Math.floor(((now - job.startedAt) / recipe.processingMs) * 100));
  return { job, recipe, progress, ready: progress >= 100 };
};

export const collectProcessing = () => {
  const state = processingState();
  if (!state.ready || !state.recipe) return false;
  const player = playerStore.getState();
  const stored = Object.values(player.resources).reduce((sum, value) => sum + value, 0);
  if (stored + state.recipe.outputQuantity > player.storageCapacity) { notify('Community Storage is full'); return false; }
  const resources = { ...player.resources, [state.recipe.output]: player.resources[state.recipe.output] + state.recipe.outputQuantity };
  playerStore.setState({ resources, electricityDemand: Math.max(0, player.electricityDemand - state.recipe.electricityRequired) });
  economyStore.setState({ processing: null });
  savePlayer(); saveEconomy(); notify(`+${state.recipe.outputQuantity} ${state.recipe.outputName} produced`);
  return true;
};

export const getBuildingLevel = (id: string) => economyStore.getState().buildingLevels[id]?.level ?? 1;

export const upgradeBuilding = (id: string) => {
  const player = playerStore.getState();
  const cost = upgradeCosts[id];
  if (!cost || getBuildingLevel(id) >= 2 || player.treasury < cost) return false;
  const buildingLevels = { ...economyStore.getState().buildingLevels, [id]: { level: 2 } };
  const special = id === 'storage' ? { storageCapacity: player.storageCapacity + 500 } :
    id === 'solar-farm' ? { electricityCapacity: player.electricityCapacity + 30 } :
    id === 'biogas-plant' ? { electricityCapacity: player.electricityCapacity + 20 } : {};
  playerStore.setState({ treasury: player.treasury - cost, development: Math.min(100, player.development + 2), ...special });
  economyStore.setState({ buildingLevels });
  profileStore.setState({ ...profileStore.getState(), completedUpgrades: profileStore.getState().completedUpgrades + 1 });
  completeGovernanceAction();
  checkAchievements();
  audioManager.playSFX('success');
  savePlayer(); saveEconomy();
  const effect = upgradeEffects[id] ?? 'Community improvement';
  record({ type: 'UPGRADE', amount: -cost, message: `Upgraded ${id} · Development +2`, timestamp: Date.now() });
  notify(`${effect} · -₦${cost.toLocaleString()}`);
  refreshCommunityMetrics();
  savePlayer();
  return true;
};

export const unlockExpansion = (plot: ExpansionPlot) => {
  const player = playerStore.getState();
  if (economyStore.getState().expansions[plot.id] || player.development < plot.developmentRequired || player.treasury < plot.cost) return false;
  const expansions = { ...economyStore.getState().expansions, [plot.id]: true };
  playerStore.setState({ treasury: player.treasury - plot.cost });
  economyStore.setState({ expansions });
  try { window.localStorage.setItem('our-naija-expansions', JSON.stringify(expansions)); } catch { /* persistence is optional */ }
  refreshCommunityMetrics();
  savePlayer();
  notify(`${plot.name} unlocked · -₦${plot.cost.toLocaleString()}`);
  return true;
};

export const refreshPoliticalApproval = () => {
  const player = playerStore.getState();
  const lga = player.role === 'LOCAL_GOVERNMENT_CHAIRMAN' ? lgaSummary() : null;
  const result = calculateApproval(lga ? {
    ...player, foodSecurity: lga.foodSecurity, health: lga.health, education: lga.education,
    employment: lga.employment, electricity: lga.electricity, happiness: lga.happiness, development: lga.development,
  } : player);
  const current = politicsStore.getState();
  const phase = current.phase === 'LOCKED' && isEligible(player) ? 'CAMPAIGN' : current.phase;
  politicsStore.setState({ approval: result.approval, approvalFactors: result.factors, phase });
  savePolitics();
  return { ...result, requirements: eligibility(player), phase };
};

export const startElection = () => {
  const current = refreshPoliticalApproval();
  if (!isEligible(playerStore.getState()) || !['CAMPAIGN', 'LOST'].includes(current.phase)) return false;
  politicsStore.setState({ phase: 'ELECTION_READY' });
  savePolitics();
  notify('Election Day is ready · review the candidates');
  return true;
};

export const runElection = () => {
  const political = politicsStore.getState();
  if (political.phase !== 'ELECTION_READY') return null;
  const shares = calculateElection(playerStore.getState(), political);
  const playerShare = shares[0];
  const won = playerShare > Math.max(...shares.slice(1));
  const record: ElectionRecord = {
    number: political.electionNumber, position: 'LOCAL_GOVERNMENT_CHAIRMAN',
    result: won ? 'WON' : 'LOST', playerShare, date: Date.now(), gameYear: timeStore.getState().year,
  };
  politicsStore.setState({
    phase: won ? 'WON' : 'LOST', lastResult: record.result,
    electionHistory: [record, ...political.electionHistory],
    electionNumber: political.electionNumber + 1,
  });
  if (won) playerStore.setState({ role: 'LOCAL_GOVERNMENT_CHAIRMAN' });
  if (won) {
    const profile = profileStore.getState();
    profileStore.setState({ ...profile, electionsWon: profile.electionsWon + 1, bestElectionShare: Math.max(profile.bestElectionShare, playerShare) });
  }
  audioManager.playSFX(won ? 'election' : 'wahala');
  checkAchievements();
  savePolitics(); savePlayer();
  notify(won ? 'You won the Local Government Chairman election' : 'You lost the election · keep serving the community');
  return { shares, won, record };
};

export const useCampaignAction = (id: CampaignActionId) => {
  const action = campaignActions[id];
  const political = politicsStore.getState();
  const player = playerStore.getState();
  if (!action || !['CAMPAIGN', 'LOST'].includes(political.phase) || political.campaignUses[id] >= action.maximum || player.treasury < action.cost) return false;
  politicsStore.setState({
    campaignApproval: political.campaignApproval + action.approval,
    campaignSpent: political.campaignSpent + action.cost,
    campaignUses: { ...political.campaignUses, [id]: political.campaignUses[id] + 1 },
  });
  playerStore.setState({ treasury: player.treasury - action.cost });
  savePolitics(); savePlayer();
  notify(`${action.name} completed · approval +${action.approval}`);
  return true;
};

export const resolveCampaignEvent = (choice: 'promise' | 'repair' | 'limited') => {
  const political = politicsStore.getState();
  const player = playerStore.getState();
  if (!['CAMPAIGN', 'LOST'].includes(political.phase)) return false;
  const options = {
    promise: { cost: 0, approval: 1, message: 'You promised to improve market access · traders will remember' },
    repair: { cost: 15000, approval: 4, message: 'You funded immediate market repairs · traders are encouraged' },
    limited: { cost: 0, approval: -1, message: 'You explained the treasury limits · trust remains cautious' },
  }[choice];
  if (player.treasury < options.cost) return false;
  politicsStore.setState({ campaignApproval: Math.max(0, political.campaignApproval + options.approval), campaignSpent: political.campaignSpent + options.cost });
  playerStore.setState({ treasury: player.treasury - options.cost });
  savePolitics(); savePlayer(); notify(options.message);
  return true;
};

const applyCompletedProjects = () => {
  const now = Date.now();
  const state = lgaStore.getState();
  let changed = false;
  const wards = { ...state.wards };
  let development = state.development;
  for (const project of state.projects) {
    if (project.completesAt > now) continue;
    const ward = wards[project.wardId];
    if (!ward || ward.completedProjects.includes(project.projectId)) continue;
    const definition = projectById(project.projectId);
    if (!definition) continue;
    const metrics = { ...ward.metrics };
    for (const [key, value] of Object.entries(definition.effects)) {
      if (key in metrics) metrics[key as keyof typeof metrics] = Math.min(100, metrics[key as keyof typeof metrics] + (value ?? 0));
    }
    wards[project.wardId] = {
      ...ward, metrics, serviceAccess: Math.round((metrics.health + metrics.education + metrics.electricityAccess + metrics.waterAccess) / 4),
      completedProjects: [...ward.completedProjects, project.projectId],
    };
    development = Math.min(100, development + definition.effects.development);
    changed = true;
  }
  if (changed) { lgaStore.setState({ wards, development }); saveLga(); }
};

export const collectLgaRevenue = () => {
  applyCompletedProjects();
  const state = lgaStore.getState();
  const transactions = economyStore.getState().transactions.filter((item) => item.timestamp > state.lastRevenueAt);
  const activity = {
    marketTransactions: transactions.filter((item) => item.type === 'SALE').reduce((sum, item) => sum + (item.amount > 0 ? item.amount : 0), 0),
    agriculturalUnits: transactions.filter((item) => item.type === 'HARVEST').reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    processedUnits: transactions.filter((item) => item.type === 'PROCESSING').reduce((sum, item) => sum + (item.quantity ?? 0), 0),
  };
  const breakdown = calculateRevenue(activity);
  if (!breakdown.total) return breakdown;
  const player = playerStore.getState();
  lgaStore.setState({ treasury: state.treasury + breakdown.total, lastRevenueAt: Date.now() });
  playerStore.setState({ treasury: player.treasury + breakdown.total });
  saveLga(); savePlayer();
  notify(`LGA revenue collected · +₦${breakdown.total.toLocaleString()}`);
  return breakdown;
};

export const startLgaProject = (projectId: LgaProjectId, wardId: WardId) => {
  applyCompletedProjects();
  const definition = projectById(projectId);
  const state = lgaStore.getState();
  const player = playerStore.getState();
  if (player.role !== 'LOCAL_GOVERNMENT_CHAIRMAN' || !definition || !state.wards[wardId] || player.treasury < definition.cost ||
      state.projects.some((project) => project.wardId === wardId && project.projectId === projectId && project.completesAt > Date.now())) return false;
  const project = { projectId, wardId, startedAt: Date.now(), completesAt: Date.now() + definition.constructionDurationDays * 1000 };
  lgaStore.setState({ projects: [...state.projects, project], treasury: Math.max(0, state.treasury - definition.cost) });
  playerStore.setState({ treasury: player.treasury - definition.cost });
  saveLga(); savePlayer(); notify(`${definition.name} started in Ward ${state.wards[wardId].population}`);
  return true;
};

export const retainLgaSurplus = () => {
  const balance = calculateFoodBalance(lgaStore.getState());
  if (balance.surplus <= 0) return false;
  const state = lgaStore.getState();
  const retained = Math.min(balance.surplus, state.storageCapacity - state.foodReserve);
  if (retained <= 0) return false;
  lgaStore.setState({ foodReserve: state.foodReserve + retained });
  saveLga(); notify(`LGA Food Reserve +${retained} units`);
  return true;
};

export const lgaSummary = () => {
  applyCompletedProjects();
  const state = lgaStore.getState();
  const wards = Object.values(state.wards);
  const population = wards.reduce((sum, ward) => sum + ward.population, 0);
  const average = (key: 'health' | 'education' | 'employment' | 'electricityAccess' | 'happiness') =>
    Math.round(wards.reduce((sum, ward) => sum + ward.metrics[key], 0) / Math.max(1, wards.length));
  const balance = calculateFoodBalance(state);
  const foodSecurity = Math.min(100, Math.round((balance.production + state.foodReserve) / Math.max(1, balance.demand) * 100));
  const development = Math.min(100, Math.round((average('health') + average('education') + average('employment') + average('electricityAccess') + foodSecurity) / 5));
  const result = { population, foodSecurity, health: average('health'), education: average('education'), employment: average('employment'), electricity: average('electricityAccess'), happiness: average('happiness'), development, balance, revenue: state.treasury };
  return result;
};
