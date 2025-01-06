import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PatientdashboardComponent } from './patientdashboard/patientdashboard.component';
import { AppointmentComponent } from './patientdashboard/appointment/appointment.component';
import { DefaultviewComponent } from './patientdashboard/defaultview/defaultview.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'patientdashboard',
    component: PatientdashboardComponent,
    children: [
      { path: '', component: DefaultviewComponent },
      { path: 'appointment', component: AppointmentComponent }
    ]
  },
  { path: 'appointment', component: AppointmentComponent },
];
