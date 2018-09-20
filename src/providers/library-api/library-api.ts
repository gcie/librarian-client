import { DirectoryProvider } from './../directory/directory';
import { AlertController } from 'ionic-angular';
import { Utils } from './../utils/utils';
import { DirectoryItem } from './../../models/directoryItem';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { Storage } from '@ionic/storage';
import { Log } from '../log/log';
import { Credentials } from '../../models/credentials';
import { Directory } from '../../models/directory';

@Injectable()
export class LibraryApi {

  private directory: Directory;
  private synchronizationFolder = '';

  constructor(
    private alertCtrl: AlertController,
    private ftp: FTP,
    private storage: Storage,
    private file: File,
    private log: Log,
    private util: Utils,
    private directoryProvider: DirectoryProvider
  ) {
    // storage.set('credentials', { hostname: 'reinfarn.ddns.net', port: 8021, username: 'gucci', password: 'gucci123' });
  }

  async setCredentials(c: Credentials) {
    await this.storage.set('credentials', c);
    return 'Credentials changed successfully';
  }

  async getCredentials(): Promise<Credentials> {
    return await this.storage.get('credentials');
  }

  async validateCredentials(c: Credentials): Promise<string> {
    try {
      await this.ftp.connect(`${c.hostname}:${c.port}`, c.username, c.password);
      this.ftp.disconnect();
      return;
    } catch (err) {
      return err;
    }
  }

  async setSynchronizationFolder(path: string) {
    return await this.storage.set('synchronizationFolder', path);
  }

  async getSynchronizationFolder(): Promise<string> {
    return await this.storage.get('synchronizationFolder');
  }

  async login(c: Credentials): Promise<string> {
    try {
      // Create and set synchronization folder FIXME: remove hard link
      /* const exists = await this.file.checkDir(this.file.externalRootDirectory, 'Librarian');
      if (!exists) await this.file.createDir(this.file.externalRootDirectory, 'Librarian', false); */

      await this.storage.set('synchronizationFolder', `${this.file.externalRootDirectory}/Librarian`);
      this.synchronizationFolder = `${this.file.externalRootDirectory}/Librarian`;

      // Store credentials if specified
      if (c.remember) await this.storage.set('credentials', c);

      // Connect with database
      try { await this.ftp.connect(`${c.hostname}:${c.port}`, c.username, c.password); } catch (err) { throw 'Error during connecting to server'; }

      // Download, store and cache description file
      await this.createDescriptionFile();

      // Return success
      return;

    } catch (err) {
      console.log('### login error:', err);
      return 'Error during login';
    } finally { }
  }

  async getDescriptionFile(): Promise<DirectoryItem[]> {
    const description = await this.file.readAsText(this.file.dataDirectory, 'description.json');
    return JSON.parse(description);
  }

  /**
   * Function for creating storage description file.
   * It requires valid connection with ftp server.
   * @async
   */
  createDescriptionFile(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ftp.download(`${this.file.dataDirectory}/description.json`, '/.library/description.json').subscribe((state) => {
        if (state == 1) {
          this.file.readAsText(this.file.dataDirectory, 'description.json')
            .then((fileContent) => {
              // this.directory = JSON.parse(fileContent);
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });
  }

  /**
   * 
   */
  async buildDescriptionFile(path: string = '') {
    console.log(await this.ftp.ls(path));
  }

  getDirectory(path: string) {
    let tree = this.directory;
    for (let folder of path.split('/')) {
      tree = tree.folders[folder];
    }
  }


  /* readDirectory(path: string): DirectoryItem[] {
    let tree = this.directory;
    for (let folder of path.split('/')) {
      if (folder === '') return tree;
      const fittingFolders = tree.filter( (item) => item.name == folder && this.util.isFolder(item) );
      if (fittingFolders.length == 0) return [];
      tree = fittingFolders[0].content;
    }
    return tree;
  } */
}
