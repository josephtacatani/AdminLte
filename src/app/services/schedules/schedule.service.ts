import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Patient, PatientResponse, PatientsListResponse } from 'src/app/interfaces/patient_details.interface';
import { Schedule, ScheduleResponse, SchedulesResponse, TimeslotIdResponse, TimeSlotsResponse } from 'src/app/interfaces/schedule.interface';


@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  private apiUrl = `${environment.apiUrl}/schedules`; // ✅ Ensure correct endpoint
  private timeSlotsUrl = `${environment.apiUrl}/timeslots/available`; // ✅ Ensure correct endpoint
  private timeAllSlotsUrl = `${environment.apiUrl}/timeslots/all`; // ✅ Ensure correct endpoint
  private timeSlotById = `${environment.apiUrl}/timeslots`; // ✅ Ensure correct endpoint


  constructor(private http: HttpClient) {}

  getSchedules(): Observable<SchedulesResponse> {
    return this.http.get<SchedulesResponse>(this.apiUrl);
  }

  getScheduleById(id: number): Observable<ScheduleResponse> {
    return this.http.get<ScheduleResponse>(`${this.apiUrl}/${id}`);
  }

  getSchedulesByDentist(dentistId: number): Observable<SchedulesResponse> {
    return this.http.get<SchedulesResponse>(`${this.apiUrl}/dentist/${dentistId}`);
  }

  createSchedule(schedule: Partial<Schedule>): Observable<ScheduleResponse> {
    return this.http.post<ScheduleResponse>(this.apiUrl, schedule);
  }

  deleteSchedule(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${id}`);
  }

  getTimeSlots(scheduleId: number): Observable<TimeSlotsResponse> {
    return this.http.get<TimeSlotsResponse>(`${this.timeSlotsUrl}/${scheduleId}`);
  }

  getAllTimeSlots(): Observable<TimeSlotsResponse> {
    return this.http.get<TimeSlotsResponse>(this.timeAllSlotsUrl);
  }

  getAllTimeSlotsById(scheduleId: number): Observable<TimeSlotsResponse> {
    return this.http.get<TimeSlotsResponse>(`${this.timeAllSlotsUrl}/${scheduleId}`);
  }

  getTimeslotById(timeslotId: number): Observable<TimeslotIdResponse> {
    return this.http.get<TimeslotIdResponse>(`${this.timeSlotById}/${timeslotId}`);
  }
}
