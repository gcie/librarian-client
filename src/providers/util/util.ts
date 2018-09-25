import { Injectable } from '@angular/core';
import { DirectoryItem } from '../../models/directoryItem';
import { Sync } from '../../models/synchronizedStateEnum';

@Injectable()
export class Util {

  constructor() { }

  public isFolder(item: DirectoryItem) {
    return item.type === 1;
  }

  public syncStatusDone(state: Sync): boolean {
    return state === Sync.No || state == Sync.Partial || state == Sync.Yes;
  }

  public syncStatusDesc(state: Sync) {
    switch(state) {
      case Sync.No: {
        return 'Not synchronized';
      }
      case Sync.Removing: {
        return 'Removing...';
      }
      case Sync.WaitingForRemoval: {
        return 'Waiting for removal...';
      }
      case Sync.Partial: {
        return 'Downloaded partially';
      }
      case Sync.Waiting: {
        return 'Waiting...';
      }
      case Sync.WaitingForDownload: {
        return 'Waiting for download...';
      }
      case Sync.Downloading: {
        return 'Downloading...';
      }
      case Sync.Yes: {
        return 'Downloaded';
      }
    }
    return 'Unknown state';
  }

}
