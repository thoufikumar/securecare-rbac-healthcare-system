import React, { useState, useEffect } from 'react';
import NurseHeader from './components/NurseHeader';
import NurseStats from './components/NurseStats';
import NurseTaskList from './components/NurseTaskList';
import NurseCareList from './components/NurseCareList';
import NurseRecordsTable from './components/NurseRecordsTable';
import NurseActivity from './components/NurseActivity';
import useAuth from '../../../backend/modules/auth/useAuth';
import { 
  getRecentActivities,
  updateCarePlanTaskStatus,
  subscribeToPatientsByNurse
} from '../../../backend/modules/patient/PatientService';

const NurseDashboard = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    tasks: [],
    patients: [],
    records: [],
    activities: [],
    vitalsCount: 0,
    medsCount: 0
  });

  useEffect(() => {
    if (!user) return;

    let unsubscribePatients;
    
    const initDashboard = async () => {
      setLoading(true);
      try {
        // Real-time subscription for patients and tasks
        unsubscribePatients = subscribeToPatientsByNurse(user.uid, (patients) => {
          processDashboardData(patients);
          setLoading(false);
        });

        // Fetch activities once or subscribe later if needed
        const activities = await getRecentActivities(user.uid);
        const normalizedActivities = (activities || []).map(a => ({
          id: a.id,
          action: a.action.replace(/_/g, ' '),
          patientName: a.resource?.split('/').pop() || 'System',
          time: a.timestamp ? new Date(a.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        }));

        setData(prev => ({ ...prev, activities: normalizedActivities }));
      } catch (error) {
        console.error("Dashboard init error:", error);
        setLoading(false);
      }
    };

    initDashboard();
    return () => unsubscribePatients && unsubscribePatients();
  }, [user]);

  const processDashboardData = (patients) => {
    const allTasks = [];
    patients.forEach(p => {
      if (p.carePlan?.tasks) {
        p.carePlan.tasks.forEach(task => {
          allTasks.push({
            ...task,
            patientId: p.id,
            patientName: p.fullName,
            appointmentId: p.carePlan?.appointmentId
          });
        });
      }
    });

    const pendingTasks = allTasks
      .filter(t => t.status === "pending")
      .sort((a, b) => (a.priority === "urgent" ? -1 : 1));

    setData(prev => ({
      ...prev,
      tasks: pendingTasks,
      patients: patients || [],
      records: patients || [],
      vitalsCount: allTasks.filter(t => (t.type === "Vitals" || t.type === "Vitals Check") && t.status === "pending").length,
      medsCount: allTasks.filter(t => t.type === "Medication" && t.status === "pending").length
    }));
  };

  const handleMarkDone = async (taskId) => {
    try {
      const task = data.tasks.find(t => t.id === taskId);
      if (!task) return;

      await updateCarePlanTaskStatus(task.patientId, taskId, "completed", user);
      
      // Update local state
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }));
    } catch (error) {
      alert("Error updating task: " + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Nurse Care Management Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-wrapper fade-in">
      <NurseHeader />
      
      <NurseStats 
        patientsCount={data.patients.length} 
        tasksCount={data.tasks.length}
        vitalsCount={data.vitalsCount}
        medsCount={data.medsCount}
      />

      <div className="dashboard-grid section">
        <div className="left-column">
          <NurseTaskList tasks={data.tasks} onMarkDone={handleMarkDone} />
          <NurseRecordsTable records={data.records} />
        </div>

        <div className="right-column">
          <NurseCareList patients={data.patients} />
          <NurseActivity activities={data.activities} />
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
