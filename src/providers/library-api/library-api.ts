import { DirectoryProvider } from './../directory/directory';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { Storage } from '@ionic/storage';
import { Credentials } from '../../models/credentials';

@Injectable()
export class LibraryApi {

  constructor(
    public ftp: FTP,
    public storage: Storage,
    public file: File,
    public directory: DirectoryProvider
  ) {
    // storage.set('credentials', { hostname: 'reinfarn.ddns.net', port: 8021, username: 'gucci', password: 'gucci123' });
  }

  async handleDownload() {
    for (let downloadPath of this.directory.syncQueue) {
      let path = downloadPath.slice(0, downloadPath.lastIndexOf('/'));
      await this.createDirectory(path);
      await this.download(downloadPath);
    }
  }

  async download(file: string) {
    return new Promise((resolve, reject) => {
      this.ftp.download(`${this.file.externalRootDirectory}/Librarian${file}`, file)
        .subscribe(status => {
          if (status == 1) {
            resolve();
          }
        })
    });
    
  }

  async createDirectory(path: string) {
    try { await this.file.createDir(this.file.externalRootDirectory, 'Librarian', false); } catch (err) { }
    let currentDir = `${this.file.externalRootDirectory}/Librarian`;
    for (let folder of path.split('/').slice(1)) {
      try { await this.file.createDir(currentDir, folder, false); } catch (err) { }
      currentDir = `${currentDir}/${folder}`;
    }
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

      // Store credentials if specified
      if (c.remember) await this.storage.set('credentials', c);

      // Connect with database
      try { await this.ftp.connect(`${c.hostname}:${c.port}`, c.username, c.password); } catch (err) { throw 'Error during connecting to server'; }


      // Return success
      return;

    } catch (err) {
      console.log('### login error:', err);
      return 'Error during login';
    } finally { }
  }
}
