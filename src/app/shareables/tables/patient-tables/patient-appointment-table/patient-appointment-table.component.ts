import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectDetailedAppointments } from 'src/app/ngrx/appointment/addappointment.reducers';
import { AppointmentActions } from 'src/app/ngrx/appointment/addappointment.actions';
import { DetailedAppointment } from 'src/app/interfaces/addappointment.interface';

@Component({
  selector: 'app-patient-appointment-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-appointment-table.component.html',
  styleUrls: ['./patient-appointment-table.component.scss'],
})
export class PatientAppointmentTableComponent implements OnInit {
  pagetitle = 'Patient Appointments';

  // ✅ Fetch appointments from NgRx Store
  appointmentDetails$: Observable<DetailedAppointment[]> = this.store.pipe(
    select(selectDetailedAppointments)
  );

  // ✅ BehaviorSubject for search term
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  // ✅ BehaviorSubject for sorting
  private sortColumnSubject = new BehaviorSubject<string>('schedule_date');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  filteredAppointments$: Observable<DetailedAppointment[]>;

  errorMessage = '';
  isLoading = false;

  columns = [
    { key: 'schedule_date', label: 'Date', sortable: true },
    { key: 'timeslot_start_time', label: 'Start Time', sortable: true },
    { key: 'timeslot_end_time', label: 'End Time', sortable: true },
    { key: 'dentist_name', label: 'Dentist', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ];

  currentPage = 1;
  itemsPerPage = 10;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    // ✅ Combine Observables for filtering & sorting
    this.filteredAppointments$ = combineLatest([
      this.appointmentDetails$,
      this.searchTerm$,
      this.sortColumnSubject,
      this.sortDirectionSubject,
    ]).pipe(
      map(([appointments, searchTerm, sortColumn, sortDirection]) => {
        let filtered = appointments;
    
        // ✅ Filter appointments based on search
        if (searchTerm.trim()) {
          filtered = appointments.filter((appointment) =>
            Object.values(appointment)
              .join(' ')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }
    
        // ✅ Format the date before displaying it in the table
        filtered = filtered.map((appointment) => ({
          ...appointment,
          schedule_date: this.formatDate(appointment.schedule_date), // Format date
        }));
    
        // ✅ Sort filtered results
        return [...filtered].sort((a, b) => {
          const aValue = a[sortColumn as keyof DetailedAppointment] as string;
          const bValue = b[sortColumn as keyof DetailedAppointment] as string;
    
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
      })
    );
    
  }

  formatDate(dateString: string): string {
    if (!dateString) return ''; // Handle empty dates
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  getStatusClass(status: string): string {
    if (!status) return 'badge-secondary'; // Default when status is missing
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'badge-success'; // Green
      case 'pending':
        return 'badge-warning'; // Yellow
      case 'canceled':
        return 'badge-danger'; // Red
      default:
        return 'badge-secondary'; // Gray
    }
  }
  
  
  

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const patientId = Number(params.get('patientId'));
      if (patientId) {
        this.store.dispatch(AppointmentActions.loadAllAppointmentsByPatientId({ patient_id: patientId }));
      } else {
        this.errorMessage = 'Invalid patient ID.';
        console.error(this.errorMessage);
      }
    });
  }

  // ✅ Updates the search term for filtering
  filterAppointmentDetails(search: string): void {
    this.searchTermSubject.next(search.trim());
  }

  // ✅ Sorting function using BehaviorSubject
  sortAppointmentDetails(column: string): void {
    if (this.sortColumnSubject.getValue() === column) {
      this.sortDirectionSubject.next(this.sortDirectionSubject.getValue() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumnSubject.next(column);
      this.sortDirectionSubject.next('asc');
    }
  }


  // ✅ Navigate to appointment details
  goToAppointmentDetails(id: number): void {
    this.router.navigate([`/appointments/${id}`]);
  }

  get searchTerm(): string {
    return this.searchTermSubject.getValue(); // ✅ Retrieves the current search term
  }
  
}
