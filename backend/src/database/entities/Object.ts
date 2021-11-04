export interface IObject {
    id: number;
    bid: number;
    x: number;
    y: number;
    imageUrl: string;
    fileUrl?: string;
}

export class Object implements IObject {
    public id: number;
    public bid: number;
    public x: number;
    public y: number;
    public imageUrl: string;
    public fileUrl?: string;

    constructor(
        id: number,
        bid: number,
        x: number,
        y: number,
        imageUrl: string,
        fileUrl?: string,
    ) {
        this.id = id;
        this.bid = bid;
        this.x = x;
        this.y = y;
        this.imageUrl = imageUrl;
        this.fileUrl = fileUrl;
    }
}
