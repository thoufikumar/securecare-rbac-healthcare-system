import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../backend/config/firebase";
import useAuth from "../../../backend/modules/auth/useAuth";

const ManageUsers = () => {
  const { createUserByAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("doctor");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let collectionName = "users";
      if (activeTab === "patient") collectionName = "patients";
      else if (activeTab === "doctor") collectionName = "doctors";
      else if (activeTab === "nurse") collectionName = "nurses";

      const q = query(collection(db, collectionName));
      const snapshot = await getDocs(q);
      const fetchedItems = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Normalize display fields
        displayName: doc.data().fullName || doc.data().name || doc.data().email?.split('@')[0] || "Unknown",
        displayEmail: doc.data().email || "No Email",
        displayRole: doc.data().role || activeTab
      }));

      fetchedItems.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setItems(fetchedItems);
    } catch (err) {
      console.error(`Error fetching ${activeTab} data:`, err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);

    const res = await createUserByAdmin(email, password, role);
    if (res.success) {
      setFormSuccess("User created successfully.");
      setEmail("");
      setPassword("");
      setRole("doctor");
      fetchItems(); 
    } else {
      setFormError(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="crm-view">
      <div className="crm-top-bar">
        <h1 className="view-title">Users</h1>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'patient' ? 'active' : ''}`}
          onClick={() => setActiveTab('patient')}
        >
          Patients
        </button>
        <button
          className={`tab ${activeTab === 'doctor' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctor')}
        >
          Doctors
        </button>
        <button
          className={`tab ${activeTab === 'nurse' ? 'active' : ''}`}
          onClick={() => setActiveTab('nurse')}
        >
          Staff
        </button>
      </div>

      {showAddForm && (
        <div className="card add-user-card" style={{ marginBottom: '24px' }}>
          <h2>Create New User</h2>
          <form onSubmit={handleCreateUser} className="inline-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <div>
                <label>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              <button type="submit" className="btn-primary form-submit" disabled={isSubmitting} style={{ height: '38px', padding: '0 20px', display: 'flex', alignItems: 'center', transform: 'translateY(-10px)' }}>
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
          {formError && <p className="error-text">❌ {formError}</p>}
          {formSuccess && <p className="success-text">✅ {formSuccess}</p>}
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <div className="user-grid">
          {items.map(u => (
            <div className="user-card" key={u.id}>

              <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div className="user-cell" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="avatar-small">{u.displayName.charAt(0).toUpperCase()}</div>
                  <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="user-name" style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                      {u.displayName}
                    </span>
                    <span className="date-text" style={{ fontSize: '12px', color: '#6b7280' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                  </div>
                </div>
                <button className="btn-icon">⋮</button>
              </div>

              <div className="card-middle" style={{ padding: '12px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{u.displayEmail}</span>
                </div>
              </div>

              <div className="card-bottom" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="role-badge" style={{ textTransform: 'capitalize' }}>{u.displayRole}</span>
                <span className="status-badge" style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: '#dcfce7', color: '#166534' }}>Active</span>
              </div>

            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No {activeTab}s found in the system.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
