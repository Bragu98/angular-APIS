import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

import { CreateNewProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products'

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts() {
    return this.http.get<Product[]>(this.apiUrl)
    //.pipe nos sirve para agregar alguna otra funcion 
    .pipe(
      retry(3)
    );
  }

  // consultr datos por id
  getProduct(id:string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  getProductsByPages(limit: number, offset:number) {
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params : {limit, offset}
    })
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
