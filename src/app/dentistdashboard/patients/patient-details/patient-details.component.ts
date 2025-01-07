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
    { date: '2023-10-01', time: '10:00 AM', doctor: 'Dr. John Smith', status: 'Confirmed' },
    { date: '2023-10-02', time: '11:00 AM', doctor: 'Dr. Jane Doe', status: 'Pending' },
    { date: '2023-10-03', time: '12:00 PM', doctor: 'Dr. Emily Johnson', status: 'Cancelled' },
    { date: '2023-10-04', time: '01:00 PM', doctor: 'Dr. Michael Brown', status: 'Confirmed' },
    { date: '2023-10-05', time: '02:00 PM', doctor: 'Dr. Sarah Davis', status: 'Pending' }
  ];

  prescriptionData = [
    { doctorName: 'Dr. Smith', date: '2023-01-01', medicine: 'Medicine A', notes: 'Take twice daily' },
    { doctorName: 'Dr. Jones', date: '2023-01-02', medicine: 'Medicine B', notes: 'Take once daily' }
  ];

  treatmentData = [
    { date: '2023-01-01', time: '10:00 AM', doctor: 'Dr. Smith', status: 'Confirmed' },
    { date: '2023-01-02', time: '11:00 AM', doctor: 'Dr. Jones', status: 'Pending' }
  ];

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
        { data: 'doctorName' },
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
  }

  navigateToAppointment(): void {
    this.router.navigate(['/patientdashboard/appointment']);
  }

  cancelAppointment(): void {
    this.appointmentData.status = 'cancelled';
  }
}
