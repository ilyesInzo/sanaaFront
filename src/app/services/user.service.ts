import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@app/models/User'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  currentUser$ = this.http.get<User>(environment.backEndPoint +'currentUser');

  getAllUsers() {
    return this.http.get<User[]>(environment.backEndPoint +'/users');
  }

  getUserById(id: number) {
    return this.http.get<User>(environment.backEndPoint + '/users/' + id);
  }

}
