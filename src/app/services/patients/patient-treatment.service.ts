import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreatmentData } from 'src/app/interfaces/patients.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientTreatmentService {
  private apiUrl = 'http://localhost:3000/treatmentData';

  constructor(private http: HttpClient) {}

  getTreatments(): Observable<TreatmentData[]> {
    return this.http.get<TreatmentData[]>(this.apiUrl);
  }

  getTreatmentById(id: number): Observable<TreatmentData> {
    return this.http.get<TreatmentData>(`${this.apiUrl}/${id}`);
  }

  addTreatment(treatment: TreatmentData): Observable<TreatmentData> {
    return this.http.post<TreatmentData>(this.apiUrl, treatment);
  }

  updateTreatment(id: number, treatment: TreatmentData): Observable<TreatmentData> {
    return this.http.put<TreatmentData>(`${this.apiUrl}/${id}`, treatment);
  }

  deleteTreatment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
