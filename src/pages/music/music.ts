import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { LibraryApi } from '../../providers/library-api/library-api';
import { Credentials } from '../../models/credentials';


@IonicPage()
@Component({
  selector: 'page-music',
  templateUrl: 'music.html',
})
export class MusicPage {

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
