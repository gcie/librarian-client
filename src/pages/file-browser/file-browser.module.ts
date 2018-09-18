import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FileBrowserPage } from './file-browser';

@NgModule({
  declarations: [
    FileBrowserPage,
  ],
  imports: [
    IonicPageModule.forChild(FileBrowserPage),
  ],
})
export class FileBrowserPageModule {}
