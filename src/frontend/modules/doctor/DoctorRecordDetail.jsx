import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../backend/modules/auth/useAuth';
import PatientProfileCard from './components/PatientProfileCard';
import PatientInfoCard from './components/PatientInfoCard';
import TestReports from './components/TestReports';
import PrescriptionSection from './components/PrescriptionSection';
import AddPrescriptionModal from './components/AddPrescriptionModal';
// 🛡️ SECURITY & UI COMPONENTS
import SecureContainer from '../../components/security/SecureContainer';
import WatermarkOverlay from '../../components/security/WatermarkOverlay';
import AccessReasonModal from '../../components/security/AccessReasonModal';
import { getPatient } from '../../../backend/modules/patient/PatientService';

const DoctorRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const userRole = user?.role || 'doctor';

  const [showModal, setShowModal] = useState(false);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔐 Security State
  const [isAccessAuthorized, setIsAccessAuthorized] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(true);
  const [confirmedReason, setConfirmedReason] = useState(null);

  const fetchPatient = async (reason = null) => {
    if (!id || !user) return;
    
    // Determine the reason to use
    const effectiveReason = reason || confirmedReason || (user.role === 'admin' ? "Admin System Review" : null);

    setLoading(true);
    try {
      const data = await getPatient(id, user, effectiveReason ? { action: "READ", reason: effectiveReason } : {});
      setPatient(data);
      setIsAccessAuthorized(true);
      if (reason) setConfirmedReason(reason);
    } catch (error) {
      console.error("Error fetching patient:", error);
      alert("Access Denied: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'receptionist' || user?.role === 'admin') {
      setIsReasonModalOpen(false);
      fetchPatient();
    }
  }, [id, user]);

  const handleConfirmAccess = (reason) => {
    setIsReasonModalOpen(false);
    fetchPatient(reason);
  };

  if (loading && !isReasonModalOpen) return <div className="p-10 text-center">Verifying Security Credentials...</div>;
  
  if (!patient && !loading && !isReasonModalOpen) {
    return (
      <div className="p-10 text-center">
        <h2>Patient not found or Access restricted</h2>
        <button onClick={() => navigate(-1)} className="btn-primary mt-4">Go Back</button>
      </div>
    );
  }

  const rolePath = userRole === "nurse" ? "/nurse" : "/doctor";

  return (
    <div className="record-container fade-in">
      <AccessReasonModal 
        isOpen={isReasonModalOpen} 
        onClose={() => navigate(-1)} 
        onConfirm={handleConfirmAccess} 
      />

      <div className="record-content-area">
        
        {/* ── TOP BAR ── */}
        <div className="record-top-bar mb-6">
          <button className="back-link" onClick={() => navigate(`${rolePath}/records`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Records
          </button>
          <div className="top-bar-right">
            {/* User profile section removed */}
          </div>
        </div>

        <div className="record-detail-header mb-8">
          <h1 className="page-title-lg">Current Appointment Details</h1>
        </div>

        <SecureContainer secure={userRole !== 'admin'}>
          <WatermarkOverlay patientId={id} />
          
          {/* ── 2-COLUMN MAIN LAYOUT ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* LEFT COLUMN: Demographics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <PatientProfileCard patient={patient} variant="appointment" />
              <PatientInfoCard info={patient} />
            </div>

            {/* RIGHT COLUMN: Clinical Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <TestReports />
              <PrescriptionSection 
                prescriptions={patient?.prescriptions || []} 
                onAdd={() => setShowModal(true)} 
                userRole={userRole}
              />
            </div>
          </div>
        </SecureContainer>

        {userRole === 'doctor' && (
          <AddPrescriptionModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            patientId={id}
            onSuccess={() => fetchPatient()}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorRecordDetail;
