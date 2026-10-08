import { useEffect, useRef } from 'react';
import { Lock, X } from 'lucide-react';
import type { ExpansionPlot } from '../types/world';
import { unlockExpansion, selectEntity } from '../state/actions';
import { economyStore, playerStore } from '../state/stores';
import { useStore } from '../state/createStore';

export function ExpansionPanel({ plot }: { plot: ExpansionPlot }) {
  const player = useStore(playerStore, (state) => state);
  const unlocked = useStore(economyStore, (state) => Boolean(state.expansions[plot.id]));
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus({ preventScroll: true }); }, [plot.id]);
  const canUnlock = player.development >= plot.developmentRequired && player.treasury >= plot.cost;
  return <aside className="info card expansion-panel" role="dialog" aria-label={plot.name}>
    <header><span className="info-icon" aria-hidden><Lock size={24} /></span><div><h2>{plot.name}</h2><p className="cat">Expansion land</p></div>
      <button ref={close} className="icon-btn" onClick={() => selectEntity(null)} aria-label="Close expansion panel"><X size={22} /></button></header>
    <p>{plot.description}</p>
    {unlocked ? <p className="upgrade-complete">Land unlocked and available for development.</p> : <dl className="facts">
      <div><dt>Unlock cost</dt><dd>₦{plot.cost.toLocaleString()}</dd></div>
      <div><dt>Development required</dt><dd>{plot.developmentRequired}</dd></div>
      <div><dt>Your development</dt><dd>{Math.round(player.development)}</dd></div>
      <button className="btn primary upgrade-button" disabled={!canUnlock} onClick={() => unlockExpansion(plot)}>
        {player.development < plot.developmentRequired ? 'Develop community further' : player.treasury < plot.cost ? 'Not enough Naira' : 'Unlock land'}
      </button>
    </dl>}
  </aside>;
}
