import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FTP } from '@ionic-native/ftp';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LibraryProvider } from '../providers/library/library';
import { MyApp } from './app.component';
import { MockLibraryProvider } from '../mocks/providers/library';
import { File } from '@ionic-native/file';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FTP,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LibraryProvider, useClass: MockLibraryProvider}
  ]
})
export class AppModule {}
