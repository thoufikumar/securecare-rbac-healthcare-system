// src/frontend/app/routes.jsx
// Centralized route definitions for the SecureCare application.
// Embedded nested routing specifically for the CRM Admin Layout structure.

import { createBrowserRouter } from "react-router-dom";
import Login from "../modules/auth/Login";
import ProtectedRoute from "../modules/auth/ProtectedRoute";
import Unauthorized from "../modules/auth/Unauthorized";

import DoctorLayout from "../modules/doctor/DoctorLayout";
import DoctorDashboard from "../modules/doctor/DoctorDashboard";
import DoctorPatients from "../modules/doctor/DoctorPatients";
import DoctorRecords from "../modules/doctor/DoctorRecords";
import DoctorRecordDetail from "../modules/doctor/DoctorRecordDetail";
import PatientDetail from "../modules/doctor/PatientDetail";
import NurseLayout from "../modules/nurse/NurseLayout";
import NurseDashboard from "../modules/nurse/NurseDashboard";
import NursePatients from "../modules/nurse/NursePatients";
import ReceptionistLayout from "../modules/receptionist/ReceptionistLayout";
import ReceptionistDashboard from "../modules/receptionist/ReceptionistDashboard";
import PatientRegistration from "../modules/receptionist/PatientRegistration";
import CreatePatient from "../modules/patient/CreatePatient";

import AdminLayout from "../modules/admin/AdminLayout";
import AdminDashboard from "../modules/admin/AdminDashboard";
import ManageUsers from "../modules/admin/ManageUsers";
import AuditLogs from "../modules/admin/AuditLogs";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  // Nested CRM Admin Routing
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <ManageUsers /> },
      { path: "logs", element: <AuditLogs /> }
    ]
  },

  // Nested Doctor Routing
  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedRoles={["doctor", "admin"]}>
        <DoctorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "patients", element: <DoctorPatients /> },
      { path: "records", element: <DoctorRecords /> },
      { path: "records/:id", element: <DoctorRecordDetail /> },
      { path: "patient/:id", element: <PatientDetail /> }
    ]
  },
  // Nested Nurse Routing
  {
    path: "/nurse",
    element: (
      <ProtectedRoute allowedRoles={["nurse", "admin"]}>
        <NurseLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <NurseDashboard /> },
      { path: "monitoring", element: <NursePatients /> },
      { path: "tasks", element: <NurseDashboard /> },
      { path: "patient/:id", element: <PatientDetail /> }
    ]
  },
  {
    path: "/receptionist",
    element: (
      <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
        <ReceptionistLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ReceptionistDashboard /> },
      { path: "register", element: <PatientRegistration /> }
    ]
  },
  {
    path: "/patient/create",
    element: <ProtectedRoute allowedRoles={["doctor", "receptionist", "admin"]}><CreatePatient /></ProtectedRoute>
  }
]);

export default router;
