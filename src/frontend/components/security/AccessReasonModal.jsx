import React, { useState } from 'react';

/**
 * AccessReasonModal enforces intent-based reasoning before accessing clinical data.
 */
const AccessReasonModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    { value: 'CONSULTATION', label: 'Consultation & Review' },
    { value: 'EMERGENCY', label: 'Emergency Access' },
    { value: 'FOLLOW_UP', label: 'Follow-up Treatment' },
    { value: 'ADMIN_AUDIT', label: 'Compliance Audit' },
    { value: 'OTHER', label: 'Other (Specify below)' }
  ];

  const handleConfirm = () => {
    const finalReason = reason === 'OTHER' ? otherReason : reason;
    if (!finalReason || finalReason.length < 5) {
      alert("A valid reason (minimum 5 characters) is required for security auditing.");
      return;
    }
    onConfirm(finalReason);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div className="modal-card fade-in" style={{
        background: 'white', padding: '32px', borderRadius: '16px',
        width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔐</div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Security Verification Required</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            Please provide a purpose for accessing this patient's clinical records. This action will be audited.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>Primary Reason</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                fontSize: '14px', color: '#1e293b', background: '#f8fafc'
              }}
            >
              <option value="">Select a reason...</option>
              {reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {reason === 'OTHER' && (
            <div className="fade-in">
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>Specific Purpose</label>
              <textarea 
                placeholder="Describe your reason here..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                  fontSize: '14px', color: '#1e293b', resize: 'none'
                }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <button 
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px', borderRadius: '8px', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="primary-btn"
              disabled={!reason}
              style={{ padding: '10px', borderRadius: '8px', fontSize: '14px', background: '#3b82f6', color: 'white', border: 'none' }}
            >
              Confirm Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessReasonModal;
