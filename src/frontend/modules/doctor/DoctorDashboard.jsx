import React, { useState, useEffect } from 'react';
import HeaderSection from './components/HeaderSection';
import StatsCards from './components/StatsCards';
import AppointmentsList from './components/AppointmentsList';
import AssignedPatientsList from './components/AssignedPatientsList';
import PatientRecordsTable from './components/PatientRecordsTable';
import UpdatePatientModal from './components/UpdatePatientModal';
import DeletePatientModal from './components/DeletePatientModal';
import RecentActivity from './components/RecentActivity';
import useAuth from '../../../backend/modules/auth/useAuth';
import { 
  getPatientsByDoctor, 
  getAllPatients, 
  getRecentActivities 
} from '../../../backend/modules/patient/PatientService';
import { subscribeToDoctorAppointments } from '../../../backend/modules/appointment/AppointmentService';

const DoctorDashboard = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    appointments: [],
    patients: [],
    records: [],
    activities: []
  });

  // Modal States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'doctor') {
      const unsubscribe = subscribeToDoctorAppointments(user.uid, (appointments) => {
        setData(prev => ({ ...prev, appointments }));
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const isNurse = user.role === 'nurse';
      
      // Fetch in parallel for speed
      const [patients, records, activities] = await Promise.all([
        isNurse ? getAllPatients() : getPatientsByDoctor(user.uid),
        getAllPatients(), // For Records table, show all for now
        getRecentActivities(user.uid)
      ]);

      const normalizedActivities = (activities || []).map(a => ({
        id: a.id,
        action: a.action.replace(/_/g, ' '),
        patient: a.target?.patientId || 'N/A',
        time: a.timestamp ? new Date(a.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        avatar: a.userId
      }));

      setData(prev => ({
        ...prev,
        patients: patients || [],
        records: records || [],
        activities: normalizedActivities
      }));
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableAction = (action, patient) => {
    setSelectedPatient(patient);
    if (action === 'Edit') {
      setIsUpdateModalOpen(true);
    } else if (action === 'Delete') {
      setIsDeleteModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading {user?.role === 'nurse' ? 'Nurse' : 'Doctor'} Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-wrapper fade-in">
      <HeaderSection />
      
      <StatsCards 
        appointmentsCount={data.appointments.length} 
        patientsCount={data.patients.length} 
        reviewsCount={data.records.filter(r => !r.viewed).length} 
      />

      <div className="dashboard-grid section">
        <div className="left-column">
          <AppointmentsList appointments={data.appointments} />
          <PatientRecordsTable records={data.records} />
        </div>

        <div className="right-column">
          <AssignedPatientsList 
            patients={data.patients} 
            onAction={handleTableAction}
          />
          <RecentActivity activities={data.activities} />
        </div>
      </div>

      {/* MODALS */}
      {isUpdateModalOpen && selectedPatient && (
        <UpdatePatientModal 
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          patient={selectedPatient}
          onSuccess={fetchDashboardData}
        />
      )}

      {isDeleteModalOpen && selectedPatient && (
        <DeletePatientModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          patientId={selectedPatient.id}
          patientName={selectedPatient.fullName || `${selectedPatient.firstName} ${selectedPatient.lastName}`}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
