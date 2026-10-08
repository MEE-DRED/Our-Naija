import { backToTitle } from '../state/actions';
import { gameStore } from '../state/stores';
import { useStore } from '../state/createStore';

export function ErrorScreen() {
  const msg = useStore(gameStore, (s) => s.errorMessage);
  return (
    <main className="screen center" role="alert">
      <div className="card">
        <h1>The game could not start</h1>
        <p>Your browser may not support the graphics this game needs. Try updating it, or open Our Naija in Chrome, Edge, Safari or Firefox.</p>
        {msg && <p className="muted small">{msg}</p>}
        <button className="btn primary" onClick={backToTitle}>Back to title</button>
      </div>
    </main>
  );
}
