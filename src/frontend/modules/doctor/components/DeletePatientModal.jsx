import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePatient } from '../../../../backend/modules/patient/PatientService';

const DeletePatientModal = ({ isOpen, onClose, patientId, patientName }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePatient(patientId);
      alert("Patient deleted successfully");
      navigate('/doctor/patients');
    } catch (err) {
      alert("Failed to delete patient: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: '#fee2e2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Confirm Deletion</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
            Are you sure you want to delete <strong>{patientName}</strong>? This action cannot be undone and all clinical history will be permanently removed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-secondary" 
            onClick={onClose} 
            style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
          >
            Cancel
          </button>
          <button 
            className="btn-danger" 
            onClick={handleDelete}
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '10px', 
              background: '#dc2626', 
              color: 'white', 
              border: 'none',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
              cursor: 'pointer'
            }}
          >
            {loading ? "Deleting..." : "Delete Patient"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePatientModal;
