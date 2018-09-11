import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { DirectoryItem } from '../../models/directoryItem';
import { LibraryProvider } from '../../providers/library/library';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private rootDir: DirectoryItem[];

  constructor(
    public navCtrl: NavController,
    public library: LibraryProvider,
    public alertCtrl: AlertController
  ) {
    library.readFolders('')
      .then((directory) => {
        this.rootDir = directory;
        // alertCtrl.create({title: 'Info', subTitle: directory[0].name }).present();
      });
  }
}
