export type Weather = 'CLEAR' | 'RAIN' | 'HAZE' | 'DRY';

export interface GameTime {
  day: number;
  month: number;
  year: number;
  minute: number;
  speed: 1 | 2;
  paused: boolean;
  pausedAt: number | null;
  pausedDuration: number;
  weather: Weather;
}
