import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements AfterViewInit {
  pagetitle = 'Patients';

  patients = [
    {
      id: 101, // Dummy ID for Patient 1
      photo: 'assets/img/patient1.jpg',
      name: 'John Doe',
      birthday: '1990-01-01',
      gender: 'Male',
      contact: '123-456-7890',
      email: 'john.doe@example.com'
    },
    {
      id: 102, // Dummy ID for Patient 2
      photo: 'assets/img/patient2.jpg',
      name: 'Jane Smith',
      birthday: '1985-05-15',
      gender: 'Female',
      contact: '987-654-3210',
      email: 'jane.smith@example.com'
    }
  ];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    $(document).ready(() => {
      const table = $('#patientlist').DataTable({
        autoWidth: false,
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        data: this.patients,
        columns: [
          { data: 'photo', render: (data: any) => `<img src="${data}" class="img-thumbnail" width="50">` },
          { data: 'name' },
          { data: 'birthday' },
          { data: 'gender' },
          { data: 'contact' },
          { data: 'email' },
          {
            data: null,
            render: (data: any, type: any, row: any) => {
              // Attach dummy ID to the button
              return `
                <button class="btn btn-info btn-sm view-patient" data-id="${row.id}">
                  <i class="fas fa-eye"></i> View
                </button>`;
            }
          }
        ]
      });

      // Handle click event for the "View" button
      $('#patientlist').on('click', '.view-patient', (event: any) => {
        const patientId = $(event.currentTarget).data('id'); // Get dummy ID
        this.navigateToPatientDetails(patientId);
      });
    });
  }

  // Navigate to the Patient Details component
  navigateToPatientDetails(patientId: number): void {
    console.log('Navigating to patient with ID:', patientId);
    this.router.navigate([`/dentistdashboard/patients/patient-details`, patientId]);
  }
}
