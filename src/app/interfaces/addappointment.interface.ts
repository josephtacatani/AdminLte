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

    // ✅ Appointment Detail Interface
    export interface AppointmentDetail {
      id: number; // Appointment ID
      status: string; // Appointment status
      appointment_type: string; // Type of appointment
      patient_fullname: string; // Full name of the patient
      dentist_fullname: string; // Full name of the dentist
      patient:{
        id: number,
        fullname: string
      };
      dentist:{
        id: number,
        fullname: string
      };

      schedule: {
        id: number; // Schedule ID
        date: string; // Schedule date
      };
      timeslot: {
        id: number; // Timeslot ID
        start_time: string; // Start time of the appointment
        end_time: string; // End time of the appointment
      };
      services: {
        id: number; // Service ID
        service_name: string; // Service name
        title: string; // Service title
        content: string; // Service description
        photo: string; // Service photo URL
      }[]; // Updated to include additional fields for services
    }


  
  // ✅ Appointment Services Interface (Links Appointments to Services)
  export interface AppointmentService {
    appointment_id: number;
    service_list_id: number;
  }

  interface Service {
    id: number;
    name: string;
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
  