export interface IWorld {
    id: number;
    uid: number;
    name: string;
    port: number;
    thumbnail: string;
}

export class World implements IWorld {
    public id: number;
    public uid: number;
    public name: string;
    public port: number;
    public thumbnail: string;

    constructor(
        id: number,
        uid: number,
        name: string,
        port: number,
        thumbnail: string,
    ) {
        this.id = id;
        this.uid = uid;
        this.name = name;
        this.port = port;
        this.thumbnail = thumbnail;
    }
}
