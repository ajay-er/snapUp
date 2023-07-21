import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private http: HttpClient) {}

  inSubmission = false;

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(17),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
  ]);

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created.';
  alertColor = 'blue';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  });

  async register() {
    this.showAlert = true;
    this.alertColor = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';

    this.inSubmission = true;

    try {
      const observable$ = this.http.post(
        '/api/auth/signup',
        this.registerForm.value,
      );
      const responseData: any = await lastValueFrom(observable$);

      localStorage.setItem('authToken', responseData.token);
    } catch (error: any) {
      console.log(error);

      if (error.error?.message) {
        this.alertMsg = error.error.message;
        this.alertColor = 'red';
      } else {
        this.alertMsg = 'An unexpected Error occured.Please try again later!';
        this.alertColor = 'red';
      }

      this.inSubmission = false;
      return;
    }

    this.alertMsg = 'Success your account has been Created!';
    this.alertColor = 'green';
  }
}
