import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-defaultview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultviewComponent {
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
  }
  constructor(private router: Router) {}

  navigateToAppointment(): void {
    this.router.navigate(['/patientdashboard/appointment']);
  }

  cancelAppointment(): void {
    this.appointmentData.status = 'cancelled';
  }
}
