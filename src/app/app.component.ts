import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Nav, Platform } from 'ionic-angular';
import { ProgressViewPage } from '../pages/progress-view/progress-view';
import { SetupPage } from '../pages/setup/setup';
import { DirectoryProvider } from './../providers/directory/directory';
import { LibraryApi } from './../providers/library-api/library-api';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public libraryApi: LibraryApi,
    public directoryProvider: DirectoryProvider
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.checkCredentials();
    });
  }
  
  save() {
    this.directoryProvider.save();
  }

  async checkCredentials() {
    const creds = await this.libraryApi.getCredentials();
    const res = await this.libraryApi.login(creds);
    if(res) {
      console.log('### login on startup error:', res);
      this.nav.setRoot(SetupPage);
    } else {
      console.log('### login on startup successful');
      this.nav.setRoot(SetupPage);
    }
  }

  async synchronize() {
    this.libraryApi.handleDownload();
  }
}
