import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManagingComponent } from './dashboard-managing.component';

describe('DashboardManagingComponent', () => {
  let component: DashboardManagingComponent;
  let fixture: ComponentFixture<DashboardManagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardManagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
