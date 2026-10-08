import { citizenVoiceStore, playerStore, politicsStore, profileStore, timeStore } from '../../state/stores';
import type { AchievementId, GovernanceTask, PlayerProfileState } from '../../types/profile';
import { audioManager } from './audio';

export const achievements: Record<AchievementId, { title: string; description: string }> = {
  'first-harvest': { title: 'First Harvest', description: 'Harvested your first crop.' },
  'community-builder': { title: 'Community Builder', description: 'Completed three community upgrades.' },
  'food-secure': { title: 'Food Secure', description: 'Reached 90% food security.' },
  'peoples-choice': { title: "People's Choice", description: 'Won an election with 70%+ votes.' },
  'no-wahala': { title: 'No Wahala', description: 'Resolved 10 citizen petitions.' },
  'power-to-the-people': { title: 'Power to the People', description: 'Achieved 90% electricity access.' },
};

const save = (state: PlayerProfileState) => {
  try { window.localStorage.setItem('our-naija-profile-stats', JSON.stringify(state)); } catch { /* optional persistence */ }
};
const taskForDay = (day: number): GovernanceTask => {
  const tasks: GovernanceTask[] = [
    { id: `task-${day}-petitions`, day, title: "Today's Priority", description: 'Review the citizen voice dashboard and respond to a petition.', kind: 'petition', completed: false },
    { id: `task-${day}-market`, day, title: "Today's Priority", description: 'Review food prices at the community market.', kind: 'market', completed: false },
    { id: `task-${day}-services`, day, title: "Today's Priority", description: 'Check the health centre and school service indicators.', kind: 'services', completed: false },
    { id: `task-${day}-inspection`, day, title: "Today's Priority", description: 'Inspect the community report before advancing the month.', kind: 'inspection', completed: false },
  ];
  return tasks[day % tasks.length];
};
export const ensureDailyTask = () => {
  const state = profileStore.getState(), day = timeStore.getState().day;
  if (state.dailyTask?.day === day) return state.dailyTask;
  const task = taskForDay(day);
  profileStore.setState({ dailyTask: task }); save({ ...state, dailyTask: task });
  return task;
};
export const completeGovernanceAction = (kind?: GovernanceTask['kind']) => {
  const state = profileStore.getState(), day = timeStore.getState().day, task = ensureDailyTask();
  const nextStreak = state.lastActionDay === day ? state.governanceStreak : state.lastActionDay === day - 1 ? state.governanceStreak + 1 : Math.max(1, state.governanceStreak);
  const completed = kind === undefined || task.kind === kind;
  const next: PlayerProfileState = { ...state, governanceStreak: nextStreak, bestStreak: Math.max(state.bestStreak, nextStreak), lastActionDay: day, dailyTask: completed ? { ...task, completed: true } : task };
  profileStore.setState(next); save(next);
  if (completed && !task.completed) audioManager.playSFX('success');
  return next;
};
export const checkAchievements = () => {
  const state = profileStore.getState(), player = playerStore.getState();
  const checks: [AchievementId, boolean][] = [
    ['first-harvest', state.harvests > 0], ['community-builder', state.completedUpgrades >= 3],
    ['food-secure', player.foodSecurity >= 90], ['peoples-choice', state.electionsWon > 0 && state.bestElectionShare >= 70],
    ['no-wahala', state.resolvedPetitions >= 10], ['power-to-the-people', player.electricity >= 90],
  ];
  const added = checks.filter(([id, condition]) => condition && !state.achievements.includes(id)).map(([id]) => id);
  if (!added.length) return;
  const next = { ...state, achievements: [...state.achievements, ...added] };
  profileStore.setState(next); save(next); audioManager.playSFX('achievement');
};
export const profileSummary = () => ({ player: playerStore.getState(), profile: profileStore.getState(), trust: citizenVoiceStore.getState().trust, politics: politicsStore.getState() });
