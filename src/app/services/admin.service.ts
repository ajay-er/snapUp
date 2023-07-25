import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private isAdminAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isAdminAuthenticated$: Observable<boolean> =
    this.isAdminAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient,private router:Router) {
    this.isAdminAuthenticated$ = this.isAdminAuthenticatedSubject.asObservable();
  }

  public async loginUser(userData: { email: string; password: string }) {
    const observable$ = this.http.post('/api/admin/login', userData);
    const response: any = await firstValueFrom(observable$);
    console.log(response);
    localStorage.setItem('authToken', response.token);
    this.isAdminAuthenticatedSubject.next(true);
    this.router.navigateByUrl('/admin/dashboard')
  }

  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    localStorage.removeItem('authToken');
    this.isAdminAuthenticatedSubject.next(false);
  }
}
