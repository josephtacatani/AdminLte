export interface Dentist {
    user_id: number;
    email: string;
    fullname: string;
    status: string;
    photo: string;
    birthday: string;
    address: string;
    gender: string;
    contact_number: string;
    degree: string;
    specialty: string;
  }
  
  export interface DentistResponse {
    message: string;
    data: Dentist | null;
    error: string | null;
  }
  
  export interface DentistsListResponse {
    message: string;
    data: Dentist[];
    error: string | null;
  }
  