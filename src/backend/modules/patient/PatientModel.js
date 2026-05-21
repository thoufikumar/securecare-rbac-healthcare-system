// src/backend/modules/patient/PatientModel.js
// Defines the normalized Patient data model.

/**
 * Creates a normalized patient object (Security-First structure).
 */
export const createPatientModel = (data) => ({
  basicInfo: {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    fullName: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    age: data.age || "",
    gender: data.gender || "",
    bloodGroup: data.bloodGroup || "",
    dob: data.dob || "",
  },
  contactInfo: {
    phoneNumber: data.contactNumber || data.phone || "",
    email: data.email || "",
    address: data.address || "",
    city: data.city || "",
    zipCode: data.zipCode || "",
  },
  emergencyContact: {
    name: data.emergencyContactName || "",
    relationship: data.emergencyRelationship || "",
    phoneNumber: data.emergencyPhone || "",
  },
  createdBy: data.createdBy || null,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
