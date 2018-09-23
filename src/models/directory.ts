import { File } from "./file";
import { Folder } from "./folder";
import { SynchronizationState } from './synchronizedStateEnum';

export class Directory implements Folder {
    name: string;
    size: number;
    modifiedDate: string;
    synchronizationStatus: SynchronizationState;

    folders: Folder[];
    files: File[];

    constructor() {
        this.name = '';
        this.size = -1;
        this.modifiedDate = '';
        this.synchronizationStatus = SynchronizationState.None;

        this.folders = [];
        this.files = [];
    }

    folder(folderName: string): Folder {
        return this.folders.find(folder => folder.name === folderName);
    }

    file(fileName: string): File { 
        return this.files.find(file => file.name === fileName);
    }
}