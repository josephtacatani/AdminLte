import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Schedule } from 'src/app/interfaces/patients.interface';


@Injectable({
  providedIn: 'root', // Ensures the service is available application-wide
})
export class ScheduleService {
  private readonly apiUrl = 'http://localhost:8082/schedules'; // API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all schedules
  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new schedule
  addSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiUrl, schedule).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing schedule (PUT or PATCH based on your API setup)
  updateSchedule(id: number, schedule: Partial<Schedule>): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.apiUrl}/${id}`, schedule).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a schedule
  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
