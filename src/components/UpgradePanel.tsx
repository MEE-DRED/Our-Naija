import { useEffect, useRef } from 'react';
import { ArrowUpCircle, X } from 'lucide-react';
import { getBuildingLevel, selectEntity, upgradeBuilding } from '../state/actions';
import { economyStore, playerStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { upgradeCosts, upgradeEffects } from '../game/data/economy';

export function UpgradePanel({ id, title, description }: { id: string; title: string; description: string }) {
  const player = useStore(playerStore, (state) => state);
  const economy = useStore(economyStore, (state) => state);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus({ preventScroll: true }); }, [id]);
  const level = economy.buildingLevels[id]?.level ?? getBuildingLevel(id);
  const cost = upgradeCosts[id];
  const upgraded = level >= 2;
  return <aside className="info card upgrade-panel" role="dialog" aria-label={title}>
    <header><span className="info-icon" aria-hidden><ArrowUpCircle size={24} /></span><div><h2>{title}</h2><p className="cat">Community improvement</p></div>
      <button ref={close} className="icon-btn" onClick={() => selectEntity(null)} aria-label="Close upgrade panel"><X size={22} /></button></header>
    <p>{description}</p><dl className="facts"><div><dt>Current level</dt><dd>Level {level}</dd></div>
      <div><dt>Effect</dt><dd>{upgradeEffects[id]}</dd></div>{!upgraded && <div><dt>Upgrade cost</dt><dd>₦{cost.toLocaleString()}</dd></div>}</dl>
    {!upgraded ? <button className="btn primary upgrade-button" disabled={player.treasury < cost} onClick={() => upgradeBuilding(id)}>Upgrade{player.treasury < cost ? ' (not enough Naira)' : ''}</button> : <p className="upgrade-complete">Level 2 improvement complete.</p>}
  </aside>;
}
