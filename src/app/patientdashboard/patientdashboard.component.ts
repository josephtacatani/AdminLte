import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-patientdashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterOutlet],
  templateUrl: './patientdashboard.component.html',
  styleUrls: ['./patientdashboard.component.scss']
})
export class PatientdashboardComponent {

  constructor(private router: Router) {}

  PatientInfoDummyData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    birthdate: '1990-01-01',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA'
  };

  
}
