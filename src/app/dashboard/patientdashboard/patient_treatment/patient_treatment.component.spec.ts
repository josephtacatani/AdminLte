import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('TreatmentComponent', () => {
  let component: TreatmentComponent;
  let fixture: ComponentFixture<TreatmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TreatmentComponent]
    });
    fixture = TestBed.createComponent(TreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
