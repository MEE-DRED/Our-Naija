import { useEffect, useState } from 'react';
import { campaignActions, candidateData, electionRequirements } from '../game/data/politics';
import { electionRequirements as requirements } from '../game/data/politics';
import { resolveCampaignEvent, runElection, startElection, useCampaignAction, refreshPoliticalApproval } from '../state/actions';
import { citizenVoiceStore, playerStore, politicsStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { formatNaira } from '../utils/format';
import { Modal } from './Modal';
import type { CampaignActionId } from '../types/politics';

const labels: Record<keyof typeof electionRequirements, string> = {
  development: 'Development', foodSecurity: 'Food Security', healthcare: 'Healthcare',
  education: 'Education', electricity: 'Electricity', employment: 'Employment', happiness: 'Happiness',
};

export function PoliticsPanel() {
  const player = useStore(playerStore, (state) => state);
  const politics = useStore(politicsStore, (state) => state);
  const citizenVoice = useStore(citizenVoiceStore, (state) => state);
  const [result, setResult] = useState<{ shares: number[]; won: boolean } | null>(null);
  useEffect(() => { refreshPoliticalApproval(); }, [player]);
  const currentRequirements = {
    development: player.development, foodSecurity: player.foodSecurity, healthcare: player.health,
    education: player.education, electricity: player.electricity, employment: player.employment, happiness: player.happiness,
  };
  const eligible = Object.entries(requirements).every(([key, value]) => currentRequirements[key as keyof typeof currentRequirements] >= value);
  const launchElection = () => { if (startElection()) refreshPoliticalApproval(); };
  const election = () => setResult(runElection());
  return (
    <Modal title="Leadership & public trust">
      <div className="approval-card">
        <div className="meter-head"><span>Public Approval</span><strong>{politics.approval + politics.campaignApproval}%</strong></div>
        <div className="track"><span style={{ width: `${Math.min(100, politics.approval + politics.campaignApproval)}%` }} /></div>
        <p className="muted">Your approval is earned through food, services, jobs, responsible community development, and listening to citizen petitions.</p>
        <p className="muted">Citizen trust: <strong>{citizenVoice.trust}%</strong> · Active petitions: <strong>{citizenVoice.petitions.length}</strong></p>
      </div>
      <h3>Local Government Chairman election</h3>
      {politics.phase === 'LOCKED' && (
        <div className="politics-section">
          <p>Election eligibility</p>
          {Object.entries(requirements).map(([key, value]) => <div className="requirement" key={key}><span>{currentRequirements[key as keyof typeof currentRequirements] >= value ? '✓' : '✗'} {labels[key as keyof typeof labels]}</span><strong>{currentRequirements[key as keyof typeof currentRequirements]} / {value}</strong></div>)}
          <p className="muted">Improve the remaining services to earn the right to contest.</p>
        </div>
      )}
      {['CAMPAIGN', 'LOST'].includes(politics.phase) && (
        <>
          <p>{politics.phase === 'LOST' ? 'The people have asked you to keep serving. Prepare for the next election.' : 'The community is ready. Spend carefully to earn more trust before Election Day.'}</p>
          <div className="campaign-list">
            {(Object.entries(campaignActions) as [CampaignActionId, typeof campaignActions[CampaignActionId]][]).map(([id, action]) => {
              const used = politics.campaignUses[id];
              return <button className="campaign-action" key={id} onClick={() => useCampaignAction(id)} disabled={used >= action.maximum || player.treasury < action.cost}>
                <span><strong>{action.name}</strong><small>{action.description}</small></span><em>{formatNaira(action.cost)} · +{action.approval} approval · {used}/{action.maximum}</em>
              </button>;
            })}
          </div>
          <div className="campaign-event">
            <strong>Market Traders Meeting</strong>
            <p className="muted">“The market traders are unhappy about poor road access.”</p>
            <div className="event-actions">
              <button className="btn reserve" onClick={() => resolveCampaignEvent('promise')}>Promise improvements</button>
              <button className="btn reserve" onClick={() => resolveCampaignEvent('repair')} disabled={player.treasury < 15000}>Fund repairs · {formatNaira(15000)}</button>
              <button className="btn reserve" onClick={() => resolveCampaignEvent('limited')}>Explain limited funds</button>
            </div>
          </div>
          <p className="campaign-total">Campaign spent: {formatNaira(politics.campaignSpent)}</p>
          <button className="btn primary" onClick={launchElection} disabled={!eligible}>Set Election Day</button>
        </>
      )}
      {politics.phase === 'ELECTION_READY' && !result && (
        <>
          <p><strong>Election Day</strong> · {player.communityName}</p>
          <div className="candidate-list">{candidateData.map((candidate) => <div className="candidate-card" key={candidate.id}><strong>{candidate.name}</strong><span>{candidate.party}</span><small>Strength: {candidate.strengths.join(' and ')}</small></div>)}<div className="candidate-card player-candidate"><strong>You</strong><span>Community Leader</span><small>Approval: {Math.min(100, politics.approval + politics.campaignApproval)}%</small></div></div>
          <button className="btn primary" onClick={election}>Count the votes</button>
        </>
      )}
      {result && <div className={result.won ? 'election-result won' : 'election-result'}><h3>{result.won ? 'You won the election' : 'You lost the election'}</h3><p>{result.won ? 'You have been elected Local Government Chairman. Your responsibilities have expanded.' : 'The community continues under your leadership. Improve service delivery and try again.'}</p>{[...result.shares].map((share, index) => <div className="vote-row" key={index}><span>{index === 0 ? 'You' : candidateData[index - 1].name}</span><strong>{share}%</strong></div>)}{result.won && <div className="ward-foundation"><strong>Local Government foundation</strong><small>Ward 1 · Ward 2 · Ward 3 · Ward 4</small><span>New wards will become available in a future leadership cycle.</span></div>}</div>}
      {politics.electionHistory.length > 0 && <><h3>Election history</h3>{politics.electionHistory.map((entry) => <p className="history-row" key={`${entry.number}-${entry.date}`}>Election #{entry.number}: <strong>{entry.result === 'WON' ? 'Won' : 'Lost'}</strong> · {entry.playerShare}%</p>)}</>}
    </Modal>
  );
}
