import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressViewPage } from './progress-view';

@NgModule({
  declarations: [
    ProgressViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgressViewPage),
  ],
})
export class ProgressViewPageModule {}
