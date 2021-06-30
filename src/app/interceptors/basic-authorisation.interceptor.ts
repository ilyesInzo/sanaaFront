import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@app/helpers/local-storage.service';
import { AuthInfo } from '@app/models/AuthInfo';

@Injectable()
export class BasicAuthorisationInterceptor implements HttpInterceptor {

  constructor(private authStorage: LocalStorageService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Token is not required for some resource = we don't have to check existance
    const token = this.authStorage.get('token')
    if (token) {
      const auth = <AuthInfo>JSON.parse(token)
      const {access_token} = auth;
      request = request.clone({
        url: request.url,
        setHeaders: {
          Authorization: `Bearer ${access_token}`
        }
      });
    }
    //ToDo subscribe and handle issue (e.g. token expired)
    return next.handle(request);
  }
}
