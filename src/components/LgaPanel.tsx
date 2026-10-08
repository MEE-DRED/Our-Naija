import { useEffect, useState } from 'react';
import { lgaWards } from '../game/data/wards';
import { lgaProjects } from '../game/data/projects';
import { collectLgaRevenue, lgaSummary, retainLgaSurplus, startLgaProject } from '../state/actions';
import { lgaStore, playerStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { formatNaira, formatPercent } from '../utils/format';
import { Modal } from './Modal';
import type { LgaProjectId } from '../types/project';
import type { WardId } from '../types/ward';

export function LgaPanel() {
  const state = useStore(lgaStore, (value) => value);
  const player = useStore(playerStore, (value) => value);
  const [selectedWard, setSelectedWard] = useState<WardId>('iyetoro');
  const [summary, setSummary] = useState(lgaSummary());
  useEffect(() => { setSummary(lgaSummary()); }, [state]);
  const selected = state.wards[selectedWard];
  const activeProjects = state.projects.filter((project) => project.completesAt > Date.now());
  return (
    <Modal title="Chairman's Office · Local Government">
      <p className="lga-intro">You managed {player.startingCommunity}. Now you govern the four communities of {player.lgaName} in {player.stateName}.</p>
      <div className="lga-stats">
        <div><strong>{summary.population}</strong><small>Population</small></div>
        <div><strong>{formatPercent(summary.development)}</strong><small>Development</small></div>
        <div><strong>{formatNaira(state.treasury)}</strong><small>LGA Treasury</small></div>
        <div><strong>{formatNaira(summary.revenue)}</strong><small>Available funds</small></div>
      </div>
      <div className="lga-meters">
        <span>Food {formatPercent(summary.foodSecurity)}</span><span>Health {formatPercent(summary.health)}</span>
        <span>Education {formatPercent(summary.education)}</span><span>Power {formatPercent(summary.electricity)}</span>
        <span>Jobs {formatPercent(summary.employment)}</span><span>Happiness {formatPercent(summary.happiness)}</span>
      </div>
      <h3>Wards</h3>
      <div className="ward-tabs">{lgaWards.map((ward) => <button className={selectedWard === ward.id ? 'active' : ''} key={ward.id} onClick={() => setSelectedWard(ward.id)}>Ward {ward.wardNumber}<small>{ward.name}</small></button>)}</div>
      <div className="ward-card">
        <strong>{lgaWards.find((ward) => ward.id === selectedWard)?.name}</strong>
        <span>{lgaWards.find((ward) => ward.id === selectedWard)?.agriculturalStrengths.join(' · ')} · {selected.population} people</span>
        <div className="ward-metrics">Food {selected.foodProduction}/{selected.foodDemand} · Health {selected.metrics.health}% · Education {selected.metrics.education}% · Jobs {selected.metrics.employment}% · Power {selected.metrics.electricityAccess}%</div>
      </div>
      <p className="lga-food">Food: {summary.balance.production} produced · {summary.balance.demand} demanded · {summary.balance.surplus ? `${summary.balance.surplus} surplus` : `${summary.balance.shortage} shortage`} · Reserve {state.foodReserve}/{state.storageCapacity}</p>
      <button className="btn reserve" onClick={retainLgaSurplus} disabled={!summary.balance.surplus}>Retain food surplus</button>
      <button className="btn reserve" onClick={() => { collectLgaRevenue(); setSummary(lgaSummary()); }}>Collect economic revenue</button>
      <h3>Government projects</h3>
      <div className="project-list">{lgaProjects.map((project) => <div className="project-row" key={project.id}><span><strong>{project.name}</strong><small>{project.description}</small></span><button className="btn reserve" disabled={player.treasury < project.cost} onClick={() => startLgaProject(project.id as LgaProjectId, selectedWard)}>{formatNaira(project.cost)} · Build</button></div>)}</div>
      {activeProjects.length > 0 && <p className="muted">Under construction: {activeProjects.map((project) => project.projectId).join(', ')}.</p>}
      <h3>Future progression</h3><p className="muted">Strong LGA-wide performance will eventually open the next leadership stage. Governor systems are not active in this cycle.</p>
    </Modal>
  );
}
