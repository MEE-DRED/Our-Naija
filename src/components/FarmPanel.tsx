import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cropById, crops } from '../game/data/crops';
import { farmStateAt, harvestFarm, plantCrop, selectEntity, upgradeBuilding } from '../state/actions';
import { economyStore, farmingStore, playerStore } from '../state/stores';
import { useStore } from '../state/createStore';
import type { CropId } from '../types/farming';

export function FarmPanel({ farmId, farmName }: { farmId: string; farmName: string }) {
  const saved = useStore(farmingStore, (state) => state.farms[farmId]);
  const player = useStore(playerStore, (state) => state);
  const buildingLevel = useStore(economyStore, (state) => state.buildingLevels['farm-1']?.level ?? 1);
  const [now, setNow] = useState(Date.now());
  const [message, setMessage] = useState('');
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  const state = farmStateAt(farmId, now);
  const crop = cropById(state.cropId);
  const progress = crop && state.plantedAt ? Math.min(100, Math.floor(((now - state.plantedAt) / crop.growthMs) * 100)) : 0;
  const plant = (cropId: CropId) => { plantCrop(farmId, cropId); setMessage('Crop planted successfully.'); };
  const harvest = () => {
    const amount = harvestFarm(farmId);
    if (amount && crop) setMessage(`+${amount} ${crop.name}`);
  };

  return (
    <aside className="info card farm-panel" role="dialog" aria-label={farmName}>
      <header><span className="info-icon farm-mark" aria-hidden>🌱</span><div><h2>{farmName}</h2><p className="cat">Agricultural plot</p></div>
        <button className="icon-btn" onClick={() => selectEntity(null)} aria-label="Close farm panel"><X size={22} /></button>
      </header>
      {state.status === 'EMPTY' ? <>
        <p className="farm-status"><strong>Status:</strong> Empty</p>
        <h3>Choose crop</h3>
        <div className="crop-list">
          {crops.map((item) => <button type="button" className="crop-choice" key={item.id} onClick={() => plant(item.id)}>
            <span className="crop-emoji" aria-hidden>{item.emoji}</span><span><strong>{item.name}</strong><small>{item.role}</small></span><span className="crop-growth">{Math.round(item.growthMs / 1000)}s</span>
          </button>)}
        </div>
      </> : crop ? <>
        <p className="farm-status"><strong>{crop.emoji} {crop.name}</strong></p>
        <p>{state.status === 'READY_TO_HARVEST' ? 'Ready to harvest!' : state.status === 'PLANTED' ? 'Recently planted...' : 'Growing...'}</p>
        <div className="meter"><div className="meter-head"><span>{state.status === 'READY_TO_HARVEST' ? 'Ready' : `${progress}% complete`}</span><span>{Math.round(crop.growthMs / 1000)}s</span></div><div className="track" aria-label={`${progress}% grown`}><span style={{ width: `${progress}%` }} /></div></div>
        {state.status === 'READY_TO_HARVEST' && <button type="button" className="btn primary harvest-button" onPointerUp={(event) => { event.stopPropagation(); harvest(); }} onClick={(event) => event.stopPropagation()}>Harvest {crop.name}</button>}
      </> : null}
      {message && <p className="farm-feedback" role="status">{message}</p>}
      {farmId === 'farm-1' && <button className="btn ghost dark upgrade-button" disabled={buildingLevel >= 2 || player.treasury < 20000} onClick={() => { if (upgradeBuilding('farm-1')) setMessage('Community Farm upgraded · Development +2'); }}>Farm Level {buildingLevel < 2 ? 'Upgrade · ₦20,000' : '2'}</button>}
      {saved && state.status !== saved.status && <span className="sr-only">Farm status updated</span>}
    </aside>
  );
}
