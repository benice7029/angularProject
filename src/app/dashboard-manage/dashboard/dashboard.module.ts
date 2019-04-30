import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from '../dashboard-page/dashboard-page.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardManagingComponent, DeleteDialog, DeleteAllDialog } from '../dashboard-managing/dashboard-managing.component';
import { DashboardSearchingComponent } from '../dashboard-searching/dashboard-searching.component';
import { TypeFilterPipe } from '../shared/customPipe/type-filter.pipe';
import { DynamicDashboardManageDirective } from '../shared/directives/dynamic-dashboard-manage.directive';
import { DashboardManagementComponent } from '../dashboard-management/dashboard-management.component';
import { CheckedPipePipe } from '../shared/customPipe/checked-pipe.pipe';
import { DashboardManageAddDialogComponent, SuccessComponent } from '../dashboard-manage-add-dialog/dashboard-manage-add-dialog.component';
import { DashboardManageDeleteDialogComponent } from '../dashboard-manage-delete-dialog/dashboard-manage-delete-dialog.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardFileComponent,
    DashboardFolderComponent,
    DashboardManagingComponent,
    DashboardSearchingComponent,
    TypeFilterPipe,
    CheckedPipePipe,
    DynamicDashboardManageDirective,
    DeleteDialog,
    DeleteAllDialog,
    DashboardManagementComponent,
    DashboardManageAddDialogComponent,
    DashboardManageDeleteDialogComponent,
    SuccessComponent
  ],
  providers:[TypeFilterPipe, CheckedPipePipe],
  exports: [
    DashboardPageComponent,
    TypeFilterPipe,
    CheckedPipePipe,
    DynamicDashboardManageDirective,
    SuccessComponent],
  entryComponents: [
    DashboardFolderComponent,
    DashboardFileComponent,
    DashboardManagingComponent,
    DashboardSearchingComponent,
    DeleteDialog,
    DeleteAllDialog,
    DashboardManagementComponent,
    DashboardManageAddDialogComponent,
    DashboardManageDeleteDialogComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DashboardModule { }
