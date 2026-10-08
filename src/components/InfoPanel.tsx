import { useEffect, useRef } from 'react';
import { Droplets, HeartPulse, Home, Landmark, School, Sprout, Store, X, Zap } from 'lucide-react';
import type { EntityInfo } from '../types/world';
import { selectEntity } from '../state/actions';

const ICONS = { home: Home, school: School, health: HeartPulse, market: Store, water: Droplets, power: Zap, gov: Landmark, farm: Sprout };

/** Reusable panel for every selectable entity: houses, farms, civic buildings and utilities. */
export function InfoPanel({ info }: { info: EntityInfo }) {
  const Icon = ICONS[info.icon];
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus({ preventScroll: true }); }, [info.id]);
  return (
    <aside className="info card" role="dialog" aria-label={info.title}>
      <header>
        <span className="info-icon" aria-hidden><Icon size={24} /></span>
        <div><h2>{info.title}</h2><p className="cat">{info.categoryLabel}</p></div>
        <button ref={close} className="icon-btn" onClick={() => selectEntity(null)} aria-label="Close information panel"><X size={22} /></button>
      </header>
      <p>{info.description}</p>
      <dl className="facts">
        {info.level !== undefined && <div><dt>Level</dt><dd>{info.level}</dd></div>}
        <div><dt>Status</dt><dd>{info.status}</dd></div>
        {info.stats.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
      </dl>
    </aside>
  );
}
