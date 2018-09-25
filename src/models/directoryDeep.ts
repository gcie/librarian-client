import { Directory } from './directory';
import { DirectoryItem } from "./directoryItem";
import { File } from "./file";
import { Folder } from "./folder";
import { Sync } from './synchronizedStateEnum';

export class DirectoryDeep extends Directory {
    name: string;
    size: number;
    modifiedDate: string;
    synchronizationStatus: Sync;

    complete: boolean;

    folders: DirectoryDeep[];
    files: File[];

    constructor(directory: DirectoryItem) {
        super();
        this.name = directory.name;
        this.size = directory.size;
        this.modifiedDate = directory.modifiedDate;

        if (directory.content) {
            for (let item of directory.content) {
                switch (item.type) {
                    case 1: {
                        this.folders.push(new DirectoryDeep(item));
                        break;
                    }
                    case 0: {
                        this.files.push(Object.assign(item, { synchronizationStatus: Sync.No }));
                        break;
                    }
                }
            }
            this.complete = true;
        } else {
            this.complete = false;
        }
    }

    insert(item: DirectoryItem) {
        switch (item.type) {
        case 1: {
            this.folders.push(new DirectoryDeep(item));
            break;
        }
        case 0: {
            this.files.push(Object.assign(item, { synchronizationStatus: Sync.No }));
            break;
        }
        }
    }

    cd(folderName: string): DirectoryDeep {
        return this.folders.find(folder => folder.name === folderName);
    }

    folder(folderName: string): Folder {
        return this.folders.find(folder => folder.name === folderName);
    }

    file(fileName: string): File { 
        return this.files.find(file => file.name === fileName);
    }

    private static parseObj(object: DirectoryDeep): DirectoryDeep {
        const d = new DirectoryDeep({name: object.name, size: object.size, modifiedDate: object.modifiedDate, type: 0});
        d.complete = object.complete;
        d.synchronizationStatus = object.synchronizationStatus;
        for (let file of object.files) {
            d.files.push(file);
        }
        for (let folder of object.folders) {
            d.folders.push(DirectoryDeep.parseObj(folder));
        }
        return d;
    }

    static parse(text: string) {
        return DirectoryDeep.parseObj(JSON.parse(text));
    }
}
