export interface IBuilding {
    id?: number;
    x: number;
    y: number;
    uid: number;
    description: string;
    scope: string;
    password?: string;
    imageUrl?: string;
}

export class Building implements IBuilding {
    public id: number;
    public x: number;
    public y: number;
    public uid: number;
    public description: string;
    public scope: string;
    public password: string;
    public imageUrl: string;

    constructor(
        id: number,
        x: number,
        y: number,
        uid: number,
        description: string,
        scope: string,
        password: string,
        imageUrl: string,
    ) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.uid = uid;
        this.description = description;
        this.scope = scope;
        this.password = password;
        this.imageUrl = imageUrl;
    }
}
