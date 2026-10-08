import { useState } from 'react';
import { eventById } from '../game/data/events';
import { resolveActiveEvent, respondToPetition } from '../state/actions';
import { responseLabel } from '../game/systems/citizenVoice';
import { citizenVoiceStore, eventStore, playerStore } from '../state/stores';
import { useStore } from '../state/createStore';
import { formatNaira } from '../utils/format';
import { Modal } from './Modal';

export function EventsPanel() {
  const state = useStore(eventStore, (value) => value);
  const player = useStore(playerStore, (value) => value);
  const voice = useStore(citizenVoiceStore, (value) => value);
  const [message, setMessage] = useState<string | null>(null);
  const event = state.active ? eventById(state.active.eventId) : undefined;
  const choose = (choiceId: string) => {
    if (!resolveActiveEvent(choiceId)) return;
    setMessage('Decision recorded. Its consequences will shape the next few months.');
  };
  return (
    <Modal title="Wahala & opportunities">
      <div className="event-summary"><strong>Month {state.turn}</strong><span>{state.season.toLowerCase()} season</span></div>
      {event ? (
        <div className="event-card">
          <div className="event-heading"><span className={`severity ${event.severity}`}>{event.severity}</span><small>{event.category} · {event.affectedArea}</small></div>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p className="muted">Active until month {state.active?.expiresTurn}. Choose a response; unresolved events can expire and remain in governance history.</p>
          <div className="event-choices">
            {event.choices.map((choice) => <button className="event-choice" key={choice.id} onClick={() => choose(choice.id)} disabled={player.treasury < choice.cost}>
              <strong>{choice.label}</strong><small>{choice.description}</small><em>{choice.cost ? formatNaira(choice.cost) : 'No immediate cost'}</em>
            </button>)}
          </div>
        </div>
      ) : <p className="muted">No active event. Advance the month from the dashboard to discover what the community faces next.</p>}
      {message && <p className="event-success">{message}</p>}
      <h3>Citizen voice · trust {voice.trust}%</h3>
      {voice.petitions.length === 0 ? <p className="muted">No active petitions. Citizens will raise issues when services come under pressure.</p> : voice.petitions.map((petition) => (
        <div className="petition-card" key={petition.id}>
          <div className="event-heading"><span className={`severity ${petition.priority}`}>{petition.priority}</span><small>{petition.category} · {petition.ward}</small></div>
          <h3>{petition.title}</h3>
          <p>“{petition.message}”</p>
          <small className="muted">Submitted by {petition.submittedBy} · Status: {petition.status.replace('_', ' ').toLowerCase()}</small>
          <p className="muted">{petition.impact}</p>
          <div className="event-actions">
            <button className="btn reserve" onClick={() => { respondToPetition(petition.id, 'progress'); setMessage('Government response recorded.'); }}>{responseLabel(petition.status) ?? 'Respond'}</button>
            <button className="btn ghost dark" onClick={() => { respondToPetition(petition.id, 'ignore'); setMessage('Petition ignored; trust and approval were affected.'); }}>Ignore</button>
          </div>
        </div>
      ))}
      {voice.history.length > 0 && <><h3>Citizen voice history</h3>{voice.history.slice(0, 5).map((petition) => <div className="history-row" key={`${petition.id}-${petition.status}`}><strong>{petition.title}</strong><span>{petition.status.toLowerCase()} · Month {petition.updatedTurn}</span><small>{petition.impact}</small></div>)}</>}
      <h3>Recent governance history</h3>
      {state.history.length === 0 ? <p className="muted">No decisions recorded yet.</p> : state.history.slice(0, 5).map((entry) => <div className="history-row" key={`${entry.eventId}-${entry.turn}-${entry.decision}`}><strong>{entry.title}</strong><span>Month {entry.turn} · {entry.decision}</span><small>{entry.outcome}</small></div>)}
    </Modal>
  );
}
