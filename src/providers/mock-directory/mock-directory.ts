import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DirectoryDeep } from '../../models/directoryDeep';
import { getMockRoot } from './mock-root';
import { Directory } from '../../models/directory';

@Injectable()
export class MockDirectoryProvider {

  root: DirectoryDeep;

  constructor() {
    this.root = getMockRoot();
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
