import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Directory } from '../../models/directory';
import { DirectoryProvider } from './../../providers/directory/directory';
import { LibraryApi } from './../../providers/library-api/library-api';
import { SynchronizationState } from '../../models/synchronizedStateEnum';


@IonicPage()
@Component({
  selector: 'page-file-browser',
  templateUrl: 'file-browser.html',
})
export class FileBrowserPage {

  public path: string = '';
  public dir = new Directory();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryApi: LibraryApi,
    public directoryProvider: DirectoryProvider
  ) { }

  ionViewDidLoad() {
    this.path = this.navParams.get('path') || '';
    this.loadDirectory();
  }

  async loadDirectory() {
    this.dir = await this.directoryProvider.readPath(this.path);
  }

  enter(folder) {
    this.navCtrl.push(FileBrowserPage, { 'path': `${this.path}/${folder}`});
  }

  back() {
    this.path.replace(/\/[^\/]*$/, '');
  }

}
