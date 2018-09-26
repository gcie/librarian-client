import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { Storage } from '@ionic/storage';
import { Directory } from '../../models/directory';
import { DirectoryItem } from '../../models/directoryItem';
import { Sync } from '../../models/synchronizedStateEnum';
import { Util } from '../util/util';
import { DirectoryDeep } from './../../models/directoryDeep';


@Injectable()
export class DirectoryProvider {

  root: DirectoryDeep;
  syncQueue: string[];
  unsyncQueue: string[];

  constructor(
    public ftp: FTP,
    public file: File,
    public storage: Storage,
    public util: Util
  ) {
    this.syncQueue = [];
    this.unsyncQueue = [];
    this.root = new DirectoryDeep({name: '', size: -1, type: 1, modifiedDate: ''});
  }

  /**
   * Add all files which are marked for synchronization to syncQueue and unsyncQueue.
   * Do not use if queues are not empty.
   * @param dir root directory to search for waiting files
   * @param path path of dir
   */
  async updateSyncQueue(dir = this.root, path = '') {
    for (let file of dir.files) {
      if (file.synchronizationStatus == Sync.WaitingForDownload) {
        this.syncQueue.push(`${path}/${file.name}`);
      } else if (file.synchronizationStatus == Sync.WaitingForRemoval) {
        this.unsyncQueue.push(`${path}/${file.name}`);
      }
    }

    for (let folder of dir.folders) {
      if (!this.util.syncStatusDone(folder.synchronizationStatus)) {
        this.updateSyncQueue(dir.cd(folder.name), `${path}/${folder.name}`);
      }
    }
  }

  /**
   * Mark folder and it's content as ready to download and add them
   * to download queue. If folder is already downloaded it resolves 
   * after building entire folder structure, so there may be delay 
   * before actual mark change. It requires you to have built given path.
   * 
   * @param path path of base folder containing target folder
   * @param foldername name of the folder to be downloaded
   */
  async markFolderAsWaitingForDownload(path: string, foldername: string) {
    const dir = await this.buildDeep(`${path}/${foldername}`);
    if (dir.synchronizationStatus !== Sync.Yes) {
      dir.synchronizationStatus = Sync.WaitingForDownload;
      for (let folder of dir.folders) {
        await this.markFolderAsWaitingForDownload(`${path}/${foldername}`, folder.name);
      }
      for (let file of dir.files) {
        await this.markFileAsWaitingForDownload(`${path}/${foldername}`, file.name);
      }
    }
  }

  /**
   * Mark folder and it's content as ready to remove and add them to removal queue. 
   * If folder is already removed it resolves after building entire 
   * folder structure, so there may be delay before actual mark change.
   * It requires you to have built given path.
   * 
   * @param path path of base folder containing target folder
   * @param foldername name of the folder to be removed
   */
  async markFolderAsWaitingForRemoval(path: string, foldername: string) {
    const dir = await this.buildDeep(`${path}/${foldername}`);
    if (dir.synchronizationStatus !== Sync.No) {
      dir.synchronizationStatus = Sync.WaitingForRemoval;
      for (let folder of dir.folders) {
        await this.markFolderAsWaitingForRemoval(`${path}/${foldername}`, folder.name);
      }
      for (let file of dir.files) {
        await this.markFileAsWaitingForRemoval(`${path}/${foldername}`, file.name);
      }
    }
  }

  /**
   * Mark file as ready to download and add it to download queue. 
   * If file is already downloaded it resolves immediately. 
   * It requires you to have built given path.
   * 
   * @param path path of base folder containing target file
   * @param filename name of the file to be downloaded
   */
  markFileAsWaitingForDownload(path: string, filename: string) {
    const dir = this.readPathNoCheck(path);
    if (dir.file(filename).synchronizationStatus !== Sync.Yes) {
      dir.file(filename).synchronizationStatus = Sync.WaitingForDownload;
      this.unsyncQueue.filter(item => item !== `${path}/${filename}`);
      if (!this.syncQueue.find(item => item == `${path}/${filename}`)) {
        this.syncQueue.push(`${path}/${filename}`);
      }
    }
  }

