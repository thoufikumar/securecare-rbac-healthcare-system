import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../backend/config/firebase';
import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';
import AppointmentTable from './components/AppointmentTable';

const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "appointments"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort newest first or by date
        data.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Dashboard Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-wrapper fade-in" style={{ padding: '0px' }}>
      <DashboardHeader />
      
      <div style={{ padding: '24px' }}>
        <StatsCards 
          appointmentsCount={appointments.length} 
          pendingCount={pendingCount} 
        />
        
        <AppointmentTable appointments={appointments} />
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
