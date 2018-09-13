import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { DirectoryItem } from '../../models/directoryItem';
import { LibraryProvider } from '../../providers/library/library';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private currentPath: string = '';
  private currentDir: DirectoryItem[];

  constructor(
    public navCtrl: NavController,
    public library: LibraryProvider,
    public alertCtrl: AlertController,
    public file: File
  ) { }

  ionViewDidLoad() {
    this.loadDirectory();
  }

  itemClickHandler(item: DirectoryItem) {
    if (item.type === 1) {
      this.enterFolder(item);
    }
  }

  backClickHandler() {
    this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
    this.loadDirectory();
  }

  enterFolder(folder: DirectoryItem) {
    // assert(folder.type === 1, "You cannot enter to files");
    this.currentPath += `/${folder.name}`;
    this.loadDirectory();
  }

  loadDirectory() {
    this.library.readDir(this.currentPath)
      .then((directory) => {
        this.currentDir = directory;
      })
  }

}
