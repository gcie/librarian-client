import { LibraryApi } from './../../providers/library-api/library-api';
import { DirectoryItem } from './../../models/directoryItem';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-file-browser',
  templateUrl: 'file-browser.html',
})
export class FileBrowserPage {

  public directory: DirectoryItem[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryApi: LibraryApi
  ) { }

  ionViewDidLoad() {
    // console.log('### Hello from FileBrowser');
    this.directory = this.libraryApi.readDirectory('');
  }

}