  /**
   * Mark file as ready to remove and add it to removal queue. 
   * If file is already removed it resolves immediately. 
   * It requires you to have built given path.
   * 
   * @param path path of base folder containing target file
   * @param filename name of the file to be downloaded
   */
  markFileAsWaitingForRemoval(path: string, filename: string) {
    const dir = this.readPathNoCheck(path);
    if (dir.file(filename).synchronizationStatus !== Sync.No) {
      dir.file(filename).synchronizationStatus = Sync.WaitingForRemoval;
      this.syncQueue.filter(item => item !== `${path}/${filename}`);
      if (!this.unsyncQueue.find(item => item == `${path}/${filename}`)) {
        this.unsyncQueue.push(`${path}/${filename}`);
      }
    }
  }

  /**
   * Mark file as being downloaded. It requires you to have built 
   * given path.
   * 
   * @param path path of base folder containing target file
   * @param filename name of the file to be marked
   */
  markFileAsBeingDownloaded(path: string, filename: string) {
    const dir = this.readPathNoCheck(path);
    dir.file(filename).synchronizationStatus = Sync.Downloading;
    this.updateSynchronizationStatusBackwards(path);
  }

  /**
   * Mark file as being removed. It requires you to have built 
   * given path.
   * 
   * @param path path of base folder containing target file
   * @param filename name of the file to be marked
   */
  markFileAsBeingRemoved(path: string, filename: string) {
    const dir = this.readPathNoCheck(path);
    dir.file(filename).synchronizationStatus = Sync.Removing;
    this.updateSynchronizationStatusBackwards(path);
  }

  /**
   * Mark file as removed. It requires you to have built 
   * given path.
   * 
   * @param path path of base folder containing target file
   * @param filename name of the file to be marked
   */
  markFileAsRemoved(path: string, filename: string) {
    const dir = this.readPathNoCheck(path);
    dir.file(filename).synchronizationStatus = Sync.No;
    this.updateSynchronizationStatusBackwards(path);
  }

  /**
   * Mark file as downloaded. It requires you to have built 
   * given path.
   * 
   * @param path path of base folder containing target file
   * @param filename name of the file to be marked
   */
  markFileAsDownloaded(path: string, filename: string) {
    const dir = this.readPathNoCheck(path);
    dir.file(filename).synchronizationStatus = Sync.Yes;
    this.updateSynchronizationStatusBackwards(path);
  }

  /**
   * Update synchronization status of a folder, and all it's parents.
   * Called when changing synchronization marks.
   * @param path path of a folder, which children changed synchronization status
   */
  private async updateSynchronizationStatusBackwards(path: string) {

  }

  /* updateSynchronizationState(path: string) { // TODO: update considering sync states update
    const dir = this.readPathNoCheck(path);
    let fullSync = true;
    let noSync = true;
    let waitingForRemoval = false;
    let waitingForDownload = false;
    let removing = false;
    let downloading = false;
    for (let folder of dir.folders) {
      switch(folder.synchronizationStatus) {
        case Sync.No: {
          fullSync = false;
          break;
        }
        case Sync.Partial: {
          fullSync = false;
          noSync = false;
          break;
        }
        case Sync.Yes: {
          noSync = false;
          break;
        }
        case Sync.WaitingForDownload: {
          waiting = true;
          break;
        }
        case Sync.Downloading: {
          progress = true;
          break;
        }
      }
    }
    for (let file of dir.files) {
      switch(file.synchronizationStatus) {
        case Sync.No: {
          fullSync = false;
          break;
        }
        case Sync.Partial: {
          fullSync = false;
          noSync = false;
          break;
        }
        case Sync.Yes: {
          noSync = false;
          break;
        }
        case Sync.WaitingForDownload: {
          waiting = true;
          break;
        }
        case Sync.Downloading: {
          progress = true;
          break;
        }
      }
    }
    if (progress) {
      dir.synchronizationStatus = Sync.Downloading;
    } else if (waiting) {
      dir.synchronizationStatus = Sync.WaitingForDownload;
    } else if (fullSync) {
      dir.synchronizationStatus = Sync.Yes;
    } else if (noSync) {
      dir.synchronizationStatus = Sync.No;
    } else {
      dir.synchronizationStatus = Sync.Partial;
    }
  } */


  async load() {
    this.root = JSON.parse(await this.storage.get('root'));
  }

  async save() {
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
