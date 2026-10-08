import { eventById, gameEvents } from '../data/events';
import type { ActiveEvent, EventConsequence, EventHistoryEntry, EventState, Season } from '../../types/events';
import { eventStore, playerStore, politicsStore } from '../../state/stores';
import { refreshCommunityMetrics } from './communityMetrics';

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const save = () => {
  try { window.localStorage.setItem('our-naija-events', JSON.stringify(eventStore.getState())); } catch { /* optional persistence */ }
};

export const initialEventState = (): EventState => ({ turn: 0, season: 'RAINY', active: null, history: [], cooldowns: {} });

const seasonForTurn = (turn: number): Season => {
  const phase = turn % 12;
  return phase < 5 ? 'RAINY' : phase < 9 ? 'DRY' : 'HARMATTAN';
};

const eligible = (event: typeof gameEvents[number]) => {
  const player = playerStore.getState();
  const state = eventStore.getState();
  const production = Object.values(player.resources).reduce((sum, amount) => sum + amount, 0);
  const trigger = event.trigger;
  return (!trigger.seasons || trigger.seasons.includes(state.season))
    && (trigger.minFoodSecurity === undefined || player.foodSecurity >= trigger.minFoodSecurity)
    && (trigger.maxHappiness === undefined || player.happiness <= trigger.maxHappiness)
    && (trigger.minProduction === undefined || production >= trigger.minProduction);
};

export const advanceTurn = () => {
  const previous = eventStore.getState();
  const turn = previous.turn + 1;
  const season = seasonForTurn(turn);
  const cooldowns = Object.fromEntries(Object.entries(previous.cooldowns).map(([id, until]) => [id, Math.max(0, until - 1)]));
  const next: EventState = { ...previous, turn, season, cooldowns };
  if (next.active && turn >= next.active.expiresTurn) {
    next.history = [{ eventId: next.active.eventId, title: eventById(next.active.eventId)?.title ?? next.active.eventId, turn, decision: 'Expired', outcome: 'The situation passed without a final intervention.' }, ...next.history].slice(0, 20);
    next.active = null;
  }
  eventStore.setState(next);
  if (!next.active) {
    const candidates = gameEvents.filter((event) => eligible(event) && !next.cooldowns[event.id]);
    const candidate = candidates.find((event) => Math.random() < event.trigger.baseChance);
    if (candidate) {
      const active: ActiveEvent = {
        eventId: candidate.id, startedTurn: turn, expiresTurn: turn + candidate.duration,
        effects: { treasury: 0, foodSecurity: 0, happiness: 0, approval: 0, electricity: 0, employment: 0 },
      };
      eventStore.setState({ active, cooldowns: { ...next.cooldowns, [candidate.id]: candidate.cooldown } });
    }
  }
  save();
};

