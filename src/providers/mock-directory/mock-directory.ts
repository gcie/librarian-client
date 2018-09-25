import { Injectable } from '@angular/core';
import { Directory } from '../../models/directory';
import { DirectoryDeep } from '../../models/directoryDeep';
import { getMockRoot } from './mock-root';
import { Sync } from '../../models/synchronizedStateEnum';

@Injectable()
export class MockDirectoryProvider {

  root: DirectoryDeep;
  public syncQueue: string[];
  public unsyncQueue: string[];

  constructor() {
    this.root = getMockRoot();
    this.syncQueue = [];
    this.unsyncQueue = [];
    console.log(this.root);
  }

  async updateSyncQueue(dir = this.root, path = '') {
    this.syncQueue = [];
    for (let file of dir.files) {
      if (file.synchronizationStatus == Sync.WaitingForDownload) {
        this.syncQueue.push(`${path}/${file.name}`);
      }
    }

    for (let folder of dir.folders) {
      if (folder.synchronizationStatus == Sync.WaitingForDownload || folder.synchronizationStatus == Sync.Downloading) {
        this.updateSyncQueue(dir.cd(folder.name), `${path}/${folder.name}`);
      }
    }
  }

  
  async markFolderToDownload(path: string, folderName: string) {
    const dir = await this.readPath(`${path}/${folderName}`);
    if (dir.synchronizationStatus !== Sync.Yes) {
      dir.synchronizationStatus = Sync.WaitingForDownload;
      for (let folder of dir.folders) {
        await this.markFolderToDownload(`${path}/${folderName}`, folder.name);
      }
      for (let file of dir.files) {
        await this.markFileToDownload(`${path}/${folderName}`, file.name);
      }
    }
  }

  async markFileToDownload(path: string, filename: string) {
    const dir = await this.readPath(path);
    if (dir.file(filename).synchronizationStatus !== Sync.Yes) {
      dir.file(filename).synchronizationStatus = Sync.WaitingForDownload;
      this.unsyncQueue.filter(item => item !== `${path}/${filename}`);
      if (!this.syncQueue.find(item => item == `${path}/${filename}`)) {
        this.syncQueue.push(`${path}/${filename}`);
      }
    }
  }

  async markFolderToRemove(path: string, folderName: string) {
    const dir = await this.readPath(`${path}/${folderName}`);
    if (dir.synchronizationStatus !== Sync.No) {
      dir.synchronizationStatus = Sync.WaitingForRemoval;
      for (let folder of dir.folders) {
        await this.markFolderToRemove(`${path}/${folderName}`, folder.name);
      }
      for (let file of dir.files) {
        await this.markFileToRemove(`${path}/${folderName}`, file.name);
      }
    }
  }

  async markFileToRemove(path: string, filename: string) {
    const dir = await this.readPath(path);
    if (dir.file(filename).synchronizationStatus !== Sync.No) {
      dir.file(filename).synchronizationStatus = Sync.WaitingForRemoval;
      this.syncQueue.filter(item => item !== `${path}/${filename}`);
      if (!this.unsyncQueue.find(item => item == `${path}/${filename}`)) {
        this.unsyncQueue.push(`${path}/${filename}`);
      }
    }
  }

  async readPath(path: string): Promise<Directory> {
    let currentDiretory = this.root;
    for (let folder of path.split('/').slice(1)) {
      currentDiretory = currentDiretory.cd(folder);
    }
    return currentDiretory;
  }

  async load() { }

  async save() { }
}
