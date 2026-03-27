import React, { useState, useEffect } from 'react';
import { getUsersByRole } from '../../../../backend/modules/user/UserService';
import { assignNurseToPatient } from '../../../../backend/modules/patient/PatientService';
import useAuth from '../../../../backend/modules/auth/useAuth';

const AssignNurseModal = ({ isOpen, onClose, patient, appointment, onAssigned }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [nurses, setNurses] = useState([]);
  const [selectedNurseId, setSelectedNurseId] = useState('');
  const [tasks, setTasks] = useState([
    { type: 'Vitals Check', description: '', priority: 'normal', scheduledTime: new Date().toISOString().slice(0, 16) }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getUsersByRole('nurse').then(setNurses).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTask = () => {
    setTasks([...tasks, { type: 'Vitals Check', description: '', priority: 'normal', scheduledTime: new Date().toISOString().slice(0, 16) }]);
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleRemoveTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNurseId) {
      alert("Please select a nurse");
      return;
    }
    if (tasks.length === 0) {
      alert("At least one task is required in the Care Plan");
      return;
    }
    setLoading(true);
    try {
      await assignNurseToPatient(patient.id, selectedNurseId, tasks, user, appointment?.id);
      alert("Nurse assigned successfully!");
      if (onAssigned) onAssigned();
      onClose();
    } catch (error) {
      alert("Error assigning nurse: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="section-title-md mb-6" style={{ fontSize: '20px' }}>Assign Nurse & Care Plan</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label className="form-label block text-sm font-medium text-gray-700 mb-1">Select Nurse *</label>
            <select 
              value={selectedNurseId} 
              onChange={(e) => setSelectedNurseId(e.target.value)}
              className="form-input"
              required
            >
              <option value="">-- Select Nurse --</option>
              {nurses.map(nurse => (
                <option key={nurse.id} value={nurse.id}>{nurse.email}</option>
              ))}
            </select>
          </div>

          <div className="care-plan-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#374151' }}>Care Plan Builder</h3>
               <button type="button" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleAddTask}>+ Add Task</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((task, index) => (
                <div key={index} className="task-row" style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.2fr', gap: '10px', marginBottom: '10px' }}>
                    <select 
                      value={task.type} 
                      onChange={(e) => handleTaskChange(index, 'type', e.target.value)}
                      className="form-input"
                      style={{ fontSize: '13px' }}
                    >
                      <option value="Vitals Check">Vitals Check</option>
                      <option value="Medication">Medication</option>
                      <option value="Routine Check">Routine Check</option>
                    </select>
                    <input 
                      type="datetime-local"
                      className="form-input"
                      value={task.scheduledTime}
                      onChange={(e) => handleTaskChange(index, 'scheduledTime', e.target.value)}
                      style={{ fontSize: '13px' }}
                    />
                    <select 
                      value={task.priority} 
                      onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                      className="form-input"
                      style={{ fontSize: '13px' }}
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <button type="button" onClick={() => handleRemoveTask(index)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                  <input 
                    placeholder="Brief description of the task..." 
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                    className="form-input"
                    required
                    style={{ fontSize: '13px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ padding: '10px 20px', background: '#f3f4f6', borderRadius: '8px' }}>Cancel</button>
            <button 
              type="submit" 
              className="primary-btn" 
              disabled={loading}
              style={{ padding: '10px 20px', borderRadius: '8px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Assigning..." : "Assign Nurse & Care Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignNurseModal;
