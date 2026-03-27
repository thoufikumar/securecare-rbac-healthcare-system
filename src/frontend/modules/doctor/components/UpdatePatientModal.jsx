import React, { useState } from 'react';
import { updatePatient } from '../../../../backend/modules/patient/PatientService';

const UpdatePatientModal = ({ isOpen, onClose, patient, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: patient.firstName || '',
    lastName: patient.lastName || '',
    age: patient.age || '',
    gender: patient.gender || '',
    contactNumber: patient.contactNumber || '',
    address: patient.address || '',
    fullName: patient.fullName || `${patient.firstName} ${patient.lastName}`
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      alert("First Name and Last Name are required");
      return;
    }

    setLoading(true);
    try {
      await updatePatient(patient.id, {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`
      });
      alert("Patient updated successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to update patient: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" style={{ maxWidth: '500px' }}>
        <h2 className="section-title-md mb-6" style={{ fontSize: '20px' }}>Update Patient Details</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group mb-4">
            <label className="form-label block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="form-group mb-4">
            <label className="form-label block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group mb-4">
            <label className="form-label block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              className="form-input"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div className="form-group mb-4">
            <label className="form-label block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              className="form-input"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <input
            type="text"
            className="form-input"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />
        </div>

        <div className="form-group mb-6">
          <label className="form-label block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            className="form-input"
            rows="2"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
            {loading ? "Updating..." : "Update Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatientModal;
