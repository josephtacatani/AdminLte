import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Treatment, TreatmentResponse, TreatmentsResponse } from 'src/app/interfaces/treatments.interface';


@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private apiUrl = `${environment.apiUrl}/treatments`;

  constructor(private http: HttpClient) {}

  getAllTreatments(): Observable<TreatmentsResponse> {
    return this.http.get<TreatmentsResponse>(this.apiUrl);
  }

  getTreatmentById(id: number): Observable<TreatmentResponse> {
    return this.http.get<TreatmentResponse>(`${this.apiUrl}/${id}`);
  }

  getTreatmentsByPatientId(patientId: number): Observable<TreatmentsResponse> {
    return this.http.get<TreatmentsResponse>(`${this.apiUrl}/patient/${patientId}`);
  }

  addTreatment(treatment: Omit<Treatment, 'id' | 'created_at' | 'updated_at'>): Observable<TreatmentResponse> {
    return this.http.post<TreatmentResponse>(this.apiUrl, treatment);
  }

  updateTreatment(id: number, treatment: Partial<Omit<Treatment, 'created_at' | 'updated_at'>>): Observable<TreatmentResponse> {
    return this.http.put<TreatmentResponse>(`${this.apiUrl}/${id}`, treatment);
  }
  

  deleteTreatment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
