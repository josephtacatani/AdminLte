import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultviewComponent } from './defaultview.component';

describe('DefaultviewComponent', () => {
  let component: DefaultviewComponent;
  let fixture: ComponentFixture<DefaultviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DefaultviewComponent]
    });
    fixture = TestBed.createComponent(DefaultviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
