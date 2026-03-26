import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../backend/modules/auth/useAuth';
import PatientProfileCard from './components/PatientProfileCard';
import PatientInfoCard from './components/PatientInfoCard';
import VitalStats from './components/VitalStats';
import TestReports from './components/TestReports';
import PrescriptionSection from './components/PrescriptionSection';
import AddPrescriptionModal from './components/AddPrescriptionModal';
import UpdateVitalsModal from './components/UpdateVitalsModal';
import { getPatient } from '../../../backend/modules/patient/PatientService';

const DoctorRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const userRole = user?.role || 'doctor';

  const [showModal, setShowModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchPatient();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Patient Details...</div>;
  if (!patient) return <div className="p-10 text-center">Patient not found</div>;

  const rolePath = userRole === "nurse" ? "/nurse" : "/doctor";

  return (
    <div className="record-container fade-in">
      <div className="record-content-area">
        
        {/* ── TOP BAR ── */}
        <div className="record-top-bar mb-6">
          <button className="back-link" onClick={() => navigate(`${rolePath}/records`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Records
          </button>
          <div className="top-bar-right">
            <button className="icon-btn-minimal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="doctor-profile-mini">
              <img src={`https://ui-avatars.com/api/?name=${userRole === 'nurse' ? 'Nurse' : 'Doctor'}&background=${userRole === 'nurse' ? 'ec4899' : '2563eb'}&color=fff`} alt="User" />
              <div className="doc-info-mini">
                <span className="doc-name-mini">{userRole === 'nurse' ? 'Nurse' : 'Doctor'} ▾</span>
              </div>
            </div>
          </div>
        </div>

        <div className="record-detail-header mb-8">
          <h1 className="page-title-lg">Current Appointment Details</h1>
        </div>

        {/* ── 2-COLUMN MAIN LAYOUT ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Demographics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PatientProfileCard patient={patient} variant="appointment" />
            <PatientInfoCard info={patient} />
          </div>

          {/* RIGHT COLUMN: Clinical Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <VitalStats 
              vitals={patient.vitals} 
              onUpdate={() => setShowVitalsModal(true)} 
            />
            <TestReports />
            <PrescriptionSection 
              prescriptions={patient.prescriptions || []} 
              onAdd={() => setShowModal(true)} 
              userRole={userRole}
            />
          </div>
        </div>

        {userRole === 'doctor' && (
          <AddPrescriptionModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            patientId={id}
            onSuccess={fetchPatient}
          />
        )}

        <UpdateVitalsModal 
          isOpen={showVitalsModal}
          onClose={() => setShowVitalsModal(false)}
          patientId={id}
          initialVitals={patient.vitals}
          onSuccess={fetchPatient}
        />
      </div>
    </div>
  );
};

export default DoctorRecordDetail;
