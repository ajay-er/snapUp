import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import IUser from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private usersSubject: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>(
    []
  );
  public users$: Observable<IUser[]> = this.usersSubject.asObservable();

  private isAdminAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public isAdminAuthenticated$: Observable<boolean> =
    this.isAdminAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userSevice: AuthService
  ) {
    this.isAdminAuthenticatedSubject.next(!!localStorage.getItem('adminToken'));
    this.isAdminAuthenticated$ =
      this.isAdminAuthenticatedSubject.asObservable();
    this.getUsers();
  }

  public async loginUser(userData: { email: string; password: string }) {
    const observable$ = this.http.post('/api/admin/login', userData);
    const response: any = await firstValueFrom(observable$);
    localStorage.setItem('adminToken', response.token);

    if (this.userSevice.isAuthenticated$) {
      this.userSevice.logout();
    }

    this.isAdminAuthenticatedSubject.next(true);
    this.getUsers();
    this.router.navigateByUrl('/admin/dashboard');
  }

  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    localStorage.removeItem('adminToken');
    this.isAdminAuthenticatedSubject.next(false);
    this.router.navigateByUrl('/');
  }

  public async createUser(userData: any) {
    const observable$ = this.http.post('/api/auth/signup', userData);
    await firstValueFrom(observable$);

    userData.imageUrl = 'https://api.multiavatar.com/Binx Bond.png';

    // this.usersSubject.next([...this.usersSubject.value, userData]);

    this.getUsers();

    setTimeout(() => {
      this.router.navigateByUrl('/admin/dashboard');
    }, 2000);
  }

  public getUsers() {
    this.http.get('/api/admin/getusers').subscribe((res: any) => {
      this.usersSubject.next(res.users);
    });
  }

  public getUserData(id: any): Observable<any> {
    return this.http.get(`/api/admin/getuser/${id}`);
  }

  public updateUserData(userData: any): Observable<any> {
    return this.http.post(`/api/admin/updateuser`, userData);
  }

  public deleteUser(id: any): Observable<any> {
    return this.http.delete(`/api/admin/deleteuser/${id}`);
  }

  public updateUsersSubject(newUser: any) {
    const currentUsers = this.usersSubject.getValue();
    this.usersSubject.next([...currentUsers, newUser]);
  }
}
