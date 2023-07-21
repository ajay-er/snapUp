import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject, firstValueFrom } from 'rxjs';
import IUser from '../models/user.model';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.checkTokenExpiration()
  }


  public async createUser(userData: IUser) {
    const observable$ = this.http.post('/api/auth/signup', userData);
    const responseData: any = await firstValueFrom(observable$);

    this.setTokenToLocalStorage(responseData?.token);

    this.isAuthenticatedSubject.next(true);
    this.checkTokenExpiration();
  }

  public async loginUser(userData:{email:string,password:string}) {

    const observable$ = this.http.post('/api/auth/login', userData);
    const response: any = await firstValueFrom(observable$);
    
    this.setTokenToLocalStorage(response?.token);

    this.isAuthenticatedSubject.next(true);
    this.checkTokenExpiration();
  }

  public logout() {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
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

  private setTokenToLocalStorage(token:string) {
    localStorage.setItem('authToken', token);
  }
}
