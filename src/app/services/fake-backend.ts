import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    
  constructor(){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

    const testUser = {
      Id: 1, 
      Username: 'test@test.com',
      Password: 'test'
    }

    const testProducts: Product[] = [{
      Id: 1,
      Name: 'Product 1'
    }, {
      Id: 2,
      Name: 'Product 2'
    }];

    return of(null).pipe(
      mergeMap(() => {

        if (request.url.endsWith('/login') && request.method === 'POST') {
          if (request.body.Username === testUser.Username && request.body.Password === testUser.Password) {

            let body = {
              Id: testUser.Id,
              Username: testUser.Username,
              Token: '0000-fake-jwt-token-0000'
            }

            return of(new HttpResponse({status: 200, body}))
          }
          else {
            return throwError({
              error: {
                message: 'Username or Password is incorrect.'
              }
            })
          }
        }

        if(request.url.endsWith('/users') && request.method === 'GET') {

          if (request.headers.get('Authorization') === 'Bearer 0000-fake-jwt-token-0000') {
            return of(new HttpResponse({status: 200, body: [testUser]}));
          }
          else {
            return throwError({
              error: {
                message: 'Unauthorized'
              }
            });
          }
        }

        if(request.url.endsWith('/products') && request.method === 'GET') {

          if (request.headers.get('Authorization') === 'Bearer 0000-fake-jwt-token-0000') {
            return of(new HttpResponse({status: 200, body: testProducts}));
          }
          else {
            return throwError({
              error: {
                message: 'Unauthorized'
              }
            });
          }
        }

        return next.handle(request);
      })
    )
    // call materialize and dematerialize to ensure delay even if an error is thrown
    .pipe(materialize())
    .pipe(delay(500))
    .pipe(dematerialize());
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
