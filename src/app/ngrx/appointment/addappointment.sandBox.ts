import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectAllAppointments, selectAppointments, selectError, selectIsLoading, selectMessage } from "./addappointment.reducers";
import { Appointment, AppointmentDetail } from "src/app/interfaces/addappointment.interface";
import { AppointmentActions } from "./addappointment.actions";
import { Patient } from "src/app/interfaces/patient_details.interface";
import { selectSelectedPatient } from "../patients/patients.reducers";
import { Dentist } from "src/app/interfaces/dentist.interface";
import { selectSelectedDentist } from "../dentist/dentist.reducers";
import { selectSelectedSchedule } from "../schedules/schedules.reducers";
import { Schedule } from "src/app/interfaces/schedule.interface";


@Injectable({
    providedIn: 'root'
})

export class AppointmentSandBox{

    $message: Observable<string | null> = this.store.pipe(select(selectMessage));
    $error: Observable<string | null> = this.store.pipe(select(selectError));
    $loading: Observable<boolean | null> = this.store.pipe(select(selectIsLoading));
    $appointments: Observable<AppointmentDetail[]> = this.store.pipe(select(selectAppointments));
    
    
    constructor(private readonly store: Store){
    }

    loadAllAppointments():void{
        this.store.dispatch(AppointmentActions.loadAppointments())
    }

    createAppointments(appointment: Partial<Appointment>):void{
        this.store.dispatch(AppointmentActions.createAppointment({appointment}))
    }

    updateAppointment(appointment: Appointment): void {
        if (!appointment.id) {
          console.error("Appointment ID is missing!");
          return;
        }
        this.store.dispatch(AppointmentActions.updateAppointment({ id: appointment.id, appointment }));
      }
      
      deleteAppointment(id: number): void {
        this.store.dispatch(AppointmentActions.deleteAppointment({ id }));
      }




}