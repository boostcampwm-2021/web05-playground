export interface IObject {
    oid: number;
    bid: number;
    x: number;
    y: number;
    url: string;
    fileurl?: string;
}

export class Object implements IObject {
    public oid: number;
    public bid: number;
    public x: number;
    public y: number;
    public url: string;
    public fileurl?: string;

    constructor(
        oid: number,
        bid: number,
        x: number,
        y: number,
        url: string,
        fileurl?: string,
    ) {
        this.oid = oid;
        this.bid = bid;
        this.x = x;
        this.y = y;
        this.url = url;
        this.fileurl = fileurl;
    }
}
