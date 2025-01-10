import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientData } from 'src/app/interfaces/patients.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientDataService {
  private apiUrl = 'http://localhost:8082/patients';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<PatientData[]> {
    return this.http.get<PatientData[]>(this.apiUrl);
  }

  getPatientById(id: number): Observable<PatientData> {
    return this.http.get<PatientData>(`${this.apiUrl}/${id}`);
  }

  addPatient(patient: PatientData): Observable<PatientData> {
    return this.http.post<PatientData>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: PatientData): Observable<PatientData> {
    return this.http.put<PatientData>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
