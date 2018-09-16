import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Log {

  constructor() {}

  fileDownload(msg?: string) {
    return function(progress) {
      if (msg) {
        console.log(`${msg}: ${progress * 100}%`);
      } else {
        console.log(`Download progress: ${progress * 100}%`);
      }
    }
  }

}
