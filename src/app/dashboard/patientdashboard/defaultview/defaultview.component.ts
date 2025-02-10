import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-bs4';
import { map, Observable } from 'rxjs';
import { Patient } from 'src/app/interfaces/patient_details.interface';
import { select, Store } from '@ngrx/store';
import { selectError, selectPatients, selectSelectedPatient } from 'src/app/ngrx/patients/patients.reducers';
import { decodeAccessToken } from 'src/app/services/auth/auth.utils';
import { PatientsActions } from 'src/app/ngrx/patients/patients.actions';
import { AddAppointmentModalComponent } from 'src/app/my-components/modals/add-appointment-modal/add-appointment-modal.component';
import { Appointment, AppointmentDetail, DetailedAppointment } from 'src/app/interfaces/addappointment.interface';
import { selectAppointments, selectDetailedAppointments, selectSelectedAppointment, selectSelectedAppointmentPatient } from 'src/app/ngrx/appointment/addappointment.reducers';
import { AppointmentActions } from 'src/app/ngrx/appointment/addappointment.actions';
import { Dentist } from 'src/app/interfaces/dentist.interface';
import { Schedule, TimeSlot } from 'src/app/interfaces/schedule.interface';
import { selectSchedules, selectSelectedSchedule, selectSelectedTimeSlot, selectTimeSlots, selectTimeSlotsById } from 'src/app/ngrx/schedules/schedules.reducers';
import { selectDentists, selectSelectedDentist } from 'src/app/ngrx/dentist/dentist.reducers';
import { ConfirmModalComponent } from 'src/app/my-components/modals/confirm-modal/confirm-modal.component';

declare var $: any;

@Component({
  selector: 'app-defaultview',
  standalone: true,
  imports: [CommonModule, AddAppointmentModalComponent, ConfirmModalComponent],
  templateUrl: './defaultview.component.html',
  styleUrls: ['./defaultview.component.scss']
})
export class DefaultviewComponent implements AfterViewInit, OnInit {
  isAddAppointmentModalVisible: boolean = false;
  selectedAppointmentId: number | null = null;
  isCancelModalVisible = false;
  patient$!: Observable<Patient | null>;
  error$!: Observable<string | null>;
  patients$!: Observable<Patient[] | null>;
  appointments$!: Observable<Appointment | null>;
  schedule$: Observable<Schedule | null> = this.store.pipe(select(selectSelectedSchedule));
  dentist$: Observable<Dentist | null> = this.store.pipe(select(selectSelectedDentist));
  appointment$ = this.store.pipe(select(selectSelectedAppointment));
  timeslot$ = this.store.pipe(select(selectSelectedTimeSlot));
  appointmentsAll$: Observable<AppointmentDetail[] | null> = this.store.pipe(select(selectAppointments));
  detailedAppointments$: Observable<DetailedAppointment[] | null> = this.store.pipe(select(selectDetailedAppointments));

  constructor(private store: Store, private router: Router) {
    this.patient$ = this.store.pipe(select(selectSelectedPatient));
    this.patients$ = this.store.pipe(select(selectPatients));
    this.error$ = this.store.pipe(select(selectError));
    this.appointments$ = this.store.pipe(select(selectSelectedAppointmentPatient));

    
  }

    date$: Observable<string> = this.schedule$.pipe(
      map(schedule => schedule?.date || 'N/A')
    );
  
    dentistName$: Observable<string> = this.dentist$.pipe(
      map(dentist => dentist?.fullname || 'N/A')
    );


    timeslotStartTime$: Observable<string> = this.timeslot$.pipe(
      map(timeslot => timeslot?.start_time || 'N/A')
    );
    
    timeslotEndTime$: Observable<string> = this.timeslot$.pipe(
      map(timeslot => timeslot?.end_time || 'N/A')
    );

    latestAppointment$: Observable<DetailedAppointment | null> = this.detailedAppointments$.pipe(
      map(appointments =>
        appointments && appointments.length > 0
          ? [...appointments].sort((a, b) => b.appointment_id - a.appointment_id)[0] // Sort by appointmentId in descending order
          : null
      )
    );
    
    
    
    




