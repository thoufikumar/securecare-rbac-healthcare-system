// src/frontend/modules/doctor/PatientIntakeForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SecureContainer from '../../components/security/SecureContainer';
import WatermarkOverlay from '../../components/security/WatermarkOverlay';
import { getPatient } from '../../../backend/modules/patient/PatientService';
import { recordMedicalHistory } from '../../../backend/modules/clinical/ClinicalService';
import { saveInsuranceDetails } from '../../../backend/modules/clinical/InsuranceService';
import { transition } from '../../../backend/modules/state/StateService';
import useAuth from '../../../backend/modules/auth/useAuth';

const PatientIntakeForm = () => {
  const { patientId } = useParams();
  const id = patientId; // Normalized for existing logic
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  
  const [formData, setFormData] = useState({
    medical: {
      conditions: [],
      allergies: [],
      surgeries: [],
      chronicDiseases: [],
      pastMedications: [],
      familyHistory: "",
      lifestyle: { smoking: "Never", alcohol: "Occasional", activity: "Moderate" }
    },
    insurance: {
      provider: "",
      policyNumber: "",
      coverageType: "Cashless",
      validUntil: "",
      notes: ""
    },
    additional: {
      notes: "",
      emergencyFlags: []
    }
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatient(id, user, { action: "READ", reason: "Initial Patient Intake" });
        setPatient(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    if (id && user) fetchPatient();
  }, [id, user]);

  const handleUpdate = (section, fields) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...fields }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const context = { reason: "Initial Medical Intake" };
      
      // 1. Save Medical History
      await recordMedicalHistory({
        patientId: id,
        ...formData.medical,
        additionalNotes: formData.additional.notes,
        emergencyFlags: formData.additional.emergencyFlags
      }, user, context);

      // 2. Save Insurance
      await saveInsuranceDetails({
        patientId: id,
        ...formData.insurance
      }, user, context);

      // 3. Update State to COMPLETED
      await transition(id, "REGISTERED", user, {
        intakeStatus: "COMPLETED"
      });

      alert("Secure Intake Complete. Data encrypted and saved.");
      navigate(`/receptionist`);
    } catch (error) {
      alert("Submission failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return <div className="p-10 text-center">Loading Patient Context...</div>;

  return (
    <SecureContainer secure={true}>
      <WatermarkOverlay patientId={id} />
      
      <div className="crm-view fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="flex-between mb-8">
          <div>
            <h1 className="view-title">Secure Data Intake</h1>
            <p className="text-slate-400">Patient: {patient.fullName} • ID: {id.slice(-6)}</p>
          </div>
          <div className="badge badge-blue">Step {step} of 3</div>
        </div>

        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          
          {/* STEP 1: MEDICAL HISTORY */}
          {step === 1 && (
            <div className="fade-in">
              <h3 className="section-title-md mb-6">Clinical History (Encrypted)</h3>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Chronic Conditions</label>
                  <input 
                    type="text" className="form-input" 
                    placeholder="Comma separated: Diabetes, Hypertension..."
                    onChange={e => handleUpdate('medical', { conditions: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Allergies</label>
                  <input 
                    type="text" className="form-input" 
                    placeholder="Peanuts, Penicillin..."
                    onChange={e => handleUpdate('medical', { allergies: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Family Medical History</label>
                  <textarea 
                    className="form-input" rows="3"
                    onChange={e => handleUpdate('medical', { familyHistory: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Smoking Status</label>
                  <select className="form-input" onChange={e => handleUpdate('medical', { lifestyle: { ...formData.medical.lifestyle, smoking: e.target.value } })}>
                    <option>Never</option>
                    <option>Former</option>
                    <option>Current</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Alcohol Consumption</label>
                  <select className="form-input" onChange={e => handleUpdate('medical', { lifestyle: { ...formData.medical.lifestyle, alcohol: e.target.value } })}>
                    <option>None</option>
                    <option>Occasional</option>
                    <option>Frequent</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INSURANCE DETAILS */}
          {step === 2 && (
            <div className="fade-in">
              <h3 className="section-title-md mb-6">Insurance Coverage (Encrypted)</h3>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Insurance Provider</label>
                  <input 
                    type="text" className="form-input" 
                    value={formData.insurance.provider}
                    onChange={e => handleUpdate('insurance', { provider: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Policy Number</label>
                  <input 
                    type="text" className="form-input" 
                    value={formData.insurance.policyNumber}
                    onChange={e => handleUpdate('insurance', { policyNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Coverage Type</label>
                  <select className="form-input" value={formData.insurance.coverageType} onChange={e => handleUpdate('insurance', { coverageType: e.target.value })}>
                    <option>Cashless</option>
                    <option>Reimbursement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Validity Period</label>
                  <input 
                    type="date" className="form-input" 
                    value={formData.insurance.validUntil}
                    onChange={e => handleUpdate('insurance', { validUntil: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ADDITIONAL RECORDS */}
          {step === 3 && (
            <div className="fade-in">
              <h3 className="section-title-md mb-6">Emergency Flags & Additional Notes</h3>
              <div className="form-group">
                <label className="form-label">High-Risk Conditions (Emergency Flags)</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {['Heart Condition', 'Asthma', 'Diabetes', 'Epilepsy', 'Blood Thinners'].map(flag => (
                    <button
                      key={flag}
                      onClick={() => {
                        const flags = formData.additional.emergencyFlags.includes(flag)
                          ? formData.additional.emergencyFlags.filter(f => f !== flag)
                          : [...formData.additional.emergencyFlags, flag];
                        handleUpdate('additional', { emergencyFlags: flags });
                      }}
                      className={`badge ${formData.additional.emergencyFlags.includes(flag) ? 'badge-red' : 'badge-blue'}`}
                      style={{ border: 'none', cursor: 'pointer', padding: '8px 16px' }}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Past Surgical Records / Notes</label>
                <textarea 
                  className="form-input" rows="5"
                  placeholder="Record major surgeries, previous hospitalizations..."
                  onChange={e => handleUpdate('additional', { notes: e.target.value })}
                ></textarea>
              </div>
            </div>
          )}

        </div>

        <div className="flex-between">
          <button 
            className="btn-secondary" 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button className="primary-btn" onClick={() => setStep(s => s + 1)}>Continue</button>
          ) : (
            <button className="primary-btn" style={{ background: '#10b981' }} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Securing Data...' : 'Complete Intake'}
            </button>
          )}
        </div>

        <p style={{ marginTop: '24px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
          🛡️ This module uses end-to-end encryption. Only authorized medical staff can view this data after successful identity verification.
        </p>
      </div>
    </SecureContainer>
  );
};

export default PatientIntakeForm;
