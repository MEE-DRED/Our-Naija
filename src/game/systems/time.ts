import { eventStore, timeStore } from '../../state/stores';
import type { GameTime, Weather } from '../../types/time';

const save = (time: GameTime) => {
  try { window.localStorage.setItem('our-naija-time', JSON.stringify(time)); } catch { /* persistence is optional */ }
};
let pendingMinutes = 0;

const weatherFor = (): Weather => {
  const event = eventStore.getState().active?.eventId;
  if (event === 'flooding' || event === 'power-outage') return 'RAIN';
  const season = eventStore.getState().season;
  if (season === 'HARMATTAN') return 'HAZE';
  if (season === 'DRY') return 'DRY';
  return 'RAIN';
};

export const tickGameTime = (deltaMs: number) => {
  const current = timeStore.getState();
  if (current.paused) return current;
  pendingMinutes += (deltaMs / 1000) * 4 * current.speed;
  if (pendingMinutes < 0.25) return current;
  const minutes = pendingMinutes;
  pendingMinutes = 0;
  let minute = current.minute + minutes;
  let day = current.day;
  let month = current.month;
  let year = current.year;
  while (minute >= 24 * 60) { minute -= 24 * 60; day += 1; }
  while (day > 30) { day -= 30; month += 1; }
  while (month > 12) { month -= 12; year += 1; }
  const next = { ...current, day, month, year, minute, weather: weatherFor() };
  timeStore.setState(next);
  if (Math.floor(current.minute / 60) !== Math.floor(minute / 60) || day !== current.day) save(next);
  return next;
};

export const togglePause = () => {
  const current = timeStore.getState();
  const now = Date.now();
  const next = current.paused
    ? { ...current, paused: false, pausedAt: null, pausedDuration: current.pausedDuration + (current.pausedAt ? now - current.pausedAt : 0) }
    : { ...current, paused: true, pausedAt: now };
  timeStore.setState(next); save(next);
};

export const simulationNow = () => {
  const time = timeStore.getState();
  const pausedSince = time.paused && time.pausedAt ? Date.now() - time.pausedAt : 0;
  return Date.now() - time.pausedDuration - pausedSince;
};

export const setGameSpeed = (speed: 1 | 2) => {
  const next = { ...timeStore.getState(), speed };
  timeStore.setState(next); save(next);
};

export const activityForHour = (minute: number) => {
  const hour = minute / 60;
  if (hour < 6 || hour >= 21) return 'night';
  if (hour < 10) return 'morning';
  if (hour < 17) return 'day';
  return 'evening';
};

export const formatGameTime = (time: GameTime) => {
  const hour = Math.floor(time.minute / 60);
  const minute = Math.floor(time.minute % 60).toString().padStart(2, '0');
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
};
