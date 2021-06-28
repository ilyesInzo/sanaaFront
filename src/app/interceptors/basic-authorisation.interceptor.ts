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

  constructor(private authStorage: LocalStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Token is not required for some resource = we don't have to check existance
    const auth = <AuthInfo>JSON.parse(this.authStorage.get('token'))
    const token = auth.access_token;
    
    request = request.clone({
      url:  request.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    //ToDo subscribe and handle issue (e.g. token expired)
    return next.handle(request);
  }
}
