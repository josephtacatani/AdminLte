export interface DentistData {
  id: number; // Unique identifier for the patient
  photo: string; // URL of the patient's photo
  name: string; // Full name of the patient
  birthday: string; // Date of birth (YYYY-MM-DD)
  gender: string; // Gender (Male/Female)
  contact: string; // Contact number
  email: string; // Email address
  address: string; // Optional address field
}

export interface PatientData {
  id: number; // Unique identifier for the patient
  patientId: number; // Corresponding patient's ID
  photo: string; // URL of the patient's photo
  name: string; // Full name of the patient
  birthday: string; // Date of birth (YYYY-MM-DD)
  gender: string; // Gender (Male/Female)
  contact: string; // Contact number
  email: string; // Email address
  address: string; // Optional address field
}

export interface AppointmentData {
  id: number; // Unique identifier for the appointment
  date: string; // Appointment date (YYYY-MM-DD)
  time: string; // Appointment time (e.g., '10:00 AM')
  status: string; // Status (e.g., 'Confirmed', 'Pending')
}

export interface AppointmentDetail {
  id: number; // Unique identifier for detailed appointment
  date: string; // Appointment date (YYYY-MM-DD)
  time: string; // Appointment time
  doctor: string; // Doctor's name
  status: string; // Status of the appointment
}

export interface PrescriptionData {
  id: number; // Unique identifier for the prescription
  date: string; // Prescription date (YYYY-MM-DD)
  medicine: string; // Name of the prescribed medicine
  notes: string; // Dosage or usage instructions
}

export interface TreatmentData {
  id: number; // Unique identifier for the treatment
  patientId: number; // Corresponding patient's ID
  dateVisit: string; // Visit date (YYYY-MM-DD)
  teethNos: string; // Teeth numbers affected (e.g., '12, 14')
  treatment: string; // Treatment name (e.g., 'Filling', 'Extraction')
  description: string; // Details of the treatment
  fees: string; // Cost of the treatment
  remarks: string; // Additional remarks (e.g., 'Follow-up in 6 months')
}

export interface DentalHistoryData {
  id: number; // Unique identifier for dental history
  previousDentist: string; // Name of the previous dentist
  lastDentalVisit: string; // Last dental visit date (YYYY-MM-DD)
  action: string; // Action associated (e.g., 'View')
}

export interface MedicalHistoryData {
  id: number; // Unique identifier for medical history
  condition?: string; // Condition being treated (optional)
  symptoms?: string; // Symptoms experienced (optional)
  lastVisitDate?: string; // Last medical visit date (YYYY-MM-DD) (optional)
  ongoingTreatment?: boolean; // Whether the patient is undergoing treatment
  medicationDetails?: string; // Medication details (optional)
  allergies: string; // Known allergies
  illnesses: string; // Current or past illnesses
  action: string; // Action associated (e.g., 'View')
}

export interface Schedule {
  date: string; // Date of the schedule (YYYY-MM-DD)
  startTime: string; // Start time of the schedule (e.g., '09:00 AM')
  endTime: string; // End time of the schedule (e.g., '05:00 PM')
  duration: string; // Duration of the schedule (e.g., '8 hours')
}
