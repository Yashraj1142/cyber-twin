import React, { useEffect, useState } from 'react';

const API_BASE = window.location.origin;

function App() {
  const [events, setEvents] = useState([]);
  const [apiStatus, setApiStatus] = useState('Checking API…');
  const [simulationStatus, setSimulationStatus] = useState('Ready');

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/health`)
      .then((response) => {
        if (!response.ok) throw new Error('Health check failed');
        return response.json();
      })
      .then((health) => {
        if (!cancelled) setApiStatus(`${health.service} · online`);
      })
      .catch(() => {
        if (!cancelled) setApiStatus('API unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function startSimulation() {
    setSimulationStatus('Starting…');
    setEvents([]);

    try {
      const response = await fetch(`${API_BASE}/api/v1/agents/red/start`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const result = await response.json();

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(
        `${protocol}//${window.location.host}/ws/simulations/${encodeURIComponent(result.simulation_id)}`,
      );

      socket.onopen = () => setSimulationStatus('Simulation running');
      socket.onmessage = (message) => setEvents((previous) => [...previous, message.data]);
      socket.onerror = () => setSimulationStatus('Live event connection failed');
      socket.onclose = () => setSimulationStatus('Simulation complete');
    } catch (error) {
      setSimulationStatus(error.message || 'Could not connect to the API');
    }
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Cyber Twin home">
          <span className="brand-mark">CT</span>
          <span>CYBER<span className="brand-accent">·</span>TWIN</span>
        </a>
        <div className="api-indicator">
          <span className={`status-dot ${apiStatus.endsWith('online') ? 'online' : ''}`} />
          <span>{apiStatus}</span>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">AUTONOMOUS SECURITY OPERATIONS</p>
        <h1>Cyber Twin <span>Command Center</span></h1>
        <p className="hero-copy">Run the allowlisted Red Agent checks against a separate demo-target container and watch each result arrive live.</p>
        <div className="hero-meta">
          <span><small>API</small>{API_BASE}</span>
          <span><small>DEMO LOGIN</small><a className="demo-link" href="/demo/" target="_blank" rel="noreferrer">Open isolated target ↗</a></span>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel simulation-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">SIMULATION CONTROL</p>
              <h2>Red Agent test sequence</h2>
            </div>
            <span className={`run-state ${simulationStatus === 'Simulation running' ? 'active' : ''}`}>
              <span className="status-dot" />{simulationStatus}
            </span>
          </div>
          <p className="panel-copy">Runs reconnaissance, header review, and up to three fixed login checks. Open the demo target to watch each login attempt arrive live.</p>
          <button className="start-button" onClick={startSimulation} disabled={simulationStatus === 'Starting…' || simulationStatus === 'Simulation running'}>
            <span aria-hidden="true">▶</span> Run scoped Red Agent
          </button>
          <div className="agent-strip">
            <div><span className="agent-icon red">R</span><span><b>Red Agent</b><small>Allowlisted plan</small></span></div>
            <div><span className="agent-icon blue">D</span><span><b>Demo target</b><small>Separate private image</small></span></div>
            <div><span className="agent-icon purple">F</span><span><b>Findings</b><small>Live event feed</small></span></div>
          </div>
        </article>

        <article className="panel events-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">LIVE TELEMETRY</p>
              <h2>Simulation events</h2>
            </div>
            <span className="event-count">{String(events.length).padStart(2, '0')}</span>
          </div>
          <div className="event-feed" aria-live="polite">
            {events.length === 0 ? (
              <div className="empty-state"><span className="pulse-mark">⌁</span><p>Events will appear here when the simulation starts.</p></div>
            ) : events.map((event, index) => (
              <div className="event-row" key={`${index}-${event}`}>
                <span className="event-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="event-line" />
                <p>{event}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
      <footer>CYBER-TWIN MVP <span>·</span> API and dashboard served from one Docker URL</footer>
    </main>
  );
}

export default App;
