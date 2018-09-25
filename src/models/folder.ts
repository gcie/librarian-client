import { Sync } from './synchronizedStateEnum';

export interface Folder {
    name: string;
    size: number;
    modifiedDate: string;
    synchronizationStatus: Sync;
}