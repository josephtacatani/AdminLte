import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { environment } from 'src/environments/environment.prod';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { authFeatureKey, authReducer } from './auth/ngrx/login.reducers';
import { AuthEffects } from './auth/ngrx/login.effects';
import { profileFeatureKey, profileReducer } from './ngrx/user_profile/user_profile.reducers';
import { ProfileEffects } from './ngrx/user_profile/user_profile.effects';
import { patientsFeatureKey, patientsReducer } from './ngrx/patients/patients.reducers';
import { PatientsEffects } from './ngrx/patients/patients.effects';
import { dentistFeatureKey, dentistReducer } from './ngrx/dentist/dentist.reducers';
import { DentistEffects } from './ngrx/dentist/dentist.effects';
import { scheduleFeatureKey, scheduleReducer } from './ngrx/schedules/schedules.reducers';
import { ScheduleEffects } from './ngrx/schedules/schedules.effects';
import { appointmentFeatureKey, appointmentReducer } from './ngrx/appointment/addappointment.reducers';
import { AppointmentEffects } from './ngrx/appointment/addappointment.effects';
import { servicesFeatureKey, servicesReducer } from './ngrx/servicelist/servicelist.reducers';
import { ServicesEffects } from './ngrx/servicelist/servicelist.effects';
import { prescriptionsFeatureKey, prescriptionsReducer } from './ngrx/prescription/prescription.reducers';
import { PrescriptionsEffects } from './ngrx/prescription/prescription.effects';
import { treatmentFeatureKey, treatmentReducer } from './ngrx/treatments/treatments.reducers';
import { TreatmentEffects } from './ngrx/treatments/treatments.effects';
import { dentalHistoryFeatureKey, dentalHistoryReducer } from './ngrx/dental_history/dental_history.reducers';
import { DentalHistoryEffects } from './ngrx/dental_history/dental_history.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideStore({
      [authFeatureKey]: authReducer,
      [profileFeatureKey]: profileReducer,
      [patientsFeatureKey]: patientsReducer,
      [dentistFeatureKey]: dentistReducer,
      [scheduleFeatureKey]: scheduleReducer,
      [appointmentFeatureKey]: appointmentReducer,
      [servicesFeatureKey]: servicesReducer,
      [prescriptionsFeatureKey]: prescriptionsReducer,
      [treatmentFeatureKey]: treatmentReducer,
      [dentalHistoryFeatureKey]:dentalHistoryReducer
    }),
    provideEffects([
      AuthEffects, 
      ProfileEffects, 
      PatientsEffects, 
      DentistEffects,
      ScheduleEffects,
      AppointmentEffects,
      ServicesEffects,
      PrescriptionsEffects,
      TreatmentEffects,
      DentalHistoryEffects
    ]),  // <-- Ensure AuthEffects is provided
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production, // or !isDevMode()
    }),
  ]
};
