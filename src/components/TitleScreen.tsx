import { useEffect, useRef } from 'react';
import { Info, Play, Settings } from 'lucide-react';
import { APP_NAME, TAGLINE } from '../config/app';
import { openModal } from '../state/actions';
import { FlagMark } from './Brand';
import { audioManager } from '../game/systems/audio';

function Backdrop() {
  return (
    <svg className="title-art" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#072d1c" /><stop offset="0.55" stopColor="#1d6b43" /><stop offset="1" stopColor="#f2a33a" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky)" />
      <circle cx="880" cy="500" r="90" fill="#f2b705" opacity="0.9" />
      <path d="M0 560 Q200 480 420 540 T800 520 T1200 540 V800 H0Z" fill="#0f5233" />
      <g fill="#0a3d26">
        <rect x="120" y="500" width="90" height="50" /><path d="M110 500 L165 462 L220 500Z" />
        <rect x="250" y="515" width="70" height="40" /><path d="M242 515 L285 486 L328 515Z" />
        <rect x="760" y="505" width="110" height="55" /><path d="M750 505 L815 466 L880 505Z" />
        <rect x="900" y="520" width="70" height="40" /><path d="M892 520 L935 490 L978 520Z" />
      </g>
      <path d="M0 640 Q300 590 600 630 T1200 610 V800 H0Z" fill="#b5653a" />
      <g stroke="#8e4a2b" strokeWidth="6" opacity="0.7">
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M0 ${680 + i * 18} Q600 ${650 + i * 18} 1200 ${675 + i * 18}`} fill="none" />)}
      </g>
      <g stroke="#072d1c" strokeWidth="8" fill="#072d1c">
        <path d="M90 640 Q100 540 110 470" fill="none" /><path d="M110 470 q-60 -10 -80 30 M110 470 q60 -20 90 20 M110 470 q-20 -50 -60 -50 M110 470 q30 -50 80 -40" fill="none" />
        <path d="M1090 650 Q1080 560 1070 490" fill="none" /><path d="M1070 490 q-60 -10 -80 30 M1070 490 q60 -20 90 20 M1070 490 q-20 -50 -60 -50 M1070 490 q30 -50 80 -40" fill="none" />
      </g>
    </svg>
  );
}

export function TitleScreen() {
  const play = useRef<HTMLButtonElement>(null);
  useEffect(() => { play.current?.focus(); }, []);
  return (
    <main className="screen title">
      <Backdrop />
      <div className="title-body">
        <div className="logo"><FlagMark size={44} /><h1>{APP_NAME}</h1></div>
        <p className="tagline">{TAGLINE}</p>
        <button ref={play} className="btn primary xl" onClick={() => { audioManager.playMusic(); openModal('location'); }}><Play size={22} aria-hidden /> Play</button>
        <div className="row">
          <button className="btn ghost" onClick={() => openModal('settings')}><Settings size={18} aria-hidden /> Settings</button>
          <button className="btn ghost" onClick={() => openModal('about')}><Info size={18} aria-hidden /> About</button>
        </div>
      </div>
    </main>
  );
}
