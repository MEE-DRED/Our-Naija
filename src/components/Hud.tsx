import { Smile, TrendingUp, Users, Wheat } from 'lucide-react';
import { leadershipLevels } from '../config/leadership';
import { advanceGameTurn, openModal, openSidePanel } from '../state/actions';
import { audioManager } from '../game/systems/audio';
import { formatGameTime, setGameSpeed, togglePause } from '../game/systems/time';
import { playerStore } from '../state/stores';
import { economyStore, eventStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { formatNaira, formatPercent } from '../utils/format';
import { FlagMark } from './Brand';
import { timeStore } from '../state/stores';
import type { ReactNode } from 'react';

const Stat = ({ icon, label, value, short }: { icon: ReactNode; label: string; value: string; short?: string }) => (
  <div className="stat" role="group" aria-label={`${label}: ${value}`}>
    <span className="stat-icon" aria-hidden>{icon}</span>
    <strong>{short ? <><span className="full">{value}</span><span className="short">{short}</span></> : value}</strong>
    <small>{label}</small>
  </div>
);

export function Hud() {
  const p = useStore(playerStore, (s) => s);
  const notification = useStore(economyStore, (s) => s.notification);
  const eventState = useStore(eventStore, (s) => s);
  const time = useStore(timeStore, (s) => s);
  return (
    <header className="hud compact-hud">
      <div className="hud-top">
        <FlagMark size={26} />
        <div className="who">
          <span className="role">{leadershipLevels[p.role].name.toUpperCase()}</span>
          <span className="community">{p.communityName}</span>
        </div>
        <button className="btn ghost small" onClick={() => openModal('profile')} aria-label="Open player profile">Profile</button>
        <button className="btn ghost small" onClick={() => audioManager.mute()} aria-label="Toggle sound">{audioManager.getSettings().muted ? '🔇' : '🔊'}</button>
        <button className="btn ghost small" onClick={() => openModal('nigeria')} aria-label="Browse Nigeria overview"><span aria-hidden>🇳🇬</span><span className="hide-sm">Nigeria</span></button>
        {p.role === 'LOCAL_GOVERNMENT_CHAIRMAN' && <button className="btn ghost small" onClick={() => openModal('lga')} aria-label="Open Local Government dashboard">
          <span aria-hidden>🏛</span> <span className="hide-sm">LGA</span>
        </button>}
        {(p.role === 'LOCAL_GOVERNMENT_CHAIRMAN' || p.role === 'GOVERNOR') && <button className="btn ghost small" onClick={() => openModal('governor')} aria-label="Open State Governor dashboard">
          <span aria-hidden>🏛</span> <span className="hide-sm">{p.role === 'GOVERNOR' ? 'State' : 'Governor'}</span>
        </button>}
      </div>
      <nav className="top-navigation" aria-label="Major game systems">
        <button onClick={() => openSidePanel('overview')}>Community</button>
        <button onClick={() => openModal('politics')}>Politics</button>
        <button onClick={() => openModal('nigeria')}>Nigeria</button>
        <button onClick={() => openModal('events')}>Wahala</button>
      </nav>
      <div className="time-controls" aria-label="Game time controls">
        <span>Day {time.day} · {formatGameTime(time)}</span>
        <button onClick={togglePause}>{time.paused ? 'Resume' : 'Pause'}</button>
        <button onClick={() => setGameSpeed(time.speed === 1 ? 2 : 1)}>{time.speed}×</button>
      </div>
      <div className="stats compact-stats">
        <Stat icon={<Users size={18} />} label="Population" value={String(p.population)} />
        <Stat icon={<Wheat size={18} />} label="Food Security" value={formatPercent(p.foodSecurity)} />
        <Stat icon={<span className="naira">₦</span>} label="Treasury" value={formatNaira(p.treasury)} short={`₦${Math.round(p.treasury / 1000)}k`} />
        <Stat icon={<TrendingUp size={18} />} label="Development" value={formatPercent(p.development)} />
        <Stat icon={<Smile size={18} />} label="Happiness" value={formatPercent(p.happiness)} />
      </div>
      <button className="advance-button compact-advance" onClick={advanceGameTurn}>Advance month · {eventState.season.toLowerCase()}</button>
      {notification && <div className="hud-notification" role="status">{notification}</div>}
    </header>
  );
}
