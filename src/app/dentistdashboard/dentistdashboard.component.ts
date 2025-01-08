import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dentistdashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterModule, RouterOutlet],
  templateUrl: './dentistdashboard.component.html',
  styleUrls: ['./dentistdashboard.component.scss']
})
export class DentistdashboardComponent {
    constructor(private router: Router) {}
    
  user = {
    name: 'Dr. Jane Doe',
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