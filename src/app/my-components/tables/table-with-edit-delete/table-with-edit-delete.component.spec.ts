import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWithEditDeleteComponent } from './table-with-edit-delete.component';

describe('TableWithEditDeleteComponent', () => {
  let component: TableWithEditDeleteComponent;
  let fixture: ComponentFixture<TableWithEditDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableWithEditDeleteComponent]
    });
    fixture = TestBed.createComponent(TableWithEditDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
