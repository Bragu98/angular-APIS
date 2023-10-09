import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }
 
  //LocalStorage nos sirve para guardar el token de forma local y que si se recarga la pagina no se cierre sesión, solo hasta que esta sea cerrada de forma manual
  //esto tambien se puede hacer por medio de cookies
  saveToken(token:string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }
}
