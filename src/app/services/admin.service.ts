import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private totalUsersCountSubject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalCount$: Observable<number> = this.totalUsersCountSubject$.asObservable();


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
  ) {
    this.isAdminAuthenticatedSubject.next(!!localStorage.getItem('adminToken'));
    this.isAdminAuthenticated$ =
      this.isAdminAuthenticatedSubject.asObservable();

    this.isAdminAuthenticated$.pipe(
      map((isAdmin) => {
        if (isAdmin) {
          this.getUsers2();
        }
      })
    ).subscribe();
  }

  public async loginUser(userData: { email: string; password: string }) {
    const observable$ = this.http.post('/api/admin/login', userData);
    const response: any = await firstValueFrom(observable$);
    
    window.localStorage.clear()

    localStorage.setItem('adminToken', response.token);

    this.isAdminAuthenticatedSubject.next(true);
    this.getUsers2();
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

    this.getUsers2();

    setTimeout(() => {
      this.router.navigateByUrl('/admin/dashboard');
    }, 2000);
  }

  public getUsers(page:number,limit:number) {
    return this.http.get(`/api/admin/getusers?page=${page}&limit=${limit}`)
  }

  public getUsers2() {
    this.http.get(`/api/admin/getusers`).subscribe((res: any) => {
      console.log(res);
      
      this.totalUsersCountSubject$.next(res.total);
      return this.usersSubject.next(res.users);
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

  public updateUsersSubject(updatedUser: any) {
    const currentUsers = this.usersSubject.getValue();
    const updatedUsers = currentUsers.map((user: any) => {
      if (user._id === updatedUser._id) {
        return { ...user, ...updatedUser };
      } else {
        return user;
      }
    });
    this.usersSubject.next(updatedUsers);
  }
}
export { IUser };
