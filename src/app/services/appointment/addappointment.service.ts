import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Appointment } from 'src/app/interfaces/addappointment.interface';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;
  private apiUrl_patient = `${environment.apiUrl}/appointments/by-patient`;
  private apiUrl_cancel = `${environment.apiUrl}/appointments/cancel`;

  constructor(private http: HttpClient) {}

  // ✅ Get all appointments
  getAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(this.apiUrl);
  }

  // ✅ Get appointment by ID
  getAppointmentById(id: number): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`);
  }

  // ✅ Get appointment by ID
  getAppointmentByPatientId(id: number): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl_patient}/${id}`);
  }

  // ✅ Create a new appointment (Handles Optional `service_list_id`)
  createAppointment(
    appointment: Partial<Appointment>, 
    service_list_id: number[]
  ): Observable<ApiResponse<{ appointmentId: number }>> {
    return this.http.post<ApiResponse<{ appointmentId: number }>>(this.apiUrl, { 
      ...appointment, 
      service_list_id 
    });
  }

  // ✅ Update an appointment (Handles Optional `service_list_id`)
  updateAppointment(id: number, appointment: Partial<Appointment>): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`, appointment);
  }

  // ✅ Delete an appointment
  deleteAppointment(id: number): Observable<ApiResponse<{ id: number }>> {
    return this.http.delete<ApiResponse<{ id: number }>>(`${this.apiUrl}/${id}`);
  }

    // ✅ Cancel an appointment (PATCH - Updates Only `status`)
    cancelAppointment(id: number): Observable<ApiResponse<{ appointmentId: number }>> {
      return this.http.patch<ApiResponse<{ appointmentId: number }>>(`${this.apiUrl_cancel}/${id}`, {
        status: 'canceled',
      });
    }

}
