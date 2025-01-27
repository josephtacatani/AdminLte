import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DentalHistory, DentalHistoryResponse, DentalHistoriesListResponse } from '../../interfaces/dental_history.interface';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class DentalHistoryService {
  private apiUrl = `${environment.apiUrl}/dental_histories`;

  constructor(private http: HttpClient) {}

  getAllDentalHistories(): Observable<DentalHistoriesListResponse> {
    return this.http.get<DentalHistoriesListResponse>(`${this.apiUrl}`);
  }

  getDentalHistoriesByPatientId(patientId: number): Observable<DentalHistoriesListResponse> {
    return this.http.get<DentalHistoriesListResponse>(`${this.apiUrl}/by-patient/${patientId}`);
  }

  getDentalHistoryById(id: number): Observable<DentalHistoryResponse> {
    return this.http.get<DentalHistoryResponse>(`${this.apiUrl}/${id}`);
  }

  createDentalHistory(dentalHistory: Partial<DentalHistory>): Observable<DentalHistoryResponse> {
    return this.http.post<DentalHistoryResponse>(`${this.apiUrl}`, dentalHistory);
  }

  updateDentalHistory(id: number, dentalHistory: Partial<DentalHistory>): Observable<DentalHistoryResponse> {
    return this.http.put<DentalHistoryResponse>(`${this.apiUrl}/${id}`, dentalHistory);
  }

  deleteDentalHistory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}