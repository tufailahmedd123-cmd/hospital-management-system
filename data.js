/* ==========================================================================
   HOSPITAL MANAGEMENT SYSTEM - INITIAL DATA & STORAGE ENGINE
   Vanilla ES6+ LocalStorage Management
   ========================================================================== */

export const STORAGE_KEYS = {
  USERS: 'hms_users',
  CURRENT_USER: 'hms_current_user',
  PATIENTS: 'hms_patients',
  DOCTORS: 'hms_doctors',
  DEPARTMENTS: 'hms_departments',
  APPOINTMENTS: 'hms_appointments',
  OPD_VISITS: 'hms_opd_visits',
  ADMISSIONS: 'hms_admissions',
  BEDS: 'hms_beds',
  RECORDS: 'hms_records',
  PRESCRIPTIONS: 'hms_prescriptions',
  MEDICINES: 'hms_medicines',
  BILLS: 'hms_bills',
  LAB_TESTS: 'hms_lab_tests',
  STAFF: 'hms_staff',
  NOTIFICATIONS: 'hms_notifications',
  SETTINGS: 'hms_settings'
};

// Default Users for Role-Based Access
export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Dr. Sarah Mitchell',
    email: 'admin@hms.com',
    password: 'admin123',
    role: 'admin',
    title: 'Hospital Director',
    avatar: 'SM'
  },
  {
    id: 'USR-002',
    name: 'Dr. James Anderson',
    email: 'doctor@hms.com',
    password: 'doctor123',
    role: 'doctor',
    doctorId: 'DOC-001',
    title: 'Senior Cardiologist',
    avatar: 'JA'
  },
  {
    id: 'USR-003',
    name: 'Emily Watson',
    email: 'reception@hms.com',
    password: 'reception123',
    role: 'receptionist',
    title: 'Chief Front Desk Officer',
    avatar: 'EW'
  }
];

export const INITIAL_DEPARTMENTS = [
  { id: 'DEP-01', name: 'Cardiology', head: 'Dr. James Anderson', description: 'Comprehensive heart & cardiovascular care', doctorsCount: 2, patientsCount: 4 },
  { id: 'DEP-02', name: 'Neurology', head: 'Dr. Elena Rostova', description: 'Brain, spinal cord and nervous system therapy', doctorsCount: 1, patientsCount: 2 },
  { id: 'DEP-03', name: 'Orthopedics', head: 'Dr. Robert Chen', description: 'Musculoskeletal trauma, spine & joint surgery', doctorsCount: 1, patientsCount: 3 },
  { id: 'DEP-04', name: 'Pediatrics', head: 'Dr. Maya Lin', description: 'Child healthcare, neonatal & adolescent medicine', doctorsCount: 1, patientsCount: 2 },
  { id: 'DEP-05', name: 'General Medicine', head: 'Dr. David Kim', description: 'Primary internal healthcare & chronic disease management', doctorsCount: 1, patientsCount: 3 },
  { id: 'DEP-06', name: 'Dermatology', head: 'Dr. Olivia Vance', description: 'Skin disorders, allergy diagnostics and aesthetic derm', doctorsCount: 1, patientsCount: 1 },
  { id: 'DEP-07', name: 'General Surgery', head: 'Dr. Tariq Mahmood', description: 'Laparoscopic, trauma and reconstructive procedures', doctorsCount: 1, patientsCount: 2 },
  { id: 'DEP-08', name: 'ENT', head: 'Dr. Sophia Al-Mansoor', description: 'Ear, nose, throat and auditory rehabilitation', doctorsCount: 1, patientsCount: 1 },
  { id: 'DEP-09', name: 'Gynecology & Obstetrics', head: 'Dr. Maria Santos', description: 'Maternal health, prenatal care and women wellness', doctorsCount: 1, patientsCount: 2 }
];

export const INITIAL_DOCTORS = [
  { id: 'DOC-001', name: 'Dr. James Anderson', gender: 'Male', email: 'j.anderson@hms.com', phone: '+1 (555) 234-8891', cnic: '42101-1123456-1', qualification: 'MBBS, MD (Cardiology), FACC', specialization: 'Cardiology', department: 'Cardiology', experience: 14, fee: 120, availability: 'Mon - Fri (09:00 AM - 02:00 PM)', status: 'Active' },
  { id: 'DOC-002', name: 'Dr. Elena Rostova', gender: 'Female', email: 'e.rostova@hms.com', phone: '+1 (555) 345-7782', cnic: '42101-2234567-2', qualification: 'MD, PhD (Neuroscience)', specialization: 'Neurology', department: 'Neurology', experience: 11, fee: 140, availability: 'Tue, Thu, Sat (10:00 AM - 03:00 PM)', status: 'Active' },
  { id: 'DOC-003', name: 'Dr. Robert Chen', gender: 'Male', email: 'r.chen@hms.com', phone: '+1 (555) 456-6673', cnic: '42101-3345678-3', qualification: 'MBBS, MS (Orthopedics)', specialization: 'Orthopedics', department: 'Orthopedics', experience: 16, fee: 110, availability: 'Mon - Thu (08:30 AM - 01:30 PM)', status: 'Active' },
  { id: 'DOC-004', name: 'Dr. Maya Lin', gender: 'Female', email: 'm.lin@hms.com', phone: '+1 (555) 567-5564', cnic: '42101-4456789-4', qualification: 'MD (Pediatrics), FAAP', specialization: 'Pediatrics', department: 'Pediatrics', experience: 9, fee: 95, availability: 'Mon - Fri (09:00 AM - 01:00 PM)', status: 'Active' },
  { id: 'DOC-005', name: 'Dr. David Kim', gender: 'Male', email: 'd.kim@hms.com', phone: '+1 (555) 678-4455', cnic: '42101-5567890-5', qualification: 'MBBS, FCPS (Internal Medicine)', specialization: 'General Medicine', department: 'General Medicine', experience: 18, fee: 85, availability: 'Mon - Sat (08:00 AM - 02:00 PM)', status: 'Active' },
  { id: 'DOC-006', name: 'Dr. Olivia Vance', gender: 'Female', email: 'o.vance@hms.com', phone: '+1 (555) 789-3346', cnic: '42101-6678901-6', qualification: 'MD (Dermatology), Board Certified', specialization: 'Dermatology', department: 'Dermatology', experience: 8, fee: 100, availability: 'Wed - Fri (11:00 AM - 04:00 PM)', status: 'Active' },
  { id: 'DOC-007', name: 'Dr. Tariq Mahmood', gender: 'Male', email: 't.mahmood@hms.com', phone: '+1 (555) 890-2237', cnic: '42101-7789012-7', qualification: 'FRCS (General Surgery)', specialization: 'General Surgery', department: 'General Surgery', experience: 20, fee: 150, availability: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)', status: 'Active' },
  { id: 'DOC-008', name: 'Dr. Maria Santos', gender: 'Female', email: 'm.santos@hms.com', phone: '+1 (555) 901-1128', cnic: '42101-8890123-8', qualification: 'MBBS, MS (Obstetrics & Gynecology)', specialization: 'Gynecology & Obstetrics', department: 'Gynecology & Obstetrics', experience: 13, fee: 115, availability: 'Mon - Fri (10:00 AM - 03:00 PM)', status: 'Active' }
];

