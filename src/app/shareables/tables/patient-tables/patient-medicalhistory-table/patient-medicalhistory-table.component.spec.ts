import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalhistoryTableComponent } from './patient-medicalhistory-table.component';

describe('PatientMedicalhistoryTableComponent', () => {
  let component: PatientMedicalhistoryTableComponent;
  let fixture: ComponentFixture<PatientMedicalhistoryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PatientMedicalhistoryTableComponent]
    });
    fixture = TestBed.createComponent(PatientMedicalhistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
