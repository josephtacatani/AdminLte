import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { selectDentists } from 'src/app/ngrx/dentist/dentist.reducers';
import { DentistActions } from 'src/app/ngrx/dentist/dentist.actions';
import { Dentist } from 'src/app/interfaces/dentist.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule], // ✅ Added FormsModule
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  dentists$!: Observable<Dentist[]>;

  services = [
    { id: 1, name: 'Exodontia' },
    { id: 2, name: 'Prosthodontics Treatment' },
    { id: 3, name: 'Oral Prophylaxis' },
    { id: 4, name: 'Orthodontic Treatment' },
    { id: 5, name: 'Oral Surgery' },
    { id: 6, name: 'Cosmetic Dentistry' },
    { id: 7, name: 'Restorative Treatment' }
  ];

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.dentists$ = this.store.pipe(select(selectDentists));
    this.store.dispatch(DentistActions.loadDentists());

    // ✅ Initialize Parent Form that holds both Appointment and Health Declaration Forms
    this.appointmentForm = this.fb.group({
      appointmentForm: this.fb.group({
        dentist_id: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
        services: [[], Validators.required], // ✅ Multi-select
        fever: ['', Validators.required],
        breathing: ['', Validators.required],
        cough: ['', Validators.required],
        nose: ['', Validators.required],
        smell: ['', Validators.required],
        throat: ['', Validators.required],
        diarrhea: ['', Validators.required],
        influenza: ['', Validators.required],
        history_covid: ['', Validators.required],
        family_positive: ['', Validators.required],
        contact_positive: ['', Validators.required],
        local_transmission: ['', Validators.required],
        travel_ph: ['', Validators.required],
        travel_outside_ph: ['', Validators.required]
      })
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      console.log('Submitting Appointment and Health Declaration:', this.appointmentForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
