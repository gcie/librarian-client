import { SynchronizationState } from './synchronizedStateEnum';

export interface File {
    name: string;
    size: number;
    modifiedDate: string;
    synchronized: SynchronizationState;
}