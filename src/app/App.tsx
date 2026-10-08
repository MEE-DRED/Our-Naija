import { useEffect } from 'react';
import { GameCanvas } from '../components/GameCanvas';
import { TitleScreen } from '../components/TitleScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorScreen } from '../components/ErrorScreen';
import { Hud } from '../components/Hud';
import { InfoPanel } from '../components/InfoPanel';
import { AboutModal, DashboardModal, ProfileModal, SettingsModal } from '../components/Modals';
import { PoliticsPanel } from '../components/PoliticsPanel';
import { LgaPanel } from '../components/LgaPanel';
import { closeModal, selectEntity } from '../state/actions';
import { gameStore, worldStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { getEntityInfo } from '../game/data/entityInfo';
import { FarmPanel } from '../components/FarmPanel';
import { MarketPanel } from '../components/MarketPanel';
import { UpgradePanel } from '../components/UpgradePanel';
import { ExpansionPanel } from '../components/ExpansionPanel';
import { ProcessingPanel } from '../components/ProcessingPanel';
import { EventsPanel } from '../components/EventsPanel';
import { LocationSetup } from '../components/LocationSetup';
import { GovernorPanel } from '../components/GovernorPanel';
import { NigeriaOverview } from '../components/NigeriaOverview';
import { PresidentPanel } from '../components/PresidentPanel';
import { SidePanel } from '../components/SidePanel';

export default function App() {
  const screen = useStore(gameStore, (s) => s.screen);
  const modal = useStore(gameStore, (s) => s.modal);
  const selectedId = useStore(gameStore, (s) => s.selectedId);
  const world = useStore(worldStore, (s) => s.world);
  const info = getEntityInfo(world, selectedId);
  const selectedFarm = selectedId ? world.farmPlots.find((farm) => farm.id === selectedId) : undefined;
  const selectedBuilding = selectedId ? world.buildings.find((building) => building.id === selectedId) : undefined;
  const upgradeable = selectedBuilding && ['market', 'borehole', 'school', 'clinic', 'storage', 'solar-farm', 'biogas-plant'].includes(selectedBuilding.id) ? selectedBuilding : undefined;
  const selectedExpansion = selectedId ? world.expansionPlots.find((plot) => plot.id === selectedId) : undefined;
  const selectedProcessor = selectedId && ['garri-plant', 'rice-mill', 'tomato-plant', 'maize-plant'].includes(selectedId)
    ? world.buildings.find((building) => building.id === selectedId) : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (gameStore.getState().modal !== 'none') closeModal(); else selectEntity(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const inGame = screen === 'loading' || screen === 'playing';
  return (
    <>
      <p className="size-warning" role="alert">Our Naija needs a wider screen. Rotate your device or enlarge the window.</p>
      {inGame && <GameCanvas />}
      {screen === 'playing' && <><Hud /><SidePanel /></>}
      {screen === 'playing' && selectedFarm && <FarmPanel farmId={selectedFarm.id} farmName={selectedFarm.name} />}
      {screen === 'playing' && selectedId === 'market' && <MarketPanel />}
      {screen === 'playing' && selectedExpansion && <ExpansionPanel plot={selectedExpansion} />}
      {screen === 'playing' && selectedProcessor && <ProcessingPanel facilityId={selectedProcessor.id} title={selectedProcessor.name} />}
      {screen === 'playing' && upgradeable && selectedId !== 'market' && <UpgradePanel id={upgradeable.id} title={upgradeable.name} description={upgradeable.description} />}
      {screen === 'playing' && info && !selectedFarm && selectedId !== 'market' && !upgradeable && <InfoPanel info={info} />}
      {screen === 'loading' && <LoadingScreen />}
      {screen === 'title' && <TitleScreen />}
      {screen === 'error' && <ErrorScreen />}
      {modal === 'about' && <AboutModal />}
      {modal === 'settings' && <SettingsModal />}
      {modal === 'dashboard' && <DashboardModal />}
      {modal === 'profile' && <ProfileModal />}
      {modal === 'politics' && <PoliticsPanel />}
      {modal === 'lga' && <LgaPanel />}
      {modal === 'events' && <EventsPanel />}
      {modal === 'location' && <LocationSetup />}
      {modal === 'governor' && <GovernorPanel />}
      {modal === 'nigeria' && <NigeriaOverview />}
      {modal === 'president' && <PresidentPanel />}
    </>
  );
}
