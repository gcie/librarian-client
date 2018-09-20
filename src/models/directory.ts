import { Folder } from "./folder";
import { File } from "./file";

export interface Directory extends Folder {
    folders: Directory[];
    files: File[];
}