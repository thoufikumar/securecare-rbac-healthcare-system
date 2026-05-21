import React from 'react';
import ShiftFilteredPatientList from './components/ShiftFilteredPatientList';
import CarePlanTaskList from './components/CarePlanTaskList';
import useAuth from '../../../backend/modules/auth/useAuth';

const NursePatients = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  return (
    <div className="patients-manager-wrapper fade-in" style={{ padding: '24px' }}>
      {/* HEADER */}
      <div className="patients-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>Ward Monitoring</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Active Shift • {user?.wardId || "WARD_B"} • {new Date().toLocaleDateString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="badge badge-blue" style={{ padding: '8px 16px' }}>Shift ACTIVE</div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        <ShiftFilteredPatientList />
        <CarePlanTaskList />
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
        <p style={{ fontSize: '13px', color: '#0369a1', margin: 0, fontWeight: '500' }}>
          🛡️ <strong>Security Notice:</strong> You are currently restricted to viewing patients only within your assigned ward and active shift window. All access is logged.
        </p>
      </div>
    </div>
  );
};

export default NursePatients;
