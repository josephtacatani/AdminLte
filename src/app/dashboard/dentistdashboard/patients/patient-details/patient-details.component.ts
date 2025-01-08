import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
declare var $: any;
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentData, AppointmentDetail,  DentalHistoryData, MedicalHistoryData, PatientData, PrescriptionData, TreatmentData } from 'src/app/interfaces/patients.interface';
import { PatientTreatmentTableComponent } from 'src/app/shareables/tables/patient-tables/patient-treatment-table/patient-treatment-table.component';
import { TableComponent } from 'src/app/my-components/tables/table/table.component';
import { PatientAppointmentTableComponent } from 'src/app/shareables/tables/patient-tables/patient-appointment-table/patient-appointment-table.component';
import { PatientPrescriptionTableComponent } from "../../../../shareables/tables/patient-tables/patient-prescription-table/patient-prescription-table.component";
import { AddEditDentalHistoryComponent } from 'src/app/my-components/modals/add-edit-dental-history/add-edit-dental-history.component';
import { PatientDentalhistoryTableComponent } from 'src/app/shareables/tables/patient-tables/patient-dentalhistory-table/patient-dentalhistory-table.component';
import { AddEditMedicalHistoryComponent } from 'src/app/my-components/modals/add-edit-medical-history/add-edit-medical-history.component';
import { PatientMedicalhistoryTableComponent } from 'src/app/shareables/tables/patient-tables/patient-medicalhistory-table/patient-medicalhistory-table.component';


@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, PatientAppointmentTableComponent,  PatientPrescriptionTableComponent, AddEditDentalHistoryComponent, PatientDentalhistoryTableComponent, AddEditMedicalHistoryComponent, PatientMedicalhistoryTableComponent, PatientTreatmentTableComponent],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  patientData: PatientData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    birthdate: '1990-01-01',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA'
  };


  currentEditingId: number | null = null;
  currentEditingMedicalId: number | null = null;
  isAddDentalHistoryModalVisible: boolean = false;
  isAddMedicalHistoryModalVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {


  }



  openAddDentalHistoryModal(): void {
    this.isAddDentalHistoryModalVisible = true;
  }

  openAddMedicalHistoryModal(): void {
    this.isAddMedicalHistoryModalVisible = true;
  }

  closeAddDentalHistoryModal(): void {
    this.isAddDentalHistoryModalVisible = false;
  }

  closeAddMedicalHistoryModal(): void {
    this.isAddMedicalHistoryModalVisible = false;
  }

  handleDentalHistorySubmit(dentalHistory: DentalHistoryData): void {
    // Handle the submitted dental history data
    console.log('Dental History Submitted:', dentalHistory);
    this.closeAddDentalHistoryModal();
  }

  handleMedicalHistorySubmit(medicalHistory: MedicalHistoryData): void {
    // Handle the submitted dental history data
    console.log('Dental History Submitted:', medicalHistory);
    this.closeAddDentalHistoryModal();
  }
}
