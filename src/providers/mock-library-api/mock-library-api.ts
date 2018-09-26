import { Injectable, EventEmitter } from '@angular/core';
import { Credentials } from '../../models/credentials';

@Injectable()
export class MockLibraryApi {

  public downloadProgress: EventEmitter<number>;
  public currentAction: EventEmitter<string>;

  constructor() {
    this.downloadProgress = new EventEmitter();
    this.currentAction = new EventEmitter();
  }

  async setCredentials(c: Credentials) {
    return 'Credentials changed successfully';
  }

  async getCredentials(): Promise<Credentials> {
    return { hostname: 'reinfarn.ddns.net', port: 7201, username: 'gucci', password: 'gucci123', remember: true };
  }

  async validateCredentials(c: Credentials): Promise<string> {
    if (c.hostname !== 'reinfarn.ddns.net') return 'Wrong hostname';
    if (c.port     !== 7201               ) return 'Wrong port';
    if (c.username !== 'gucci'            ) return 'Wrong username';
    if (c.password !== 'gucci123'         ) return 'Wrong password';
    return;
  }

  async setSynchronizationFolder(path: string) { }

  async getSynchronizationFolder(): Promise<string> {
    return '';
  }

  async login(c: Credentials): Promise<string> {
    return this.validateCredentials(c);
  }
}
