export type AudioSettings = { master: number; music: number; environment: number; sfx: number; muted: boolean };
const defaultSettings: AudioSettings = { master: 0.7, music: 0.25, environment: 0.35, sfx: 0.5, muted: false };
const listeners = new Set<() => void>();
let settings: AudioSettings = load();
let context: AudioContext | null = null;
let musicTimer: number | null = null;

function load(): AudioSettings {
  try { return { ...defaultSettings, ...JSON.parse(window.localStorage.getItem('our-naija-audio') ?? '{}') }; } catch { return defaultSettings; }
}
function save() {
  try { window.localStorage.setItem('our-naija-audio', JSON.stringify(settings)); } catch { /* optional persistence */ }
}
function audioContext() {
  if (!context) context = new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}
function tone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  if (settings.muted || !settings.master || !volume) return;
  const ctx = audioContext(), oscillator = ctx.createOscillator(), gain = ctx.createGain();
  oscillator.type = type; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(Math.min(0.2, volume * settings.master), ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  oscillator.connect(gain).connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + duration);
}
export const audioManager = {
  getSettings: () => settings,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); },
  update: (next: Partial<AudioSettings>) => { settings = { ...settings, ...next }; save(); listeners.forEach((listener) => listener()); },
  mute: () => { settings = { ...settings, muted: !settings.muted }; save(); listeners.forEach((listener) => listener()); },
  playMusic: () => {
    if (musicTimer !== null || settings.muted) return;
    const notes = [220, 277, 330, 277];
    let index = 0;
    const play = () => { tone(notes[index++ % notes.length], 1.8, settings.music * 0.18, 'triangle'); };
    play(); musicTimer = window.setInterval(play, 2400);
  },
  stopMusic: () => { if (musicTimer !== null) window.clearInterval(musicTimer); musicTimer = null; },
  playAmbient: (kind: 'community' | 'rain' | 'market' | 'generator' = 'community') => {
    const tones = { community: 196, rain: 330, market: 247, generator: 92 };
    tone(tones[kind], kind === 'generator' ? 0.35 : 0.22, settings.environment * 0.18, kind === 'generator' ? 'sawtooth' : 'sine');
  },
  playSFX: (kind: 'select' | 'success' | 'money' | 'petition' | 'wahala' | 'election' | 'achievement') => {
    const sounds = {
      select: [440], success: [523, 659], money: [659, 784], petition: [330, 392],
      wahala: [196, 175], election: [392, 523, 659], achievement: [523, 659, 784],
    };
    sounds[kind].forEach((frequency, index) => window.setTimeout(() => tone(frequency, 0.18, settings.sfx * 0.3), index * 100));
  },
};
