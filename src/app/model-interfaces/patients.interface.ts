export interface Patient {
    id: number;
    photo: string;
    name: string;
    birthday: string;
    gender: string;
    contact: string;
    email: string;
}

export interface PatientData {
    name: string;
    email: string;
    gender: string;
    birthdate: string;
    phone: string;
    address: string;
  }
  
  export interface AppointmentData {
    date: string;
    time: string;
    status: string;
  }
  
  export interface AppointmentDetail {
    date: string;
    time: string;
    doctor: string;
    status: string;
  }
  
  export interface PrescriptionData {
    date: string;
    medicine: string;
    notes: string;
  }
  
  export interface TreatmentData {
    dateVisit: string;
    teethNos: string;
    treatment: string;
    description: string;
    fees: string;
    remarks: string;
  }
  
  export interface DentalHistoryData {
    id: number;
    previousDentist: string;
    lastDentalVisit: string;
    action: string;
  }
  
  export interface MedicalHistoryData {
    id: number;
    allergies: string;
    illnesses: string;
    action: string;
  }