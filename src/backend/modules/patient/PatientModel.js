// src/backend/modules/patient/PatientModel.js
// Defines the Patient data model / schema used throughout the application.
// Acts as a single source of truth for patient data structure.

/**
 * Creates a normalized patient object.
 * @param {Object} data - Raw patient form data
 * @returns {Object} Normalized patient record
 */
export const createPatientModel = (data) => ({
  id: data.id || null,
  firstName: data.firstName || "",
  lastName: data.lastName || "",
  fullName: data.fullName || "",
  age: data.age || "",
  gender: data.gender || "",
  bloodGroup: data.bloodGroup || "",
  contactNumber: data.contactNumber || "",
  address: data.address || "",
  medicalHistory: data.medicalHistory || [],
  prescriptions: data.prescriptions || [],
  vitals: data.vitals || { heartRate: "80", temperature: "36.5", glucose: "100" },
  assignedDoctorId: data.assignedDoctorId || null,
  createdBy: data.createdBy || null,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