const consequenceFor = (eventId: string, choiceId: string): EventConsequence => {
  const neutral: EventConsequence = { treasury: 0, foodSecurity: 0, happiness: 0, approval: 0, electricity: 0, employment: 0 };
  const outcomes: Record<string, Record<string, EventConsequence>> = {
    'fuel-scarcity': {
      subsidize: { ...neutral, treasury: -18000, happiness: 3, approval: 3 },
      prices: { ...neutral, happiness: -5, foodSecurity: -3, approval: -3, modifier: 'Transport costs +25%' },
      'local-processing': { ...neutral, treasury: -12000, employment: 3, approval: 2, modifier: 'Local processing protected' },
    },
    flooding: {
      farms: { ...neutral, treasury: -22000, foodSecurity: 2, happiness: 1 },
      drainage: { ...neutral, treasury: -35000, approval: 3, modifier: 'Flood risk reduced' },
      'switch-crops': { ...neutral, treasury: -9000, foodSecurity: -2, happiness: -1 },
    },
    drought: {
      water: { ...neutral, treasury: -24000, foodSecurity: 2, happiness: 2 },
      irrigation: { ...neutral, treasury: -42000, foodSecurity: 4, modifier: 'Water resilience improved' },
      conserve: { ...neutral, foodSecurity: -5, happiness: -3 },
    },
    'crop-disease': {
      contain: { ...neutral, treasury: -5000, foodSecurity: -2 },
      treat: { ...neutral, treasury: -16000, foodSecurity: 2, approval: 2 },
      ignore: { ...neutral, foodSecurity: -8, happiness: -4, approval: -3 },
    },
    'power-outage': {
      generator: { ...neutral, treasury: -14000, electricity: 5, employment: 2 },
      critical: { ...neutral, treasury: -6000, electricity: 2, happiness: 1 },
      wait: { ...neutral, electricity: -12, employment: -4, happiness: -3 },
    },
    'food-contamination': {
      investigate: { ...neutral, treasury: -13000, happiness: 2, approval: 3 },
      remove: { ...neutral, foodSecurity: -4, happiness: 1 },
      ignore: { ...neutral, foodSecurity: -7, happiness: -6, approval: -6 },
    },
    'transport-problem': {
      repair: { ...neutral, treasury: -20000, employment: 2, foodSecurity: 2 },
      reroute: { ...neutral, treasury: -8000, employment: -1 },
      wait: { ...neutral, employment: -5, foodSecurity: -4, happiness: -3 },
    },
    'contractor-issue': {
      fund: { ...neutral, treasury: -18000, development: 1, approval: 1 },
      replace: { ...neutral, treasury: -5000, development: -1 },
      investigate: { ...neutral, treasury: -3000, approval: 2 },
    },
    'community-protest': {
      meet: { ...neutral, treasury: -4000, happiness: 3, approval: 4 },
      address: { ...neutral, treasury: -18000, happiness: 6, approval: 7 },
      ignore: { ...neutral, happiness: -6, approval: -8 },
    },
    'agricultural-opportunity': {
      accept: { ...neutral, treasury: 26000, employment: 2, foodSecurity: -2 },
      expand: { ...neutral, treasury: -15000, employment: 5, modifier: 'Processing capacity expanded' },
      decline: neutral,
    },
    'trade-opportunity': {
      sell: { ...neutral, treasury: 18000, foodSecurity: -3 },
      store: { ...neutral, foodSecurity: 2 },
      process: { ...neutral, treasury: -10000, employment: 3 },
    },
  };
  return outcomes[eventId]?.[choiceId] ?? neutral;
};

export const resolveEvent = (choiceId: string) => {
  const state = eventStore.getState();
  if (!state.active) return false;
  const event = eventById(state.active.eventId);
  if (!event || !event.choices.some((choice) => choice.id === choiceId)) return false;
  const consequence = consequenceFor(event.id, choiceId);
  const player = playerStore.getState();
  playerStore.setState({
    treasury: Math.max(0, player.treasury + consequence.treasury),
    foodSecurity: clamp(player.foodSecurity + consequence.foodSecurity),
    development: clamp(player.development + (consequence.development ?? 0)),
    happiness: clamp(player.happiness + consequence.happiness),
    electricity: clamp(player.electricity + consequence.electricity),
    employment: clamp(player.employment + consequence.employment),
  });
  if (consequence.approval) politicsStore.setState({ approval: clamp(politicsStore.getState().approval + consequence.approval) });
  refreshCommunityMetrics();
  const choice = event.choices.find((item) => item.id === choiceId);
  const history: EventHistoryEntry = { eventId: event.id, title: event.title, turn: state.turn, decision: choice?.label ?? choiceId, outcome: consequence.modifier ?? 'The community absorbed the consequences.' };
  eventStore.setState({ active: null, history: [history, ...state.history].slice(0, 20) });
  try { window.localStorage.setItem('our-naija-player', JSON.stringify(playerStore.getState())); } catch { /* optional persistence */ }
  save();
  return true;
};
