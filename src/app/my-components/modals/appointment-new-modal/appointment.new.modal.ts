import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Schedule, TimeSlot } from 'src/app/interfaces/schedule.interface';
import { distinctUntilChanged, map, Observable, switchMap, tap } from 'rxjs';
import { Dentist } from 'src/app/interfaces/dentist.interface';
import { Service } from 'src/app/interfaces/servicelist.interface';
import { selectPatients, selectSelectedPatient } from 'src/app/ngrx/patients/patients.reducers';
import { select, Store } from '@ngrx/store';
import { selectDentists, selectIsLoading } from 'src/app/ngrx/dentist/dentist.reducers';
import { DentistActions } from 'src/app/ngrx/dentist/dentist.actions';
import { selectServices } from 'src/app/ngrx/servicelist/servicelist.reducers';
import { ServicesActions } from 'src/app/ngrx/servicelist/servicelsit.actions';
import { ScheduleActions } from 'src/app/ngrx/schedules/schedule.actions';
import { selectSchedules, selectSchedulesByDentistId, selectTimeSlots } from 'src/app/ngrx/schedules/schedules.reducers';
import { Appointment } from 'src/app/interfaces/addappointment.interface';
import { AppointmentActions } from 'src/app/ngrx/appointment/addappointment.actions';
import { selectError, selectMessage } from 'src/app/ngrx/appointment/addappointment.reducers';
import { NgSelectModule } from '@ng-select/ng-select';
import { Patient } from 'src/app/interfaces/patient_details.interface';
import { PatientsActions } from 'src/app/ngrx/patients/patients.actions';

@Component({
  selector: 'app-appointment-new-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './appointment.new.modal.component.html',
  styleUrls: ['./appointment.new.modal.component.scss']
})
export class AppointmentNewModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Add Appointment';
  @Input() appointmentData: Appointment | null = null; // Data to populate the form for editing
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<Appointment>();

  appointmentForm!: FormGroup;
  dentists$!: Observable<Dentist[]>;
  patient$!: Observable<Patient[]>;
  schedules$!: Observable<Schedule[]>; // Filtered schedules based on selected dentist
  isLoading$!: Observable<boolean>;
  timeSlots$!: Observable<TimeSlot[]>;
  message$!: Observable<string | null>;
  error$!: Observable<string | null>;
  services$!: Observable<Service[]>; // Observable for services

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  appointmentTypeOptions = [
    { label: 'Online', value: 'online' },
    { label: 'Walk In', value: 'walk_in' },
  ];

  constructor(private readonly fb: FormBuilder, private readonly store: Store) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDentists();
    this.loadPatient();
    this.setupDentistSelection();
    this.setupScheduleSelection();
    this.loadServices(); // Load services from the store
    this.appointmentForm.reset(); // Reset the form when closing
    this.message$ = this.store.pipe(select(selectMessage));
    this.error$ = this.store.pipe(select(selectError));

    // If editing (appointmentData exists), populate the form
    if (this.appointmentData) {
      this.patchFormData(this.appointmentData);
    }
  }

  /**
   * When appointmentData changes (for example, when clicking "edit"),
   * update the form values accordingly.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentData'] && !changes['appointmentData'].firstChange) {
      if (this.appointmentData) {
        this.patchFormData(this.appointmentData);
      } else {
        this.appointmentForm.reset();
      }
    }
  }
  

  /**
   * Populate the form with appointment data.
   */
  private patchFormData(appointment: Appointment): void {
    this.appointmentForm.patchValue({
      patient_id: appointment.patient_id,
      dentist_id: appointment.dentist_id,
      schedule_id: appointment.schedule_id,
      timeslot_id: appointment.timeslot_id, // Use correct control name
      service_list_id: appointment.service_list_id ? [...appointment.service_list_id] : [],
      status: appointment.status,
      appointment_type: appointment.appointment_type
    });
  }

  /** Initialize Form */
  private initForm(): void {
    this.appointmentForm = this.fb.group({
      patient_id: [{ value: '', disabled: false }, Validators.required],
      dentist_id: ['', Validators.required],
      schedule_id: ['', Validators.required],
      timeslot_id: ['', Validators.required],
      service_list_id: [[], Validators.required],
      status: ['', Validators.required],
      appointment_type: ['', Validators.required]
    });

    // Automatically populate `patient_id` from the store
    this.store.pipe(select(selectSelectedPatient)).subscribe((patient) => {
      if (patient) {
        this.appointmentForm.patchValue({ patient_id: patient.user_id });
      }
    });
  }

  /** Load Dentists from Store */
  private loadDentists(): void {
    this.dentists$ = this.store.pipe(select(selectDentists));
    this.store.dispatch(DentistActions.loadDentists());
  }

  private loadPatient(): void {
    this.patient$ = this.store.pipe(select(selectPatients));
    this.store.dispatch(PatientsActions.loadPatients());
  }

  /** Load Services */
  private loadServices(): void {
    this.services$ = this.store.pipe(select(selectServices));
    this.store.dispatch(ServicesActions.loadServices()); // Fetch services on init
  }

  /** Detect Dentist Selection & Fetch Available Dates */
  private setupDentistSelection(): void {
    this.schedules$ = this.appointmentForm.get('dentist_id')!.valueChanges.pipe(
      distinctUntilChanged(), // Prevent duplicate API calls
      tap(() => {
        this.appointmentForm.patchValue({ schedule_id: '', timeslot_id: '' }); // Reset schedule and timeslot when changing dentist
      }),
      tap((dentistId) => {
        if (dentistId) {
          this.store.dispatch(ScheduleActions.loadSchedulesByDentist({ dentistId }));
        }
      }),
      switchMap(() => this.store.pipe(select(selectSchedulesByDentistId))),
      map((schedules) =>
        schedules.map((schedule) => ({
          ...schedule,
          date: formatDate(schedule.date, 'yyyy-MM-dd', 'en-US'), // Format date
        }))
      )
    );

    this.schedules$.subscribe(slots => console.log('Schedule:', slots));

    this.isLoading$ = this.store.pipe(
      select(selectIsLoading),
      map((isLoading) => isLoading ?? false) // Convert null to false
    );
  }

  /** Detect Schedule Selection & Fetch Available Time Slots */
  private setupScheduleSelection(): void {
    this.timeSlots$ = this.appointmentForm.get('schedule_id')!.valueChanges.pipe(
      distinctUntilChanged(), // Prevent duplicate API calls
      tap(() => this.appointmentForm.patchValue({ timeslot_id: '' })), // Reset timeslot when changing schedule
      tap((scheduleId) => {
        if (scheduleId) {
          this.store.dispatch(ScheduleActions.loadTimeSlots({ scheduleId }));
        }
      }),
      switchMap(() => this.store.pipe(select(selectTimeSlots)))
    );

    this.timeSlots$.subscribe(slots => console.log('Time Slots:', slots));
  }

  /** Close Modal */
  close(): void {
    this.isVisible = false;
    this.closeModal.emit();
    this.appointmentForm.reset(); // Reset the form fields when closing
  }

  /** Submit Appointment */
  submitAppointment(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.getRawValue();
      console.log("🔹 submitAppointment() called", formValue); // Debugging
      // Emit the form data to the parent component
      this.submitModal.emit(formValue);
      this.close();
    }
  }
}
