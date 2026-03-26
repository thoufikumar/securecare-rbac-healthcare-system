import React, { useState, useEffect } from 'react';
import PatientsTable from './components/PatientsTable';
import useAuth from '../../../backend/modules/auth/useAuth';

import { getAllPatients } from '../../../backend/modules/patient/PatientService';

const DoctorPatients = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Filter by name or email
  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    return fullName.includes(term) || (p.email && p.email.toLowerCase().includes(term)) || (p.city && p.city.toLowerCase().includes(term));
  });

  return (
    <div className="patients-manager-wrapper fade-in">
      {/* HEADER */}
      <div className="patients-header" style={{ position: 'relative', justifyContent: 'center' }}>
        <div className="header-title" style={{ position: 'absolute', left: '32px' }}>
          <h2>Patient Lists</h2>
        </div>
        <div className="header-actions">
          <div className="search-input-wrapper custom-search" style={{ width: '1000px', padding: '8px 16px' }}>
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="record-search-input"
              style={{ width: '100%', fontSize: '14.7px' }}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT / TABLE */}
      {loading ? (
        <div className="loading-state" style={{ marginTop: '50px' }}>
          <div className="spinner"></div>
          <p>Loading Patients...</p>
        </div>
      ) : (
        <PatientsTable patients={filteredPatients} />
      )}
    </div>
  );
};

export default DoctorPatients;
