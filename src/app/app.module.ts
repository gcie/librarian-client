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
import { MockLibraryApi } from '../providers/mock-library-api/mock-library-api';
import { Util } from '../providers/util/util';
import { FileBrowserPage } from './../pages/file-browser/file-browser';
import { DirectoryProvider } from './../providers/directory/directory';
import { MockDirectoryProvider } from './../providers/mock-directory/mock-directory';
import { MyApp } from './app.component';
import { ComponentsModule } from '../components/components.module';
import { ProgressViewPage } from '../pages/progress-view/progress-view';

const MOCK = true;

@NgModule({
  declarations: [
    MyApp,
    FileBrowserPage,
    SetupPage,
    ProgressViewPage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FileBrowserPage,
    SetupPage,
    ProgressViewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FTP,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LibraryApi, useClass: MOCK ? MockLibraryApi : LibraryApi},
    { provide: DirectoryProvider, useClass: MOCK ? MockDirectoryProvider : DirectoryProvider },
    Util,
    Log
  ]
})
export class AppModule {}
