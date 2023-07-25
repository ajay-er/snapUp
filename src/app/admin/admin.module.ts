import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AdduserComponent } from './adduser/adduser.component';
import { UserModule } from '../user/user.module';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    UpdateUserComponent,
    AdduserComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule,
    UserModule,
  ],
})
export class AdminModule {}
