import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { DentistdashboardComponent } from './dashboard/dentistdashboard/dentistdashboard.component';
import { PatientsComponent } from './dashboard/dentistdashboard/patients/patients.component';
import { ScheduleComponent } from './dashboard/dentistdashboard/schedule/schedule.component';
import { PrescriptionComponent } from './dashboard/dentistdashboard/prescription/prescription.component';
import { TreatmentComponent } from './dashboard/dentistdashboard/treatment/treatment.component';
import { ProfileComponent } from './dashboard/dentistdashboard/profile/profile.component';
import { DefaultviewdentistComponent } from './dashboard/dentistdashboard/defaultviewdentist/defaultviewdentist.component';
import { WalkinrequestComponent } from './dashboard/dentistdashboard/walkinrequest/walkinrequest.component';
import { OnlinerequestComponent } from './dashboard/dentistdashboard/onlinerequest/onlinerequest.component';
import { CalendarComponent } from './dashboard/dentistdashboard/calendar/calendar.component';
import { PatientDetailsComponent } from './dashboard/dentistdashboard/patients/patient-details/patient-details.component';
import { PatientdashboardComponent } from './dashboard/patientdashboard/patientdashboard.component';
import { DefaultviewComponent } from './dashboard/patientdashboard/defaultview/defaultview.component';
import { AppointmentComponent } from './dashboard/patientdashboard/appointment/appointment.component';
import { UserprofileComponent } from './dashboard/patientdashboard/userprofile/userprofile.component';
import { AuthGuard } from './services/auth/auth.guard';
import { LoginGuard } from './services/auth/login.guard';
import { HealthDeclarationComponent } from './dashboard/patientdashboard/health_declaration/health_declaration.component';
import { PatientTreatmentComponent } from './dashboard/patientdashboard/patient_treatment/patient_treatment.component';



export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'register', component: RegisterComponent },

  {
    path: 'patientdashboard',
    component: PatientdashboardComponent,
    canActivate: [AuthGuard], // ✅ Protect patient dashboard
    children: [
      { path: '', component: DefaultviewComponent }, // Default view for /patientdashboard
      { path: 'appointment', component: AppointmentComponent },
      { path: 'userprofile', component: UserprofileComponent },
      { path: 'healthdeclaration', component: HealthDeclarationComponent },
      { path: 'treatment', component: PatientTreatmentComponent },
    ],
  },

  {
    path: 'dentistdashboard',
    component: DentistdashboardComponent,
    canActivate: [AuthGuard], // ✅ Protect dentist dashboard
    children: [
      { path: '', component: DefaultviewdentistComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'patients/patient-details/:patientId', component: PatientDetailsComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'walkinrequest', component: WalkinrequestComponent },
      { path: 'onlinerequest', component: OnlinerequestComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'prescription', component: PrescriptionComponent },
      { path: 'treatment', component: TreatmentComponent },
      { path: 'dentistprofile', component: ProfileComponent },
    ],
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Redirect invalid routes to login
];
