import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { LibraryApi } from '../../providers/library-api/library-api';

@IonicPage()
@Component({
  selector: 'page-progress-view',
  templateUrl: 'progress-view.html',
})
export class ProgressViewPage {
  
  progress: number;

  constructor(
    public libraryApi: LibraryApi
  ) {
    this.progress = 0;
    libraryApi.downloadProgress.subscribe((progress) => {
      this.progress = progress * 100;
    })
  }



}
