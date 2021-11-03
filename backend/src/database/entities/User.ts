export interface IUser {
    email: string;
    nickname: string;
    x: number;
    y: number;
}

export class User implements IUser {
    public email: string;
    public nickname: string;
    public x: number;
    public y: number;

    constructor(
        email: string,
        nickname: string,
        x: number,
        y: number,
    ) {
        this.email = email;
        this.nickname = nickname;
        this.x = x;
        this.y = y;
    }
}