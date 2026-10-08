import { useState } from 'react';
import { governorRequirements, stateProjects } from '../config/governor';
import { fundStateProject, governorEligibility } from '../state/actions';
import { playerStore, politicsStore, stateStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { formatNaira, formatPercent } from '../utils/format';
import { Modal } from './Modal';

export function GovernorPanel() {
  const player = useStore(playerStore, (value) => value);
  const state = useStore(stateStore, (value) => value);
  const politics = useStore(politicsStore, (value) => value);
  const [campaign, setCampaign] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState(governorEligibility());
  const regionName = player.stateName;
  const beginCampaign = () => { setEligibility(governorEligibility()); if (governorEligibility().eligible) setCampaign(true); };
  const vote = () => {
    const score = eligibility.approval + eligibility.development + eligibility.foodSecurity + eligibility.happiness;
    const won = score >= 310 && Math.random() > 0.2;
    if (won) playerStore.setState({ role: 'GOVERNOR' });
    politicsStore.setState({ approval: won ? Math.min(100, politics.approval + 5) : Math.max(0, politics.approval - 5) });
    setResult(won ? `You won the State Governor election and now govern ${regionName}.` : 'You lost the State Governor election. Continue improving your LGA and try again.');
  };
  const requirements = Object.entries(governorRequirements) as Array<[keyof typeof governorRequirements, number]>;
  return (
    <Modal title={player.role === 'GOVERNOR' ? `State of ${regionName}` : 'State Governor pathway'}>
      {player.role !== 'GOVERNOR' ? <>
        <p className="muted">Governor eligibility is earned through successful LGA governance. Your original State remains {regionName}.</p>
        {requirements.map(([key, value]) => <div className="requirement" key={key}><span>{eligibility[key] >= value ? '✓' : '✗'} {key}</span><strong>{eligibility[key]} / {value}</strong></div>)}
        {!campaign && <button className="btn primary" onClick={beginCampaign}>Begin Governor campaign</button>}
        {campaign && !result && <><p>Fictional state candidates will be judged on LGA performance, trust, campaign themes, and state-wide support.</p><div className="campaign-list"><button className="campaign-action" onClick={vote}><span><strong>Run on performance</strong><small>Food Security · Jobs · Roads · Services</small></span><em>Election Day</em></button></div></>}
        {result && <p className={result.startsWith('You won') ? 'event-success' : 'muted'}>{result}</p>}
      </> : <>
        <div className="lga-stats"><div><strong>{formatPercent(state.development)}</strong><small>Development</small></div><div><strong>{formatPercent(state.foodSecurity)}</strong><small>Food security</small></div><div><strong>{formatNaira(state.treasury)}</strong><small>State treasury</small></div><div><strong>{state.completedProjects.length}</strong><small>Projects</small></div></div>
        <p className="muted">Governor of {regionName}. You can govern every representative LGA in your selected State; the home community remains your political origin.</p>
        <h3>State projects</h3>
        <div className="project-list">{stateProjects.map((project) => <div className="project-row" key={project.id}><span><strong>{project.name}</strong><small>{project.description}</small></span><button className="btn reserve" disabled={state.completedProjects.includes(project.id) || state.treasury < project.cost} onClick={() => fundStateProject(project.id)}>{state.completedProjects.includes(project.id) ? 'Complete' : `${formatNaira(project.cost)} · Fund`}</button></div>)}</div>
        <p className="muted">State food: {state.foodProduction} produced · {state.foodDemand} demanded · reserve {state.foodReserve}. LGAs and communities are simulated in layers for browser performance.</p>
      </>}
    </Modal>
  );
}
