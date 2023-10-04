import { Component, OnInit } from '@angular/core';

import { CreateNewProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id:'',
      name:'',
    },
    description: ''
  }

  limit = 10;
  offset = 0;

  allProducts : Product[]= [];
  validLoadLess : number = 0;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPages(this.limit,this.offset)
    .subscribe(data => {
      this.products = data;
    });
    this.productsService.getAllProducts()
    .subscribe(data=> {
      this.allProducts = data;
      this.validLoadLess = this.allProducts.length - this.limit;
    });
    
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id:string) {
    this.productsService.getProduct(id)
    .subscribe(data=>{
      console.log('product', data);
      this.toggleProductDetail();
      this.productChosen = data;
    })
  }

  createNewProduct() {
    const product: CreateNewProductDTO = {
      price: 122,
      images: ["https://images.pexels.com/photos/592077/pexels-photo-592077.jpeg?cs=srgb&dl=pexels-katja-592077.jpg&fm=jpg",
      "https://media.istockphoto.com/id/519183570/es/foto/ordenador-port%C3%A1til-con-pantalla-en-notas-adhesivas-cubierto.jpg?s=1024x1024&w=is&k=20&c=MuEN844JlsaPWS_0UHgJ4TCzX8tgY_Csi7kerqXoKRs=",
      "https://media.istockphoto.com/id/1154085284/es/foto/vista-a%C3%A9rea-la-universidad-de-mu%C4%9Fla-y-la-intersecci%C3%B3n-de-carreteras-hospitalarias-turqu%C3%ADa.jpg?s=1024x1024&w=is&k=20&c=Di34ANl8y20RZN8W2knve42RPgeTIPeSXdjdZlaNmpU=",
      "https://media.istockphoto.com/id/1129381764/es/foto/fre%C3%ADr-el-huevo-en-una-cacerola-cocinar-en-cocina-dom%C3%A9stica.jpg?s=1024x1024&w=is&k=20&c=_I_xhi2w0bxQ_qmJKFBlTgLAQe1USpRuKhV6lj76lOc="],
      title: 'Nuevo Producto',
      categoryId: 2,
      description: 'fgsjkldsjfkjdskfjkdjflksjf'
    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data);
    });
  }

  updateProduct() {
     const changes : UpdateProductDTO = {
      title: 'Nuevo Title'
     }
     const id = this.productChosen.id;
     this.productsService.update(id, changes)
     .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
     });
  }

  deleteProducts(){
    const id = this.productChosen.id
    this.productsService.delete(id)
    .subscribe(() =>{
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });

  }

  loadMore() {
    console.log(this.validLoadLess);
    this.offset += this.limit;
    this.productsService.getProductsByPages(this.limit, this.offset)
    .subscribe(data => {
      this.products = data;
    });
  }

  loadLess() {
    this.offset -= this.limit;
    this.productsService.getProductsByPages(this.limit, this.offset)
    .subscribe(data => {
      this.products = data;
    });
  }

  validLessPag() {
    
  }

}
