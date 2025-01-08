import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDentalhistoryTableComponent } from './patient-dentalhistory-table.component';

describe('PatientDentalhistoryTableComponent', () => {
  let component: PatientDentalhistoryTableComponent;
  let fixture: ComponentFixture<PatientDentalhistoryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PatientDentalhistoryTableComponent]
    });
    fixture = TestBed.createComponent(PatientDentalhistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
