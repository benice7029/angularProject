import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFileComponent } from './dashboard-file.component';

describe('DashboardFileComponent', () => {
  let component: DashboardFileComponent;
  let fixture: ComponentFixture<DashboardFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
