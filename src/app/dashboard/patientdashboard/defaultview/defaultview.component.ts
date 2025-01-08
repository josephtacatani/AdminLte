import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-bs4';
declare var $: any;

@Component({
  selector: 'app-defaultview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultviewComponent implements AfterViewInit {
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
    { date: '2023-10-01', time: '10:00 AM', doctor: 'Dr. John Smith', status: 'Confirmed' },
    { date: '2023-10-02', time: '11:00 AM', doctor: 'Dr. Jane Doe', status: 'Pending' },
    { date: '2023-10-03', time: '12:00 PM', doctor: 'Dr. Emily Johnson', status: 'Cancelled' },
    { date: '2023-10-04', time: '01:00 PM', doctor: 'Dr. Michael Brown', status: 'Confirmed' },
    { date: '2023-10-05', time: '02:00 PM', doctor: 'Dr. Sarah Davis', status: 'Pending' }
  ];

  prescriptionData = [
    { doctorName: 'Dr. John Smith', date: '2023-10-01', medicine: 'Medicine A', notes: 'Take twice daily' },
    { doctorName: 'Dr. Jane Doe', date: '2023-10-02', medicine: 'Medicine B', notes: 'Take once daily' },
    { doctorName: 'Dr. Emily Johnson', date: '2023-10-03', medicine: 'Medicine C', notes: 'Take after meals' },
    { doctorName: 'Dr. Michael Brown', date: '2023-10-04', medicine: 'Medicine D', notes: 'Take before bed' },
    { doctorName: 'Dr. Sarah Davis', date: '2023-10-05', medicine: 'Medicine E', notes: 'Take with water' }
  ];

  treatmentData = [
    { dateVisit: '2023-10-01', teethNos: '12, 13', treatment: 'Filling', description: 'Cavity filling', fees: '$100', remarks: 'N/A' },
    { dateVisit: '2023-10-02', teethNos: '14', treatment: 'Extraction', description: 'Tooth extraction', fees: '$150', remarks: 'N/A' },
    { dateVisit: '2023-10-03', teethNos: '15, 16', treatment: 'Cleaning', description: 'Teeth cleaning', fees: '$80', remarks: 'N/A' },
    { dateVisit: '2023-10-04', teethNos: '17', treatment: 'Root Canal', description: 'Root canal treatment', fees: '$200', remarks: 'N/A' },
    { dateVisit: '2023-10-05', teethNos: '18', treatment: 'Whitening', description: 'Teeth whitening', fees: '$120', remarks: 'N/A' }
  ];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
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
        { data: 'doctorName' },
        { data: 'date' },
        { data: 'medicine' },
        { data: 'notes' }
      ]
    });

    $('#example4').DataTable({
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
    });
  }

  navigateToAppointment(): void {
    this.router.navigate(['/patientdashboard/appointment']);
  }

  cancelAppointment(): void {
    this.appointmentData.status = 'cancelled';
  }
}
