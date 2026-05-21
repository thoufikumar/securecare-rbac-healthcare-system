import React, { useState } from 'react';
import { transition } from '../../../../backend/modules/state/StateService';
import { allocateRoom } from '../../../../backend/modules/room/RoomAllocationService';
import useAuth from '../../../../backend/modules/auth/useAuth';

/**
 * DoctorActionPanel provides interface for patient lifecycle transitions.
 */
const DoctorActionPanel = ({ patientId, currentStage, onStateChange }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);

  const handleTransition = async (action) => {
    setLoading(true);
    try {
      // 1. If ADMITTING, try to allocate room first
      if (action === 'ADMITTED') {
        const room = await allocateRoom(patientId, { requiredWard: 'GENERAL' });
        if (!room) {
          throw new Error("No rooms available in requested ward. Please select a fallback state.");
        }
      }

      // 2. Perform State Transition
      await transition(patientId, action, user, { metadata: `Doctor manual action: ${action}` });
      if (onStateChange) onStateChange();
      alert(`Patient state transitioned to ${action}`);
    } catch (error) {
      alert("Transition failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { id: 'WAITING', label: 'Send to Waiting', icon: '⏳', color: '#f59e0b' },
    { id: 'CONSULTATION', label: 'Consultation', icon: '👨‍⚕️', color: '#3b82f6' },
    { id: 'ADMITTED', label: 'Admit to Ward', icon: '🏥', color: '#10b981' },
    { id: 'ICU', label: 'Emergency ICU', icon: '🚨', color: '#ef4444' },
    { id: 'DISCHARGED', label: 'Discharge', icon: '✅', color: '#6366f1' }
  ];

  return (
    <div className="card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>Clinical Decision Hub</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => handleTransition(action.id)}
            disabled={loading || currentStage === action.id}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px',
              background: currentStage === action.id ? '#f1f5f9' : 'white',
              border: `1px solid ${currentStage === action.id ? '#e2e8f0' : action.color + '40'}`,
              color: currentStage === action.id ? '#94a3b8' : '#1e3a8a',
              cursor: (loading || currentStage === action.id) ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '18px' }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
      
      <p style={{ marginTop: '20px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
        * Every decision triggers an atomic state change and room allocation audit.
      </p>
    </div>
  );
};

export default DoctorActionPanel;
