export interface IUser {
    id: number;
    email?: string;
    nickname: string;
    x?: number;
    y?: number;
    imageUrl: string;
    isInBuilding?: number;
}

export class User implements IUser {
    public id: number;
    public email: string;
    public nickname: string;
    public x: number;
    public y: number;
    public imageUrl: string;
    public isInBuilding: number;

    constructor(
        id: number,
        email: string,
        nickname: string,
        x: number,
        y: number,
        imageUrl: string,
        isInBuilding: number,
    ) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.x = x;
        this.y = y;
        this.imageUrl = imageUrl;
        this.isInBuilding = isInBuilding;
    }
}
