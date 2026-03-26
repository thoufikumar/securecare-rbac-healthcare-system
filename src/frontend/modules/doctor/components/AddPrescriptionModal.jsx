import React, { useState } from 'react';
import { addPrescriptionToPatient } from '../../../../backend/modules/patient/PatientService';
import { auth } from '../../../../backend/config/firebase';

const AddPrescriptionModal = ({ isOpen, onClose, patientId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split('T')[0],
    duration: "",
    notes: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      alert("Please fill required fields (Name, Date)");
      return;
    }

    setLoading(true);
    try {
      const doctorId = auth.currentUser?.uid || "unknown-doc";
      await addPrescriptionToPatient(patientId, formData, doctorId);
      alert("Prescription added successfully!");
      setFormData({ name: "", date: new Date().toISOString().split('T')[0], duration: "", notes: "" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to add prescription. Please check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="section-title-md mb-6" style={{ fontSize: '20px' }}>Add New Prescription</h2>
        <div className="form-group mb-4">
          <label className="form-label block text-sm font-medium text-gray-700 mb-1">Prescription Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Heart Disease"
          />
        </div>
        <div className="form-group mb-4">
          <label className="form-label block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            className="form-input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="form-group mb-4">
          <label className="form-label block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            className="form-input"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g. 3 months"
          />
        </div>
        <div className="form-group mb-6">
          <label className="form-label block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            className="form-input"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional instructions..."
          ></textarea>
        </div>
        <div className="flex justify-end gap-3 mt-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '8px' }}>Cancel</button>
          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '10px 20px', borderRadius: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;
