import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { User, UserToken } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static TOKEN_KEY = 'auth-token';

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) { }

  login(username: string, password: string ) {
    return this.http.post<User>(`${this.config.API}/login`, { Username: username, Password: password })
    .pipe(
      map((user: UserToken) => {
        if(user && user.Token){
          localStorage.setItem(AuthService.TOKEN_KEY, JSON.stringify(user));
        }
        return user;
      })
    );
  }

  logout() {
    
  }

  isAuthenticated(url: string) {
    const userToken: UserToken = JSON.parse(localStorage.getItem(AuthService.TOKEN_KEY));
    if (!userToken) {
      return false;
    } else {
      if (url.indexOf('/admin') !== 0) {
        return true;
      } else {
        return userToken.IsAdmin;
      }
    }
  }
}
