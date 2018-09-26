import { Component, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Directory } from '../../models/directory';
import { File } from '../../models/file';
import { Folder } from '../../models/folder';
import { Util } from '../../providers/util/util';
import { DirectoryProvider } from './../../providers/directory/directory';
import { LibraryApi } from './../../providers/library-api/library-api';


@IonicPage()
@Component({
  selector: 'page-file-browser',
  templateUrl: 'file-browser.html',
})
export class FileBrowserPage {

  public title = 'Main directory';
  public path: string = '';
  public dir = new Directory();

  @ViewChildren('folderItem') folderItems;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public libraryApi: LibraryApi,
    public directoryProvider: DirectoryProvider,
    public util: Util
  ) { }

  ionViewDidLoad() {
    this.path = this.navParams.get('path') || '';
    this.title = this.navParams.get('title') || this.title;
    this.loadDirectory();
    console.log(this.folderItems);
  }

  async loadDirectory() {
    this.dir = await this.directoryProvider.readPath(this.path);
  }

  enter(folder) {
    this.navCtrl.push(FileBrowserPage, { 'path': `${this.path}/${folder}`, 'title': folder });
  }

  back() {
    this.path.replace(/\/[^\/]*$/, '');
  }

  syncFile(file: File, item) {
    this.directoryProvider.markFileAsWaitingForDownload(this.path, file.name).then(() => this.loadDirectory());
    if (item) setTimeout(() => item.close());
  }

  syncFolder(folder: Folder, item) {
    this.directoryProvider.markFolderAsWaitingForDownload(this.path, folder.name).then(() => this.loadDirectory());
    if (item) setTimeout(() => item.close());
  }

  unsyncFile(file: File, item) {
    this.directoryProvider.markFileAsWaitingForRemoval(this.path, file.name).then(() => this.loadDirectory());
    if (item) setTimeout(() => item.close());
  }

  unsyncFolder(folder: Folder, item) {
    this.directoryProvider.markFolderAsWaitingForRemoval(this.path, folder.name).then(() => this.loadDirectory());
    if (item) setTimeout(() => item.close());
  }

}
