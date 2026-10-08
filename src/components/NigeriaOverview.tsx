import { useState } from 'react';
import { nigeriaRegions } from '../game/data/nigeria';
import { playerStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { Modal } from './Modal';

type Selection = { stateId: string; lga?: string; community?: string };

export function NigeriaOverview() {
  const player = useStore(playerStore, (value) => value);
  const [selection, setSelection] = useState<Selection | null>(null);
  const selected = selection ? nigeriaRegions.find((region) => region.id === selection.stateId) : undefined;
  const home = player.stateName;
  return (
    <Modal title="Our Naija · Nigeria overview">
      <p className="muted">Browse the country without changing your political scope. You govern only the area unlocked by your current position.</p>
      <div className="country-summary"><strong>37 administrative regions</strong><span>36 States + FCT · layered simulation</span></div>
      {!selected ? <div className="region-list">{['North West', 'North East', 'North Central', 'South West', 'South East', 'South South', 'Federal Capital Territory'].map((region) => (
        <section className="region-group" key={region}><h3>{region}</h3><div className="state-grid">{nigeriaRegions.filter((item) => item.region === region).map((item) => <button className={`state-tile ${item.name === home ? 'home' : ''}`} key={item.id} onClick={() => setSelection({ stateId: item.id })}><strong>{item.name}</strong><small>{item.capital} · {item.lgas.length} representative LGAs</small>{item.name === home && <em>⭐ Your State</em>}</button>)}</div></section>
      ))}</div> : <div className="place-detail">
        <button className="btn reserve" onClick={() => setSelection(null)}>← All regions</button>
        <h3>{selected.name}</h3><p><strong>Capital:</strong> {selected.capital} · <strong>Region:</strong> {selected.region}</p>
        <p><strong>Agricultural strengths:</strong> {selected.agriculturalStrengths.concat(selected.secondaryStrengths).join(', ')}</p>
        <p><strong>Opportunities:</strong> {selected.opportunities.join(', ')}</p>
        <p><strong>Challenges:</strong> {selected.challenges.join(', ')}</p>
        <h3>Representative LGAs</h3>
        <div className="state-grid">{selected.lgas.map((lga) => <button className="state-tile" key={lga} onClick={() => setSelection({ stateId: selected.id, lga })}><strong>{lga}</strong><small>Browse communities</small></button>)}</div>
        {selection?.lga && <div className="place-detail nested"><h3>{selection.lga}</h3>{[...(selected.name === player.stateName && selection.lga === player.lgaName ? [player.startingCommunity] : []), `${selected.name} Central Community`, `${selected.name} Riverside Community`, `${selected.name} Market Community`].filter((community, index, all) => all.indexOf(community) === index).map((community) => { const isHome = selected.name === player.stateName && selection.lga === player.lgaName && community === player.startingCommunity; return <button className="community-row" key={community} onClick={() => setSelection({ stateId: selected.id, lga: selection.lga, community })}><strong>{isHome ? '⭐ ' : '🔒 '}{community}</strong><small>{isHome ? 'Home Community · Your political origin' : 'View only · You cannot govern this community yet'}</small></button>; })}</div>}
        {selection?.community && <div className="scope-message"><strong>{selection.community}</strong><p>{selection.community === player.startingCommunity && selected.name === player.stateName && selection.lga === player.lgaName ? '⭐ Home Community · your permanent political origin.' : 'You can view this community, but you cannot govern it yet.'}</p><small>Current position: {player.role.replace('_', ' ')} · {player.startingCommunity}, {player.stateName}. Your journey expands through Chairman → Governor → President.</small></div>}
      </div>}
    </Modal>
  );
}
