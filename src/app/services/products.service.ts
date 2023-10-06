import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip, switchMap } from 'rxjs';

import { CreateNewProductDTO, Product, UpdateProductDTO } from './../models/product.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

/* en proxy.config.json se crea el comando para cambiar el proxy (solo para desarrollador), si se desea habilitar proxy para despliegue, se debe solicitar el permiso desde el backend */
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api/products`

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts() {
   return this.http.get<Product[]>(this.apiUrl)
  }

  // consultr datos por id
  getProduct(id:string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    //capturar errores de busqueda
    .pipe(
      catchError((error:HttpErrorResponse)=>{
        //HttpStatusCode es una funcion de angular que tiene tipados todos los errores 
        if (error.status === HttpStatusCode.Conflict) {
          return throwError (() => new Error ('algo esta fallando en el server'));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError (() => new Error ('El producto no existe'));        
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError (() => new Error ('No estas autorizado'));        
        }
        return throwError(() => new Error ('Ups... algo salio mal '))
      })
    )
  }

  getProductsByPages(limit: number, offset:number) {
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params : {limit, offset}
    })
    .pipe (
      //map nos sirve para agreagar informacion extra de la que nos trae la api sin modificarla 
      map(products => {
        return products.map( item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      })}),
      map(products => {
        return products.map( item => {
        return {
          ...item,
          total: item.taxes + item.price
        }
      })})
    )
  }

  fetchReadAndUpdate( id:string, dto: UpdateProductDTO ) {
    return zip (
      this.getProduct(id),
      this.update(id, dto)
     );
  }

  create(dto: CreateNewProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto)
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto)
  }

  delete (id:string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

}

//creae una branch de developer
