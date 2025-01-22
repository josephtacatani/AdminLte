export interface Patient {
    user_id: number;
    fullname: string;
    address: string;
    birthday: string; // YYYY-MM-DD format
    sex: string;
    email: string;
    contact_number: string;
    photo: string;
  }
  
  export interface PatientResponse {
    message: string;
    data: Patient | null;
  }
  
  export interface PatientsListResponse {
    message: string;
    data: Patient[];
  }
  
  export interface UpdatePatientRequest {
    fullname?: string;
    address?: string;
    birthday?: string;
    sex?: string;
    contact_number?: string;
    photo?: string;
  }
  