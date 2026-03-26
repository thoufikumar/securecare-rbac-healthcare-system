// src/modules/security/encryption.js
// AES encryption/decryption utilities using CryptoJS.
// All sensitive patient data must pass through these functions before Firestore writes.

import CryptoJS from "crypto-js";

// IMPORTANT: Move this key to environment variables in production (.env → VITE_ENCRYPTION_KEY)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "securecare-default-key-CHANGE-IN-PROD";

/**
 * Encrypts a plaintext string using AES.
 * @param {string} plaintext - Data to encrypt
 * @returns {string} Encrypted ciphertext string
 */
export const encryptData = (plaintext) => {
  if (!plaintext) return "";
  return CryptoJS.AES.encrypt(plaintext, SECRET_KEY).toString();
};

/**
 * Decrypts an AES-encrypted string.
 * @param {string} ciphertext - Encrypted data string
 * @returns {string} Decrypted plaintext
 */
export const decryptData = (ciphertext) => {
  if (!ciphertext) return "";
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
