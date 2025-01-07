import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinrequestComponent } from './walkinrequest.component';

describe('WalkinrequestComponent', () => {
  let component: WalkinrequestComponent;
  let fixture: ComponentFixture<WalkinrequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WalkinrequestComponent]
    });
    fixture = TestBed.createComponent(WalkinrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
