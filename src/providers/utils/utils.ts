import { Injectable } from '@angular/core';
import { DirectoryItem } from '../../models/directoryItem';

@Injectable()
export class Utils {

  constructor() { }

  isFolder(item: DirectoryItem) {
    return item.type === 1;
  }

}
