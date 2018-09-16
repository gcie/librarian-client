import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { Storage } from '@ionic/storage';
import { DirectoryItem } from '../../models/directoryItem';
import { Log } from '../log/log';
import { Credentials } from '../../models/credentials';

@Injectable()
export class LibraryApi {

  constructor(
    private ftp: FTP,
    private storage: Storage,
    private file: File,
    private log: Log
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

  async getDescriptionFile(): Promise<DirectoryItem[]> {
    const description = await this.file.readAsText(this.file.dataDirectory, 'description.json')
    return JSON.parse(description);
  }

  async updateDescriptionFile() {
    const creds = await this.storage.get('credentials');
    this.ftp.connect(`${creds.hostname}:${creds.port}`, creds.username, creds.password);
    this.ftp.download(`${this.file.dataDirectory}/description.json`, '/.library/description.json').subscribe(this.log.fileDownload('Downloading library description file'));
    this.ftp.disconnect();
  }
}
