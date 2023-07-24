import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import IUser from '../models/user.model';
import jwt_decode from 'jwt-decode';
import { Observable, BehaviorSubject, firstValueFrom, delay, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

interface ICurrentUser {
  id: string;
  name: string;
}

interface RouteData {
  authOnly?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();
  public isAuthenticatedWithDelay$: Observable<boolean>;

  public redirect = false;

  currentUser$ = new BehaviorSubject<ICurrentUser | null | undefined>(
    undefined
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.checkTokenExpiration();
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({} as RouteData))
      )
      .subscribe(data => {
        this.redirect = data?.authOnly ?? false;
      });
  }

  public async createUser(userData: IUser) {
    const observable$ = this.http.post('/api/auth/signup', userData);
    const response: any = await firstValueFrom(observable$);

    this.setTokenToLocalStorage(response?.token);

    this.setCurrentUser({ id: response.user._id, name: response.user.name });

    this.isAuthenticatedSubject.next(true);
    this.checkTokenExpiration();
  }

  public async loginUser(userData: { email: string; password: string }) {
    const observable$ = this.http.post('/api/auth/login', userData);
    const response: any = await firstValueFrom(observable$);
    this.setTokenToLocalStorage(response?.token);

    this.setCurrentUser({ id: response.user._id, name: response.user.name });

    this.isAuthenticatedSubject.next(true);
    this.checkTokenExpiration();
  }

  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);

    this.setCurrentUser();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }

  public async updateProfile(formdata: FormData) {
    try {
      const observable$ = this.http.put('/api/user/upload-profile', formdata);
      const response: any = await firstValueFrom(observable$);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  //common functions
  private checkTokenExpiration() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      this.isAuthenticatedSubject.next(false);
      return;
    }

    const decodedToken: any = jwt_decode(authToken);
    const tokenExpiration = decodedToken.exp;

    if (Date.now() >= tokenExpiration * 1000) {
      this.logout();
    } else {
      this.isAuthenticatedSubject.next(true);
    }
  }

  private setTokenToLocalStorage(token: string) {
    localStorage.setItem('authToken', token);
  }

  public isLoggedIn() {
    return !!localStorage.getItem('authToken');
  }

  //set current user
  setCurrentUser(data?: ICurrentUser) {
    if (data) {
      localStorage.setItem('currentUser', data.name);
    }

    if (localStorage.getItem('authToken')) {
      this.currentUser$.next(data);
    } else {
      this.currentUser$.next(null);
    }
  }
}
