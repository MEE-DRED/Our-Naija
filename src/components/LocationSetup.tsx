import { useState } from 'react';
import { closeModal, establishProfile, startGame } from '../state/actions';
import { playerStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { Modal } from './Modal';
import { nigeriaRegions } from '../game/data/nigeria';

type StateName = string;

export function LocationSetup() {
  const player = useStore(playerStore, (value) => value);
  const hasSavedProfile = Boolean(window.localStorage.getItem('our-naija-profile'));
  const savedRegion = nigeriaRegions.find((region) => region.name === player.stateName) ?? nigeriaRegions.find((region) => region.id === 'ogun')!;
  const [stateName, setStateName] = useState<StateName>(hasSavedProfile ? savedRegion.name : 'Ogun');
  const selectedRegion = nigeriaRegions.find((region) => region.name === stateName) ?? savedRegion;
  const lgaNames = selectedRegion.lgas;
  const [lgaName, setLgaName] = useState<string>(hasSavedProfile ? player.lgaName : lgaNames[0]);
  const communities = [selectedRegion.name.replace(' State', '') + ' Central Community', selectedRegion.name.replace(' State', '') + ' Riverside Community'];
  const [community, setCommunity] = useState<string>(hasSavedProfile ? player.startingCommunity : communities[0]);
  const chooseState = (next: StateName) => {
    const nextRegion = nigeriaRegions.find((region) => region.name === next)!;
    setStateName(next); setLgaName(nextRegion.lgas[0]); setCommunity(`${nextRegion.name} Central Community`);
  };
  const chooseLga = (next: string) => { setLgaName(next); setCommunity(`${selectedRegion.name} Central Community`); };
  const continueGame = () => { if (!hasSavedProfile) establishProfile(stateName, lgaName, community); closeModal(); startGame(); };
  return (
    <Modal title={hasSavedProfile ? 'Continue your political origin' : 'Choose your political origin'}>
      {hasSavedProfile ? <p>Your account is permanently rooted in <strong>{player.startingCommunity}</strong>, {player.lgaName}, {player.stateName}. This origin remains with you as you progress.</p> : <p>Select the State, LGA and community where your leadership begins. One account can establish one permanent starting community.</p>}
      {!hasSavedProfile && <div className="location-form">
        <label>State<select value={stateName} onChange={(event) => chooseState(event.target.value)}>{nigeriaRegions.map((region) => <option key={region.id}>{region.name}</option>)}</select></label>
        <label>Local Government Area<select value={lgaName} onChange={(event) => chooseLga(event.target.value)}>{lgaNames.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label>Starting Community<select value={community} onChange={(event) => setCommunity(event.target.value)}>{communities.map((name) => <option key={name}>{name}</option>)}</select></label>
      </div>}
      <button className="btn primary" onClick={continueGame}>{hasSavedProfile ? 'Continue' : 'Establish community'}</button>
    </Modal>
  );
}
