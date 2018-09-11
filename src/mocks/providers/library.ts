import { Injectable } from "@angular/core";
import { DirectoryItem } from "../../models/directoryItem";
import { resolveDefinition } from "@angular/core/src/view/util";

@Injectable()
export class MockLibraryProvider {
    files: DirectoryItem[] = [{
        name: '', type: 1, size: 580, modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
        content: [
            {
                name: 'Muzyka', type: 1, size: 0, modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
                content: [
                    {
                        name: 'Two Steps From Hell', type: 1, size: 0, modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
                        content: [
                            {
                                name: 'SkyWorld', type: 1, size: 0, modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
                                content: [
                                    {
                                        name: '01 All Is Hell That Ends Well.mp3', type: 0, size: 9032, modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
                                    },
                                    {
                                        name: '02 Titan Dream.mp3', type: 0, size: 9243, modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
                                    },
                                    {
                                        name: '03 SkyWorld.mp3', type: 0, size: 7432, modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
                                    }
                                ]
                            },
                            {
                                name: 'Battlecry', type: 1, size: 0, modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
                                content: [
                                    {
                                        name: '01 None Shall Live.mp3', type: 0, size: 6432, modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
                                    },
                                    {
                                        name: '02 Stormkeeper.mp3', type: 0, size: 7423, modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Avicii - True', type: 1, size: 0, modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
                        content: [
                            {
                                name: '01 Wake Me Up.mp3', type: 0, size: 10894, modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
                            },
                            {
                                name: '02 You Make Me.mp3', type: 0, size: 8942, modifiedDate: '2018-09-09 11:48:00 GMT+00:00'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'test',
                type: 1,
                size: 0,
                modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
                content: []
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
                modifiedDate: '2018-09-09 11:48:00 GMT+00:00',
                content: []
            }
        ]
    }];

    readFolders(dir: string): Promise<DirectoryItem[]> {
        return new Promise((resolve, reject) => {
            var path = dir.split('/');
            var currentDir = this.files;
            for(var folder of path) {
                currentDir = currentDir.filter((x) => x.name === folder)[0].content;
                if(currentDir === undefined) {
                    reject('Invalid path');
                }
            }
            resolve(currentDir.filter((x) => x.type === 1));
        });
    }

    readDir(dir: string): Promise<DirectoryItem[]> {
        return new Promise((resolve, reject) => {
            var path = dir.split('/');
            var currentDir = this.files;
            for(var folder of path) {
                currentDir = currentDir.filter((x) => x.name === folder)[0].content;
                if(currentDir === undefined) {
                    reject('Invalid path');
                }
            }
            resolve(currentDir);
        });
    }

}