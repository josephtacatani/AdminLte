import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'select2'; // Import Select2 jQuery plugin
import * as moment from 'moment';
declare var $: any;

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

  services = [
    'Exodontia',
    'Prosthodontics Treatment',
    'Oral Prophylaxis',
    'Orthodontic Treatment',
    'Oral Surgery',
    'Cosmetic Dentistry',
    'Restorative Treatment'
  ];

  selectedDentist: string = this.dentists[0];

  ngAfterViewInit(): void {
    ($('.select2') as any).select2();
    $('.select2').on('change', (event: any) => {
      this.onDentistChange(event.target.value);
    });

    $('#reservationdate').datetimepicker({
      format: 'L',
      defaultDate: new Date() // Set default date to today
    });

    $('#timepicker').datetimepicker({
      format: 'LT', // Localized Time format
      defaultDate: moment(),
      icons: {
        time: 'fa fa-clock',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-calendar-check',
        clear: 'fa fa-trash',
        close: 'fa fa-times'
      }
    });
  }

  onDentistChange(dentist: string): void {
    this.selectedDentist = dentist;
    console.log('Selected dentist:', this.selectedDentist);
  }
}
