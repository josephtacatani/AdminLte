import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentDetail } from 'src/app/interfaces/patients.interface';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { PatientAppointmentService } from 'src/app/services/patients/patient-appointment-service';

@Component({
  selector: 'app-patient-appointment-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-appointment-table.component.html',
  styleUrls: ['./patient-appointment-table.component.scss'],
})
export class PatientAppointmentTableComponent implements OnInit {
  pagetitle = 'Patient Appointments';
  appointmentDetails: AppointmentDetail[] = [];
  filteredAppointmentDetails: AppointmentDetail[] = [];
  columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time', sortable: true },
    { key: 'doctor', label: 'Doctor', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];
  sortColumn = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private appointmentService: PatientAppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointmentDetails();
  }

  loadAppointmentDetails(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointmentDetails = appointments;
        this.filteredAppointmentDetails = [...this.appointmentDetails];
      },
      error: (err) => console.error('Error loading appointments:', err),
    });
  }

  filterAppointmentDetails(search: string): void {
    this.searchTerm = search.trim().toLowerCase();
    this.filteredAppointmentDetails = this.searchTerm
      ? this.appointmentDetails.filter((appointment) =>
          Object.values(appointment)
            .join(' ')
            .toLowerCase()
            .includes(this.searchTerm)
        )
      : [...this.appointmentDetails];
  }

  sortAppointmentDetails(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredAppointmentDetails.sort((a, b) => {
      const aValue = a[column as keyof AppointmentDetail] as string;
      const bValue = b[column as keyof AppointmentDetail] as string;

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  goToAppointmentDetails(id: number): void {
    this.router.navigate([`/appointments/${id}`]);
  }
}
