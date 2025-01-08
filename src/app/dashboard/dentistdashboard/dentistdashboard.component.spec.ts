import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentistdashboardComponent } from './dentistdashboard.component';

describe('DentistdashboardComponent', () => {
  let component: DentistdashboardComponent;
  let fixture: ComponentFixture<DentistdashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DentistdashboardComponent]
    });
    fixture = TestBed.createComponent(DentistdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
