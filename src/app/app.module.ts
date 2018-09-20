import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { FTP } from '@ionic-native/ftp';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SetupPage } from '../pages/setup/setup';
import { LibraryApi } from '../providers/library-api/library-api';
import { Log } from '../providers/log/log';
import { Utils } from '../providers/utils/utils';
import { FileBrowserPage } from './../pages/file-browser/file-browser';
import { MyApp } from './app.component';
import { DirectoryProvider } from '../providers/directory/directory';

@NgModule({
  declarations: [
    MyApp,
    FileBrowserPage,
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
    FileBrowserPage,
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
    Log,
    DirectoryProvider
  ]
})
export class AppModule {}
