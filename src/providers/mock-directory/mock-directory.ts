import { Injectable } from '@angular/core';
import { Directory } from '../../models/directory';
import { DirectoryDeep } from '../../models/directoryDeep';
import { getMockRoot } from './mock-root';
import { SynchronizationState } from '../../models/synchronizedStateEnum';

@Injectable()
export class MockDirectoryProvider {

  root: DirectoryDeep;
  syncQueue: string[];

  constructor() {
    this.root = getMockRoot();
    this.syncQueue = [];
    console.log(this.root);
  }

  async updateSyncQueue(dir = this.root, path = '') {
    this.syncQueue = [];
    for (let file of dir.files) {
      if (file.synchronizationStatus == SynchronizationState.Waiting) {
        this.syncQueue.push(`${path}/${file.name}`);
      }
    }

    for (let folder of dir.folders) {
      if (folder.synchronizationStatus == SynchronizationState.Waiting || folder.synchronizationStatus == SynchronizationState.Progress) {
        this.updateSyncQueue(dir.cd(folder.name), `${path}/${folder.name}`);
      }
    }
  }

  async setSynchronizeFolder(path: string, folderName: string) {
    const dir = await this.readPath(`${path}/${folderName}`);
    if (dir.synchronizationStatus !== SynchronizationState.Full) {
      dir.synchronizationStatus = SynchronizationState.Waiting;
      for (let folder of dir.folders) {
        this.setSynchronizeFolder(`${path}/${folderName}`, folder.name);
      }
      for (let file of dir.files) {
        this.setSynchronizeFile(`${path}/${folderName}`, file.name);
      }
    }
  }

  async setSynchronizeFile(path: string, file: string) {
    const dir = await this.readPath(path);
    dir.file(file).synchronizationStatus = SynchronizationState.Waiting;
    if (!this.syncQueue.find(item => item == `${path}/${file}`)) {
      this.syncQueue.push(`${path}/${file}`);
    }
  }

  updateSynchronizationState(path: string) {
    return;
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
