import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDentalHistoryComponent } from './add-edit-dental-history.component';

describe('AddEditDentalHistoryComponent', () => {
  let component: AddEditDentalHistoryComponent;
  let fixture: ComponentFixture<AddEditDentalHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEditDentalHistoryComponent]
    });
    fixture = TestBed.createComponent(AddEditDentalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
