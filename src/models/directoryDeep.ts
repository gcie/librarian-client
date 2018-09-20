import { SynchronizationState } from './synchronizedStateEnum';
import { Folder } from "./folder";
import { File } from "./file";
import { DirectoryItem } from "./directoryItem";
import { Directory } from './directory';

export class DirectoryDeep extends Directory {
    name: string;
    size: number;
    modifiedDate: string;
    synchronized: SynchronizationState;

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
                        this.files.push(Object.assign(item, { synchronized: SynchronizationState.None }));
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
            this.files.push(Object.assign(item, { synchronized: SynchronizationState.None }));
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
}