export const INITIAL_PATIENTS = [
  { id: 'P-1001', name: 'Alexander Wright', fatherName: 'Arthur Wright', gender: 'Male', dob: '1978-04-12', age: 46, bloodGroup: 'O+', cnic: '42101-9988112-1', phone: '+1 (555) 101-2233', email: 'a.wright@example.com', address: '42 Oakridge Ave, Sector 4', emergencyContact: '+1 (555) 998-1122 (Wife)', allergies: 'Penicillin, NSAIDs', conditions: 'Hypertension, Mild Asthma', notes: 'Requires blood pressure check every 6 hours', regDate: '2026-03-10', doctor: 'Dr. James Anderson', department: 'Cardiology', status: 'Admitted' },
  { id: 'P-1002', name: 'Beatrice Gomez', fatherName: 'Carlos Gomez', gender: 'Female', dob: '1992-08-25', age: 34, bloodGroup: 'A+', cnic: '42101-8877223-2', phone: '+1 (555) 202-3344', email: 'b.gomez@example.com', address: '18 Sunset Blvd, Apt 3B', emergencyContact: '+1 (555) 887-2233 (Mother)', allergies: 'None reported', conditions: 'Migraine headaches', notes: 'Scheduled for neurology follow-up', regDate: '2026-03-12', doctor: 'Dr. Elena Rostova', department: 'Neurology', status: 'Active' },
  { id: 'P-1003', name: 'Charles Montgomery', fatherName: 'Edward Montgomery', gender: 'Male', dob: '1965-11-30', age: 60, bloodGroup: 'B+', cnic: '42101-7766334-3', phone: '+1 (555) 303-4455', email: 'c.montgomery@example.com', address: '88 Highland Crest', emergencyContact: '+1 (555) 776-3344 (Son)', allergies: 'Sulfa drugs', conditions: 'Post-op knee arthroscopy', notes: 'Physiotherapy protocol ongoing', regDate: '2026-03-15', doctor: 'Dr. Robert Chen', department: 'Orthopedics', status: 'Admitted' },
  { id: 'P-1004', name: 'Diana Sterling', fatherName: 'Henry Sterling', gender: 'Female', dob: '2016-02-14', age: 10, bloodGroup: 'O-', cnic: '42101-6655445-4', phone: '+1 (555) 404-5566', email: 'h.sterling@example.com', address: '12 Pine Meadow Way', emergencyContact: '+1 (555) 665-4455 (Father)', allergies: 'Peanuts', conditions: 'Seasonal Bronchitis', notes: 'Nebulizer maintenance in effect', regDate: '2026-03-18', doctor: 'Dr. Maya Lin', department: 'Pediatrics', status: 'Active' },
  { id: 'P-1005', name: 'Evan Harris', fatherName: 'Franklin Harris', gender: 'Male', dob: '1984-07-09', age: 42, bloodGroup: 'AB+', cnic: '42101-5544556-5', phone: '+1 (555) 505-6677', email: 'e.harris@example.com', address: '502 West Elm St', emergencyContact: '+1 (555) 554-5566 (Brother)', allergies: 'Latex', conditions: 'Type 2 Diabetes Mellitus', notes: 'HbA1c monitored quarterly', regDate: '2026-03-20', doctor: 'Dr. David Kim', department: 'General Medicine', status: 'Active' },
  { id: 'P-1006', name: 'Fiona Gallagher', fatherName: 'Patrick Gallagher', gender: 'Female', dob: '1995-09-17', age: 31, bloodGroup: 'A-', cnic: '42101-4433667-6', phone: '+1 (555) 606-7788', email: 'f.gallagher@example.com', address: '73 Willow Lane', emergencyContact: '+1 (555) 443-6677 (Sister)', allergies: 'Aspirin', conditions: 'Eczema flare-up', notes: 'Topical corticosteroid regimen', regDate: '2026-03-22', doctor: 'Dr. Olivia Vance', department: 'Dermatology', status: 'Active' },
  { id: 'P-1007', name: 'George Patterson', fatherName: 'Walter Patterson', gender: 'Male', dob: '1959-05-04', age: 67, bloodGroup: 'O+', cnic: '42101-3322778-7', phone: '+1 (555) 707-8899', email: 'g.patterson@example.com', address: '310 Maple Terrace', emergencyContact: '+1 (555) 332-7788 (Daughter)', allergies: 'Iodine contrast dye', conditions: 'Acute cholecystitis (Post-op)', notes: 'Surgical drain monitoring', regDate: '2026-03-25', doctor: 'Dr. Tariq Mahmood', department: 'General Surgery', status: 'Admitted' },
  { id: 'P-1008', name: 'Hannah Abbott', fatherName: 'Jonathan Abbott', gender: 'Female', dob: '1989-12-03', age: 36, bloodGroup: 'B-', cnic: '42101-2211889-8', phone: '+1 (555) 808-9900', email: 'h.abbott@example.com', address: '190 Birch Valley', emergencyContact: '+1 (555) 221-8899 (Husband)', allergies: 'None', conditions: 'Prenatal Trimester 2', notes: 'Routine ultrasound scheduled', regDate: '2026-03-26', doctor: 'Dr. Maria Santos', department: 'Gynecology & Obstetrics', status: 'Active' },
  { id: 'P-1009', name: 'Ian Fletcher', fatherName: 'Brian Fletcher', gender: 'Male', dob: '1973-03-28', age: 53, bloodGroup: 'AB-', cnic: '42101-1100990-9', phone: '+1 (555) 909-0011', email: 'i.fletcher@example.com', address: '66 Riverbend Dr', emergencyContact: '+1 (555) 110-9900 (Wife)', allergies: 'Codeine', conditions: 'Coronary Artery Disease', notes: 'Cardio ICU observation', regDate: '2026-03-27', doctor: 'Dr. James Anderson', department: 'Cardiology', status: 'Admitted' },
  { id: 'P-1010', name: 'Julia Roberts', fatherName: 'Samuel Roberts', gender: 'Female', dob: '1982-10-15', age: 44, bloodGroup: 'O+', cnic: '42101-0099112-0', phone: '+1 (555) 112-2233', email: 'j.roberts@example.com', address: '14 Beacon Hill Road', emergencyContact: '+1 (555) 009-1122 (Spouse)', allergies: 'None', conditions: 'Chronic Sinusitis', notes: 'Nasal endoscopy planned', regDate: '2026-03-28', doctor: 'Dr. Sophia Al-Mansoor', department: 'ENT', status: 'Active' },
  { id: 'P-1011', name: 'Kevin O\'Connor', fatherName: 'Liam O\'Connor', gender: 'Male', dob: '1998-01-22', age: 28, bloodGroup: 'A+', cnic: '42101-9988223-1', phone: '+1 (555) 223-3344', email: 'k.oconnor@example.com', address: '95 University Way', emergencyContact: '+1 (555) 998-2233 (Father)', allergies: 'None', conditions: 'Right ankle ligament sprain', notes: 'Orthotic boot support applied', regDate: '2026-03-29', doctor: 'Dr. Robert Chen', department: 'Orthopedics', status: 'Discharged' },
  { id: 'P-1012', name: 'Laura Bennett', fatherName: 'Douglas Bennett', gender: 'Female', dob: '1970-06-18', age: 56, bloodGroup: 'B+', cnic: '42101-8877334-2', phone: '+1 (555) 334-4455', email: 'l.bennett@example.com', address: '228 Cedar Ridge', emergencyContact: '+1 (555) 887-3344 (Son)', allergies: 'Ciprofloxacin', conditions: 'Hypertension, Dyslipidemia', notes: 'Routine checkup completed', regDate: '2026-03-29', doctor: 'Dr. David Kim', department: 'General Medicine', status: 'Discharged' },
  { id: 'P-1013', name: 'Michael Chang', fatherName: 'Victor Chang', gender: 'Male', dob: '1987-11-11', age: 39, bloodGroup: 'O+', cnic: '42101-7766445-3', phone: '+1 (555) 445-5566', email: 'm.chang@example.com', address: '44 Harbor Park', emergencyContact: '+1 (555) 776-4455 (Wife)', allergies: 'Pollen', conditions: 'Inguinal hernia', notes: 'Elective herniorrhaphy scheduled', regDate: '2026-03-30', doctor: 'Dr. Tariq Mahmood', department: 'General Surgery', status: 'Active' },
  { id: 'P-1014', name: 'Nadia Malik', fatherName: 'Zahid Malik', gender: 'Female', dob: '1990-05-19', age: 36, bloodGroup: 'AB+', cnic: '42101-6655556-4', phone: '+1 (555) 556-6677', email: 'n.malik@example.com', address: '107 Greenview Court', emergencyContact: '+1 (555) 665-5566 (Mother)', allergies: 'None', conditions: 'Postpartum recovery', notes: 'Mother and baby stable', regDate: '2026-03-30', doctor: 'Dr. Maria Santos', department: 'Gynecology & Obstetrics', status: 'Admitted' },
  { id: 'P-1015', name: 'Owen Vance', fatherName: 'Timothy Vance', gender: 'Male', dob: '2019-09-02', age: 7, bloodGroup: 'A+', cnic: '42101-5544667-5', phone: '+1 (555) 667-7788', email: 't.vance@example.com', address: '82 Magnolia Street', emergencyContact: '+1 (555) 554-6677 (Father)', allergies: 'Egg protein', conditions: 'Acute viral gastroenteritis', notes: 'IV hydration therapy completed', regDate: '2026-03-31', doctor: 'Dr. Maya Lin', department: 'Pediatrics', status: 'Inactive' }
];

