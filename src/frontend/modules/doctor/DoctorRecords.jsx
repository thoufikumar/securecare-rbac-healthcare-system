import React, { useState, useEffect } from 'react';
import RecordFolders from './components/RecordFolders';
import RecentActivityList from './components/RecentActivityList';

import { getAllPatients, getRecentActivities } from '../../../backend/modules/patient/PatientService';
import useAuth from '../../../backend/modules/auth/useAuth';

const DoctorRecords = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const [patientsData, activitiesData] = await Promise.all([
          getAllPatients(),
          getRecentActivities(user?.uid)
        ]);
        const normalizedActivities = (activitiesData || []).map(a => ({
          id: a.id,
          action: a.action.replace(/_/g, ' '),
          patient: a.resource.split('/').pop(),
          time: a.timestamp ? new Date(a.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          avatar: a.userId
        }));
        setPatients(patientsData);
        setActivities(normalizedActivities);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchRecords();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="records-container fade-in">
      <div className="records-header flex-between mb-6">
        <h1 className="page-title" style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>Patient Records</h1>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => console.log('New Record')}>
            <span>+</span> New
          </button>
          <button className="action-bar-btn" onClick={() => console.log('Filters')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            Filters
          </button>
          <button className="action-bar-btn" onClick={() => console.log('Sort')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            Sort By: Latest
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="section-title-sm" style={{ color: '#374151', marginBottom: '31px' }}>Patient Folders</h2>
        <RecordFolders folders={patients.map((p, i) => ({
          id: p.id,
          title: p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Untitled Folder',
          files: (p.prescriptions || []).length + 2, // Mocking file count based on prescriptions
          size: '12 MB',
          color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'][i % 6]
        }))} />
      </div>

      <div>
        <h2 className="section-title-sm" style={{ color: '#374151', marginBottom: '31px' }}>Recent Activity</h2>
        <RecentActivityList activities={activities} />
      </div>
    </div>
  );
};

export default DoctorRecords;
