import { useState } from 'react';
import { presidentialCampaigns, presidentialRequirements } from '../config/president';
import { stateStore, playerStore, politicsStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { presidentialEligibility, runPresidentialElection } from '../state/actions';
import { formatNaira, formatPercent } from '../utils/format';
import { Modal } from './Modal';

export function PresidentPanel() {
  const player = useStore(playerStore, (value) => value);
  const state = useStore(stateStore, (value) => value);
  const politics = useStore(politicsStore, (value) => value);
  const [support, setSupport] = useState(0);
  const [result, setResult] = useState<{ won: boolean; share: number } | null>(null);
  const eligibility = presidentialEligibility();
  const campaign = (cost: number, value: number) => { if (player.treasury < cost) return; playerStore.setState({ treasury: player.treasury - cost }); setSupport((current) => current + value); };
  const election = () => setResult(runPresidentialElection(support));
  return <Modal title="Presidential pathway">
    <p className="muted">National responsibility is prepared here, but this foundation does not yet implement federal government systems.</p>
    {player.role !== 'GOVERNOR' && player.role !== 'PRESIDENT' ? <p>Become Governor of your home State before seeking national office.</p> : <>
      {Object.entries(presidentialRequirements).map(([key, value]) => { const current = eligibility[key as keyof typeof presidentialRequirements] as number; return <div className="requirement" key={key}><span>{current >= value ? '✓' : '✗'} {key}</span><strong>{current} / {value}</strong></div>; })}
      {!result && <><h3>National campaign foundation</h3><div className="campaign-list">{presidentialCampaigns.map((item) => <button className="campaign-action" key={item.id} onClick={() => campaign(item.cost, item.support)} disabled={player.treasury < item.cost}><span><strong>{item.name}</strong><small>{item.description}</small></span><em>{formatNaira(item.cost)} · +{item.support} support</em></button>)}</div><button className="btn primary" disabled={!eligibility.eligible} onClick={election}>Hold Presidential Election</button></>}
      {result && <div className={result.won ? 'election-result won' : 'election-result'}><h3>{result.won ? 'You were elected President of Nigeria' : 'You were not elected President'}</h3><p>You received {formatPercent(result.share)} of the national vote. {result.won ? 'National scope is now unlocked for future systems.' : 'Your governorship continues.'}</p></div>}
      <p className="muted">State performance: {formatPercent(state.development)} development · current approval {formatPercent(politics.approval)}</p>
    </>}
  </Modal>;
}
