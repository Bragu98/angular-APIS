import { Component, Input } from '@angular/core';

import { UsersService } from './services/users.service';
import { User } from './models/user.model';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token:string = '';
  profile: User = {
    id: "",
    email: "",
    password: "",
    name:""
  };
  imgRta = "";

  constructor(
    private usersService : UsersService,
    private filesService : FilesService
  ){}

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create({
      name: 'Brayan',
      email: 'Brayan@guecha.com',
      password: 'Colombia123'
    }).subscribe(rta =>{
      console.log(rta)
    })
  }

  dowloadPdf(){
    this.filesService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }

  onUpload(event : Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file){
    this.filesService.uploadFile(file)
    .subscribe(rta=> {
      this.imgRta = rta.location;
    })}
  }

}
