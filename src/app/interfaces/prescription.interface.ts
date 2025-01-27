export interface Prescription {
    id: number;
    patient_id: number;
    dentist_id: number;
    date: string;
    medicine: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface PrescriptionsResponse {
    message: string;
    data: Prescription[];
  }
  
  export interface PrescriptionResponse {
    message: string;
    data: Prescription;
  }