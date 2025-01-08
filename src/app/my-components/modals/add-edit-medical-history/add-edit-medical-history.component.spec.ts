import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMedicalHistoryComponent } from './add-edit-medical-history.component';

describe('AddEditMedicalHistoryComponent', () => {
  let component: AddEditMedicalHistoryComponent;
  let fixture: ComponentFixture<AddEditMedicalHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditMedicalHistoryComponent]
    });
    fixture = TestBed.createComponent(AddEditMedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
