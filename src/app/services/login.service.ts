import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators'
import { AuthInfo } from '@app/models/AuthInfo';
import { environment } from '@environments/environment';
import { LocalStorageService } from '@app/helpers/local-storage.service';
import { TOCKEN_ENDPOINT, AUTHORIZATION } from '@app/helpers/constants'
import { UserService } from './user.service';
import { User } from '@app/models/User'
import { Authority } from '@app/models/Authority'
import { JWTTokenService } from '@app/helpers/jwttoken.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private userService: UserService, private authStorage: LocalStorageService, private extractToKen: JWTTokenService) { }

  private authorities;

  login(login: string, password: string): Observable<any> {

    this.logout()

    const headers = {
      AUTHORIZATION: 'Basic ' + btoa(environment.clientID + ':' + environment.clientSecret),
      'Content-type': 'application/x-www-form-urlencoded'
    }

    const body = new HttpParams()
      .set('username', login)
      .set('password', password)
      .set('grant_type', 'password');
    // additional request could be sent to get user complete Info
    return this.http.post<AuthInfo>(environment.backEndPoint + TOCKEN_ENDPOINT, body, { headers })
      .pipe(
        // @Todo encrypt infomrmation / get complete user info if needed
        // map(token => this.authStorage.set('token',JSON.stringify(token))),
        concatMap(token => {
          //console.log();
          this.extractAuthorities(this.extractToKen.decodeToken(token.access_token))
          this.authStorage.set('token', JSON.stringify(token))
          return this.userService.currentUser$
        }),
        tap(user => {
          user.authorities = this.authorities;
          this.authStorage.set('currentUser', JSON.stringify(user))
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    this.authStorage.remove('currentUser')
    this.authStorage.remove('token')
  }

  isLogged() {
    return this.authStorage.remove('currentUser') != null
  }

  private extractAuthorities(values: { [key: string]: string[] }) {
    if (values && values['authorities'] && values['authorities'].length > 0) {
      this.authorities = values['authorities'].reduce((acc: { [key: string]: Authority }, occ: string) => {

        const module = occ.split('_')[1]
        const permission = occ.split('_')[2]

        acc[module] = acc[module] || new Authority()

        this.extractPermission(permission, acc[module])

        return acc
      }, {})
    }
  }

  private extractPermission(permission: string, authority: Authority) {

    switch (permission) {
      case 'Create':
        authority.canCreate = true
        break;
      case 'Write':
        authority.canWrite = true
        break;
      case 'Read':
        authority.canRead = true
        break;
      case 'Delete':
        authority.canDelete = true
        break;
      default:
        break;
    }
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

  test() {
    return this.http.get(environment.backEndPoint + 'hello', { responseType: 'text' });
  }

}
