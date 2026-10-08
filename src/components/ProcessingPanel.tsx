import { useEffect, useState } from 'react';
import { Factory, X } from 'lucide-react';
import { processingState, startProcessing, collectProcessing, selectEntity } from '../state/actions';
import { playerStore, economyStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { recipeFor } from '../game/data/processing';

export function ProcessingPanel({ facilityId, title }: { facilityId: string; title: string }) {
  const player = useStore(playerStore, (state) => state);
  const job = useStore(economyStore, (state) => state.processing);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 500); return () => window.clearInterval(timer); }, []);
  const recipe = recipeFor(facilityId);
  const state = processingState(now);
  const active = state.job?.facilityId === facilityId;
  if (!recipe) return null;
  const remaining = Math.max(0, Math.ceil((recipe.processingMs - (now - (state.job?.startedAt ?? now))) / 1000));
  const canProcess = !job && player.resources[recipe.input] >= recipe.inputQuantity &&
    player.treasury >= recipe.cost && player.electricityCapacity - player.electricityDemand >= recipe.electricityRequired;
  return <aside className="info card processing-panel" role="dialog" aria-label={title}>
    <header><span className="info-icon" aria-hidden><Factory size={24} /></span><div><h2>{title}</h2><p className="cat">Agricultural value chain</p></div>
      <button className="icon-btn" onClick={() => selectEntity(null)} aria-label="Close processing panel"><X size={22} /></button></header>
    <dl className="facts"><div><dt>Input</dt><dd>{recipe.inputQuantity} {recipe.input}</dd></div><div><dt>Output</dt><dd>{recipe.outputQuantity} {recipe.outputName}</dd></div>
      <div><dt>Processing time</dt><dd>{Math.round(recipe.processingMs / 1000)}s</dd></div><div><dt>Electricity</dt><dd>{recipe.electricityRequired} units</dd></div>
      <div><dt>Cost</dt><dd>₦{recipe.cost.toLocaleString()}</dd></div><div><dt>Storage</dt><dd>{Object.values(player.resources).reduce((sum, value) => sum + value, 0)} / {player.storageCapacity}</dd></div></dl>
    {active && <><p className="farm-status"><strong>Processing...</strong> {remaining}s remaining</p><div className="track"><span style={{ width: `${state.progress}%` }} /></div>
      {state.ready && <button className="btn primary upgrade-button" onClick={() => collectProcessing()}>Collect {recipe.outputName}</button>}</>}
    {!job && <button className="btn primary upgrade-button" disabled={!canProcess} onClick={() => startProcessing(facilityId)}>
      {!player.resources[recipe.input] ? `Need ${recipe.inputQuantity} ${recipe.input}` : player.electricityCapacity - player.electricityDemand < recipe.electricityRequired ? 'Need more electricity' : 'Start processing'}
    </button>}
    {job && !active && <p className="market-note">Another facility is currently processing. Collect it before starting a new cycle.</p>}
  </aside>;
}
