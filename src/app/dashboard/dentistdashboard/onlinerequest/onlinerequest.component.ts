import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { ConfirmModalComponent } from 'src/app/my-components/modals/confirm-modal/confirm-modal.component';
import { AppointmentSandBox } from 'src/app/ngrx/appointment/addappointment.sandBox';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment, AppointmentDetail } from 'src/app/interfaces/addappointment.interface';
import { AlertComponent } from 'src/app/my-components/alert/alert.component';
import { AppointmentNewModalComponent } from "../../../my-components/modals/appointment-new-modal/appointment.new.modal";
import { selectAppointments } from 'src/app/ngrx/appointment/addappointment.reducers';
import { Service } from 'src/app/interfaces/servicelist.interface';

@Component({
  selector: 'app-onlinerequest',
  standalone: true,
  imports: [CommonModule, TableWithEditDeleteComponent, ConfirmModalComponent, AlertComponent, AppointmentNewModalComponent],
  templateUrl: './onlinerequest.component.html',
  styleUrls: ['./onlinerequest.component.scss']
})
export class OnlinerequestComponent implements OnInit {
  pagetitle: string = 'Online Request';
  isAddAppointmentModalVisible = false;
  isEditAppointmentModalVisible = false;
  isConfirmModalVisible = false;
  confirmModalMessage = 'Are you sure you want to delete this appointment?';

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  private sortColumnSubject = new BehaviorSubject<string>('date');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  $appointments: Observable<AppointmentDetail[]> = this.sandbox.$appointments;
  $message: Observable<string | null> = this.sandbox.$message;
  $error: Observable<string | null> = this.sandbox.$error;
  $loading: Observable<boolean | null> = this.sandbox.$loading;

  itemsPerPage = 10;
  currentPage = 1;
  selectedAppointment: Appointment | null = null;
  dentistId!: number | null;

  constructor(private readonly sandbox: AppointmentSandBox) {}

  columns = [
    { key: 'patient.fullname', label: 'Patient', sortable: true },
    { key: 'dentist.fullname', label: 'Dentist', sortable: true },
    { key: 'services', label: 'Service Availed', sortable: true },
    { key: 'timeslot.start_time', label: 'Start Time', sortable: true },
    { key: 'timeslot.end_time', label: 'End Time', sortable: true },
    { key: 'appointment_type', label: 'Appointment Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'action', label: 'Action', sortable: false },
  ];

  ngOnInit(): void {
    this.sandbox.loadAllAppointments();
    this.$appointments.subscribe(appointments => {
      console.log('Appointments:', appointments);
    });
  }

  filterAppointment(search: string): void {
    this.searchTermSubject.next(search.trim());
  }

  sortAppointment(column: string): void {
    if (this.sortColumnSubject.getValue() === column) {
      this.sortDirectionSubject.next(this.sortDirectionSubject.getValue() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumnSubject.next(column);
      this.sortDirectionSubject.next('asc');
    }
  }

  /** ✅ Handles clicking Edit or Delete */
  handleActionClick(event: { action: string; row: Appointment }): void {
    const { action, row } = event;
    

  
    if (action === 'edit') {
      this.handleEditAppointment(row);
    } else if (action === 'delete') {
      this.selectedAppointment = row;
      this.isConfirmModalVisible = true;

    }
  }
  

  /** ✅ Open Edit Modal and Patch Data */
  handleEditAppointment(appointment: any): void {
    if (!appointment.id) {
      console.error("🚨 Appointment ID is missing. Cannot edit.");
      return;
    }
  
    // ✅ Remap values
    const mappedAppointment = {
      id: appointment.id,
      status: appointment.status,
      appointment_type: appointment.appointment_type,
      patient_id: appointment.patient?.id || '',  // Default to 1 if undefined
      dentist_id: appointment.dentist?.id || '',
      schedule_id: appointment.schedule?.id || '',
      timeslot_id: appointment.timeslot?.id || '',
      service_list_id: appointment.services ? appointment.services.map((s: Service) => s.id) : [],

    };
  
    console.log("🔹 Remapped Appointment Data:", mappedAppointment); // Debugging
  
    // ✅ Send remapped data to modal
    this.selectedAppointment = mappedAppointment;
    this.isEditAppointmentModalVisible = true;
  }

  /** ✅ Handle Confirm Delete */
  handleDeleteAppointment(): void {
    if (!this.selectedAppointment || !this.selectedAppointment.id) {
      console.error("🚨 No appointment selected for deletion.");
      return;
    }

    this.sandbox.deleteAppointment(this.selectedAppointment.id);
    console.log("🗑️ Deleted appointment ID:", this.selectedAppointment.id);

    this.isConfirmModalVisible = false;
    this.selectedAppointment = null;
  }

  /** ✅ Handles new appointment creation */
  handleAddAppointment(appointment: Appointment): void {
    console.log("📌 Creating Appointment:", appointment);
  
    if (!appointment || !appointment.dentist_id) {
      console.error("🚨 Invalid appointment data.");
      return;
    }

    this.sandbox.createAppointments(appointment);
    console.log("✅ Dispatched createAppointments action");
  
    this.closeAppointmentModal();
  }

  /** ✅ Handles updating appointment */
  handleUpdateAppointment(appointment: Appointment): void {
    console.log("✏️ Updating Appointment:", appointment);
  
    if (!appointment || !appointment.id) {

      return;
    }

    this.sandbox.updateAppointment(appointment);
    console.log("✅ Dispatched updateAppointment action");
  
    this.closeAppointmentModal();
  }

  /** ✅ Open Add Appointment Modal */
  openAddAppointmentModal() {
    this.isAddAppointmentModalVisible = true;
    this.selectedAppointment = null; // Reset selection
  }

  /** ✅ Close Modals */
  closeAppointmentModal() {
    this.isAddAppointmentModalVisible = false;
    this.isEditAppointmentModalVisible = false;
    this.isConfirmModalVisible = false;
    this.selectedAppointment = null;
  }

  /** ✅ Confirm Delete Appointment */
  confirmDelete() {
    this.handleDeleteAppointment();
  }

  get searchTerm(): string {
    return this.searchTermSubject.getValue();
  }
}
