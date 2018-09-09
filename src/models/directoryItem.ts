export class DirectoryItem {
  // public name: string;
  // public type: number;
  // // public link: string;
  // public size: number;
  // public modifiedDate: string;
  // public content?: DirectoryItem[];

  constructor(
    public name: string,
    public type: number,
    public size: number,
    public modifiedDate: string,
    public content?: DirectoryItem[]) {
    
  }
}