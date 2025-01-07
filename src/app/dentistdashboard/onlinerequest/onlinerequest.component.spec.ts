import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinerequestComponent } from './onlinerequest.component';

describe('OnlinerequestComponent', () => {
  let component: OnlinerequestComponent;
  let fixture: ComponentFixture<OnlinerequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OnlinerequestComponent]
    });
    fixture = TestBed.createComponent(OnlinerequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
