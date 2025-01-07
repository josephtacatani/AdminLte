import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs4';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements AfterViewInit {
  pagetitle = 'Schedule';

  schedules = [
    { day: 'January 12, 2025', startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' },
    { day: 'January 13, 2025', startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' },
    { day: 'January 14, 2025', startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' },
    { day: 'January 15, 2025', startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' },
    { day: 'January 16, 2025', startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' }
  ];

  ngAfterViewInit(): void {
    $(document).ready(() => {
      $('#schedule').DataTable({
        autoWidth: false,
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        data: this.schedules,
        columns: [
          { data: 'day' },
          { data: 'startTime' },
          { data: 'endTime' },
          { data: 'duration' }
        ]
      });
    });
  }

  addSchedule(): void {
    // Add your logic to add a new schedule
    console.log('Add Schedule button clicked');
  }
}
