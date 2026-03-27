import React, { useState } from 'react';

const NurseRecordsTable = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = (records || []).filter(record => {
    const name = record.fullName || record.patientName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="dashboard-card stretch-card">
      <div className="card-header">
        <h2>Patient Records (View Only)</h2>
        <div className="header-tools">
          <div className="search-input-wrapper">
            <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="record-search-input"
            />
          </div>
        </div>
      </div>
      <div className="doctor-table-wrapper">
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Condition</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(record => (
              <tr key={record.id}>
                <td>{record.fullName || record.patientName}</td>
                <td>{record.medicalHistory?.conditions || "General Checkup"}</td>
                <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "No data"}</td>
                <td>
                  <button className="badge badge-blue">View</button>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr><td colSpan="4" className="empty-text">No matching records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NurseRecordsTable;
