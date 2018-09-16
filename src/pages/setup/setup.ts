import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController } from 'ionic-angular';
import { Credentials } from '../../models/credentials';
import { LibraryApi } from '../../providers/library-api/library-api';


@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {

  private creds = new Credentials();
  private error = '';

  constructor(
    private libraryApi: LibraryApi,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    console.log('### retrieving credentials...')
    this.libraryApi.getCredentials().then((creds) => {
      this.creds = creds;
      console.log('### creds retrieved:', creds);
    });
  }

  async logIn() {
    const loader = this.loadingCtrl.create({ content: 'Validating...' });
    loader.present();
    if (this.creds.remember) {
      console.log('### setting credentials:', this.creds);
      this.libraryApi.setCredentials(this.creds);
    } else {
      console.log('### unsetting credentials:', new Credentials());
      this.libraryApi.setCredentials(new Credentials());
    }
    const res = await this.libraryApi.validateCredentials(this.creds);
    console.log('### logging result:', res);
    if (res) {
      this.error = 'Ivalid credentials!';
    } else {
      this.error = '';
    }
    loader.dismiss();
  }

}
