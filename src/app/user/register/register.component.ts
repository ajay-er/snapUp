import IUser from 'src/app/models/user.model';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { AdminService } from 'src/app/services/admin.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService, private adminAuth: AdminService) { }
  
  @Input() registrationMethod!: 'admin' | 'user'; 

  inSubmission = false;

  name = new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]);
  email = new FormControl<string | null>(null, [Validators.required, Validators.email]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(17),
    Validators.max(120),
  ]);
  password = new FormControl<string | null>(null, [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl<string | null>(null, [Validators.required]);
  phoneNumber = new FormControl<number | null>(null, [
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
  },[RegisterValidators.match('password','confirmPassword')]);

  async register() {
    this.showAlert = true;
    this.alertColor = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';

    this.inSubmission = true;

    try {
      if (this.registrationMethod === 'admin') {
        await this.adminAuth.createUser(this.registerForm.value as IUser);
      } else if (this.registrationMethod === 'user') {
        await this.auth.createUser(this.registerForm.value as IUser);
      }

    } catch (error: any) {
      console.error(error);

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
