import { Injectable } from '@angular/core';
import { FTP } from '@ionic-native/ftp';
import { AlertController } from 'ionic-angular';
import { DirectoryItem } from '../../models/directoryItem';
import { Observable } from 'rxjs/Observable';
import { Utils } from '../utils/utils';
import { File } from '@ionic-native/file';

@Injectable()
export class LibraryProvider {

  private HOSTNAME = 'reinfarn.ddns.net:8021';
  private USERNAME = 'gucci';
  private PASSWORD = 'gucci123';

  private filetree: DirectoryItem[];
  private connected: boolean = false;
  private working: boolean = false;
  private ready: boolean = false;

  constructor(
    public ftp: FTP,
    public alertCtrl: AlertController,
    private util: Utils,
    private file: File
  ) {
    this.connect();
  }

  getFolder(dir: string, tree: DirectoryItem[] = this.filetree) {
    const res = tree.filter((item) => dir.startsWith(item.name) && dir[item.name.length] === '/');
    if (res.length) {
      this.getFolder(dir.substring(res[0].name.length + 1, dir.length), res[0].content);
    } else {

    }
  }


  async readDeep(dir: string = ''): Promise<DirectoryItem[]> {
    let tree: DirectoryItem[] = [];
    try {
      if (!this.connected) {
        await this.connect();
      }

      tree = await this.ftp.ls(dir);
      // console.log('### tree:', tree);
      for (let item of tree) {
        if (this.util.isFolder(item)) {
          // console.log('### directory: `${dir}/${item.name}`')
          item.content = await this.readDeep(`${dir}/${item.name}`);
        }
      }
    } catch (ex) {
      throw ex;
    }

    return tree;
  }

  readDir(dir: string): Promise<DirectoryItem[]> {
    return new Promise((resolve, reject) => {
      this.connect()
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

  connect(): Promise<any> {
    try {
      const connection = this.ftp.connect(this.HOSTNAME, this.USERNAME, this.PASSWORD);
      this.connected = true;
      return connection;
    } catch (ex) {
      console.log('### Unable to connect to FTP server. Retrying in 1 second... \nReason:', ex);
      setTimeout(() => {
        return this.connect();
      }, 1000);
    }
  }

  upload(localFile: string, remoteFile: string) {
    this.ftp.upload(`${this.file.externalRootDirectory}/${localFile}`, remoteFile).subscribe(status => {
      console.log(`### Uploading progress: ${status * 100}%`);
    });
  }
}
