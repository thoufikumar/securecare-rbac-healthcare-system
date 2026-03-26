import React, { useState } from 'react';
import { updatePatientVitals } from '../../../../backend/modules/patient/PatientService';
import useAuth from '../../../../backend/modules/auth/useAuth';

const UpdateVitalsModal = ({ isOpen, onClose, patientId, initialVitals, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [vitals, setVitals] = useState({
    heartRate: initialVitals?.heartRate || '80',
    temperature: initialVitals?.temperature || '36.5',
    glucose: initialVitals?.glucose || '100',
    weight: initialVitals?.weight || '70',
    height: initialVitals?.height || '175'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updatePatientVitals(patientId, vitals, user);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Update Vital Signs</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-alert mb-4">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Heart Rate (bpm)</label>
              <input
                type="number"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                placeholder="80"
                required
              />
            </div>

            <div className="form-group">
              <label>Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                placeholder="36.5"
                required
              />
            </div>

            <div className="form-group">
              <label>Glucose (mg/dl)</label>
              <input
                type="number"
                value={vitals.glucose}
                onChange={(e) => setVitals({ ...vitals, glucose: e.target.value })}
                placeholder="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                placeholder="70"
              />
            </div>
          </div>

          <div className="modal-actions mt-6">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Save Vitals'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVitalsModal;
