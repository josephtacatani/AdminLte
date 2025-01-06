import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'select2'; // Import Select2 jQuery plugin

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements AfterViewInit {
  dentists = [
    'Dr. John Smith',
    'Dr. Jane Doe',
    'Dr. Emily Johnson',
    'Dr. Michael Brown',
    'Dr. Sarah Davis',
    'Dr. David Wilson',
    'Dr. Linda Martinez'
  ];

  selectedDentist: string = this.dentists[0];

  ngAfterViewInit(): void {
    ($('.select2') as any).select2();
    $('.select2').on('change', (event: any) => {
      this.onDentistChange(event.target.value);
    });
  }

  onDentistChange(dentist: string): void {
    this.selectedDentist = dentist;
    console.log('Selected dentist:', this.selectedDentist);
  }
}
