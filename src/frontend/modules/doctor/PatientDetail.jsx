import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PatientProfileCard from './components/PatientProfileCard';
import PatientInfoGrid from './components/PatientInfoGrid';
import AppointmentsTable from './components/AppointmentsTable';
import AssignNurseModal from './components/AssignNurseModal';
import UpdatePatientModal from './components/UpdatePatientModal';
import DeletePatientModal from './components/DeletePatientModal';

// 🛡️ SECURITY & DOCTOR COMPONENTS
import SecureContainer from '../../components/security/SecureContainer';
import WatermarkOverlay from '../../components/security/WatermarkOverlay';
import AccessReasonModal from '../../components/security/AccessReasonModal';
import PatientStatusBanner from './components/PatientStatusBanner';
import PatientTimeline from './components/PatientTimeline';
import DoctorActionPanel from './components/DoctorActionPanel';
import RevealField from '../../components/security/RevealField';

import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../backend/config/firebase';
import { getPatient } from '../../../backend/modules/patient/PatientService';
import { decryptData } from '../../../backend/security/encryption';
import useAuth from '../../../backend/modules/auth/useAuth';

const PatientDetail = () => {
  const { id } = useParams();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [patientState, setPatientState] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // 🔐 Security State
  const [isAccessAuthorized, setIsAccessAuthorized] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(true);

  const fetchPatientData = async (reason = null) => {
    setLoading(true);
    try {
      // Pass reason back to backend if required by getPatient (IBAC)
      const [patientData, apptSnap, stateSnap, historySnap, insuranceSnap] = await Promise.all([
        getPatient(id, user, reason ? { action: "READ", reason } : null),
        getDocs(query(collection(db, "appointments"), where("patientId", "==", id))),
        getDoc(doc(db, "patientState", id)),
        getDocs(query(collection(db, "medicalHistory"), where("patientId", "==", id))),
        getDocs(query(collection(db, "insuranceDetails"), where("patientId", "==", id)))
      ]);
      
      setPatient(patientData);
      setPatientState(stateSnap.exists() ? stateSnap.data() : null);
      setAppointments(apptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Process & Decrypt Medical History
      if (!historySnap.empty) {
        const h = historySnap.docs[0].data();
        setMedicalHistory({
          conditions: JSON.parse(decryptData(h.conditions, id) || "[]"),
          allergies: JSON.parse(decryptData(h.allergies, id) || "[]"),
          lifestyle: JSON.parse(decryptData(h.lifestyle, id) || "{}"),
          familyHistory: decryptData(h.familyHistory, id)
        });
      }

      // Process & Decrypt Insurance
      if (!insuranceSnap.empty) {
        const i = insuranceSnap.docs[0].data();
        setInsurance({
          provider: decryptData(i.provider, id),
          policyNumber: decryptData(i.policyNumber, id),
          coverageType: decryptData(i.coverageType, id),
          validUntil: i.validUntil
        });
      }

      setIsAccessAuthorized(true);
    } catch (error) {
      console.error("Error fetching patient detail data:", error);
      alert("Access Denied: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for reason if role is doctor/nurse
    if (user?.role === 'receptionist' || user?.role === 'admin') {
      setIsReasonModalOpen(false);
      fetchPatientData();
    }
  }, [id, user]);

  const handleConfirmAccess = (reason) => {
    setIsReasonModalOpen(false);
    fetchPatientData(reason);
  };

  if (loading && !isReasonModalOpen) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p>Verifying Security Credentials...</p>
      </div>
    );
  }

  const rolePath = user?.role === "nurse" ? "/nurse/monitoring" : "/doctor/patients";

  if (!patient && !loading) {
    return (
      <div className="p-10 text-center">
        <h2>Patient not found or Access restricted</h2>
        <Link to={rolePath} className="btn-primary mt-4 inline-block">Back to Patients List</Link>
      </div>
    );
  }

  // Map Firestore fields to component props
  const profileData = {
    avatar: `https://ui-avatars.com/api/?name=${patient?.fullName || `${patient?.firstName}+${patient?.lastName}`}&background=random`,
    name: patient?.fullName || `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'N/A',
    email: patient?.email || 'N/A',
    appointmentsCount: appointments.length || 0,
    totalBilling: '0.00' 
  };

  const infoData = {
    gender: patient?.gender || 'N/A',
    dob: patient?.dob || 'N/A',
    city: patient?.city || 'N/A',
    phone: patient?.phone || 'N/A',
    zipCode: patient?.zipCode || 'N/A',
    address: patient?.address || 'N/A',
    status: patientState?.stage || 'Active',
    registerDate: patient?.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'
  };

  const isNurse = user?.role === "nurse";

  return (
    <div className="patient-detail-page fade-in" style={{ background: '#f6f8fb', minHeight: '100%', padding: '24px' }}>
      
      <AccessReasonModal 
        isOpen={isReasonModalOpen} 
        onClose={() => window.history.back()} 
        onConfirm={handleConfirmAccess} 
      />

      {/* ── BREADCRUMB HEADER ── */}
      <div className="flex-between mb-6">
        <div className="breadcrumb-header" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to={rolePath} style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>Patients List</Link>
          <span style={{ color: '#94a3b8' }}>{'>'}</span>
          <span style={{ color: '#1e293b', fontWeight: '600' }}>{profileData.name}</span>
          {isNurse && <span className="badge badge-blue" style={{ marginLeft: '12px' }}>Care Monitoring</span>}
        </div>
      </div>

      <PatientStatusBanner patientId={id} />

      <SecureContainer secure={user?.role !== 'admin'}>
        <WatermarkOverlay patientId={id} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PatientProfileCard patient={profileData} />
            {user?.role === 'doctor' && (
              <DoctorActionPanel 
                patientId={id} 
                currentStage={patientState?.stage} 
                onStateChange={() => fetchPatientData()} 
              />
            )}

            {/* Medical Summary Card */}
            <div className="card" style={{ padding: '24px' }}>
              <div className="flex-between mb-4">
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Clinical Summary</h3>
                {patientState?.intakeStatus !== 'COMPLETED' ? (
                  <span className="badge" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2' }}>⚠ Intake Pending</span>
                ) : (
                  <span className="badge badge-green">Verified</span>
                )}
              </div>

              {medicalHistory ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Conditions</p>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {medicalHistory.conditions.map(c => <span key={c} className="badge badge-blue">{c}</span>)}
                      {medicalHistory.conditions.length === 0 && <span style={{ fontSize: '13px', color: '#64748b' }}>None Reported</span>}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Allergies</p>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {medicalHistory.allergies.map(a => <span key={a} className="badge badge-red">{a}</span>)}
                      {medicalHistory.allergies.length === 0 && <span style={{ fontSize: '13px', color: '#64748b' }}>None Reported</span>}
                    </div>
                  </div>
                  {insurance && (
                    <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Insurance</p>
                      <p style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{insurance.provider}</p>
                      <RevealField label="Policy #" value={insurance.policyNumber} />
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>No medical history on file.</p>
              )}
            </div>
          </div>

          {/* Timeline / Clinical Records */}
          <div className="card" style={{ padding: '24px', minHeight: '600px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>Clinical Timeline (Append-Only)</h3>
            <PatientTimeline patientId={id} />
          </div>

          {/* Info Card & Action Modals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PatientInfoGrid info={infoData} />
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Quick Actions</h4>
              <button 
                onClick={() => setActiveModal('Update')} 
                className="btn-secondary w-full mb-3"
                disabled={isNurse}
              >
                ✏️ Edit Profile
              </button>
              <button 
                onClick={() => setActiveModal('AssignNurse')} 
                className="btn-secondary w-full"
                disabled={isNurse}
              >
                👩‍⚕️ Assign Care Team
              </button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM APPOINTMENT TABLE ── */}
        <AppointmentsTable 
          appointments={appointments} 
          onAction={(action, appt) => {
            setActiveModal(action);
            setSelectedAppointment(appt);
          }}
        />
      </SecureContainer>

      {/* ── MODALS ── */}
      {activeModal === 'AssignNurse' && (
        <AssignNurseModal 
          isOpen={true} 
          onClose={() => setActiveModal(null)} 
          patient={patient}
          appointment={selectedAppointment}
        />
      )}
      
      {activeModal === 'Update' && (
        <UpdatePatientModal 
          isOpen={true} 
          onClose={() => setActiveModal(null)} 
          patient={patient}
          onSuccess={() => fetchPatientData()}
        />
      )}

      {activeModal === 'Delete' && (
        <DeletePatientModal 
          isOpen={true} 
          onClose={() => setActiveModal(null)} 
          patientId={patient?.id}
          patientName={profileData.name}
        />
      )}
    </div>
  );
};

export default PatientDetail;
