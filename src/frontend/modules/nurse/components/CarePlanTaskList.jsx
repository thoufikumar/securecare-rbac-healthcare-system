import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../../backend/config/firebase';
import useAuth from '../../../../backend/modules/auth/useAuth';

/**
 * CarePlanTaskList displays prioritized nursing tasks.
 */
const CarePlanTaskList = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "carePlans"),
          where("assignedNurseId", "==", user?.uid),
          where("status", "==", "PENDING"),
          orderBy("priority", "desc")
        );
        const snapshot = await getDocs(q);
        setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Care plan fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  const getPriorityColor = (p) => {
    if (p === 'CRITICAL') return '#ef4444';
    if (p === 'HIGH') return '#f59e0b';
    return '#3b82f6';
  };

  if (loading) return <div className="p-4 text-center">Loading shift tasks...</div>;

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Shift Task List</h3>
        <span className="badge badge-blue">{tasks.length} Pending</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task.id} style={{ 
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9',
            background: '#fff', transition: 'transform 0.2s', cursor: 'pointer'
          }}>
            <div style={{ 
              width: '4px', height: '100%', minHeight: '40px', 
              background: getPriorityColor(task.priority), borderRadius: '2px' 
            }}></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{task.taskName}</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Patient ID: ...{task.patientId.slice(-6)}</p>
            </div>
            <button style={{ 
              padding: '6px 12px', borderRadius: '8px', background: '#f8fafc',
              border: '1px solid #e2e8f0', color: '#475569', fontSize: '11px', fontWeight: '700'
            }}>
              LOG
            </button>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>No pending tasks in your care plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarePlanTaskList;