export const INITIAL_BEDS = [
  { id: 'BED-101', ward: 'ICU Ward', room: 'Room 101', bedNumber: 'Bed A', type: 'ICU', status: 'Occupied', patientId: 'P-1009', patientName: 'Ian Fletcher', dailyRate: 250 },
  { id: 'BED-102', ward: 'ICU Ward', room: 'Room 101', bedNumber: 'Bed B', type: 'ICU', status: 'Occupied', patientId: 'P-1001', patientName: 'Alexander Wright', dailyRate: 250 },
  { id: 'BED-103', ward: 'ICU Ward', room: 'Room 102', bedNumber: 'Bed A', type: 'ICU', status: 'Available', patientId: null, patientName: null, dailyRate: 250 },
  { id: 'BED-104', ward: 'ICU Ward', room: 'Room 102', bedNumber: 'Bed B', type: 'ICU', status: 'Maintenance', patientId: null, patientName: null, dailyRate: 250 },
  { id: 'BED-201', ward: 'Male Medical Ward', room: 'Room 201', bedNumber: 'Bed 1', type: 'General', status: 'Occupied', patientId: 'P-1007', patientName: 'George Patterson', dailyRate: 80 },
  { id: 'BED-202', ward: 'Male Medical Ward', room: 'Room 201', bedNumber: 'Bed 2', type: 'General', status: 'Available', patientId: null, patientName: null, dailyRate: 80 },
  { id: 'BED-203', ward: 'Male Medical Ward', room: 'Room 202', bedNumber: 'Bed 1', type: 'General', status: 'Available', patientId: null, patientName: null, dailyRate: 80 },
  { id: 'BED-204', ward: 'Male Medical Ward', room: 'Room 202', bedNumber: 'Bed 2', type: 'General', status: 'Available', patientId: null, patientName: null, dailyRate: 80 },
  { id: 'BED-301', ward: 'Female Medical Ward', room: 'Room 301', bedNumber: 'Bed 1', type: 'General', status: 'Occupied', patientId: 'P-1014', patientName: 'Nadia Malik', dailyRate: 80 },
  { id: 'BED-302', ward: 'Female Medical Ward', room: 'Room 301', bedNumber: 'Bed 2', type: 'General', status: 'Available', patientId: null, patientName: null, dailyRate: 80 },
  { id: 'BED-303', ward: 'Female Medical Ward', room: 'Room 302', bedNumber: 'Bed 1', type: 'General', status: 'Available', patientId: null, patientName: null, dailyRate: 80 },
  { id: 'BED-304', ward: 'Female Medical Ward', room: 'Room 302', bedNumber: 'Bed 2', type: 'Maintenance', patientId: null, patientName: null, dailyRate: 80 },
  { id: 'BED-401', ward: 'Surgical Ward', room: 'Room 401', bedNumber: 'Bed 1', type: 'Semi-Private', status: 'Occupied', patientId: 'P-1003', patientName: 'Charles Montgomery', dailyRate: 120 },
  { id: 'BED-402', ward: 'Surgical Ward', room: 'Room 401', bedNumber: 'Bed 2', type: 'Semi-Private', status: 'Available', patientId: null, patientName: null, dailyRate: 120 },
  { id: 'BED-403', ward: 'Surgical Ward', room: 'Room 402', bedNumber: 'Bed 1', type: 'Semi-Private', status: 'Available', patientId: null, patientName: null, dailyRate: 120 },
  { id: 'BED-501', ward: 'Pediatric Ward', room: 'Room 501', bedNumber: 'Bed 1', type: 'General', status: 'Available', patientId: null, patientName: null, dailyRate: 75 },
  { id: 'BED-502', ward: 'Pediatric Ward', room: 'Room 501', bedNumber: 'Bed 2', type: 'General', status: 'Available', patientId: null, patientName: null, dailyRate: 75 },
  { id: 'BED-601', ward: 'VIP Deluxe Ward', room: 'Suite 601', bedNumber: 'Bed VIP-1', type: 'Deluxe', status: 'Available', patientId: null, patientName: null, dailyRate: 350 },
  { id: 'BED-602', ward: 'VIP Deluxe Ward', room: 'Suite 602', bedNumber: 'Bed VIP-2', type: 'Deluxe', status: 'Available', patientId: null, patientName: null, dailyRate: 350 },
  { id: 'BED-603', ward: 'VIP Deluxe Ward', room: 'Suite 603', bedNumber: 'Bed VIP-3', type: 'Deluxe', status: 'Available', patientId: null, patientName: null, dailyRate: 350 }
];

export const INITIAL_ADMISSIONS = [
  { id: 'ADM-01', patientId: 'P-1001', patientName: 'Alexander Wright', doctor: 'Dr. James Anderson', department: 'Cardiology', ward: 'ICU Ward', room: 'Room 101', bedNumber: 'Bed B', bedId: 'BED-102', admitDate: '2026-03-28 14:30', dischargeDate: null, reason: 'Unstable Angina & Severe BP Elevation', diagnosis: 'Hypertensive emergency with angina', status: 'Admitted' },
  { id: 'ADM-02', patientId: 'P-1003', patientName: 'Charles Montgomery', doctor: 'Dr. Robert Chen', department: 'Orthopedics', ward: 'Surgical Ward', room: 'Room 401', bedNumber: 'Bed 1', bedId: 'BED-401', admitDate: '2026-03-27 09:15', dischargeDate: null, reason: 'Elective Knee Arthroplasty', diagnosis: 'Severe Osteoarthritis right knee', status: 'Admitted' },
  { id: 'ADM-03', patientId: 'P-1007', patientName: 'George Patterson', doctor: 'Dr. Tariq Mahmood', department: 'General Surgery', ward: 'Male Medical Ward', room: 'Room 201', bedNumber: 'Bed 1', bedId: 'BED-201', admitDate: '2026-03-29 11:00', dischargeDate: null, reason: 'Acute abdomen pain & vomiting', diagnosis: 'Acute Cholecystitis', status: 'Admitted' },
  { id: 'ADM-04', patientId: 'P-1009', patientName: 'Ian Fletcher', doctor: 'Dr. James Anderson', department: 'Cardiology', ward: 'ICU Ward', room: 'Room 101', bedNumber: 'Bed A', bedId: 'BED-101', admitDate: '2026-03-30 02:45', dischargeDate: null, reason: 'Chest pain radiating to left arm', diagnosis: 'NSTEMI myocardial infarction', status: 'Admitted' },
  { id: 'ADM-05', patientId: 'P-1014', patientName: 'Nadia Malik', doctor: 'Dr. Maria Santos', department: 'Gynecology & Obstetrics', ward: 'Female Medical Ward', room: 'Room 301', bedNumber: 'Bed 1', bedId: 'BED-301', admitDate: '2026-03-30 18:20', dischargeDate: null, reason: 'Active labor onset', diagnosis: 'Normal spontaneous vaginal delivery', status: 'Admitted' },
  { id: 'ADM-06', patientId: 'P-1011', patientName: 'Kevin O\'Connor', doctor: 'Dr. Robert Chen', department: 'Orthopedics', ward: 'Surgical Ward', room: 'Room 402', bedNumber: 'Bed 1', bedId: 'BED-403', admitDate: '2026-03-20 10:00', dischargeDate: '2026-03-23 11:30', reason: 'High energy sporting trauma', diagnosis: 'Ligament tear reconstruction', status: 'Discharged' },
  { id: 'ADM-07', patientId: 'P-1012', patientName: 'Laura Bennett', doctor: 'Dr. David Kim', department: 'General Medicine', ward: 'Female Medical Ward', room: 'Room 302', bedNumber: 'Bed 1', bedId: 'BED-303', admitDate: '2026-03-22 15:40', dischargeDate: '2026-03-25 10:00', reason: 'Severe dehydration & electrolyte imbalance', diagnosis: 'Hypokalemia resolved', status: 'Discharged' },
  { id: 'ADM-08', patientId: 'P-1015', patientName: 'Owen Vance', doctor: 'Dr. Maya Lin', department: 'Pediatrics', ward: 'Pediatric Ward', room: 'Room 501', bedNumber: 'Bed 1', bedId: 'BED-501', admitDate: '2026-03-24 16:15', dischargeDate: '2026-03-26 14:00', reason: 'Persistent fever & rotavirus', diagnosis: 'Acute gastroenteritis resolved', status: 'Discharged' }
];

