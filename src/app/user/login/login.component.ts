import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient) { }

  credentials = {
    email: '',
    password:''
  }

  async login() {
    try {
      
      const observable$ = this.http.post('/api/auth/login', this.credentials);
      const response = await firstValueFrom(observable$);
      console.log(response);
      
    } catch (error) {
      
    }
  }

}
