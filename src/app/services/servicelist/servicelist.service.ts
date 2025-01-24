import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Service, ServiceResponse, ServicesListResponse } from 'src/app/interfaces/servicelist.interface';


@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private apiUrl = `${environment.apiUrl}/serviceslist`; // ✅ Base API URL

  constructor(private http: HttpClient) {}

  // ✅ Get all services
  getServices(): Observable<ServicesListResponse> {
    return this.http.get<ServicesListResponse>(this.apiUrl);
  }

  // ✅ Get a specific service by ID
  getServiceById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create a new service (Admin only)
  createService(serviceData: Partial<Service>): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.apiUrl, serviceData);
  }

  // ✅ Update an existing service
  updateService(id: number, updateData: Partial<Service>): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.apiUrl}/${id}`, updateData);
  }

  // ✅ Delete a service (Admin only)
  deleteService(id: number): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.apiUrl}/${id}`);
  }


}
