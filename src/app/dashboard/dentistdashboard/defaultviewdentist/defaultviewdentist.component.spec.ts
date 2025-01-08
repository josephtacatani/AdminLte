import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultviewdentistComponent } from './defaultviewdentist.component';

describe('DefaultviewdentistComponent', () => {
  let component: DefaultviewdentistComponent;
  let fixture: ComponentFixture<DefaultviewdentistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DefaultviewdentistComponent]
    });
    fixture = TestBed.createComponent(DefaultviewdentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
