import { Lock, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ABOUT_TEXT } from '../config/app';
import { orderedLevels } from '../config/leadership';
import { backToTitle, closeModal } from '../state/actions';
import { citizenVoiceStore, gameStore, playerStore, politicsStore, profileStore, timeStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { formatNaira, formatPercent } from '../utils/format';
import { Modal } from './Modal';
import { audioManager, type AudioSettings } from '../game/systems/audio';
import { achievements, ensureDailyTask } from '../game/systems/profile';

export function AboutModal() {
  return <Modal title="About Our Naija"><p>{ABOUT_TEXT}</p></Modal>;
}

export function SettingsModal() {
  const [settings, setSettings] = useState<AudioSettings>(audioManager.getSettings());
  useEffect(() => { const unsubscribe = audioManager.subscribe(() => setSettings(audioManager.getSettings())); return () => { unsubscribe(); }; }, []);
  const change = (key: keyof Pick<AudioSettings, 'master' | 'music' | 'environment' | 'sfx'>, value: number) => audioManager.update({ [key]: value });
  return <Modal title="Settings">
    <div className="settings-audio">
      {([['master', 'Master Volume'], ['music', 'Music'], ['environment', 'Environment'], ['sfx', 'Sound Effects']] as const).map(([key, label]) => <label key={key}>{label}<input type="range" min="0" max="1" step="0.05" value={settings[key]} onChange={(event) => change(key, Number(event.target.value))} /></label>)}
      <button className="btn ghost dark" onClick={() => audioManager.mute()}>{settings.muted ? 'Unmute sound' : 'Mute sound'}</button>
    </div>
  </Modal>;
}

export function ProfileModal() {
  const p = useStore(playerStore, (s) => s);
  const profile = useStore(profileStore, (s) => s);
  const voice = useStore(citizenVoiceStore, (s) => s);
  const politics = useStore(politicsStore, (s) => s);
  useEffect(() => { ensureDailyTask(); }, []);
  const task = profile.dailyTask;
  return <Modal title="Player profile">
    <div className="profile-identity"><strong>{p.communityName} Administration</strong><span>{p.role.replace(/_/g, ' ')} · {p.startingCommunity}</span><span>{p.lgaName} · {p.stateName}</span><small>Administration {profile.administration}</small></div>
    <div className="streak-card"><strong>Governance streak 🔥 {profile.governanceStreak} days</strong><span>Best: {profile.bestStreak} days</span>{task && <p><strong>{task.title}</strong><br />{task.description}{task.completed ? ' ✓ Complete' : ''}</p>}</div>
    <h3>Profile statistics</h3>
    <div className="profile-grid"><span>Communities developed<strong>{profile.communitiesDeveloped}</strong></span><span>LGAs governed<strong>{profile.lgasGoverned}</strong></span><span>States governed<strong>{profile.statesGoverned}</strong></span><span>Presidential terms<strong>{profile.presidentialTerms}</strong></span><span>Citizen trust<strong>{voice.trust}%</strong></span><span>Public approval<strong>{Math.min(100, politics.approval + politics.campaignApproval)}%</strong></span></div>
    <h3>Achievements</h3>
    <div className="achievement-list">{(Object.entries(achievements) as [keyof typeof achievements, typeof achievements[keyof typeof achievements]][]).map(([id, achievement]) => <div className={profile.achievements.includes(id) ? 'achievement earned' : 'achievement'} key={id}><strong>{profile.achievements.includes(id) ? '🏆' : '○'} {achievement.title}</strong><small>{achievement.description}</small></div>)}</div>
    <h3>Governance record</h3><p className="muted">Harvests {profile.harvests} · Resolved petitions {profile.resolvedPetitions} · Upgrades {profile.completedUpgrades} · Elections won {profile.electionsWon}</p>
    <h3>Political history</h3>
    {politics.electionHistory.length === 0 ? <p className="muted">Your first election chapter is still ahead.</p> : politics.electionHistory.map((entry) => <div className="history-row" key={`${entry.number}-${entry.date}`}><strong>{entry.gameYear ?? timeStore.getState().year} · {entry.result === 'WON' ? 'Elected' : 'Contested'}</strong><span>{entry.position.replace(/_/g, ' ')} · {entry.playerShare}% vote share</span></div>)}
  </Modal>;
}

const Meter = ({ label, value }: { label: string; value: number }) => (
  <div className="meter">
    <div className="meter-head"><span>{label}</span><strong>{formatPercent(value)}</strong></div>
    <div className="track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${value}%` }} /></div>
  </div>
);

export function DashboardModal() {
  const p = useStore(playerStore, (s) => s);
  const screen = useStore(gameStore, (s) => s.screen);
  const politics = useStore(politicsStore, (s) => s);
  return (
    <Modal title={p.communityName} variant="dashboard">
      <dl className="facts">
        <div><dt>State</dt><dd>{p.stateName}</dd></div>
        <div><dt>Starting LGA</dt><dd>{p.lgaName}</dd></div>
        <div><dt>Political origin</dt><dd>{p.startingCommunity}</dd></div>
        <div><dt>Population</dt><dd>{p.population}</dd></div>
        <div><dt>Housing capacity</dt><dd>{p.housingCapacity}</dd></div>
        <div><dt>Employment</dt><dd>{formatPercent(p.employment)} ({p.jobs} jobs)</dd></div>
        <div><dt>Electricity</dt><dd>{p.electricityCapacity} capacity / {p.electricityDemand} demand</dd></div>
        <div><dt>Storage</dt><dd>{Object.values(p.resources).reduce((sum, value) => sum + value, 0)} / {p.storageCapacity}</dd></div>
        <div><dt>Treasury</dt><dd>{formatNaira(p.treasury)}</dd></div>
      </dl>
      <Meter label="Food Security" value={p.foodSecurity} />
      <Meter label="Health" value={p.health} />
      <Meter label="Education" value={p.education} />
      <Meter label="Water Access" value={p.waterAccess} />
      <Meter label="Electricity" value={p.electricity} />
      <Meter label="Development" value={p.development} />
      <Meter label="Happiness" value={p.happiness} />
      <Meter label="Public Approval" value={Math.min(100, politics.approval + politics.campaignApproval)} />
      <h3>Leadership path</h3>
      <div className="political-journey">
        <strong>⭐ Home Community</strong><span>{p.startingCommunity}</span>
        <strong>Home LGA</strong><span>{p.lgaName}</span>
        <strong>Home State</strong><span>{p.stateName}</span>
      </div>
      <ol className="levels">
        {orderedLevels().map((l) => (
          <li key={l.id} className={l.id === p.role ? 'active' : ''}>
            {l.playable ? <Check size={16} aria-hidden /> : <Lock size={16} aria-hidden />}
            <span>{l.name}</span><em>{l.id === p.role ? 'Current' : 'Locked'}</em>
          </li>
        ))}
      </ol>
      {screen === 'playing' && <button className="btn ghost dark" onClick={() => { closeModal(); backToTitle(); }}>Exit to title</button>}
    </Modal>
  );
}
