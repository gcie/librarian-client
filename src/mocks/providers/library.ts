import { Injectable } from "@angular/core";
import { DirectoryItem } from "../../models/directoryItem";

@Injectable()
export class MockLibraryProvider {
    files: DirectoryItem[] = [{
        name: '/',
        type: 1,
        size: 580,
        modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
        content: [
            {
                name: 'test',
                type: 1,
                size: 0,
                modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
            }, 
            {
                name: 'data.txt',
                type: 0,
                size: 6,
                modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
            }, 
            {
                name: 'test.js',
                type: 0,
                size: 574,
                modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
            }
        ]
    }];

    readDir(dir: string): Promise<DirectoryItem[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.files[0].content);
            }, 100);
        });
    }

}