import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from '../dashboard-page/dashboard-page.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardManagingComponent } from '../dashboard-managing/dashboard-managing.component';
import { DashboardSearchingComponent } from '../dashboard-searching/dashboard-searching.component';
import { TypeFilterPipe } from '../shared/customPipe/type-filter.pipe';
import { DynamicDashboardManageDirective } from '../shared/directives/dynamic-dashboard-manage.directive';

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardFileComponent,
    DashboardFolderComponent,
    DashboardManagingComponent,
    DashboardSearchingComponent,TypeFilterPipe,DynamicDashboardManageDirective
  ],
  providers:[TypeFilterPipe],
  exports: [DashboardPageComponent,TypeFilterPipe,DynamicDashboardManageDirective],
  entryComponents: [
    DashboardFolderComponent,
    DashboardFileComponent,
    DashboardManagingComponent,
    DashboardSearchingComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DashboardModule { }
