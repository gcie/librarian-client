import { Sync } from './synchronizedStateEnum';

export interface File {
    name: string;
    size: number;
    modifiedDate: string;
    synchronizationStatus: Sync;
}