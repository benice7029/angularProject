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
import { DashboardModule } from './dashboard-manage/dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ColorfulDirective,
    BeautyStyleDirective,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DashboardModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [SharedServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
