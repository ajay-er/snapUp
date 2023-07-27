import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private adminAuth: AdminService, private userAuth: AuthService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    const token = userToken || adminToken;

    if (token) {
      const decodedToken: any = jwt_decode(token);
      const tokenExpiration = decodedToken.exp;

      if (Date.now() >= tokenExpiration * 1000) {
        if (userToken) {
          this.userAuth.logout();
        } else if (adminToken) {
          this.adminAuth.logout();
        }
      } else {
        request = request.clone({
          setHeaders: {
            Authorization: `bearer ${token}`,
          },
        });
      }
    }

    return next.handle(request);
  }
}
