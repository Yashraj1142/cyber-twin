import React, { useState } from 'react';

function App() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("Idle");

  const startSimulation = async () => {
    setStatus("Running Simulation...");
    setEvents([]);
    try {
      await fetch('http://localhost:8000/api/v1/agents/red/start', { method: 'POST' });
      const ws = new WebSocket('ws://localhost:8000/ws/simulations/sim_001');
      ws.onmessage = (event) => setEvents((prev) => [...prev, event.data]);
      ws.onclose = () => setStatus("Simulation Completed");
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CYBER-TWIN Dashboard</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={startSimulation} disabled={status === "Running Simulation..."} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px' }}>Start Autonomous Simulation</button>
        <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>Status: {status}</span>
      </div>
      <div style={{ backgroundColor: '#1e1e1e', color: '#00ff00', padding: '20px', height: '400px', overflowY: 'auto', borderRadius: '8px', fontFamily: 'monospace' }}>
        {events.length === 0 ? "Awaiting simulation events..." : events.map((e, idx) => <div key={idx} style={{ marginBottom: '10px' }}>{e}</div>)}
      </div>
    </div>
  );
}
export default App;