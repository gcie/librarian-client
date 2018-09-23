import { Injectable } from '@angular/core';
import { FTP } from '@ionic-native/ftp';
import { Storage } from '@ionic/storage';
import { Directory } from '../../models/directory';
import { DirectoryItem } from '../../models/directoryItem';
import { DirectoryDeep } from './../../models/directoryDeep';
import { File } from '@ionic-native/file';
import { SynchronizationState } from '../../models/synchronizedStateEnum';


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

  async setSynchronizeFolder(path: string, folderName: string) {
    const dir = await this.buildDeep(`${path}/${folderName}`);
    const subDir = dir.cd(folderName);
    if( folder.synchronizationStatus != SynchronizationState.Full ) {
      folder.synchronizationStatus = SynchronizationState.Waiting;
    }
    for (let fld of folder.folders)

  }

  async setSynchronizeFile(path: string, file: string) {
    const dir = this.readPathNoCheck(path);
    dir.file(file).synchronizationStatus = SynchronizationState.Waiting;
  }

  updateSynchronizationState(path: string) {
    const dir = this.readPathNoCheck(path);
    let fullSync = true;
    let noSync = true;
    let waiting = false;
    let progress = false;
    for (let folder of dir.folders) {
      switch(folder.synchronizationStatus) {
        case SynchronizationState.None: {
          fullSync = false;
          break;
        }
        case SynchronizationState.Partial: {
          fullSync = false;
          noSync = false;
          break;
        }
        case SynchronizationState.Full: {
          noSync = false;
          break;
        }
        case SynchronizationState.Waiting: {
          waiting = true;
          break;
        }
        case SynchronizationState.Progress: {
          progress = true;
          break;
        }
      }
    }
    for (let file of dir.files) {
      switch(file.synchronizationStatus) {
        case SynchronizationState.None: {
          fullSync = false;
          break;
        }
        case SynchronizationState.Partial: {
          fullSync = false;
          noSync = false;
          break;
        }
        case SynchronizationState.Full: {
          noSync = false;
          break;
        }
        case SynchronizationState.Waiting: {
          waiting = true;
          break;
        }
        case SynchronizationState.Progress: {
          progress = true;
          break;
        }
      }
    }
    if (progress) {
      dir.synchronizationStatus = SynchronizationState.Progress;
    } else if (waiting) {
      dir.synchronizationStatus = SynchronizationState.Waiting;
    } else if (fullSync) {
      dir.synchronizationStatus = SynchronizationState.Full;
    } else if (noSync) {
      dir.synchronizationStatus = SynchronizationState.None;
    } else {
      dir.synchronizationStatus = SynchronizationState.Partial;
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

  private readPathNoCheck(path: string): DirectoryDeep {
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
    if (currentDirectory.complete) return;
    const dir: DirectoryItem[] = await this.ftp.ls(path);
    for (let dirItem of dir) {
      currentDirectory.insert(dirItem);
      if (dirItem.type === 1) {
        await this.buildDeep(`${path}/${dirItem.name}`);
      }
    }
    currentDirectory.complete = true;
    return currentDirectory;
  }
}
