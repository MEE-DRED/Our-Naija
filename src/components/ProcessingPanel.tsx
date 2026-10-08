import { useEffect, useState } from 'react';
import { Factory, X } from 'lucide-react';
import { processingState, startProcessing, collectProcessing, selectEntity } from '../state/actions';
import { playerStore, economyStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { recipeFor, recipesFor } from '../game/data/processing';

export function ProcessingPanel({ facilityId, title }: { facilityId: string; title: string }) {
  const player = useStore(playerStore, (state) => state);
  const job = useStore(economyStore, (state) => state.processing);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 500); return () => window.clearInterval(timer); }, []);
  useEffect(() => { setSelectedRecipeId(recipes[0]?.recipeId); }, [facilityId]);
  const recipes = recipesFor(facilityId);
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0]?.recipeId);
  const recipe = recipeFor(facilityId, selectedRecipeId);
  const state = processingState(now);
  const active = state.job?.facilityId === facilityId;
  if (!recipe) return null;
  const remaining = Math.max(0, Math.ceil((recipe.processingMs - (now - (state.job?.startedAt ?? now))) / 1000));
  const canProcess = !job && player.resources[recipe.input] >= recipe.inputQuantity &&
    player.treasury >= recipe.cost && player.electricityCapacity - player.electricityDemand >= recipe.electricityRequired;
  const reason = job ? 'Processing capacity is full.' : !player.resources[recipe.input] ? `Not enough ${recipe.input}.` : player.treasury < recipe.cost ? `Need ₦${recipe.cost.toLocaleString()} for this batch.` : player.electricityCapacity - player.electricityDemand < recipe.electricityRequired ? 'Not enough electricity.' : '';
  return <aside className="info card processing-panel" role="dialog" aria-label={title}>
    <header><span className="info-icon" aria-hidden><Factory size={24} /></span><div><h2>{title}</h2><p className="cat">Agricultural value chain</p></div>
      <button className="icon-btn" onClick={() => selectEntity(null)} aria-label="Close processing panel"><X size={22} /></button></header>
    {recipes.length > 1 && <div className="processing-options" aria-label="Processing options">{recipes.map((option) => <button type="button" className={`btn ${option.recipeId === recipe.recipeId ? 'primary' : 'reserve'} small`} key={option.recipeId} onClick={() => setSelectedRecipeId(option.recipeId)}>{option.outputName}</button>)}</div>}
    <p className="processing-status"><strong>Status:</strong> {active ? (state.ready ? 'Complete' : 'Processing') : job ? 'Waiting for capacity' : !player.resources[recipe.input] ? 'Waiting for input' : player.electricityCapacity - player.electricityDemand < recipe.electricityRequired ? 'No power' : 'Idle'}</p>
    <dl className="facts"><div><dt>Available input</dt><dd>{player.resources[recipe.input]} {recipe.input}</dd></div><div><dt>Input required</dt><dd>{recipe.inputQuantity} {recipe.input}</dd></div><div><dt>Output</dt><dd>{recipe.outputQuantity} {recipe.outputName}</dd></div>
      <div><dt>Processing time</dt><dd>{Math.round(recipe.processingMs / 1000)}s</dd></div><div><dt>Electricity</dt><dd>{recipe.electricityRequired} units</dd></div>
      <div><dt>Cost</dt><dd>₦{recipe.cost.toLocaleString()}</dd></div><div><dt>Storage</dt><dd>{Object.values(player.resources).reduce((sum, value) => sum + value, 0)} / {player.storageCapacity}</dd></div></dl>
    {active && <><p className="farm-status"><strong>Processing...</strong> {remaining}s remaining</p><div className="track"><span style={{ width: `${state.progress}%` }} /></div>
      {state.ready && <button className="btn primary upgrade-button" onClick={() => collectProcessing()}>Collect {recipe.outputName}</button>}</>}
    {!job && <button className="btn primary upgrade-button" disabled={!canProcess} onClick={() => startProcessing(facilityId, recipe.recipeId)}>
      {canProcess ? `Process ${recipe.outputName}` : reason}
    </button>}
    {!job && !canProcess && <p className="market-note">{reason}</p>}
    {job && !active && <p className="market-note">Another facility is currently processing. Collect it before starting a new cycle.</p>}
  </aside>;
}
