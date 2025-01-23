import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { tap, switchMap, distinctUntilChanged, map } from 'rxjs/operators';
import { Dentist } from 'src/app/interfaces/dentist.interface';
import { selectDentists } from 'src/app/ngrx/dentist/dentist.reducers';
import { DentistActions } from 'src/app/ngrx/dentist/dentist.actions';
import { selectSchedules, selectIsLoading, selectTimeSlots } from 'src/app/ngrx/schedules/schedules.reducers';
import { Schedule, TimeSlot } from 'src/app/interfaces/schedule.interface';
import { ScheduleActions } from 'src/app/ngrx/schedules/schedule.actions';
import { Appointment } from 'src/app/interfaces/addappointment.interface';
import { AppointmentActions } from 'src/app/ngrx/appointment/addappointment.actions';
import { selectSelectedPatient } from 'src/app/ngrx/patients/patients.reducers';
import { AlertComponent } from '../../alert/alert.component';
import { selectError, selectMessage } from 'src/app/ngrx/appointment/addappointment.reducers';

@Component({
  selector: 'app-add-appointment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, AlertComponent],
  templateUrl: './add-appointment-modal.component.html',
  styleUrls: ['./add-appointment-modal.component.scss'],
})
export class AddAppointmentModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Add Schedule';
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<any>();

  appointmentForm!: FormGroup;
  dentists$!: Observable<Dentist[]>;
  schedules$!: Observable<Schedule[]>; // ✅ Filtered schedules based on selected dentist
  isLoading$!: Observable<boolean>;
  timeSlots$!: Observable<TimeSlot[]>;
  message$!: Observable<string | null>;
  error$!: Observable<string | null>;

  services = [
    { id: 1, name: 'Exodontia' },
    { id: 2, name: 'Prosthodontics Treatment' },
    { id: 3, name: 'Oral Prophylaxis' },
    { id: 4, name: 'Orthodontic Treatment' },
    { id: 5, name: 'Oral Surgery' },
    { id: 6, name: 'Cosmetic Dentistry' },
    { id: 7, name: 'Restorative Treatment' },
  ];

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDentists();
    this.setupDentistSelection();
    this.setupScheduleSelection();

    this.message$ = this.store.pipe(select(selectMessage));
    this.error$ = this.store.pipe(select(selectError));
  }

  /** ✅ Initialize Form */
  private initForm(): void {
    this.appointmentForm = this.fb.group({
      patient_id: [{ value: '', disabled: true }, Validators.required],
      dentist_id: ['', Validators.required],
      schedule_id: ['', Validators.required], 
      time: ['', Validators.required],
      services: [[], Validators.required], 
    });

      // ✅ Automatically populate `patient_id` from store
  this.store.pipe(select(selectSelectedPatient)).subscribe((patient) => {
    if (patient) {
      this.appointmentForm.patchValue({ patient_id: patient.user_id });
    }
  });
  }

  /** ✅ Load Dentists from Store */
  private loadDentists(): void {
    this.dentists$ = this.store.pipe(select(selectDentists));
    this.store.dispatch(DentistActions.loadDentists());
  }

  /** ✅ Detect Dentist Selection & Fetch Available Dates */
  private setupDentistSelection(): void {
    this.schedules$ = this.appointmentForm.get('dentist_id')!.valueChanges.pipe(
      distinctUntilChanged(), // ✅ Prevents duplicate API calls
      tap(() => {
        this.appointmentForm.patchValue({ schedule_id: '', time: '' }); // ✅ Reset date and time when changing dentist
      }),
      tap((dentistId) => {
        if (dentistId) {
          this.store.dispatch(ScheduleActions.loadSchedulesByDentist({ dentistId }));
        }
      }),
      switchMap(() => this.store.pipe(select(selectSchedules))),
      map((schedules) =>
        schedules.map((schedule) => ({
          ...schedule,
          date: formatDate(schedule.date, 'yyyy-MM-dd', 'en-US'), // ✅ Format date
        }))
      )
    );
  
    this.isLoading$ = this.store.pipe(
      select(selectIsLoading),
      map((isLoading) => isLoading ?? false) // ✅ Convert null to false
    );
  }

  /** ✅ Detect Date Selection & Fetch Available Time Slots */
  private setupScheduleSelection(): void {
    this.timeSlots$ = this.appointmentForm.get('schedule_id')!.valueChanges.pipe(
      distinctUntilChanged(), // ✅ Prevents duplicate API calls
      tap(() => this.appointmentForm.patchValue({ time: '' })), // ✅ Reset time when changing date
      tap((scheduleId) => {
        if (scheduleId) {
          this.store.dispatch(ScheduleActions.loadTimeSlots({ scheduleId }));
        }
      }),
      switchMap(() => this.store.pipe(select(selectTimeSlots)))
    );
  }

  /** ✅ Close Modal */
  close(): void {
    this.isVisible = false;
    this.closeModal.emit();
    this.appointmentForm.reset(); // ✅ Resets the form fields when closing
  }

/** ✅ Submit Appointment */
submitAppointment(): void {
  if (this.appointmentForm.valid) {
    // ✅ Get the patient ID from the store
    this.store.pipe(select(selectSelectedPatient)).subscribe((patient) => {
      if (patient) {
        const formValue = this.appointmentForm.getRawValue(); // ✅ Includes disabled fields like `patient_id`

        // ✅ Prepare data for dispatch
        const appointment: Partial<Appointment> = {
          patient_id: patient.user_id, // ✅ Add `patient_id`
          dentist_id: formValue.dentist_id,
          schedule_id: formValue.schedule_id,
          timeslot_id: formValue.time, // Assuming 'time' is the timeslot_id
          status: 'pending', // Default status when creating an appointment
          appointment_type: 'online', // Adjust if necessary
        };

        const service_list_id: number[] = formValue.services;

        // ✅ Dispatch Action with `patient_id`
        this.store.dispatch(
          AppointmentActions.createAppointment({ appointment, service_list_id })
        );

        this.submitModal.emit(formValue);
        this.close();
      } else {
        console.warn('No patient data found in store!');
      }
    });
  }
}


}
