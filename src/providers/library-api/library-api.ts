import { Utils } from './../utils/utils';
import { DirectoryItem } from './../../models/directoryItem';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { Storage } from '@ionic/storage';
import { Log } from '../log/log';
import { Credentials } from '../../models/credentials';

@Injectable()
export class LibraryApi {

  private directory: DirectoryItem[] = [];
  private synchronizationFolder = '';

  constructor(
    private ftp: FTP,
    private storage: Storage,
    private file: File,
    private log: Log,
    private util: Utils
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
      // Set synchronization folder FIXME: remove hard link
      await this.storage.set('synchronizationFolder', `${this.file.externalRootDirectory}/Librarian`);
      this.synchronizationFolder = `${this.file.externalRootDirectory}/Librarian`;

      // Store credentials if specified
      if (c.remember) await this.storage.set('credentials', c);

      // Connect with database
      try { await this.ftp.connect(`${c.hostname}:${c.port}`, c.username, c.password); } catch (err) { throw 'Error during connecting to server'; }

      // Download, store and cache description file
      this.ftp.download(`${this.file.externalRootDirectory}/description.json`, '/.library/description.json').subscribe((state) => {
        this.log.fileDownload('Downloading library description file')(state);
        if (state == 1) {
          this.file.readAsText(this.file.externalRootDirectory, 'description.json')
            .then((desc) => {
              this.directory = JSON.parse(desc);
  
              console.log(this.directory);
            });
        }
      });

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

  async updateDescriptionFile() {
    const creds = await this.storage.get('credentials');
    this.ftp.connect(`${creds.hostname}:${creds.port}`, creds.username, creds.password);
    this.ftp.download(`${this.file.dataDirectory}/description.json`, '/.library/description.json').subscribe(this.log.fileDownload('Downloading library description file'));
    this.ftp.disconnect();
  }

  readDirectory(path: string): DirectoryItem[] {
    let tree = this.directory;
    for (let folder of path.split('/')) {
      if (folder === '') return tree;
      const fittingFolders = tree.filter( (item) => item.name == folder && this.util.isFolder(item) );
      if (fittingFolders.length == 0) return [];
      tree = fittingFolders[0].content;
    }
    return tree;
  }
}
