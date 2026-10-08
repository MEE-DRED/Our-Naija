import { useEffect, useState } from 'react';
import { Store, X } from 'lucide-react';
import { crops } from '../game/data/crops';
import { productPrices, reserveCrops } from '../game/data/economy';
import { marketPriceFor } from '../game/systems/simulation';
import { addToFoodReserve, sellCrop, selectEntity, upgradeBuilding } from '../state/actions';
import { economyStore, playerStore } from '../state/stores';
import { useStore } from '../state/createStore';
import type { ResourceId } from '../types/farming';

export function MarketPanel() {
  const player = useStore(playerStore, (state) => state);
  const notification = useStore(economyStore, (state) => state.notification);
  const marketLevel = useStore(economyStore, (state) => state.buildingLevels.market?.level ?? 1);
  const [, refresh] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => refresh((value) => value + 1), 500); return () => window.clearInterval(timer); }, []);
  const action = (id: ResourceId, kind: 'sell' | 'reserve') => {
    if (kind === 'sell') sellCrop(id, player.resources[id]);
    else if (id === 'cassava' || id === 'maize' || id === 'rice') addToFoodReserve(id, player.resources[id]);
  };
  return <aside className="info card market-panel" role="dialog" aria-label="Community Market">
    <header><span className="info-icon" aria-hidden><Store size={24} /></span><div><h2>Community Market</h2><p className="cat">Sell your harvested crops</p></div>
      <button className="icon-btn" onClick={() => selectEntity(null)} aria-label="Close market"><X size={22} /></button></header>
    <div className="market-scroll">
    <div className="market-table" role="table" aria-label="Crop prices">
      <div className="market-row market-head" role="row"><span>Crop</span><span>You have</span><span>Price</span><span>Action</span></div>
      {[...crops.map((crop) => ({ id: crop.id as ResourceId, name: crop.name, emoji: crop.emoji, price: marketPriceFor(crop.id), raw: true })),
        { id: 'garri' as ResourceId, name: 'Garri', emoji: '🥣', price: productPrices.garri, raw: false },
        { id: 'fufu' as ResourceId, name: 'Fufu', emoji: '🥣', price: productPrices.fufu, raw: false },
        { id: 'cassavaFlour' as ResourceId, name: 'Cassava Flour', emoji: '🌾', price: productPrices.cassavaFlour, raw: false },
        { id: 'starch' as ResourceId, name: 'Starch', emoji: '⚪', price: productPrices.starch, raw: false },
        { id: 'milledRice' as ResourceId, name: 'Milled Rice', emoji: '🍚', price: productPrices.milledRice, raw: false },
        { id: 'packagedRice' as ResourceId, name: 'Packaged Rice', emoji: '🍚', price: productPrices.packagedRice, raw: false },
        { id: 'tomatoPaste' as ResourceId, name: 'Tomato Paste', emoji: '🍅', price: productPrices.tomatoPaste, raw: false },
        { id: 'tomatoSauce' as ResourceId, name: 'Tomato Sauce', emoji: '🍅', price: productPrices.tomatoSauce, raw: false },
        { id: 'maizeFlour' as ResourceId, name: 'Maize Flour', emoji: '🌽', price: productPrices.maizeFlour, raw: false },
        { id: 'maizeMeal' as ResourceId, name: 'Maize Meal', emoji: '🌽', price: productPrices.maizeMeal, raw: false },
        { id: 'maizeFeed' as ResourceId, name: 'Livestock Feed', emoji: '🌽', price: productPrices.maizeFeed, raw: false }].map((crop) => <div className="market-row" role="row" key={crop.id}>
        <span>{crop.emoji} {crop.name} <small>{crop.raw ? 'RAW' : 'PROCESSED'}</small></span><strong>{player.resources[crop.id]}</strong><span>₦{crop.price.toLocaleString()}</span>
        <span className="market-actions"><button className="btn primary small" disabled={!player.resources[crop.id]} onClick={() => action(crop.id, 'sell')}>Sell</button>
          {crop.raw && reserveCrops.includes(crop.id as 'cassava' | 'maize' | 'rice') && <button className="btn reserve small" disabled={!player.resources[crop.id]} onClick={() => action(crop.id, 'reserve')}>Reserve</button>}</span>
      </div>)}
    </div>
    <p className="market-note">Keep staple crops in the Food Reserve to support community food security.</p>
    {notification && <p className="farm-feedback" role="status">{notification}</p>}
    <p className="market-total">Food Reserve: {Object.values(player.foodReserve).reduce((sum, value) => sum + value, 0)} units</p>
    <button className="btn ghost dark upgrade-button" disabled={marketLevel >= 2 || player.treasury < 25000} onClick={() => upgradeBuilding('market')}>
      {marketLevel >= 2 ? 'Market Level 2' : `Upgrade Market · ₦25,000`}
    </button>
    </div>
  </aside>;
}
