
export class DirectoryItem {
  constructor(
    public name: string,
    public type: number,
    public size: number,
    public modifiedDate: string,
    public content?: DirectoryItem[]) { }
}