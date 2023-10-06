import { Component, OnInit } from '@angular/core';
import { switchMap, zip } from 'rxjs';

import { CreateNewProductDTO, Product, UpdateProductDTO} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import Swal from 'sweetalert2';
/* import Swal from 'sweetalert2/dist/sweetalert2.js' */



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
  statusDetail:'loading' | 'success' | 'error' | 'init' = 'init';

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
    .subscribe((data : Product[]) => {
      this.products = data.reverse();
    });
    this.productsService.getAllProducts()
    .subscribe(data => {
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
    this.statusDetail = 'loading';
    this.productsService.getProduct(id)
    .subscribe({
      next: (data)=>{
      this.toggleProductDetail();
      this.productChosen = data;
      this.statusDetail = 'success';
    }, error : (errorMsg) => {
      //Manejo de errores al momento de solicitar un producto que no existe
      //El mensaje del error viene modificado desde el products.service
      /* window.alert(errorMsg); */
      this.statusDetail = 'error';
      Swal.fire({
        title : errorMsg,
        text : errorMsg,
        icon : 'error',
        confirmButtonText: 'OK'
      });
  }})
  }

  readAndUpdate(id:string) {
    this.productsService.getProduct(id)
    //para evitar el callback hell
    .pipe(
      // switchMap Cuando se tienen dependencia una de otra 
      switchMap((product) => this.productsService.update(product.id, {title:"change"})),
      switchMap((product) => this.productsService.update(product.id, {title:"change"})),
      switchMap((product) => this.productsService.update(product.id, {title:"change"}))
    ).subscribe (data =>{
      console.log(data)
    });
    // zip cuando no se tienen dependencia y pueden correr en paralelo (se paso la logica del zip a product.service, esto con el fin de poder reutilizarla despues)
    this.productsService.fetchReadAndUpdate(id, {title:"cambio"})
    .subscribe (response => {
    const read = response[0];
    const update = response[1];
   })
    // ejemplo de callback hell
    /* .subscribe( data => {
      const product = data;
      this.productsService.update(product.id, {title:"change"})
        .subscribe(rtaUpdate => {
          console.log(rtaUpdate)
          .suscribe......
      })
    }) */
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
    window.location.reload();
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

}
