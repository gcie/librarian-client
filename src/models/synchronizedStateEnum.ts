export enum Sync {
    No,
    Removing,
    WaitingForRemoval,
    Partial, // folder only
    Waiting, // folder only
    WaitingForDownload,
    Downloading,
    Yes
}