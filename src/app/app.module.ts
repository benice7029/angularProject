import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ColorfulDirective } from './Directives/colorful.directive';
import { BeautyStyleDirective } from './Directives/beauty-style.directive';
import { SharedServiceService } from './services/shared-service.service';
import { AboutComponent } from './about/about.component';
import { DashboardPageComponent } from './dashboard-manage/dashboard-page/dashboard-page.component';
import { DashboardFileComponent } from './dashboard-manage/dashboard-file/dashboard-file.component';
import { DashboardFolderComponent } from './dashboard-manage/dashboard-folder/dashboard-folder.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ColorfulDirective,
    BeautyStyleDirective,
    AboutComponent,
    DashboardPageComponent,
    DashboardFileComponent,
    DashboardFolderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  entryComponents: [DashboardFolderComponent,DashboardFileComponent],
  providers: [SharedServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