export const INITIAL_APPOINTMENTS = [
  { id: 'APT-101', patientId: 'P-1002', patientName: 'Beatrice Gomez', doctor: 'Dr. Elena Rostova', department: 'Neurology', date: '2026-11-02', time: '10:00 AM', reason: 'Migraine with visual aura', type: 'Consultation', status: 'Confirmed' },
  { id: 'APT-102', patientId: 'P-1004', patientName: 'Diana Sterling', doctor: 'Dr. Maya Lin', department: 'Pediatrics', date: '2026-11-02', time: '11:00 AM', reason: 'Recurrent nighttime cough', type: 'Checkup', status: 'Scheduled' },
  { id: 'APT-103', patientId: 'P-1005', patientName: 'Evan Harris', doctor: 'Dr. David Kim', department: 'General Medicine', date: '2026-11-02', time: '11:30 AM', reason: 'Blood glucose quarterly review', type: 'Routine Followup', status: 'Confirmed' },
  { id: 'APT-104', patientId: 'P-1006', patientName: 'Fiona Gallagher', doctor: 'Dr. Olivia Vance', department: 'Dermatology', date: '2026-11-02', time: '12:00 PM', reason: 'Erythematous facial rash', type: 'Consultation', status: 'Scheduled' },
  { id: 'APT-105', patientId: 'P-1008', patientName: 'Hannah Abbott', doctor: 'Dr. Maria Santos', department: 'Gynecology & Obstetrics', date: '2026-11-02', time: '01:30 PM', reason: 'Second trimester anomaly ultrasound', type: 'Ultrasound', status: 'Confirmed' },
  { id: 'APT-106', patientId: 'P-1010', patientName: 'Julia Roberts', doctor: 'Dr. Sophia Al-Mansoor', department: 'ENT', date: '2026-11-03', time: '09:30 AM', reason: 'Persistent sinus pressure', type: 'Consultation', status: 'Scheduled' },
  { id: 'APT-107', patientId: 'P-1013', patientName: 'Michael Chang', doctor: 'Dr. Tariq Mahmood', department: 'General Surgery', date: '2026-11-03', time: '10:30 AM', reason: 'Pre-operative surgical clearance', type: 'Pre-Op', status: 'Scheduled' },
  { id: 'APT-108', patientId: 'P-1001', patientName: 'Alexander Wright', doctor: 'Dr. James Anderson', department: 'Cardiology', date: '2026-11-03', time: '11:00 AM', reason: 'Post-stabilization cardiology review', type: 'Followup', status: 'Scheduled' },
  { id: 'APT-109', patientId: 'P-1003', patientName: 'Charles Montgomery', doctor: 'Dr. Robert Chen', department: 'Orthopedics', date: '2026-11-04', time: '09:00 AM', reason: 'Surgical wound inspection', type: 'Post-Op', status: 'Scheduled' },
  { id: 'APT-110', patientId: 'P-1002', patientName: 'Beatrice Gomez', doctor: 'Dr. Elena Rostova', department: 'Neurology', date: '2026-10-25', time: '10:30 AM', reason: 'Initial neurological consult', type: 'Consultation', status: 'Completed' },
  { id: 'APT-111', patientId: 'P-1005', patientName: 'Evan Harris', doctor: 'Dr. David Kim', department: 'General Medicine', date: '2026-10-22', time: '11:00 AM', reason: 'Fasting lipid profile review', type: 'Review', status: 'Completed' },
  { id: 'APT-112', patientId: 'P-1007', patientName: 'George Patterson', doctor: 'Dr. Tariq Mahmood', department: 'General Surgery', date: '2026-10-24', time: '09:30 AM', reason: 'Abdominal ultrasound discussion', type: 'Consultation', status: 'Completed' },
  { id: 'APT-113', patientId: 'P-1011', patientName: 'Kevin O\'Connor', doctor: 'Dr. Robert Chen', department: 'Orthopedics', date: '2026-10-28', time: '01:00 PM', reason: 'Crutches removal review', type: 'Followup', status: 'Completed' },
  { id: 'APT-114', patientId: 'P-1012', patientName: 'Laura Bennett', doctor: 'Dr. David Kim', department: 'General Medicine', date: '2026-10-29', time: '10:00 AM', reason: 'Medication dosage adjustment', type: 'Checkup', status: 'Completed' },
  { id: 'APT-115', patientId: 'P-1015', patientName: 'Owen Vance', doctor: 'Dr. Maya Lin', department: 'Pediatrics', date: '2026-10-30', time: '02:00 PM', reason: 'Missed childhood immunization catchup', type: 'Vaccination', status: 'Cancelled' }
];

export const INITIAL_OPD = [
  { id: 'OPD-301', token: 'T-01', patientId: 'P-1002', patientName: 'Beatrice Gomez', doctor: 'Dr. Elena Rostova', department: 'Neurology', date: '2026-11-02', time: '09:45 AM', complaint: 'Acute throbbing headache and photophobia', status: 'In Consultation' },
  { id: 'OPD-302', token: 'T-02', patientId: 'P-1004', patientName: 'Diana Sterling', doctor: 'Dr. Maya Lin', department: 'Pediatrics', date: '2026-11-02', time: '10:15 AM', complaint: 'Wheezing and low grade fever for 2 days', status: 'Waiting' },
  { id: 'OPD-303', token: 'T-03', patientId: 'P-1005', patientName: 'Evan Harris', doctor: 'Dr. David Kim', department: 'General Medicine', date: '2026-11-02', time: '10:30 AM', complaint: 'Dizziness and fluctuating sugar levels', status: 'Waiting' },
  { id: 'OPD-304', token: 'T-04', patientId: 'P-1006', patientName: 'Fiona Gallagher', doctor: 'Dr. Olivia Vance', department: 'Dermatology', date: '2026-11-02', time: '11:00 AM', complaint: 'Severe itching and redness on arms', status: 'Waiting' },
  { id: 'OPD-305', token: 'T-05', patientId: 'P-1010', patientName: 'Julia Roberts', doctor: 'Dr. Sophia Al-Mansoor', department: 'ENT', date: '2026-11-02', time: '09:00 AM', complaint: 'Earache and blocked feeling in right ear', status: 'Completed' }
];