  ngAfterViewInit(): void {
    // $('#example2').DataTable({
    //   responsive: true,
    //   autoWidth: false,
    //   paging: true,
    //   data: this.tableData,
    //   columns: [
    //     { data: 'date' },
    //     { data: 'time' },
    //     { data: 'doctor' },
    //     { data: 'status', render: (data: string) => {
    //       let badgeClass = 'badge-secondary';
    //       if (data === 'Confirmed') badgeClass = 'badge-success';
    //       else if (data === 'Pending') badgeClass = 'badge-warning';
    //       else if (data === 'Cancelled') badgeClass = 'badge-danger';
    //       return `<span class="badge ${badgeClass}">${data}</span>`;
    //     }}
    //   ],
    //   createdRow: (row: Node, data: any[] | Object, dataIndex: number) => {
    //     const statusCell = $('td', row).eq(3);
    //     const status = statusCell.text();
    //     let badgeClass = 'badge-secondary';
    //     if (status === 'Confirmed') badgeClass = 'badge-success';
    //     else if (status === 'Pending') badgeClass = 'badge-warning';
    //     else if (status === 'Cancelled') badgeClass = 'badge-danger';
    //     statusCell.html(`<span class="badge ${badgeClass}">${status}</span>`);
    //   }
    // });

    // $('#example3').DataTable({
    //   responsive: true,
    //   autoWidth: false,
    //   paging: true,
    //   data: this.prescriptionData,
    //   columns: [
    //     { data: 'doctorName' },
    //     { data: 'date' },
    //     { data: 'medicine' },
    //     { data: 'notes' }
    //   ]
    // });

    // $('#example4').DataTable({
    //   responsive: true,
    //   autoWidth: false,
    //   paging: true,
    //   data: this.treatmentData,
    //   columns: [
    //     { data: 'dateVisit' },
    //     { data: 'teethNos' },
    //     { data: 'treatment' },
    //     { data: 'description' },
    //     { data: 'fees' },
    //     { data: 'remarks' }
    //   ]
    // });
  }

  ngOnInit(): void {

    
    const userData = decodeAccessToken();
    if (userData?.id) {
      this.store.dispatch(PatientsActions.loadPatient({ id: userData.id })); // ✅ Fetch patient using ID from JWT
      this.store.dispatch(AppointmentActions.loadAllAppointmentsByPatientId({patient_id: userData.id}))
      this.store.dispatch(AppointmentActions.loadAppointmentByPatientId({id: userData.id }));
    } else {
      console.warn('No user ID found in token!');
    }


  }

  navigateToAppointment(): void {
    this.router.navigate(['/patientdashboard/appointment']);
  }

  cancelAppointment(): void {
    // this.appointmentData.status = 'cancelled';
  }

  openAddAppointmentModal(): void {
    this.isAddAppointmentModalVisible = true;
  }

  closeAddAppointmentModal(): void {
    this.isAddAppointmentModalVisible = false;
  }

  handleAddAppointment(){

  }



  openConfirmModal(): void {
    this.isCancelModalVisible = true;
  }

  /** ✅ Open the confirmation modal and store `appointmentId` */
  openCancelModal(appointmentId: number | null): void {
    if (appointmentId !== null) {
      this.selectedAppointmentId = appointmentId;
      this.isCancelModalVisible = true;
    }
  }

  /** ✅ Confirm cancellation and dispatch action */
  confirmCancelAppointment(): void {
    if (this.selectedAppointmentId !== null) {
      this.store.dispatch(AppointmentActions.cancelAppointment({ id: this.selectedAppointmentId }));
      this.isCancelModalVisible = false; // ✅ Close modal after action
      this.selectedAppointmentId = null; // ✅ Reset selection
    }
  }

  getServiceNames(appointment: DetailedAppointment): string {
    return appointment.services.map(service => service.service_name).join(', ');
  }
}
