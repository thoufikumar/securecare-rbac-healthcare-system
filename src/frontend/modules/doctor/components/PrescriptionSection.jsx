import React from 'react';

const PrescriptionSection = ({ prescriptions = [], onAdd, userRole }) => {
  return (
    <div className="prescription-section">
      <div className="flex-between mb-4">
        <h3 className="section-title-md">Prescriptions</h3>
      </div>

      {userRole === 'doctor' && (
        <div className="add-prescription-banner mb-4" onClick={onAdd}>
          <span>+ Add a prescription</span>
        </div>
      )}

      <div className="table-responsive">
        <table className="prescription-table">
          <thead>
            <tr>
              <th>Prescriptions</th>
              <th>Date</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p, idx) => (
              <tr key={p.id || idx}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="pill-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-orange-400"><path d="M10.5 20.5a7 7 0 1 1 9.9-9.9L10.5 20.5z"></path><path d="M3.5 13.5a7 7 0 1 1 9.9-9.9L3.5 13.5z"></path></svg>
                    </div>
                    <span className="p-name">{p.name}</span>
                  </div>
                </td>
                <td>{p.date}</td>
                <td>{p.duration}</td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
              <tr>
                <td colSpan="3">
                  <div className="empty-state">
                    No prescriptions found for this patient.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionSection;
