import { Injectable } from '@angular/core';
import { FTP } from '@ionic-native/ftp';
import { DirectoryItem } from '../../models/directoryItem';
import { LibraryApi } from './../library-api/library-api';
import { Storage } from '@ionic/storage';


@Injectable()
export class DirectoryProvider {

  directory: any = { '': {
    name: '',
    size: 0,
    modifiedDate: '',
    synchronized: 0
  } };


  constructor(
    public ftp: FTP,
    public storage: Storage
  ) { }

  /**
   * Read data from specified folder. It requires you to have previous folder already built.
   * @param path Folder path.
   */
  async buildShallow(path: string = '') {
    const currDir = this.readNoCheck(path);
    currDir.content = {};
    const dir: DirectoryItem[] = await this.ftp.ls(path);
    for (let dirItem of dir) {
      currDir.content[dirItem.name] = {
        name: dirItem.name,
        size: dirItem.size,
        modifiedDate: dirItem.modifiedDate,
        type: dirItem.type,
        synchronized: 0
      }
    }
  }

  /**
   * Read data deep from specified directory. It requires you to have previous folder already built.
   * @param path Path from which to start building file tree.
   */
  async buildDeep(path: string = '') {
    const currDir = this.readNoCheck(path);
    currDir.content = {};
    const dir: DirectoryItem[] = await this.ftp.ls(path);
    for (let dirItem of dir) {
      currDir.content[dirItem.name] = {
        name: dirItem.name,
        size: dirItem.size,
        modifiedDate: dirItem.modifiedDate,
        type: dirItem.type,
        synchronized: 0
      }
      if (dirItem.type == 1) {
        currDir.content[dirItem.name] = await this.buildDeep(`${path}/${dirItem.name}`);
      }
    }
    return currDir;
  }

  /**
   * Read specified path from server.
   * @param path Path to read.
   */
  async read(path: string) {
    let dir = this.directory[''];
    let currPath = '';
    for (let folder of path.split('/').slice(1)) {
      if (!dir.content[folder]) {
        await this.buildShallow(currPath);
      }
      currPath += folder;
      dir = dir[folder].content;
    }
    if (!dir.content) {
      await this.buildShallow(path);
    }
    return dir;
  }

  readNoCheck(path: string) {
    let dir = this.directory[''];
    for (let folder of path.split('/').slice(1)) {
      dir = dir.content[folder];
    }
    return dir;
  }

  load() {
    this.storage.get('directory')
      .then(dir => {
        this.directory = dir;
      });
  }

  save() {
    this.storage.set('directory', this.directory);
  }

}
