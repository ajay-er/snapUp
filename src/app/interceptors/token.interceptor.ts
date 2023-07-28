import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token;
    if (localStorage.getItem('userToken')) {
      token = localStorage.getItem('userToken');
    }

    if (localStorage.getItem('adminToken')) {
      token = localStorage.getItem('adminToken');
    }

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
