import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralModalComponent } from './general-modal.component';

describe('GeneralModalComponent', () => {
  let component: GeneralModalComponent;
  let fixture: ComponentFixture<GeneralModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GeneralModalComponent]
    });
    fixture = TestBed.createComponent(GeneralModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
