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
import { Appointment } from 'src/app/interfaces/addappointment.interface';
import { selectSelectedAppointment, selectSelectedAppointmentPatient } from 'src/app/ngrx/appointment/addappointment.reducers';
import { AppointmentActions } from 'src/app/ngrx/appointment/addappointment.actions';
import { Dentist } from 'src/app/interfaces/dentist.interface';
import { Schedule, TimeSlot } from 'src/app/interfaces/schedule.interface';
import { selectSchedules, selectSelectedSchedule, selectTimeSlots, selectTimeSlotsById } from 'src/app/ngrx/schedules/schedules.reducers';
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
  timeslots$: Observable<TimeSlot[]> = this.store.pipe(select(selectTimeSlotsById));


  constructor(private store: Store, private router: Router) {
    this.patient$ = this.store.pipe(select(selectSelectedPatient));
    this.patients$ = this.store.pipe(select(selectPatients));
    this.error$ = this.store.pipe(select(selectError));
    this.appointments$ = this.store.pipe(select(selectSelectedAppointmentPatient));

    
  }

    // ✅ Extracting specific fields
    startTime$: Observable<string> = this.schedule$.pipe(
      map(schedule => schedule?.start_time || 'N/A')
    );

    date$: Observable<string> = this.schedule$.pipe(
      map(schedule => schedule?.date || 'N/A')
    );
  
    dentistName$: Observable<string> = this.dentist$.pipe(
      map(dentist => dentist?.fullname || 'N/A')
    );

    


  // tableData = [
  //   { date: '2023-10-01', time: '10:00 AM', doctor: 'Dr. John Smith', status: 'Confirmed' },
  //   { date: '2023-10-02', time: '11:00 AM', doctor: 'Dr. Jane Doe', status: 'Pending' },
  //   { date: '2023-10-03', time: '12:00 PM', doctor: 'Dr. Emily Johnson', status: 'Cancelled' },
  //   { date: '2023-10-04', time: '01:00 PM', doctor: 'Dr. Michael Brown', status: 'Confirmed' },
  //   { date: '2023-10-05', time: '02:00 PM', doctor: 'Dr. Sarah Davis', status: 'Pending' }
  // ];

  // prescriptionData = [
  //   { doctorName: 'Dr. John Smith', date: '2023-10-01', medicine: 'Medicine A', notes: 'Take twice daily' },
  //   { doctorName: 'Dr. Jane Doe', date: '2023-10-02', medicine: 'Medicine B', notes: 'Take once daily' },
  //   { doctorName: 'Dr. Emily Johnson', date: '2023-10-03', medicine: 'Medicine C', notes: 'Take after meals' },
  //   { doctorName: 'Dr. Michael Brown', date: '2023-10-04', medicine: 'Medicine D', notes: 'Take before bed' },
  //   { doctorName: 'Dr. Sarah Davis', date: '2023-10-05', medicine: 'Medicine E', notes: 'Take with water' }
  // ];

  // treatmentData = [
  //   { dateVisit: '2023-10-01', teethNos: '12, 13', treatment: 'Filling', description: 'Cavity filling', fees: '$100', remarks: 'N/A' },
  //   { dateVisit: '2023-10-02', teethNos: '14', treatment: 'Extraction', description: 'Tooth extraction', fees: '$150', remarks: 'N/A' },
  //   { dateVisit: '2023-10-03', teethNos: '15, 16', treatment: 'Cleaning', description: 'Teeth cleaning', fees: '$80', remarks: 'N/A' },
  //   { dateVisit: '2023-10-04', teethNos: '17', treatment: 'Root Canal', description: 'Root canal treatment', fees: '$200', remarks: 'N/A' },
  //   { dateVisit: '2023-10-05', teethNos: '18', treatment: 'Whitening', description: 'Teeth whitening', fees: '$120', remarks: 'N/A' }
  // ];



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
}
