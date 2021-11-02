export interface IWorld {
    wid: number;
    email: string;
    name: string;
    port: number;
    thumbnail: string;
}

export class World implements IWorld {
    public wid: number;
    public email: string;
    public name: string;
    public port: number;
    public thumbnail: string;

    constructor(
        wid: number,
        email: string,
        name: string,
        port: number,
        thumbnail: string,
    ) {
        this.wid = wid;
        this.email = email;
        this.name = name;
        this.port = port;
        this.thumbnail = thumbnail;
    }
}
