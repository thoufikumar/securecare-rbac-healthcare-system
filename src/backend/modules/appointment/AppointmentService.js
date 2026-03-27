import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  query, 
  where, 
  onSnapshot,
  getDocs,
  getDoc
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { logEvent } from "../audit/AuditService";

const COLLECTION = "appointments";

/**
 * Create an appointment and link it to both the patient and the doctor.
 * @param {Object} appointmentData
 * @param {Object} user - The acting user (receptionist/admin)
 */
export const createAppointment = async (appointmentData, user) => {
  try {
    // 1. Create appointment
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...appointmentData,
      status: "upcoming",
      createdAt: new Date().toISOString()
    });

    const appointmentId = docRef.id;

    // 2. Update Patient with Assigned Doctor
    const patientRef = doc(db, "patients", appointmentData.patientId);
    await updateDoc(patientRef, {
      assignedDoctorId: appointmentData.doctorId,
      updatedAt: new Date().toISOString()
    });

    // 3. Update Doctor with Assigned Patient reference
    const doctorRef = doc(db, "doctors", appointmentData.doctorId);
    await updateDoc(doctorRef, {
      assignedPatients: arrayUnion({
        patientId: appointmentData.patientId,
        appointmentId: appointmentId,
        assignedAt: new Date().toISOString()
      }),
      updatedAt: new Date().toISOString()
    });

    // 4. Log Event
    await logEvent({
      action: "APPOINTMENT_CREATED",
      performedBy: { userId: user.uid, role: user.role, email: user.email },
      target: { patientId: appointmentData.patientId, doctorId: appointmentData.doctorId }
    });

    return appointmentId;
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    throw error;
  }
};

/**
 * Subscribe to a doctor's appointments in real-time.
 */
export const subscribeToDoctorAppointments = (doctorId, callback) => {
  const q = query(
    collection(db, COLLECTION),
    where("doctorId", "==", doctorId),
    where("status", "==", "upcoming")
  );

  return onSnapshot(q, async (snapshot) => {
    const rawAppointments = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    
    // We need to fetch patient names for each appointment (Join logic)
    const appointmentsWithPatients = await Promise.all(
      rawAppointments.map(async (appt) => {
        try {
          const patientSnap = await getDoc(doc(db, "patients", appt.patientId));
          const patientData = patientSnap.exists() ? patientSnap.data() : { fullName: "Unknown Patient" };
          return {
            ...appt,
            patientName: patientData.fullName || `${patientData.firstName} ${patientData.lastName}`
          };
        } catch (e) {
          return { ...appt, patientName: "Error loading name" };
        }
      })
    );

    callback(appointmentsWithPatients);
  }, (error) => {
    console.error("Real-time sync error:", error);
  });
};
