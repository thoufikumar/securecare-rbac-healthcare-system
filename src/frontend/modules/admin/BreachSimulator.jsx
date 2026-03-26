import React from "react";

const BreachSimulator = () => {
  return (
    <div className="crm-view">
      <h1 className="view-title">Breach Simulator</h1>
      <div className="card warning-card">
        <h2 style={{color: '#ef4444', marginBottom: '8px'}}>⚠️ Security Drill</h2>
        <p style={{color: '#4b5563', marginBottom: '20px'}}>Trigger simulated attacks to test system resilience and audit logging mechanisms.</p>
        <button className="btn-danger" style={{padding: '10px 20px', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600}}>
          Trigger Breach
        </button>
        <div className="output-area" style={{marginTop: '20px', background: '#111827', color: '#10b981', padding: '16px', borderRadius: '8px', fontFamily: 'monospace'}}>
           &gt; System ready. Awaiting simulation trigger...
        </div>
      </div>
    </div>
  );
};

export default BreachSimulator;
