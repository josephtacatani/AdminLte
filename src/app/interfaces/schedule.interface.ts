export interface Schedule {
    id: number;
    dentist_id: number;
    date: string;
    start_time: string;
    end_time: string;
    created_at?: string;
    updated_at?: string;
  }


  export interface SchedulesResponse{
    message: string;
    data: Schedule[];
  }

  export interface ScheduleResponse{
    message: string;
    data: Schedule;
  }

  export interface TimeSlot {
    id: number;
    schedule_id: number;
    start_time: string;
    end_time: string;
  }
  
  export interface TimeSlotsResponse {
    message: string;
    data: TimeSlot[];
  }
