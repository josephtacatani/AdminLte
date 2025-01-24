import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientTreatmentTableComponent } from './patient-treatment-table.component';

describe('PatientTreatmentTableComponent', () => {
  let component: PatientTreatmentTableComponent;
  let fixture: ComponentFixture<PatientTreatmentTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PatientTreatmentTableComponent]
    });
    fixture = TestBed.createComponent(PatientTreatmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
