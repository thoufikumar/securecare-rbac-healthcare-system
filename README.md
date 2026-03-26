# SecureCare – Role-Based Secure Patient Record Management System

SecureCare is a full-stack healthcare management system designed to securely manage patient data with **Role-Based Access Control (RBAC)**, **data encryption**, and **audit logging**. The system simulates real-world hospital workflows involving Admins, Doctors, Nurses, and Receptionists.

---

## Problem Statement

Healthcare systems handle highly sensitive patient data but often lack:

* Proper role-based access control
* Secure storage of medical records
* Traceability of user actions
* Structured workflows between hospital roles

SecureCare addresses these challenges by building a **secure, scalable, and role-driven system**.

---

## Key Features

### Security & Access Control

* Role-Based Access Control (Admin, Doctor, Nurse, Receptionist)
* Firebase Authentication + Firestore role validation
* AES encryption for sensitive patient data
* Firestore security rules enforcement

---

### Doctor Module

* View assigned patients
* Access detailed patient records
* Add prescriptions
* View test reports and history

---

### Nurse Module

* View patient records
* Update patient vitals (Heart Rate, Temperature, Glucose)
* Restricted from modifying prescriptions

---

### Receptionist Module

* Multi-step patient registration
* Appointment booking system
* Assign patients to doctors

---

### Admin Module

* Manage system users (Doctor, Nurse, Receptionist)
* View system-wide audit logs
* Monitor all critical activities

---

### Audit Logging System

Tracks all important actions:

* Patient data access
* Prescription additions
* Vitals updates

Each log includes:

* User ID
* Role
* Action performed
* Timestamp

---

### Data Encryption

Sensitive fields are encrypted before storage:

* Medical history
* Prescriptions
* Vitals

Decrypted securely when accessed by authorized roles.

---

## Tech Stack

### Frontend

* React.js
* CSS (Glassmorphism UI + Blue Gradient Theme)
* Component-based architecture

### Backend

* Firebase Authentication
* Firebase Firestore
* Custom service layer (PatientService, AuditLogger)

### Security

* AES Encryption (CryptoJS)
* Firestore Security Rules

---

## Project Structure

```
src/
├── frontend/
│   ├── modules/
│   │   ├── doctor/
│   │   ├── nurse/
│   │   ├── admin/
│   │   └── receptionist/
│   ├── app/
│   └── styles/
│
├── backend/
│   ├── modules/
│   │   └── patient/
│   ├── security/
│   │   ├── encryption.js
│   │   └── auditLogger.js
│   └── config/
```

---

## System Workflow

1. Receptionist registers patient and books appointment
2. Doctor views patient and adds prescription
3. Nurse monitors and updates vitals
4. Admin monitors all actions through audit logs

---

## Security Implementation

* Sensitive patient data is encrypted before storing in Firestore
* Only authorized roles can perform specific actions
* All critical operations are logged for traceability

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/securecare-rbac-healthcare-system.git
cd securecare-rbac-healthcare-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_ENCRYPTION_KEY=your_secret_key
```

### 4. Run the project

```bash
npm run dev
```

---

## Test Credentials

| Role   | Email                                                             | Password |
| ------ | ----------------------------------------------------------------- | -------- |
| Admin  | [testmailid3422@gmail.com](mailto:testmailid3422@gmail.com)       | abce@123 |
| Doctor | [johnathanwick3422@gmail.com](mailto:johnathanwick3422@gmail.com) | abc@123  |
| Nurse  | [sjartistic3422@gmail.com](mailto:sjartistic3422@gmail.com)       | abc@123  |

---

## Future Enhancements

* Real-time patient monitoring
* Notification system (alerts for critical vitals)
* Advanced analytics dashboard
* Multi-hospital support
* AI-assisted diagnosis

---

## Key Highlights

* Real-world healthcare workflow simulation
* Strong focus on data security and access control
* Modular and scalable architecture
* Clean UI with modern glassmorphism design

---

## License

This project is developed for academic purposes.

---

## Acknowledgment

This project was built as part of a system design and development exercise to demonstrate secure healthcare data management using modern web technologies.

---
