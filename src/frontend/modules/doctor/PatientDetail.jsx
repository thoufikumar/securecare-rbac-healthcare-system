import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PatientProfileCard from './components/PatientProfileCard';
import PatientInfoGrid from './components/PatientInfoGrid';
import ReportsList from './components/ReportsList';
import AppointmentsTable from './components/AppointmentsTable';
import { getPatient } from '../../../backend/modules/patient/PatientService';

const PatientDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const data = await getPatient(id);
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p>Loading Patient Details...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-10 text-center">
        <h2>Patient not found</h2>
        <Link to="/doctor/patients" className="btn-primary mt-4 inline-block">Back to Patients List</Link>
      </div>
    );
  }

  // Map Firestore fields to component props
  const profileData = {
    avatar: `https://ui-avatars.com/api/?name=${patient.firstName}+${patient.lastName}&background=random`,
    name: `${patient.firstName} ${patient.lastName}`,
    email: patient.email || 'N/A',
    appointmentsCount: patient.prescriptions?.length || 0,
    totalBilling: '0.00' // Mock for now
  };

  const infoData = {
    gender: patient.gender || 'N/A',
    dob: patient.dob || 'N/A',
    city: patient.city || 'N/A',
    phone: patient.phone || 'N/A',
    zipCode: patient.zipCode || 'N/A',
    address: patient.address || 'N/A',
    status: 'Active', // Mock
    registerDate: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'
  };

  return (
    <div className="patient-detail-page fade-in" style={{ background: '#f6f8fb', minHeight: '100%', padding: '24px' }}>
      
      {/* ── BREADCRUMB HEADER ── */}
      <div className="breadcrumb-header mb-8" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/doctor/patients" style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>Patients List</Link>
        <span style={{ color: '#94a3b8' }}>{'>'}</span>
        <span style={{ color: '#1e293b', fontWeight: '600' }}>{profileData.name}</span>
      </div>

      {/* ── TOP 3-COLUMN GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Profile Card */}
        <PatientProfileCard patient={profileData} />

        {/* Info Card */}
        <PatientInfoGrid info={infoData} />

        {/* Reports Card */}
        <ReportsList reports={[]} /> 
      </div>

      {/* ── BOTTOM APPOINTMENT TABLE ── */}
      <AppointmentsTable appointments={patient.prescriptions || []} />
    </div>
  );
};

export default PatientDetail;
