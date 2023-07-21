import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  credentials = {
    email: '',
    password: '',
  };

  showAlert = false;
  alertMsg = 'Please wait! processing.';
  alertColor = 'blue';
  inSubmission = false;

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! processing.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.loginUser(this.credentials);
    } catch (error: any) {
      this.inSubmission = false;

      if (error.error?.message) {
        this.alertMsg = error.error.message;
        this.alertColor = 'red';
      } else {
        this.alertMsg = 'An unexpected Error occured.Please try again later!';
        this.alertColor = 'red';
      }

      return;
    }

    this.alertMsg = 'Success. You are now logged In';
    this.alertColor = 'green';
  }
}
