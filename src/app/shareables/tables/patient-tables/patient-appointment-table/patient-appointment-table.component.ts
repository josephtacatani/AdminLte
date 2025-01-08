import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentDetail } from 'src/app/interfaces/patients.interface';
import { TableComponent } from 'src/app/my-components/tables/table/table.component';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';

@Component({
  selector: 'app-patient-appointment-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-appointment-table.component.html',
  styleUrls: ['./patient-appointment-table.component.scss']
})
export class PatientAppointmentTableComponent {
  pagetitle = 'Patients';
  sortColumn: string = 'date'; // Default sort column
  sortDirection: string = 'asc'; // Default sort direction

  appointmentDetails: AppointmentDetail[] = [
    { date: '2023-10-01', time: '10:00 AM', doctor: 'Dr. Jane Doe', status: 'Confirmed' },
    { date: '2023-10-02', time: '11:00 AM', doctor: 'Dr. Jane Doe', status: 'Pending' }
  ];

  filteredAppointmentDetails: AppointmentDetail[] = [...this.appointmentDetails];

  columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time', sortable: true },
    { key: 'doctor', label: 'Doctor', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  itemsPerPage = 10;
  searchTerm = '';
  currentPage = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sortAppointmentDetails(this.sortColumn);
  }

  filterAppointmentDetails(search: string): void {
    this.searchTerm = search.trim(); // Trim unnecessary spaces

    if (this.searchTerm === '') {
      // Reset to full list if the search box is cleared
      this.filteredAppointmentDetails = [...this.appointmentDetails];
    } else {
      // Filter dynamically based on search term
      this.filteredAppointmentDetails = this.appointmentDetails.filter((appointment) =>
        Object.values(appointment)
          .join(' ')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  sortAppointmentDetails(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filteredAppointmentDetails.sort((a, b) => {
      const valA = (a as any)[column]?.toString().toLowerCase() || ''; // Access dynamically
      const valB = (b as any)[column]?.toString().toLowerCase() || '';

      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }
}
