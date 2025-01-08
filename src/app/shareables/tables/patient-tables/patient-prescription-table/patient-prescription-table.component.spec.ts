import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPrescriptionTableComponent } from './patient-prescription-table.component';

describe('PatientPrescriptionTableComponent', () => {
  let component: PatientPrescriptionTableComponent;
  let fixture: ComponentFixture<PatientPrescriptionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PatientPrescriptionTableComponent]
    });
    fixture = TestBed.createComponent(PatientPrescriptionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
