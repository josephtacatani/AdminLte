import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from 'src/app/footer/footer.component';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/auth/ngrx/login.actions';

@Component({
  selector: 'app-patientdashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterOutlet, RouterModule],
  templateUrl: './patientdashboard.component.html',
  styleUrls: ['./patientdashboard.component.scss']
})
export class PatientdashboardComponent {

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

  constructor(private router: Router, private store: Store) {}

  logout() {
    // Remove modal backdrop manually
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  
    const refreshToken = localStorage.getItem('refreshToken');
  
    if (refreshToken) {
      // Dispatch logout action with refresh token
      this.store.dispatch(AuthActions.logout({ refreshToken }));
    } else {
      // If refreshToken is missing, still dispatch logout action
      this.store.dispatch(AuthActions.logout({ refreshToken: '' }));
    }
  
    this.router.navigate(['/login']);
  }


  

}
