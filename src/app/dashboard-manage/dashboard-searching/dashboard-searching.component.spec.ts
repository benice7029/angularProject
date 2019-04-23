import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSearchingComponent } from './dashboard-searching.component';

describe('DashboardSearchingComponent', () => {
  let component: DashboardSearchingComponent;
  let fixture: ComponentFixture<DashboardSearchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSearchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSearchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
