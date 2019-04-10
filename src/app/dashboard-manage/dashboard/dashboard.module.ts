import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from '../dashboard-page/dashboard-page.component';
import { DashboardFileComponent } from '../dashboard-file/dashboard-file.component';
import { DashboardFolderComponent } from '../dashboard-folder/dashboard-folder.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardFileComponent,
    DashboardFolderComponent
  ],
  exports: [DashboardPageComponent],
  entryComponents: [DashboardFolderComponent,DashboardFileComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DashboardModule { }
