import { Component, OnInit, Input } from '@angular/core';

import { StoreService } from '../../services/store.service'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  loginUser() {
    this.authService.loginAndGet('Brayan@guecha.com', 'Colombia123')
   .subscribe(user => {
      this.profile = user;
    });
  }

  // Version larga tirando
  /* loginUser() {
    this.authService.login('Brayan@guecha.com', 'Colombia123')
    .subscribe(rta =>{
      this.token = rta.access_token;
      this.getProfile();
    })
  }

  getProfile(){
    this.authService.profile(this.token)
    .subscribe((user:User) => {
      this.profile = user;
    })
  } */

}
