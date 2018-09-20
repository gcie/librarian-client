import { File } from "./file";

export interface Folder {
    name: string;
    size: number;
    modifiedDate: string;
    synchronized: boolean;
}