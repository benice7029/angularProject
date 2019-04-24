import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DashboardPageComponent } from './dashboard-manage/dashboard-page/dashboard-page.component';
import { DASHBOARD_MANAGE_ROUTES } from './dashboard-manage/dashboard/dashboard-routing';

const routes: Routes = [
  ...DASHBOARD_MANAGE_ROUTES,
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
