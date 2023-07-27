import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import IUser from '../models/user.model';
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
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? of({} as RouteData))
      )
      .subscribe((data) => {
        this.redirect = data?.authOnly ?? false;
      });
  }

  public async createUser(userData: IUser) {
    const observable$ = this.http.post('/api/auth/signup', userData);
    const response: any = await firstValueFrom(observable$);

    this.setTokenToLocalStorage(response?.token);

    this.setCurrentUser({
      name: response.user.name,
      imageUrl: response.user.imageUrl,
    });

    this.isAuthenticatedSubject.next(true);
  }

  public async loginUser(userData: { email: string; password: string }) {
    const observable$ = this.http.post('/api/auth/login', userData);
    const response: any = await firstValueFrom(observable$);

    if (localStorage.getItem('adminToken')) {
      localStorage.removeItem('adminToken');
    }

    this.setTokenToLocalStorage(response?.token);

    this.setCurrentUser({
      name: response.user.name,
      imageUrl: response.user.imageUrl,
    });

    this.isAuthenticatedSubject.next(true);
  }

  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    this.isAuthenticatedSubject.next(false);

    this.setCurrentUser();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }

  public async updateProfile(selectedFile: File) {
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      const observable$ = this.http.put('/api/user/upload-profile', formData);
      const response: any = await firstValueFrom(observable$);

      if (response?.imageUrl) {
        localStorage.setItem('profileImage', response.imageUrl);
      }
    } catch (e) {
      console.log(e);
    }
  }

  //common functions
  private setTokenToLocalStorage(token: string) {
    localStorage.setItem('userToken', token);
  }

  //set current user
  setCurrentUser(data?: any) {
    if (!data) {
      this.clearLocalStorage();
      this.currentUser$.next(null);
      return;
    }
    localStorage.setItem('userName', data.name);
    localStorage.setItem('profileImage', data.imageUrl);
    this.currentUser$.next(data);
  }

  private clearLocalStorage() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('profileImage');
  }
}
