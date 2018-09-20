import { SynchronizationState } from './synchronizedStateEnum';

export interface Folder {
    name: string;
    size: number;
    modifiedDate: string;
    synchronized: SynchronizationState;
}