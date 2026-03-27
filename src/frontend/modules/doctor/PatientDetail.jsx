import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PatientProfileCard from './components/PatientProfileCard';
import PatientInfoGrid from './components/PatientInfoGrid';
import ReportsList from './components/ReportsList';
import AppointmentsTable from './components/AppointmentsTable';
import AssignNurseModal from './components/AssignNurseModal';
import UpdatePatientModal from './components/UpdatePatientModal';
import DeletePatientModal from './components/DeletePatientModal';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../backend/config/firebase';
import { getPatient } from '../../../backend/modules/patient/PatientService';
import useAuth from '../../../backend/modules/auth/useAuth';

const PatientDetail = () => {
  const { id } = useParams();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const [patientData, apptSnap] = await Promise.all([
          getPatient(id),
          getDocs(query(collection(db, "appointments"), where("patientId", "==", id)))
        ]);
        
        setPatient(patientData);
        setAppointments(apptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching patient detail data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p>Loading Patient Details...</p>
      </div>
    );
  }

  const rolePath = user?.role === "nurse" ? "/nurse/monitoring" : "/doctor/patients";

  if (!patient) {
    return (
      <div className="p-10 text-center">
        <h2>Patient not found</h2>
        <Link to={rolePath} className="btn-primary mt-4 inline-block">Back to Patients List</Link>
      </div>
    );
  }

  // Map Firestore fields to component props
  const profileData = {
    avatar: `https://ui-avatars.com/api/?name=${patient.fullName || `${patient.firstName}+${patient.lastName}`}&background=random`,
    name: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'N/A',
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

  const isNurse = user?.role === "nurse";

  const handleAction = (action, data = null) => {
    setActiveModal(action);
    setSelectedAppointment(data);
  };

  return (
    <div className="patient-detail-page fade-in" style={{ background: '#f6f8fb', minHeight: '100%', padding: '24px' }}>
      
      {/* ── BREADCRUMB HEADER ── */}
      <div className="flex-between mb-8">
        <div className="breadcrumb-header" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to={rolePath} style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>Patients List</Link>
          <span style={{ color: '#94a3b8' }}>{'>'}</span>
          <span style={{ color: '#1e293b', fontWeight: '600' }}>{profileData.name}</span>
          {isNurse && <span className="badge badge-blue" style={{ marginLeft: '12px' }}>View Only Mode</span>}
        </div>
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
      <AppointmentsTable 
        appointments={appointments} 
        onAction={(action, appt) => handleAction(action, appt)}
      />

      {/* ── MODALS ── */}
      <AssignNurseModal 
        isOpen={activeModal === 'AssignNurse'} 
        onClose={() => handleAction(null)} 
        patient={patient}
        appointment={selectedAppointment}
      />
      
      <UpdatePatientModal 
        isOpen={activeModal === 'Update'} 
        onClose={() => setActiveModal(null)} 
        patient={patient}
        onSuccess={() => {
           // Reload patient data
           getPatient(id).then(setPatient);
        }}
      />

      <DeletePatientModal 
        isOpen={activeModal === 'Delete'} 
        onClose={() => setActiveModal(null)} 
        patientId={patient.id}
        patientName={profileData.name}
      />
    </div>
  );
};

export default PatientDetail;
