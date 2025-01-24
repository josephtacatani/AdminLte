import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAppointmentTableComponent } from './patient-appointment-table.component';

describe('PatientAppointmentTableComponent', () => {
  let component: PatientAppointmentTableComponent;
  let fixture: ComponentFixture<PatientAppointmentTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PatientAppointmentTableComponent]
    });
    fixture = TestBed.createComponent(PatientAppointmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
