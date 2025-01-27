export interface DentalHistory {
    id?: number;                // Unique identifier for the dental history
    patient_id: number;        // ID of the patient
    previous_dentist: string; 
    last_dentist_visit: string; 
    created_at?: string;       // Timestamp when the record was created
    updated_at?: string;       // Timestamp when the record was last updated
  }
  

  export interface DentalHistoryResponse {
    message: string;    // API response message
    data: DentalHistory | null; // Single dental history object or null
  }
  
 
  export interface DentalHistoriesListResponse {
    message: string;    // API response message
    data: DentalHistory[]; // Array of dental history records
  }
  
