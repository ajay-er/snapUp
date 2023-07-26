import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AdduserComponent } from './adduser/adduser.component';
import { AdminAuthGuard } from '../services/admin.guard';

const routes: Routes = [
  {
    path: 'admin/login',
    component: LoginComponent,
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate:[AdminAuthGuard]
  },
  {
    path: 'admin/edit/:id',
    component:UpdateUserComponent,
    canActivate:[AdminAuthGuard]
  },
  {
    path: 'admin/adduser',
    component:AdduserComponent,
    canActivate:[AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
