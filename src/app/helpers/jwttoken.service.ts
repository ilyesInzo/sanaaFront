import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {

  decodedToken: { [key: string]:  string[] };

  constructor() {
  }

  decodeToken(jwtToken) {
      return this. decodedToken = jwt_decode(jwtToken);
  }

}
