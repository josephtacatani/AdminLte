import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTableComponent } from './display-table.component';

describe('DisplayTableComponent', () => {
  let component: DisplayTableComponent;
  let fixture: ComponentFixture<DisplayTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisplayTableComponent]
    });
    fixture = TestBed.createComponent(DisplayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
