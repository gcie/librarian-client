import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Credentials } from '../../models/credentials';
import { LibraryApi } from '../../providers/library-api/library-api';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private creds = new Credentials();

  constructor(
    private libraryApi: LibraryApi
  ) { }

  ionViewDidLoad() {
    this.libraryApi.getCredentials().then((creds) => this.creds = creds);
  }

  async logIn() {
    if (this.creds.remember) {
      console.log('### setting credentials:', this.creds);
      this.libraryApi.setCredentials(this.creds);
    } else {
      console.log('### unsetting credentials:', new Credentials());
      this.libraryApi.setCredentials(new Credentials());
    }
    const res = await this.libraryApi.validateCredentials(this.creds);
    console.log('### logging result:', res);
  }

}
