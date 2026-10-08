import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Our Naija crashed:', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="screen center" role="alert">
        <div className="card">
          <h1>Something went wrong</h1>
          <p>Our Naija hit an unexpected problem. Reload the page to try again.</p>
          <p className="muted small">{this.state.error.message}</p>
          <button className="btn primary" onClick={() => window.location.reload()}>Reload game</button>
        </div>
      </main>
    );
  }
}
