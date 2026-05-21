// src/backend/modules/room/RoomAllocationService.js
// Logic for hospital room and ward allocation.

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  runTransaction 
} from "firebase/firestore";
import { db } from "../../config/firebase";

/**
 * Automatically allocates a room based on patient requirements.
 * @param {string} patientId - Patient ID
 * @param {Object} requirement - { urgency, requiredWard, specialNeeds }
 */
export const allocateRoom = async (patientId, requirement) => {
  const { urgency, requiredWard, specialNeeds } = requirement;

  // 1. Find available rooms in the required ward
  const roomsQuery = query(
    collection(db, "rooms"),
    where("wardId", "==", requiredWard),
    where("status", "==", "AVAILABLE")
  );

  const roomsSnap = await getDocs(roomsQuery);
  if (roomsSnap.empty) {
    throw new Error(`No available rooms in ward: ${requiredWard}`);
  }

  // 2. Simple selection logic: Match accessibility or pick the first one
  let selectedRoom = roomsSnap.docs[0];
  if (specialNeeds) {
    selectedRoom = roomsSnap.docs.find(d => 
      d.data().accessibilityFeatures?.includes(specialNeeds)
    ) || roomsSnap.docs[0];
  }

  const roomRef = doc(db, "rooms", selectedRoom.id);
  const stateRef = doc(db, "patientState", patientId);

  // 3. Atomically update Room status and Patient state
  await runTransaction(db, async (transaction) => {
    const roomDoc = await transaction.get(roomRef);
    if (roomDoc.data().status !== "AVAILABLE") {
      throw new Error("Room was taken during allocation process.");
    }

    // Update Room
    transaction.update(roomRef, {
      status: "OCCUPIED",
      patientId: patientId,
      updatedAt: new Date().toISOString()
    });

    // Update Patient State
    transaction.update(stateRef, {
      roomId: selectedRoom.id,
      wardId: requiredWard,
      updatedAt: new Date().toISOString()
    });

    // Update Ward occupancy
    const wardRef = doc(db, "wards", requiredWard);
    const wardDoc = await transaction.get(wardRef);
    const newOccupancy = (wardDoc.data().occupancy || 0) + 1;
    transaction.update(wardRef, { occupancy: newOccupancy });
  });

  return { roomId: selectedRoom.id, wardId: requiredWard };
};
