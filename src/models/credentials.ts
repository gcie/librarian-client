export class Credentials {
    constructor(
        public hostname?: string,
        public port?: number,
        public username?: string,
        public password?: string,
        public remember?: boolean
    ) { }
}