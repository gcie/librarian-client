import { Injectable } from '@angular/core';
import { FTP } from '@ionic-native/ftp';
import { AlertController } from 'ionic-angular';
import { DirectoryItem } from '../../models/directoryItem';


@Injectable()
export class LibraryApi {

  private hostname = 'reinfarn.ddns.net:8021';
  private username = 'gucci';
  private password = 'gucci123';

  constructor(
    public ftp: FTP,
    public alertCtrl: AlertController
  ) {
    
  }

  readDir(dir): Promise<DirectoryItem[]> {
    return new Promise((resolve, reject) => {
      this.ftp.connect(this.hostname, this.username, this.password)
        .then(() => this.ftp.ls(dir))
        .then((directory) => {
          console.log(directory);
          let res: DirectoryItem[] = [];
          directory.forEach(item => {
            res.push(item);
          });
          resolve(res);
        })
        .catch(reject);
    }); 
  }

}
