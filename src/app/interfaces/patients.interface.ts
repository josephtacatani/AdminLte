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
  firstName: string; // First name of the patient
  lastName: string; // Last name of the patient
  dateOfBirth: string; // Date of birth (YYYY-MM-DD)
  gender: string; // Gender (Male/Female)
  email: string; // Email address
  mobileNumber: string; // Mobile number
  address: string; // Optional address field
  profilePicture: string; // URL of the patient's profile picture
}


export interface AppointmentDetail {
  id: number; // Unique identifier for detailed appointment
  patientId: number; // Corresponding patient's ID
  date: string; // Appointment date (YYYY-MM-DD)
  time: string; // Appointment time
  doctor: string; // Doctor's name
  status: string; // Status of the appointment
}

export interface PrescriptionData {
  id: number; // Unique identifier for the prescription
  patientId: number; // Corresponding patient's ID
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
  patientId: number; // Corresponding patient's ID
  previousDentist: string; // Name of the previous dentist
  lastDentalVisit: string; // Last dental visit date (YYYY-MM-DD)
  action: string; // Action associated (e.g., 'View')
}

export interface MedicalHistoryData {
  id: number; // Unique identifier for medical history
  patientId?: number; // Corresponding patient's ID
  conditions?: string; // Condition being treated (optional)
  symptoms?: string; // Symptoms experienced (optional)
  lastVisitDate?: string; // Last medical visit date (YYYY-MM-DD) (optional)
  ongoingTreatment?: boolean; // Whether the patient is undergoing treatment
  medicationDetails?: string; // Medication details (optional)
  allergies: string; // Known allergies
  illnesses: string; // Current or past illnesses
  action: string; // Action associated (e.g., 'View')
}

export interface Schedule {
  id: number; // Unique identifier for the schedule
  date: string; // Date of the schedule (YYYY-MM-DD)
  dentistId: number; // Dentist's ID
  startTime: string; // Start time of the schedule (e.g., '09:00 AM')
  endTime: string; // End time of the schedule (e.g., '05:00 PM')
  duration: string; // Duration of the schedule (e.g., '8 hours')
}



