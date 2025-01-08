import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from 'src/app/footer/footer.component';

@Component({
  selector: 'app-patientdashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterOutlet, RouterModule],
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

  user = {
    name: 'Taylor Swift',
    email: 'feliztoothdev@gmail.com',
  };

  logout() {
    // Remove modal backdrop manually
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    this.router.navigate(['/login']);
  }

  
}
