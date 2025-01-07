import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PatientdashboardComponent } from './patientdashboard/patientdashboard.component';
import { AppointmentComponent } from './patientdashboard/appointment/appointment.component';
import { DefaultviewComponent } from './patientdashboard/defaultview/defaultview.component';
import { UserprofileComponent } from './patientdashboard/userprofile/userprofile.component';
import { DentistdashboardComponent } from './dentistdashboard/dentistdashboard.component';
import { PatientsComponent } from './dentistdashboard/patients/patients.component';
import { ScheduleComponent } from './dentistdashboard/schedule/schedule.component';
import { PrescriptionComponent } from './dentistdashboard/prescription/prescription.component';
import { TreatmentComponent } from './dentistdashboard/treatment/treatment.component';
import { ProfileComponent } from './dentistdashboard/profile/profile.component';
import { DefaultviewdentistComponent } from './dentistdashboard/defaultviewdentist/defaultviewdentist.component';
import { WalkinrequestComponent } from './dentistdashboard/walkinrequest/walkinrequest.component';
import { OnlinerequestComponent } from './dentistdashboard/onlinerequest/onlinerequest.component';
import { CalendarComponent } from './dentistdashboard/calendar/calendar.component';
import { PatientDetailsComponent } from './dentistdashboard/patients/patient-details/patient-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'patientdashboard',
    component: PatientdashboardComponent,
    children: [
      { path: '', component: DefaultviewComponent }, // Default view for /patientdashboard
      { path: 'appointment', component: AppointmentComponent }, // /patientdashboard/appointment
      { path: 'userprofile', component: UserprofileComponent }, // /patientdashboard/userprofile
    ],
  },

  {
    path: 'dentistdashboard',
    component: DentistdashboardComponent,
    children: [
      { path: '', component: DefaultviewdentistComponent},
      { path: 'patients', component: PatientsComponent ,},
      { path: 'patients/patient-details/:id', component: PatientDetailsComponent }, // Moved to the same level
      { path: 'schedule', component: ScheduleComponent},
      { path: 'walkinrequest', component: WalkinrequestComponent},
      { path: 'onlinerequest', component: OnlinerequestComponent},
      { path: 'calendar', component: CalendarComponent},
      { path: 'prescription', component: PrescriptionComponent},
      { path: 'treatment', component: TreatmentComponent},
      { path: 'dentistprofile', component: ProfileComponent }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Redirect invalid routes to login
];
