import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

// creamos un contexto al cual llamamos CHECK_TIME para poder definir cuales solicitudes nos interes interceptar y cuales no 

const CHECK_TIME = new HttpContextToken<boolean>(()=>false); //aqui se define si el interceptor va a estar encendido o apagado por defecto 

//luego creamos una función para cambiar su estado en determinadas solicitudes
export function checkTime() {
  return new HttpContext().set(CHECK_TIME, true)
}

// Los interceptores nis ayudan a interceptar cualquier tipo de solicitud entre la app y el back-end y hacer algun tipo de proceso con esta información, como por ejemplo medir su tiempo de respuesta  
// El interceptor se debe inyectar de forma manual en app.modules con import { HttpInterceptor } from '@angular/common/http';
// import { TimeInterceptor } from './interceptor/time.interceptor';
//{provide: HTTP_INTERCEPTORS, useClass: TimeInterceptor, multi:true}

@Injectable()
export class TimeInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.context.get(CHECK_TIME)) {
      const start = performance.now();
      return next
      .handle(request)
      .pipe(
        // El operador tap nos sirve para correr un proceso sin tener que modificar la información que se esta utilizando 
        tap(() => {
          const time = (performance.now() - start) + 'ms';
          console.log(request.url, time);
        })
    );}
    return next.handle(request)
  }
}
