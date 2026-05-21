import CryptoJS from "crypto-js";

// Master key from environment
const MASTER_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "securecare-master-key-DEFAULT";

/**
 * Derives a unique patient key using PBKDF2.
 * @param {string} patientId - Unique patient identifier
 */
export const derivePatientKey = (patientId) => {
  if (!patientId) throw new Error("Security Error: Patient ID required for key derivation.");
  
  // Use patientId as salt for derivation
  return CryptoJS.PBKDF2(MASTER_KEY, patientId, {
    keySize: 256 / 32,
    iterations: 1000
  }).toString();
};

/**
 * Encrypts data using a patient-specific derived key.
 */
export const encryptData = (plaintext, patientId) => {
  if (!plaintext) return "";
  const key = derivePatientKey(patientId);
  return CryptoJS.AES.encrypt(plaintext, key).toString();
};

/**
 * Decrypts data using a patient-specific derived key.
 */
export const decryptData = (ciphertext, patientId) => {
  if (!ciphertext) return "";
  const key = derivePatientKey(patientId);
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
