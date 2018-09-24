import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController } from 'ionic-angular';
import { Credentials } from '../../models/credentials';
import { LibraryApi } from '../../providers/library-api/library-api';
import { FileBrowserPage } from './../file-browser/file-browser';


@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {

  public creds = new Credentials();
  public error = '';

  constructor(
    private libraryApi: LibraryApi,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
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
    const res = await this.libraryApi.login(this.creds);
    console.log('### logging result:', res);
    if (res) {
      console.log('### login error!');
      this.error = 'Ivalid credentials!';
    } else {
      console.log('### login successful');
      this.error = '';
      this.navCtrl.setRoot(FileBrowserPage);
    }
    loader.dismiss();
  }

}
