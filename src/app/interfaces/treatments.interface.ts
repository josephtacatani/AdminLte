export interface Treatment {
    id: number;
    patient_id: number;
    dentist_id: number;
    date_visit: string;
    teeth: string;
    treatment: string;
    description: string;
    fees: number;
    remarks: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface TreatmentsResponse {
    message: string;
    data: Treatment[];
  }
  
  export interface TreatmentResponse {
    message: string;
    data: Treatment;
  }
  