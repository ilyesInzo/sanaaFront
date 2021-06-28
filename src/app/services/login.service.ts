import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators'
import { AuthInfo } from '../models/AuthInfo';
import { environment } from '@environments/environment';
import { LocalStorageService } from '@app/helpers/local-storage.service';
import {TOCKEN_ENDPOINT, AUTHORIZATION} from '@app/helpers/constants'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient, private authStorage: LocalStorageService) { }

  login(login: string, password: string): Observable<any> {


    const headers = {
      AUTHORIZATION : 'Basic ' + btoa(environment.clientID +':'+ environment.clientSecret),
      'Content-type': 'application/x-www-form-urlencoded'
    }

    const body = new HttpParams()
      .set('username', login)
      .set('password', password)
      .set('grant_type', 'password');
    // additional request could be sent to get user complete Info
    return this.http.post<AuthInfo>(environment.backEndPoint + TOCKEN_ENDPOINT, body, {headers})
    .pipe(
      // @Todo encrypt infomrmation / get complete user info if needed
      map(token => this.authStorage.set('token',JSON.stringify(token))),
      catchError(this.handleError)
    );
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    console.error(err);
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // in case of unexpected error like cors the body may not exist
      errorMessage = `Backend returned code ${err.status}: ${err.body?.error}`;
    }
    return throwError(errorMessage);
  }

  test(){
    return this.http.get(environment.backEndPoint + 'hello', {responseType: 'text'});
  }

}
