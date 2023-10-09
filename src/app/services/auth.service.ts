import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { tap, switchMap} from 'rxjs';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`

  constructor(
    private http: HttpClient,
    private tokenServices:TokenService
  ) { }

  login(email:string, password:string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password})
    .pipe (
      tap (Response => this.tokenServices.saveToken(Response.access_token))
      );
  }

  getProfile() {
    //Otra forma de enviar los headers de la autorización
    /* const headers = new HttpHeaders();
    headers.set('Authorization', `Bearer ${token}`) 
    return this.http.get<User>(`${this.apiUrl}/profile`, headers)*/ 

    return this.http.get<User>(`${this.apiUrl}/profile`/* , {
      headers: {
        Authorization: `Bearer ${token}`, // importante que haya um espacio entre la concatenación de Bearer y el token
        //'content-type' : 'application/json'
      }
    } */);
  }

  loginAndGet(email:string, password:string) {
    return this.login(email,password)
    .pipe(
      switchMap(()=> this.getProfile())
    )
  }
}
