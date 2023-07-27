import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'snapUp';

  constructor(public auth: AuthService, public adminAuth: AdminService) { }
  

}
