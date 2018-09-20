import { LibraryApi } from './../../providers/library-api/library-api';
import { DirectoryItem } from './../../models/directoryItem';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DirectoryProvider } from '../../providers/directory/directory';


@IonicPage()
@Component({
  selector: 'page-file-browser',
  templateUrl: 'file-browser.html',
})
export class FileBrowserPage {

  public path: string = '';
  public dir = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryApi: LibraryApi,
    public directory: DirectoryProvider
  ) { }

  ionViewDidLoad() {
    this.loadDirectory();
  }

  loadDirectory() {
    this.dir = [];
    this.directory.read(this.path)
      .then(dir => {
        console.log(dir);
        for (var k in dir.content) {
          this.dir.push(dir.content[k]);
        }
      });
  }

  enter(folder) {
    this.path = `${this.path}/${folder}`;
    this.loadDirectory();
  }

}
