import { useEffect, useState, type ReactNode } from 'react';
import { BarChart3, ChevronRight, Factory, Home, Landmark, Menu, Wheat, X, Zap } from 'lucide-react';
import { navigateTo, openModal, openSidePanel, selectEntity, closeSidePanel } from '../state/actions';
import { economyStore, eventStore, farmingStore, gameStore, playerStore, politicsStore, simulationStore, worldStore, type SidePanelSection } from '../state/stores';
import { useStore } from '../state/createStore';
import { formatNaira, formatPercent } from '../utils/format';
import { getEntityInfo } from '../game/data/entityInfo';

type Section = SidePanelSection;

const SectionButton = ({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) => (
  <button className={`side-nav-button ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>
);

export function SidePanel() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>('overview');
  const selectedId = useStore(gameStore, (state) => state.selectedId);
  const sharedOpen = useStore(gameStore, (state) => state.sidePanelOpen);
  const sharedSection = useStore(gameStore, (state) => state.sidePanelSection);
  const world = useStore(worldStore, (state) => state.world);
  const player = useStore(playerStore, (state) => state);
  const farms = useStore(farmingStore, (state) => state.farms);
  const economy = useStore(economyStore, (state) => state);
  const politics = useStore(politicsStore, (state) => state);
  const events = useStore(eventStore, (state) => state);
  const report = useStore(simulationStore, (state) => state.report);
  const selectedInfo = getEntityInfo(world, selectedId);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (sharedOpen) { setSection(sharedSection); setOpen(true); }
  }, [sharedOpen, sharedSection]);
  useEffect(() => {
    if (selectedId) setOpen(true);
  }, [selectedId]);
  const setSectionAndOpen = (next: Section) => { setSection(next); openSidePanel(next); setOpen(true); };
  const close = () => { setOpen(false); closeSidePanel(); };
  const focus = (id: string) => { navigateTo(id); selectEntity(id); };
  const farmCount = Object.values(farms).filter((farm) => farm.status !== 'EMPTY').length;
  const inventory = Object.values(player.resources).reduce((sum, value) => sum + value, 0);
  return (
    <>
      <button className="side-toggle" onClick={() => { if (open) close(); else { setOpen(true); openSidePanel(section); } }} aria-label={open ? 'Close game menu' : 'Open game menu'}>
        {open ? <ChevronRight size={22} /> : <Menu size={22} />}
      </button>
      <aside className={`side-panel ${open ? 'open' : ''}`} aria-label={selectedInfo ? `${selectedInfo.title} details` : 'Game menu'}>
        <header className="side-panel-header"><div><strong>{selectedInfo?.title ?? 'Our Naija'}</strong><small>{selectedInfo?.categoryLabel ?? player.communityName}</small></div><button className="icon-btn" onClick={close} aria-label="Close menu"><X size={20} /></button></header>
        {selectedInfo && <div className="selected-context"><p>{selectedInfo.description}</p><div className="side-facts"><div><span>Status</span><strong>{selectedInfo.status}</strong></div>{selectedInfo.stats.slice(0, 3).map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div><button className="btn reserve side-action" onClick={() => selectEntity(null)}>Clear selection</button></div>}
        <nav className="side-nav" aria-label="Community sections">
          <SectionButton active={section === 'overview'} label="Home" icon={<Home size={17} />} onClick={() => setSectionAndOpen('overview')} />
          <SectionButton active={section === 'agriculture'} label="Farms" icon={<Wheat size={17} />} onClick={() => setSectionAndOpen('agriculture')} />
          <SectionButton active={section === 'economy'} label="Market" icon={<BarChart3 size={17} />} onClick={() => setSectionAndOpen('economy')} />
          <SectionButton active={section === 'services'} label="Services" icon={<Zap size={17} />} onClick={() => setSectionAndOpen('services')} />
          <SectionButton active={section === 'politics'} label="Politics" icon={<Landmark size={17} />} onClick={() => setSectionAndOpen('politics')} />
          <SectionButton active={section === 'events'} label="Events" icon={<Factory size={17} />} onClick={() => setSectionAndOpen('events')} />
        </nav>
        <div className="side-content">
          {section === 'overview' && <><p className="side-location"><strong>{player.communityName}</strong><span>{player.lgaName} · {player.stateName}</span></p><div className="side-facts"><div><span>Population</span><strong>{player.population}</strong></div><div><span>Food security</span><strong>{formatPercent(player.foodSecurity)}</strong></div><div><span>Healthcare</span><strong>{formatPercent(player.health)}</strong></div><div><span>Education</span><strong>{formatPercent(player.education)}</strong></div><div><span>Electricity</span><strong>{formatPercent(player.electricity)}</strong></div><div><span>Employment</span><strong>{formatPercent(player.employment)}</strong></div><div><span>Happiness</span><strong>{formatPercent(player.happiness)}</strong></div><div><span>Treasury</span><strong>{formatNaira(player.treasury)}</strong></div></div><div className="side-report"><strong>Community performance</strong><span>Strength: {report.mainStrength}</span><span>Concern: {report.mainConcern}</span></div><button className="btn primary side-action" onClick={() => openModal('dashboard')}>Open full community dashboard</button></>}
          {section === 'agriculture' && <><div className="side-facts"><div><span>Active farms</span><strong>{farmCount}</strong></div><div><span>Inventory</span><strong>{inventory} units</strong></div><div><span>Food reserve</span><strong>{Object.values(player.foodReserve).reduce((sum, value) => sum + value, 0)}</strong></div><div><span>Processing job</span><strong>{economy.processing ? 'Active' : 'Idle'}</strong></div></div><button className="btn reserve side-action" onClick={() => focus('farm-1')}>View farms</button><button className="btn reserve side-action" onClick={() => openModal('dashboard')}>Agriculture details</button></>}
          {section === 'economy' && <><div className="side-facts"><div><span>Treasury</span><strong>{formatNaira(player.treasury)}</strong></div><div><span>Market goods</span><strong>{inventory}</strong></div><div><span>Transactions</span><strong>{economy.transactions.length}</strong></div><div><span>Jobs</span><strong>{player.jobs}</strong></div></div><button className="btn reserve side-action" onClick={() => focus('market')}>View market</button></>}
          {section === 'services' && <><div className="side-facts"><div><span>Healthcare</span><strong>{formatPercent(player.health)}</strong></div><div><span>Education</span><strong>{formatPercent(player.education)}</strong></div><div><span>Water</span><strong>{formatPercent(player.waterAccess)}</strong></div><div><span>Electricity</span><strong>{formatPercent(player.electricity)}</strong></div></div><button className="btn reserve side-action" onClick={() => focus('clinic')}>View clinic</button><button className="btn reserve side-action" onClick={() => focus('school')}>View school</button></>}
          {section === 'politics' && <><div className="side-facts"><div><span>Position</span><strong>{player.role.replace('_', ' ')}</strong></div><div><span>Approval</span><strong>{formatPercent(Math.min(100, politics.approval + politics.campaignApproval))}</strong></div><div><span>Election status</span><strong>{politics.phase}</strong></div></div><button className="btn primary side-action" onClick={() => openModal('politics')}>Open politics</button></>}
          {section === 'events' && <><div className="side-facts"><div><span>Active event</span><strong>{events.active ? 'Yes' : 'None'}</strong></div><div><span>Month</span><strong>{events.turn}</strong></div><div><span>History</span><strong>{events.history.length}</strong></div></div><button className="btn primary side-action" onClick={() => openModal('events')}>Open Wahala</button></>}
        </div>
      </aside>
    </>
  );
}
