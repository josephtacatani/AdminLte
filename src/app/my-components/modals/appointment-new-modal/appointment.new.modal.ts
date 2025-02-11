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
  loadSchedules$!: Observable<Schedule[]>;
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
    this.loadSchedules();
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
    if (changes['appointmentData'] && changes['appointmentData'].currentValue) {
      const appointment = this.appointmentData!;
      console.log("🛠️ Editing Appointment - Received Data:", appointment);
  
      // ✅ Populate Form Fields
      this.patchFormData(appointment);
  
      // ✅ Automatically Fetch Schedules Based on Existing Dentist ID (Override Default)
      if (appointment.dentist_id) {
        console.log("📅 Fetching schedules for dentist:", appointment.dentist_id);
        this.store.dispatch(ScheduleActions.loadSchedulesByDentist({ dentistId: appointment.dentist_id }));
      }
  
      // ✅ Automatically Fetch Time Slots Based on Existing Schedule ID (Override Default)
      if (appointment.schedule_id) {
        console.log("⏳ Fetching time slots for schedule:", appointment.schedule_id);
        this.store.dispatch(ScheduleActions.loadTimeSlots({ scheduleId: appointment.schedule_id }));
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

  private loadSchedules():void{
    this.loadSchedules$ = this.store.pipe(select(selectSchedules));
    this.store.dispatch(ScheduleActions.loadSchedules());
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
      distinctUntilChanged(),
      tap((dentistId) => {
        console.log("🦷 Selected Dentist ID:", dentistId);
  
        // ✅ If editing, ignore unless user manually changes the dentist
        if (this.appointmentData && dentistId === this.appointmentData.dentist_id) {
          console.log("✅ Editing: Using existing schedule, skipping API call.");
          return;
        }
  
        // ✅ Reset schedule and time slot
        this.appointmentForm.patchValue({ schedule_id: '', timeslot_id: '' });
  
        // ✅ Fetch schedules for new dentist selection
        if (dentistId) {
          this.store.dispatch(ScheduleActions.loadSchedulesByDentist({ dentistId }));
        }
      }),
      switchMap(() => this.store.pipe(select(selectSchedulesByDentistId)))
    );
  
    this.schedules$.subscribe(schedules => console.log("📅 Loaded Schedules:", schedules));
  }
  
  
  /** Detect Schedule Selection & Fetch Available Time Slots */
  private setupScheduleSelection(): void {
    this.timeSlots$ = this.appointmentForm.get('schedule_id')!.valueChanges.pipe(
      distinctUntilChanged(),
      tap((scheduleId) => {
        console.log("📅 Selected Schedule ID:", scheduleId);
  
        // ✅ If editing, ignore unless user manually changes the schedule
        if (this.appointmentData && scheduleId === this.appointmentData.schedule_id) {
          console.log("✅ Editing: Using existing time slot, skipping API call.");
          return;
        }
  
        // ✅ Reset time slot
        this.appointmentForm.patchValue({ timeslot_id: '' });
  
        // ✅ Fetch time slots for new schedule selection
        if (scheduleId) {
          this.store.dispatch(ScheduleActions.loadTimeSlots({ scheduleId }));
        }
      }),
      switchMap(() => this.store.pipe(select(selectTimeSlots)))
    );
  
    this.timeSlots$.subscribe(timeSlots => console.log("⏳ Loaded Time Slots:", timeSlots));
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
