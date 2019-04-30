import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManageAddDialogComponent } from './dashboard-manage-add-dialog.component';

describe('DashboardManageAddDialogComponent', () => {
  let component: DashboardManageAddDialogComponent;
  let fixture: ComponentFixture<DashboardManageAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardManageAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManageAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
