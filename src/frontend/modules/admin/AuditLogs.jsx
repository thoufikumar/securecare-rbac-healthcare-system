// src/frontend/modules/admin/LogViewer.jsx
// Displays audit log entries fetched from Firestore.

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../../backend/config/firebase";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "auditLogs"),
          orderBy("timestamp", "desc"),
          limit(100)
        );
        const snapshot = await getDocs(q);
        setLogs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;

  return (
    <div className="log-viewer-container">
      <h2>Audit Logs</h2>
      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp?.toDate()).toLocaleString()}</td>
                <td>{log.userId}</td>
                <td>{log.action}</td>
                <td>{log.resource}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogs;
