import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
declare var $: any;
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  dummyData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    birthdate: '1990-01-01',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA'
  };

  appointmentData = {
    date: '2021-12-31',
    time: '09:00 AM',
    status: 'pending'
  };

  tableData = [
    { date: '2023-10-01', time: '10:00 AM', doctor: 'Dr. Jane Doe', status: 'Confirmed' },
    { date: '2023-10-02', time: '11:00 AM', doctor: 'Dr. Jane Doe', status: 'Pending' }
  ];

  prescriptionData = [
    { date: '2023-01-01', medicine: 'Medicine A', notes: 'Take twice daily' },
    { date: '2023-01-02', medicine: 'Medicine B', notes: 'Take once daily' }
  ];

  treatmentData = [
    {
      dateVisit: '2023-10-01',
      teethNos: '12, 14',
      treatment: 'Filling',
      description: 'Composite filling',
      fees: '$200',
      remarks: 'Follow-up in 6 months'
    },
    {
      dateVisit: '2023-10-15',
      teethNos: '22',
      treatment: 'Extraction',
      description: 'Tooth extraction',
      fees: '$150',
      remarks: 'Healing well'
    }
  ];

  dentalHistoryData = [
    { id: 1, previousDentist: 'Dr. John Smith', lastDentalVisit: '2022-12-01', action: 'View' },
    { id: 2, previousDentist: 'Dr. Jane Doe', lastDentalVisit: '2022-11-15', action: 'View' }
  ];

  medicalHistoryData = [
    { id: 1, allergies: 'Peanuts', illnesses: 'Asthma', action: 'View' },
    { id: 2, allergies: 'Penicillin', illnesses: 'Diabetes', action: 'View' }
  ];

  currentEditingId: number | null = null;
  currentEditingMedicalId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    $('#example2').DataTable({
      responsive: true,
      autoWidth: false,
      paging: true,
      data: this.tableData,
      columns: [
        { data: 'date' },
        { data: 'time' },
        { data: 'doctor' },
        { data: 'status', render: (data: string) => {
          let badgeClass = 'badge-secondary';
          if (data === 'Confirmed') badgeClass = 'badge-success';
          else if (data === 'Pending') badgeClass = 'badge-warning';
          else if (data === 'Cancelled') badgeClass = 'badge-danger';
          return `<span class="badge ${badgeClass}">${data}</span>`;
        }}
      ],
      createdRow: (row: Node, data: any[] | Object, dataIndex: number) => {
        const statusCell = $('td', row).eq(3);
        const status = statusCell.text();
        let badgeClass = 'badge-secondary';
        if (status === 'Confirmed') badgeClass = 'badge-success';
        else if (status === 'Pending') badgeClass = 'badge-warning';
        else if (status === 'Cancelled') badgeClass = 'badge-danger';
        statusCell.html(`<span class="badge ${badgeClass}">${status}</span>`);
      }
    });

    $('#example3').DataTable({
      responsive: true,
      autoWidth: false,
      paging: true,
      data: this.prescriptionData,
      columns: [
        { data: 'date' },
        { data: 'medicine' },
        { data: 'notes' }
      ]
    } as any); // Cast to any to bypass type checking

    $('#example4').DataTable({
      responsive: true,
      autoWidth: false,
      paging: true,
      data: this.treatmentData,
      columns: [
        { data: 'date' },
        { data: 'time' },
        { data: 'doctor' },
        { data: 'status', render: (data: string) => {
          let badgeClass = 'badge-secondary';
          if (data === 'Confirmed') badgeClass = 'badge-success';
          else if (data === 'Pending') badgeClass = 'badge-warning';
          else if (data === 'Cancelled') badgeClass = 'badge-danger';
          return `<span class="badge ${badgeClass}">${data}</span>`;
        }}
      ],
      createdRow: (row: Node, data: any[] | Object, dataIndex: number) => {
        const statusCell = $('td', row).eq(3);
        const status = statusCell.text();
        let badgeClass = 'badge-secondary';
        if (status === 'Confirmed') badgeClass = 'badge-success';
        else if (status === 'Pending') badgeClass = 'badge-warning';
        else if (status === 'Cancelled') badgeClass = 'badge-danger';
        statusCell.html(`<span class="badge ${badgeClass}">${status}</span>`);
      }
    } as any); // Cast to any to bypass type checking

    $('#dentalhistory').DataTable({
      responsive: true,
      autoWidth: false,
      paging: true,
      data: this.dentalHistoryData,
      columns: [
        { data: 'previousDentist' },
        { data: 'lastDentalVisit' },
        {
          data: null, // Render custom buttons
          render: (data: any, type: any, row: any) => {
            return `
              <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
            `;
          }
        }
      ]
    });

    $('#medicalhistory').DataTable({
      responsive: true,
      autoWidth: false,
      paging: true,
      data: this.medicalHistoryData,
      columns: [
        { data: 'allergies' },
        { data: 'illnesses' },
        {
          data: null, // Render custom buttons
          render: (data: any, type: any, row: any) => {
            return `
              <button class="btn btn-primary btn-sm edit-btn" data-id="${row.id}">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>
            `;
          }
        }
      ]
    });

    $('#example5').DataTable({
      responsive: true,
      autoWidth: false,
      paging: true,
      data: this.treatmentData,
      columns: [
        { data: 'dateVisit' },
        { data: 'teethNos' },
        { data: 'treatment' },
        { data: 'description' },
        { data: 'fees' },
        { data: 'remarks' }
      ]
    } as any); // Cast to any to bypass type checking

    // Handle edit button click
    $('#dentalhistory').on('click', '.edit-btn', (event: any) => {
      const id = $(event.target).data('id');
      console.log('Edit button clicked for ID:', id);
      this.editDentalHistory(id); // Replace with your actual function
    });

    // Handle delete button click
    $('#dentalhistory').on('click', '.delete-btn', (event: any) => {
      const id = $(event.target).data('id');
      console.log('Delete button clicked for ID:', id);
      this.deleteDentalHistory(id); // Replace with your actual function
    });

    // Handle edit button click for medical history
    $('#medicalhistory').on('click', '.edit-btn', (event: any) => {
      const id = $(event.target).data('id');
      console.log('Edit button clicked for ID:', id);
      this.editMedicalHistory(id); // Replace with your actual function
    });

    // Handle delete button click for medical history
    $('#medicalhistory').on('click', '.delete-btn', (event: any) => {
      const id = $(event.target).data('id');
      console.log('Delete button clicked for ID:', id);
      this.deleteMedicalHistory(id); // Replace with your actual function
    });
  }

  deleteDentalHistory(id: number): void {
    console.log('Deleting dental history for ID:', id);
    // Add your logic here
  }

  deleteMedicalHistory(id: number): void {
    console.log('Deleting medical history for ID:', id);
    // Add your logic here
  }

  navigateToAppointment(): void {
    this.router.navigate(['/patientdashboard/appointment']);
  }

  cancelAppointment(): void {
    this.appointmentData.status = 'cancelled';
  }

  editDentalHistory(id: number): void {
    this.currentEditingId = id;
    const row = this.dentalHistoryData.find((item) => item.id === id);
    if (row) {
      // Populate modal fields
      (document.getElementById('editPreviousDentist') as HTMLInputElement).value = row.previousDentist;
      (document.getElementById('editLastDentalVisit') as HTMLInputElement).value = row.lastDentalVisit;
  
      // Show the modal
      $('#editDentalHistoryModal').modal('show');
    }
  }

  saveDentalHistoryChanges(): void {
    const updatedPreviousDentist = (document.getElementById('editPreviousDentist') as HTMLInputElement).value;
    const updatedLastDentalVisit = (document.getElementById('editLastDentalVisit') as HTMLInputElement).value;
  
    if (this.currentEditingId !== null) {
      const index = this.dentalHistoryData.findIndex((item) => item.id === this.currentEditingId);
      if (index !== -1) {
        // Update the data
        this.dentalHistoryData[index] = {
          ...this.dentalHistoryData[index],
          previousDentist: updatedPreviousDentist,
          lastDentalVisit: updatedLastDentalVisit,
        };
      }
    }
  
    // Hide the modal
    $('#editDentalHistoryModal').modal('hide');
  }

  // Edit Medical History
  editMedicalHistory(id: number): void {
    this.currentEditingMedicalId = id;
    const row = this.medicalHistoryData.find((item) => item.id === id);
    if (row) {
      (document.getElementById('editAllergies') as HTMLInputElement).value = row.allergies;
      (document.getElementById('editIllnesses') as HTMLInputElement).value = row.illnesses;
      $('#editMedicalHistoryModal').modal('show');
    }
  }

  // Save Medical History Changes
  saveMedicalHistoryChanges(): void {
    const updatedAllergies = (document.getElementById('editAllergies') as HTMLInputElement).value;
    const updatedIllnesses = (document.getElementById('editIllnesses') as HTMLInputElement).value;

    if (this.currentEditingMedicalId !== null) {
      const index = this.medicalHistoryData.findIndex((item) => item.id === this.currentEditingMedicalId);
      if (index !== -1) {
        this.medicalHistoryData[index] = {
          ...this.medicalHistoryData[index],
          allergies: updatedAllergies,
          illnesses: updatedIllnesses
        };
      }
    }
    $('#editMedicalHistoryModal').modal('hide');
  }
}
