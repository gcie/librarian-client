import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MusicPage } from '../pages/music/music';
import { SetupPage } from '../pages/setup/setup';
import { LibraryApi } from '../providers/library-api/library-api';
import { Log } from '../providers/log/log';
import { Utils } from '../providers/utils/utils';
import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MusicPage,
    SetupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    MusicPage,
    SetupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FTP,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LibraryApi, useClass: LibraryApi },
    Utils,
    Log
  ]
})
export class AppModule {}