export const INITIAL_RECORDS = [
  { id: 'REC-01', patientId: 'P-1001', patientName: 'Alexander Wright', doctor: 'Dr. James Anderson', visitDate: '2026-03-28', symptoms: 'Crushing retrosternal chest pain, diaphoresis, shortness of breath', diagnosis: 'Acute Coronary Syndrome, Unstable Angina, Stage 2 HTN', notes: 'Initiated dual antiplatelet therapy, statin, beta-blocker. ECG demonstrates non-specific ST changes. Transferred to ICU Bed 102.', followupDate: '2026-04-05' },
  { id: 'REC-02', patientId: 'P-1002', patientName: 'Beatrice Gomez', doctor: 'Dr. Elena Rostova', visitDate: '2026-03-24', symptoms: 'Unilateral pulsating headache, photophobia, phonophobia', diagnosis: 'Common Migraine without aura', notes: 'Prescribed Sumatriptan 50mg PRN for acute attacks and Propranolol for prophylaxis. Advised sleep log and headache diary.', followupDate: '2026-04-20' },
  { id: 'REC-03', patientId: 'P-1003', patientName: 'Charles Montgomery', doctor: 'Dr. Robert Chen', visitDate: '2026-03-27', symptoms: 'Chronic right knee pain, crepitus, severe loss of joint space', diagnosis: 'Grade 4 Tricompartmental Osteoarthritis right knee', notes: 'Completed right total knee arthroplasty under spinal anesthesia. Wound clean, active drain output 80ml. Started on Enoxaparin DVT prophylaxis.', followupDate: '2026-04-10' },
  { id: 'REC-04', patientId: 'P-1004', patientName: 'Diana Sterling', doctor: 'Dr. Maya Lin', visitDate: '2026-03-18', symptoms: 'Expiratory wheezing, dry barking cough, no respiratory distress', diagnosis: 'Reactive Airway Disease (Viral-induced asthma)', notes: 'Administered Salbutamol nebulization. Chest clear on discharge. Prescribed Fluticasone inhaler via spacer 2 puffs BID.', followupDate: '2026-04-02' },
  { id: 'REC-05', patientId: 'P-1005', patientName: 'Evan Harris', doctor: 'Dr. David Kim', visitDate: '2026-03-20', symptoms: 'Fatigue, polydipsia, nocturia, tingling sensations in feet', diagnosis: 'Type 2 Diabetes Mellitus with early peripheral neuropathy', notes: 'Fasting glucose 172 mg/dL, HbA1c 7.8%. Started Metformin 850mg BID and Pregabalin 75mg QHS. Referred to diabetes educator.', followupDate: '2026-04-25' },
  { id: 'REC-06', patientId: 'P-1006', patientName: 'Fiona Gallagher', doctor: 'Dr. Olivia Vance', visitDate: '2026-03-22', symptoms: 'Pruritic erythematous plaques with fine scaling on flexor surfaces', diagnosis: 'Atopic Dermatitis (Moderate)', notes: 'Advised mild unscented emollient baths. Prescribed Mometasone furoate 0.1% cream for 7 days, then taper.', followupDate: '2026-04-15' },
  { id: 'REC-07', patientId: 'P-1007', patientName: 'George Patterson', doctor: 'Dr. Tariq Mahmood', visitDate: '2026-03-25', symptoms: 'Right upper quadrant pain radiating to scapula, positive Murphy sign', diagnosis: 'Acute Calculous Cholecystitis', notes: 'Ultrasound confirmed gallstones with 4mm gallbladder wall edema. Laparoscopic cholecystectomy successfully performed.', followupDate: '2026-04-08' },
  { id: 'REC-08', patientId: 'P-1008', patientName: 'Hannah Abbott', doctor: 'Dr. Maria Santos', visitDate: '2026-03-26', symptoms: 'Routine 20-week gestation obstetric evaluation', diagnosis: 'Single intrauterine pregnancy, 20 weeks 2 days, cephalic', notes: 'Fetal anatomy scan within normal parameters. Estimated fetal weight 340g. Prescribed ferrous sulfate, calcium and DHA supplementation.', followupDate: '2026-04-24' },
  { id: 'REC-09', patientId: 'P-1009', patientName: 'Ian Fletcher', doctor: 'Dr. James Anderson', visitDate: '2026-03-30', symptoms: 'Severe squeezing chest pressure at rest, troponin I elevated (1.4 ng/ml)', diagnosis: 'Non-ST Elevation Myocardial Infarction (NSTEMI)', notes: 'Admitted to CCU Bed A. Commenced Heparin infusion, Atorvastatin 80mg, Ticagrelor 90mg. Coronary angiogram scheduled.', followupDate: '2026-04-06' },
  { id: 'REC-10', patientId: 'P-1010', patientName: 'Julia Roberts', doctor: 'Dr. Sophia Al-Mansoor', visitDate: '2026-03-28', symptoms: 'Facial fullness, purulent nasal discharge, hyposmia', diagnosis: 'Acute Bacterial Rhinosinusitis', notes: 'Anterior rhinoscopy showed mucosal edema and middle meatus discharge. Prescribed Amoxicillin-Clavulanate 875/125mg for 10 days.', followupDate: '2026-04-12' },
  { id: 'REC-11', patientId: 'P-1011', patientName: 'Kevin O\'Connor', doctor: 'Dr. Robert Chen', visitDate: '2026-03-20', symptoms: 'Swollen lateral malleolus, inability to bear weight', diagnosis: 'Grade II Anterior Talofibular Ligament Sprain', notes: 'Ottawa ankle rules applied, radiograph negative for fracture. Ankle pneumatic walking boot applied with RICE protocol.', followupDate: '2026-04-03' },
  { id: 'REC-12', patientId: 'P-1012', patientName: 'Laura Bennett', doctor: 'Dr. David Kim', visitDate: '2026-03-22', symptoms: 'Muscle cramps, general weakness, palpitations', diagnosis: 'Diuretic-induced Hypokalemia (Serum K+ 3.1 mmol/L)', notes: 'Oral potassium chloride replacement 40 mEq/day commenced. Discontinued hydrochlorothiazide. Potassium normalized to 4.2.', followupDate: '2026-04-20' },
  { id: 'REC-13', patientId: 'P-1013', patientName: 'Michael Chang', doctor: 'Dr. Tariq Mahmood', visitDate: '2026-03-30', symptoms: 'Reducible groin bulge increasing with Valsalva', diagnosis: 'Right Indirect Inguinal Hernia', notes: 'Surgical options discussed with patient. Scheduled for elective Lichtenstein mesh tension-free repair.', followupDate: '2026-04-14' },
  { id: 'REC-14', patientId: 'P-1014', patientName: 'Nadia Malik', doctor: 'Dr. Maria Santos', visitDate: '2026-03-30', symptoms: 'Regular uterine contractions 3 minutes apart', diagnosis: 'Active Labor, Term pregnancy (39 weeks 4 days)', notes: 'Delivered healthy female infant (weight 3.2 kg, APGAR 9/10). Episiotomy repaired. Normal postpartum observation.', followupDate: '2026-04-15' },
  { id: 'REC-15', patientId: 'P-1015', patientName: 'Owen Vance', doctor: 'Dr. Maya Lin', visitDate: '2026-03-24', symptoms: 'Watery diarrhea 6 episodes, vomiting, mild sunken eyes', diagnosis: 'Viral Gastroenteritis with moderate dehydration', notes: 'Rehydrated with oral rehydration salts and low-osmolarity zinc solution. Stool microscopy negative for parasites.', followupDate: '2026-04-01' }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: 'RX-501',
    patientId: 'P-1001',
    patientName: 'Alexander Wright',
    doctor: 'Dr. James Anderson',
    date: '2026-03-28',
    diagnosis: 'Acute Coronary Syndrome, Hypertension',
    medicines: [
      { name: 'Atorvastatin 40mg', dosage: '1 tablet', frequency: 'Once daily at night', duration: '30 Days', instructions: 'Take with or without food' },
      { name: 'Aspirin 81mg', dosage: '1 tablet', frequency: 'Once daily', duration: '90 Days', instructions: 'Take with full glass of water after breakfast' },
      { name: 'Metoprolol Succinate 50mg', dosage: '1 tablet', frequency: 'Once daily', duration: '30 Days', instructions: 'Monitor pulse rate daily' },
      { name: 'Ramipril 5mg', dosage: '1 capsule', frequency: 'Once daily in morning', duration: '30 Days', instructions: 'Report persistent dry cough' }
    ]
  },
  {
    id: 'RX-502',
    patientId: 'P-1002',
    patientName: 'Beatrice Gomez',
    doctor: 'Dr. Elena Rostova',
    date: '2026-03-24',
    diagnosis: 'Common Migraine',
    medicines: [
      { name: 'Sumatriptan 50mg', dosage: '1 tablet', frequency: 'At onset of migraine attack', duration: 'PRN', instructions: 'May repeat once after 2 hours if headache recurs' },
      { name: 'Propranolol 40mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '60 Days', instructions: 'Do not discontinue abruptly' }
    ]
  },
  {
    id: 'RX-503',
    patientId: 'P-1003',
    patientName: 'Charles Montgomery',
    doctor: 'Dr. Robert Chen',
    date: '2026-03-27',
    diagnosis: 'Total Knee Arthroplasty (Post-Op)',
    medicines: [
      { name: 'Enoxaparin 40mg/0.4ml', dosage: '1 prefilled syringe', frequency: 'Once daily subcutaneous', duration: '14 Days', instructions: 'Rotate abdominal injection sites' },
      { name: 'Tramadol/Paracetamol 37.5/325mg', dosage: '1-2 tablets', frequency: 'Every 6 hours as needed', duration: '7 Days', instructions: 'For moderate to severe pain' },
      { name: 'Pantoprazole 40mg', dosage: '1 tablet', frequency: 'Once daily before breakfast', duration: '14 Days', instructions: 'GI mucosal protection' }
    ]
  },
  {
    id: 'RX-504',
    patientId: 'P-1004',
    patientName: 'Diana Sterling',
    doctor: 'Dr. Maya Lin',
    date: '2026-03-18',
    diagnosis: 'Reactive Airway Disease',
    medicines: [
      { name: 'Salbutamol HFA Inhaler 100mcg', dosage: '2 puffs', frequency: 'Every 4-6 hours PRN', duration: '1 Inhaler', instructions: 'Use with pediatric spacer device' },
      { name: 'Fluticasone Propionate 50mcg', dosage: '1 puff', frequency: 'Twice daily', duration: '30 Days', instructions: 'Rinse mouth with water after use' }
    ]
  },
  {
    id: 'RX-505',
    patientId: 'P-1005',
    patientName: 'Evan Harris',
    doctor: 'Dr. David Kim',
    date: '2026-03-20',
    diagnosis: 'Type 2 Diabetes Mellitus',
    medicines: [
      { name: 'Metformin Hydrochloride 850mg', dosage: '1 tablet', frequency: 'Twice daily with meals', duration: '60 Days', instructions: 'Take with morning and evening food' },
      { name: 'Pregabalin 75mg', dosage: '1 capsule', frequency: 'Once daily at bedtime', duration: '30 Days', instructions: 'For neuropathic discomfort' }
    ]
  },
  {
    id: 'RX-506',
    patientId: 'P-1006',
    patientName: 'Fiona Gallagher',
    doctor: 'Dr. Olivia Vance',
    date: '2026-03-22',
    diagnosis: 'Atopic Dermatitis',
    medicines: [
      { name: 'Mometasone Furoate 0.1% Cream', dosage: 'Thin film', frequency: 'Once daily to affected skin', duration: '7 Days', instructions: 'Do not apply to open skin or face' },
      { name: 'Cetirizine Hydrochloride 10mg', dosage: '1 tablet', frequency: 'Once daily in evening', duration: '14 Days', instructions: 'For pruritus reduction' }
    ]
  },
  {
    id: 'RX-507',
    patientId: 'P-1007',
    patientName: 'George Patterson',
    doctor: 'Dr. Tariq Mahmood',
    date: '2026-03-25',
    diagnosis: 'Laparoscopic Cholecystectomy (Post-Op)',
    medicines: [
      { name: 'Cefuroxime Axetil 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 Days', instructions: 'Complete full prescribed course' },
      { name: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: 'Every 8 hours with meals', duration: '5 Days', instructions: 'Take with food or milk' }
    ]
  },
  {
    id: 'RX-508',
    patientId: 'P-1008',
    patientName: 'Hannah Abbott',
    doctor: 'Dr. Maria Santos',
    date: '2026-03-26',
    diagnosis: 'Second Trimester Gestation',
    medicines: [
      { name: 'Ferrous Sulfate 200mg + Folic Acid', dosage: '1 tablet', frequency: 'Once daily with citrus juice', duration: '90 Days', instructions: 'Do not take with dairy or tea' },
      { name: 'Calcium Carbonate + Vit D3', dosage: '1 tablet', frequency: 'Twice daily after meals', duration: '90 Days', instructions: 'Maintain adequate hydration' }
    ]
  },
  {
    id: 'RX-509',
    patientId: 'P-1009',
    patientName: 'Ian Fletcher',
    doctor: 'Dr. James Anderson',
    date: '2026-03-30',
    diagnosis: 'NSTEMI',
    medicines: [
      { name: 'Ticagrelor 90mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '30 Days', instructions: 'Take with Aspirin 81mg' },
      { name: 'Rosuvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at night', duration: '30 Days', instructions: 'Lipid lowering therapy' }
    ]
  },
  {
    id: 'RX-510',
    patientId: 'P-1010',
    patientName: 'Julia Roberts',
    doctor: 'Dr. Sophia Al-Mansoor',
    date: '2026-03-28',
    diagnosis: 'Acute Bacterial Sinusitis',
    medicines: [
      { name: 'Amoxicillin-Clavulanate 875/125mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '10 Days', instructions: 'Take at the start of a meal' },
      { name: 'Oxymetazoline 0.05% Nasal Spray', dosage: '2 sprays each nostril', frequency: 'Twice daily', duration: '3 Days only', instructions: 'Do not exceed 3 consecutive days' }
    ]
  }
];

export const INITIAL_MEDICINES = [
  { id: 'MED-01', name: 'Amoxicillin-Clavulanate 875/125mg', category: 'Antibiotic', manufacturer: 'GSK Pharmaceuticals', quantity: 180, unitPrice: 1.25, expiryDate: '2027-08-15', status: 'Available' },
  { id: 'MED-02', name: 'Atorvastatin 40mg Tablets', category: 'Cardiology', manufacturer: 'Pfizer Inc.', quantity: 240, unitPrice: 0.85, expiryDate: '2027-11-20', status: 'Available' },
  { id: 'MED-03', name: 'Metformin Hydrochloride 850mg', category: 'Antidiabetic', manufacturer: 'Merck & Co.', quantity: 350, unitPrice: 0.40, expiryDate: '2028-02-10', status: 'Available' },
  { id: 'MED-04', name: 'Aspirin 81mg Delayed-Release', category: 'Cardiology', manufacturer: 'Bayer Health', quantity: 500, unitPrice: 0.15, expiryDate: '2027-09-30', status: 'Available' },
  { id: 'MED-05', name: 'Ramipril 5mg Capsules', category: 'Cardiology', manufacturer: 'Sanofi Aventis', quantity: 210, unitPrice: 0.65, expiryDate: '2027-06-18', status: 'Available' },
  { id: 'MED-06', name: 'Metoprolol Succinate 50mg', category: 'Cardiology', manufacturer: 'AstraZeneca', quantity: 190, unitPrice: 0.70, expiryDate: '2027-10-15', status: 'Available' },
  { id: 'MED-07', name: 'Enoxaparin Sodium 40mg Injection', category: 'Anticoagulant', manufacturer: 'Sanofi', quantity: 45, unitPrice: 14.50, expiryDate: '2026-12-05', status: 'Available' },
  { id: 'MED-08', name: 'Paracetamol 500mg Tablets', category: 'Analgesic', manufacturer: 'Johnson & Johnson', quantity: 820, unitPrice: 0.10, expiryDate: '2028-05-20', status: 'Available' },
  { id: 'MED-09', name: 'Ibuprofen 400mg Tablets', category: 'Analgesic', manufacturer: 'Abbott Laboratories', quantity: 410, unitPrice: 0.25, expiryDate: '2027-12-10', status: 'Available' },
  { id: 'MED-10', name: 'Pantoprazole 40mg Delayed-Release', category: 'Gastroenterology', manufacturer: 'Takeda Pharma', quantity: 300, unitPrice: 0.90, expiryDate: '2027-07-22', status: 'Available' },
  { id: 'MED-11', name: 'Salbutamol HFA Inhaler 100mcg', category: 'Respiratory', manufacturer: 'GSK', quantity: 15, unitPrice: 8.20, expiryDate: '2026-11-30', status: 'Low Stock' },
  { id: 'MED-12', name: 'Fluticasone Propionate 50mcg', category: 'Respiratory', manufacturer: 'Cipla Ltd.', quantity: 18, unitPrice: 12.00, expiryDate: '2027-03-15', status: 'Low Stock' },
  { id: 'MED-13', name: 'Sumatriptan 50mg Tablets', category: 'Neurology', manufacturer: 'Sun Pharma', quantity: 60, unitPrice: 3.50, expiryDate: '2027-04-10', status: 'Available' },
  { id: 'MED-14', name: 'Pregabalin 75mg Capsules', category: 'Neurology', manufacturer: 'Pfizer Inc.', quantity: 140, unitPrice: 1.10, expiryDate: '2027-09-05', status: 'Available' },
  { id: 'MED-15', name: 'Cefuroxime Axetil 500mg', category: 'Antibiotic', manufacturer: 'Novartis', quantity: 8, unitPrice: 2.10, expiryDate: '2026-12-15', status: 'Low Stock' },
  { id: 'MED-16', name: 'Cetirizine 10mg Tablets', category: 'Antihistamine', manufacturer: 'UCB Pharma', quantity: 380, unitPrice: 0.30, expiryDate: '2028-01-25', status: 'Available' },
  { id: 'MED-17', name: 'Mometasone Furoate 0.1% Cream', category: 'Dermatology', manufacturer: 'Organon', quantity: 40, unitPrice: 6.80, expiryDate: '2027-05-18', status: 'Available' },
  { id: 'MED-18', name: 'Insulin Glargine 100 IU/ml Pen', category: 'Antidiabetic', manufacturer: 'Sanofi', quantity: 0, unitPrice: 32.00, expiryDate: '2026-10-15', status: 'Out of Stock' },
  { id: 'MED-19', name: 'Ciprofloxacin 500mg Tablets', category: 'Antibiotic', manufacturer: 'Bayer AG', quantity: 220, unitPrice: 0.95, expiryDate: '2025-05-10', status: 'Expired' },
  { id: 'MED-20', name: 'Ticagrelor 90mg Tablets', category: 'Cardiology', manufacturer: 'AstraZeneca', quantity: 95, unitPrice: 2.80, expiryDate: '2027-08-30', status: 'Available' }
];

export const INITIAL_BILLS = [
  { id: 'INV-1001', patientId: 'P-1001', patientName: 'Alexander Wright', consultationFee: 120, medicineCharges: 165, labCharges: 210, roomCharges: 500, otherCharges: 80, totalAmount: 1075, paidAmount: 1075, remainingAmount: 0, date: '2026-03-30', status: 'Paid', paymentMethod: 'Health Insurance' },
  { id: 'INV-1002', patientId: 'P-1002', patientName: 'Beatrice Gomez', consultationFee: 140, medicineCharges: 45, labCharges: 90, roomCharges: 0, otherCharges: 0, totalAmount: 275, paidAmount: 275, remainingAmount: 0, date: '2026-03-24', status: 'Paid', paymentMethod: 'Credit Card' },
  { id: 'INV-1003', patientId: 'P-1003', patientName: 'Charles Montgomery', consultationFee: 110, medicineCharges: 290, labCharges: 180, roomCharges: 480, otherCharges: 350, totalAmount: 1410, paidAmount: 1000, remainingAmount: 410, date: '2026-03-29', status: 'Partial', paymentMethod: 'Online Transfer' },
  { id: 'INV-1004', patientId: 'P-1004', patientName: 'Diana Sterling', consultationFee: 95, medicineCharges: 32, labCharges: 60, roomCharges: 0, otherCharges: 0, totalAmount: 187, paidAmount: 187, remainingAmount: 0, date: '2026-03-18', status: 'Paid', paymentMethod: 'Cash' },
  { id: 'INV-1005', patientId: 'P-1005', patientName: 'Evan Harris', consultationFee: 85, medicineCharges: 55, labCharges: 110, roomCharges: 0, otherCharges: 0, totalAmount: 250, paidAmount: 0, remainingAmount: 250, date: '2026-03-20', status: 'Unpaid', paymentMethod: 'Pending' },
  { id: 'INV-1006', patientId: 'P-1006', patientName: 'Fiona Gallagher', consultationFee: 100, medicineCharges: 42, labCharges: 0, roomCharges: 0, otherCharges: 0, totalAmount: 142, paidAmount: 142, remainingAmount: 0, date: '2026-03-22', status: 'Paid', paymentMethod: 'Credit Card' },
  { id: 'INV-1007', patientId: 'P-1007', patientName: 'George Patterson', consultationFee: 150, medicineCharges: 210, labCharges: 160, roomCharges: 320, otherCharges: 450, totalAmount: 1290, paidAmount: 800, remainingAmount: 490, date: '2026-03-28', status: 'Partial', paymentMethod: 'Health Insurance' },
  { id: 'INV-1008', patientId: 'P-1008', patientName: 'Hannah Abbott', consultationFee: 115, medicineCharges: 60, labCharges: 140, roomCharges: 0, otherCharges: 50, totalAmount: 365, paidAmount: 365, remainingAmount: 0, date: '2026-03-26', status: 'Paid', paymentMethod: 'Credit Card' },
  { id: 'INV-1009', patientId: 'P-1009', patientName: 'Ian Fletcher', consultationFee: 120, medicineCharges: 340, labCharges: 280, roomCharges: 500, otherCharges: 200, totalAmount: 1440, paidAmount: 0, remainingAmount: 1440, date: '2026-03-30', status: 'Unpaid', paymentMethod: 'Pending' },
  { id: 'INV-1010', patientId: 'P-1010', patientName: 'Julia Roberts', consultationFee: 85, medicineCharges: 35, labCharges: 40, roomCharges: 0, otherCharges: 0, totalAmount: 160, paidAmount: 160, remainingAmount: 0, date: '2026-03-28', status: 'Paid', paymentMethod: 'Cash' },
  { id: 'INV-1011', patientId: 'P-1011', patientName: 'Kevin O\'Connor', consultationFee: 110, medicineCharges: 40, labCharges: 75, roomCharges: 360, otherCharges: 120, totalAmount: 705, paidAmount: 705, remainingAmount: 0, date: '2026-03-23', status: 'Paid', paymentMethod: 'Credit Card' },
  { id: 'INV-1012', patientId: 'P-1012', patientName: 'Laura Bennett', consultationFee: 85, medicineCharges: 28, labCharges: 65, roomCharges: 240, otherCharges: 50, totalAmount: 468, paidAmount: 468, remainingAmount: 0, date: '2026-03-25', status: 'Paid', paymentMethod: 'Cash' },
  { id: 'INV-1013', patientId: 'P-1013', patientName: 'Michael Chang', consultationFee: 150, medicineCharges: 0, labCharges: 120, roomCharges: 0, otherCharges: 0, totalAmount: 270, paidAmount: 270, remainingAmount: 0, date: '2026-03-30', status: 'Paid', paymentMethod: 'Online Transfer' },
  { id: 'INV-1014', patientId: 'P-1014', patientName: 'Nadia Malik', consultationFee: 115, medicineCharges: 180, labCharges: 90, roomCharges: 160, otherCharges: 300, totalAmount: 845, paidAmount: 500, remainingAmount: 345, date: '2026-03-31', status: 'Partial', paymentMethod: 'Cash' },
  { id: 'INV-1015', patientId: 'P-1015', patientName: 'Owen Vance', consultationFee: 95, medicineCharges: 22, labCharges: 45, roomCharges: 150, otherCharges: 30, totalAmount: 342, paidAmount: 342, remainingAmount: 0, date: '2026-03-26', status: 'Paid', paymentMethod: 'Credit Card' }
];

export const INITIAL_LAB_TESTS = [
  { id: 'LAB-101', patientId: 'P-1001', patientName: 'Alexander Wright', testName: 'Cardiac Troponin I & Lipid Panel', doctor: 'Dr. James Anderson', department: 'Cardiology', testDate: '2026-03-28', status: 'Completed', resultSummary: 'Troponin I: 0.08 ng/mL (Mildly elevated), Total Cholesterol: 245 mg/dL, LDL: 162 mg/dL' },
  { id: 'LAB-102', patientId: 'P-1002', patientName: 'Beatrice Gomez', testName: 'Serum Electrolytes & Thyroid TSH', doctor: 'Dr. Elena Rostova', department: 'Neurology', testDate: '2026-03-24', status: 'Completed', resultSummary: 'Sodium: 139 mEq/L, Potassium: 4.1 mEq/L, TSH: 2.1 mIU/L (Euthyroid)' },
  { id: 'LAB-103', patientId: 'P-1003', patientName: 'Charles Montgomery', testName: 'Pre-op Coagulation Profile (PT/INR)', doctor: 'Dr. Robert Chen', department: 'Orthopedics', testDate: '2026-03-26', status: 'Completed', resultSummary: 'PT: 12.1 sec, INR: 1.02, Platelet count: 240,000/uL (Satisfactory)' },
  { id: 'LAB-104', patientId: 'P-1005', patientName: 'Evan Harris', testName: 'Glycated Hemoglobin (HbA1c) & eGFR', doctor: 'Dr. David Kim', department: 'General Medicine', testDate: '2026-03-20', status: 'Completed', resultSummary: 'HbA1c: 7.8% (Target < 7.0%), eGFR: 84 mL/min/1.73m2, Microalbumin: negative' },
  { id: 'LAB-105', patientId: 'P-1007', patientName: 'George Patterson', testName: 'Liver Function Tests (LFT)', doctor: 'Dr. Tariq Mahmood', department: 'General Surgery', testDate: '2026-03-25', status: 'Completed', resultSummary: 'Total Bilirubin: 1.8 mg/dL, ALT: 68 U/L, AST: 52 U/L, Alkaline Phosphatase: 145 U/L' },
  { id: 'LAB-106', patientId: 'P-1008', patientName: 'Hannah Abbott', testName: 'Maternal Blood Group & Glucose Challenge', doctor: 'Dr. Maria Santos', department: 'Gynecology & Obstetrics', testDate: '2026-03-26', status: 'Completed', resultSummary: 'Blood Group: B Rh Negative, Antibody screen: negative, 1-hr GCT: 118 mg/dL' },
  { id: 'LAB-107', patientId: 'P-1009', patientName: 'Ian Fletcher', testName: 'High Sensitivity Troponin & CK-MB', doctor: 'Dr. James Anderson', department: 'Cardiology', testDate: '2026-03-30', status: 'In Progress', resultSummary: 'Processing sample serial drawn at 06:00 AM' },
  { id: 'LAB-108', patientId: 'P-1013', patientName: 'Michael Chang', testName: 'Complete Blood Count (CBC) & Coagulation', doctor: 'Dr. Tariq Mahmood', department: 'General Surgery', testDate: '2026-03-30', status: 'In Progress', resultSummary: 'Awaiting lab technician verification' },
  { id: 'LAB-109', patientId: 'P-1014', patientName: 'Nadia Malik', testName: 'Neonatal Bilirubin & Maternal Hemoglobin', doctor: 'Dr. Maria Santos', department: 'Gynecology & Obstetrics', testDate: '2026-03-31', status: 'Requested', resultSummary: 'Sample collected, queued in analyzer' },
  { id: 'LAB-110', patientId: 'P-1010', patientName: 'Julia Roberts', testName: 'Nasal Swab Bacterial Culture & Sensitivity', doctor: 'Dr. Sophia Al-Mansoor', department: 'ENT', testDate: '2026-03-28', status: 'Completed', resultSummary: 'S. pneumoniae isolated, sensitive to Amoxicillin-Clavulanate and Cefuroxime' }
];

export const INITIAL_STAFF = [
  { id: 'STF-01', name: 'Rachel Adams, RN', role: 'Nurse', department: 'Cardiology', phone: '+1 (555) 771-0011', email: 'r.adams@hms.com', shift: 'Morning (07:00 AM - 03:00 PM)', status: 'Active' },
  { id: 'STF-02', name: 'Brian Miller, RN', role: 'Nurse', department: 'ICU Ward', phone: '+1 (555) 771-0022', email: 'b.miller@hms.com', shift: 'Night (11:00 PM - 07:00 AM)', status: 'Active' },
  { id: 'STF-03', name: 'Grace Hopper', role: 'Receptionist', department: 'Front Desk OPD', phone: '+1 (555) 771-0033', email: 'g.hopper@hms.com', shift: 'Morning (08:00 AM - 04:00 PM)', status: 'Active' },
  { id: 'STF-04', name: 'Marcus Sterling', role: 'Laboratory Technician', department: 'Clinical Pathology', phone: '+1 (555) 771-0044', email: 'm.sterling@hms.com', shift: 'Day (09:00 AM - 05:00 PM)', status: 'Active' },
  { id: 'STF-05', name: 'Linda Nguyen, PharmD', role: 'Pharmacist', department: 'Central Pharmacy', phone: '+1 (555) 771-0055', email: 'l.nguyen@hms.com', shift: 'Day (08:30 AM - 04:30 PM)', status: 'Active' },
  { id: 'STF-06', name: 'Steven Wright', role: 'Accountant', department: 'Finance & Billing', phone: '+1 (555) 771-0066', email: 's.wright@hms.com', shift: 'Day (09:00 AM - 05:00 PM)', status: 'Active' },
  { id: 'STF-07', name: 'Jessica Taylor, RN', role: 'Nurse', department: 'Pediatrics', phone: '+1 (555) 771-0077', email: 'j.taylor@hms.com', shift: 'Evening (03:00 PM - 11:00 PM)', status: 'Active' },
  { id: 'STF-08', name: 'Daniel Scott', role: 'Administrative Staff', department: 'Human Resources', phone: '+1 (555) 771-0088', email: 'd.scott@hms.com', shift: 'Day (09:00 AM - 05:00 PM)', status: 'Active' },
  { id: 'STF-09', name: 'Amanda Lewis', role: 'Laboratory Technician', department: 'Biochemistry Lab', phone: '+1 (555) 771-0099', email: 'a.lewis@hms.com', shift: 'Day (08:00 AM - 04:00 PM)', status: 'Active' },
  { id: 'STF-10', name: 'Christopher Paul', role: 'Pharmacist', department: 'Emergency Pharmacy', phone: '+1 (555) 771-0100', email: 'c.paul@hms.com', shift: 'Night (11:00 PM - 07:00 AM)', status: 'Active' }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'NOTIF-1', title: 'New Patient Registered', message: 'Nadia Malik was registered and assigned to Dr. Maria Santos', time: '10 mins ago', read: false, icon: 'fa-user-plus' },
  { id: 'NOTIF-2', title: 'Low Inventory Alert', message: 'Salbutamol HFA Inhaler is running low (15 units remaining)', time: '45 mins ago', read: false, icon: 'fa-triangle-exclamation' },
  { id: 'NOTIF-3', title: 'Critical Patient Admitted', message: 'Ian Fletcher was admitted to ICU Ward Bed A', time: '2 hours ago', read: false, icon: 'fa-bed-pulse' },
  { id: 'NOTIF-4', title: 'Lab Test Verified', message: 'Cardiac Troponin report for Alexander Wright has been completed', time: '3 hours ago', read: true, icon: 'fa-flask-vial' },
  { id: 'NOTIF-5', title: 'Payment Received', message: 'Payment of $1,075 recorded for Invoice #INV-1001 (Alexander Wright)', time: '4 hours ago', read: true, icon: 'fa-receipt' }
];

export const INITIAL_SETTINGS = {
  hospitalName: 'CarePulse Memorial Hospital',
  subtitle: 'Smart Healthcare Administration & Patient Management Platform',
  phone: '+1 (800) 555-CARE (2273)',
  emergency: '+1 (800) 555-9911',
  email: 'info@carepulse-hospital.org',
  address: '100 Medical Center Way, Metro City, MC 90210',
  currency: '$',
  theme: 'light'
};

/* --------------------------------------------------------------------------
   STORAGE ACCESS UTILITIES
   -------------------------------------------------------------------------- */
export function getStorageData(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return defaultData;
  }
}

export function setStorageData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export function initializeDemoData(force = false) {
  if (force || !localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.OPD_VISITS, JSON.stringify(INITIAL_OPD));
    localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify(INITIAL_ADMISSIONS));
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(INITIAL_BEDS));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
    localStorage.setItem(STORAGE_KEYS.LAB_TESTS, JSON.stringify(INITIAL_LAB_TESTS));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
}
