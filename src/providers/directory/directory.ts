import { Injectable } from '@angular/core';
import { FTP } from '@ionic-native/ftp';
import { Storage } from '@ionic/storage';
import { Directory } from '../../models/directory';
import { DirectoryItem } from '../../models/directoryItem';
import { DirectoryDeep } from './../../models/directoryDeep';
import { File } from '@ionic-native/file';


@Injectable()
export class DirectoryProvider {

  root: DirectoryDeep;

  constructor(
    public ftp: FTP,
    public file: File,
    public storage: Storage
  ) {
    this.root = new DirectoryDeep({name: '', size: -1, type: 1, modifiedDate: ''});
  }

  /**
   * Read path from cache, load from server if necessary. Requires open connection.
   * @param path Path to be read.
   */
  async readPath(path: string): Promise<Directory> {
    let currentDirectory = this.root;
    let currentPath = '';
    for (let folder of path.split('/').slice(1)) {
      if (!currentDirectory.complete) {
        await this.buildShallow(currentPath);
      }

      currentPath = `${currentPath}/${folder}`;
      currentDirectory = currentDirectory.cd(folder);
    }
    if (!currentDirectory.complete) {
      await this.buildShallow(currentPath);
    }
    return currentDirectory;
  }

  private readPathNoCheck(path: string) {
    let currentDirectory = this.root;
    for (let folder of path.split('/').slice(1)) {
      currentDirectory = currentDirectory.cd(folder);
    }
    return currentDirectory;
  }

  private async buildShallow(path: string): Promise<void> {
    const currentDirectory = this.readPathNoCheck(path);
    const dir: DirectoryItem[] = await this.ftp.ls(path);
    for (let dirItem of dir) {
      currentDirectory.insert(dirItem);
    }
    currentDirectory.complete = true;
  }

  private async buildDeep(path: string = '') {
    const currentDirectory = this.readPathNoCheck(path);
    const dir: DirectoryItem[] = await this.ftp.ls(path);
    for (let dirItem of dir) {
      currentDirectory.insert(dirItem);
      if (dirItem.type === 1) {
        await this.buildDeep(`${path}/${dirItem.name}`);
      }
    }
  }

  async load() {
    this.root = JSON.parse(await this.storage.get('root'));
  }

  async save() {
    console.log('### saving...')
    await this.storage.set('root', JSON.stringify(this.root));
    this.file.createFile(this.file.externalRootDirectory, 'root.json', true).then(file => file.createWriter(writer => {
      writer.write(JSON.stringify(this.root));
      this.ftp.upload(`${this.file.externalRootDirectory}/root.json`, '/root.json').subscribe(status => console.log(`### uploading status: ${status * 100}%`));
    }));
  }

}
