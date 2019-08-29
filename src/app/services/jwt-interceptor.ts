import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserToken } from '../models/User';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken: UserToken = JSON.parse(localStorage.getItem(AuthService.TOKEN_KEY));
    if (userToken && userToken.Token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken.Token}`
        }
      });
    }
    
    return next.handle(request);
  }
}
