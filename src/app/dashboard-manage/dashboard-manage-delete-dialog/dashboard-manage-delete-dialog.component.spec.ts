import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManageDeleteDialogComponent } from './dashboard-manage-delete-dialog.component';

describe('DashboardManageDeleteDialogComponent', () => {
  let component: DashboardManageDeleteDialogComponent;
  let fixture: ComponentFixture<DashboardManageDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardManageDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManageDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
