import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { DirectoryItem } from '../../models/directoryItem';
import { LibraryProvider } from '../../providers/library/library';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';

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
    public file: File,
    public ftp: FTP
  ) { }

  ionViewDidLoad() {
    // this.loadDirectory();
    console.log('### externalRootDir:', this.file.externalRootDirectory);
    this.library.upload('filetree.json', 'filetree.json');

    /* this.library.readDeep().then((tree) => {
      this.file.writeFile(this.file.externalRootDirectory, 'filetree.json', JSON.stringify(tree), { replace: true }).then(() => {
        this.ftp.upload(this.file.externalRootDirectory + 'filetree.json', '/filetree.json').subscribe(res => {
          console.log('### uploading status:', res);
        });
      })
      .catch(ex => {
        console.log('### writeFileException:', ex);
      });
    })
    .catch(ex => {
      console.log('### readDeepException:', ex);
    }); */
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
