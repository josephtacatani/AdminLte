import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentDetail } from 'src/app/interfaces/patients.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientAppointmentService {
  private apiUrl = 'http://localhost:3000/appointmentDetails';

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<AppointmentDetail[]> {
    return this.http.get<AppointmentDetail[]>(this.apiUrl);
  }

  getAppointmentById(id: number): Observable<AppointmentDetail> {
    return this.http.get<AppointmentDetail>(`${this.apiUrl}/${id}`);
  }

  addAppointment(appointment: AppointmentDetail): Observable<AppointmentDetail> {
    return this.http.post<AppointmentDetail>(this.apiUrl, appointment);
  }

  updateAppointment(id: number, appointment: AppointmentDetail): Observable<AppointmentDetail> {
    return this.http.put<AppointmentDetail>(`${this.apiUrl}/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
