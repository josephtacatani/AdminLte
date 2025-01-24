// ✅ Generic API Response Interface
export interface ApiResponse<T> {
    message: string;  // API response message
    data: T | null;   // The actual response data (generic type T)
    error?: string | null;  // Optional error field
  }
  
  // ✅ Appointment Interface (Now Includes `service_list_id`, but Optional)
  export interface Appointment {
    id?: number; // Optional for create operations
    patient_id: number;
    dentist_id: number;
    schedule_id: number;
    timeslot_id: number;
    status: 'pending' | 'confirmed' | 'canceled';
    appointment_type: 'online' | 'walk_in';
    health_declaration_id?: number | null; // Optional if the system fetches it automatically
    service_list_id?: number[]; // ✅ Now Optional (Array of Service IDs)
  }
  
  // ✅ Appointment Services Interface (Links Appointments to Services)
  export interface AppointmentService {
    appointment_id: number;
    service_list_id: number;
  }
  

  export interface DetailedAppointment {
    appointment_id: number;
    status: string;
    appointment_type: string;
    schedule_date: string;
    timeslot_start_time: string;
    timeslot_end_time: string;
    dentist_name: string;
    patient_name: string;
    services: AppointmentService[];
  }
  
  export interface AppointmentService {
    service_id: number;
    service_name: string;
  }
  